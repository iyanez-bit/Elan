import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, X, MessageSquare, Loader2, Volume2, Globe } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

// --- Audio Utility Functions ---
function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Data = btoa(binary);

  return {
    data: base64Data,
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const SYSTEM_INSTRUCTION = `
You are Sofia, the lead coordinator for "Traducciones Certificadas México". 
We are a premier translation agency with offices in Mexico City (CDMX) and Querétaro.
We specialize in "Perito Traductor" (Certified Official Translations) valid for legal procedures.

Your capabilities:
1. You are fluent in Spanish, English, Italian, Russian, Chinese, French, Portuguese, Japanese, German, and Korean.
2. You should switch languages instantly if the user speaks a different language.

Your goals:
1. Answer FAQs about pricing (approx 600 MXN/page), timing (2-3 days standard), and validity.
2. Qualify leads: Ask for their name, what type of document they have (birth cert, diploma, etc.), and the language pair.
3. Encourage them to email their documents for a quote.

Personality:
Professional, warm, efficient, and culturally aware of Mexican business etiquette.
Keep responses concise (max 2-3 sentences) to allow for natural conversation flow.
Do not hallucinate specific legal advice; always refer to the "Perito" standard.
`;

const VoiceWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null); // Type 'any' used because session type is internal to library for now
  
  // Visualizer Refs
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [analyserState, setAnalyserState] = useState<AnalyserNode | null>(null); // State for React re-render

  const stopAudio = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    if (sessionRef.current) {
       // Ideally close session if method exists, but mainly just stop sending
       sessionRef.current = null;
    }
    // Stop all playing sources
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    
    setConnectionState('idle');
    setAnalyserState(null);
  }, []);

  const startSession = async () => {
    setConnectionState('connecting');
    setErrorMessage('');

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      
      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // Visualizer Setup (Output)
      const analyser = outputAudioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      setAnalyserState(analyser); // Trigger re-render to pass to Visualizer
      
      // Output Node connection
      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(analyser); // Connect to analyser
      analyser.connect(outputAudioContextRef.current.destination); // Connect analyser to speakers

      // Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setConnectionState('connected');
            nextStartTimeRef.current = outputAudioContextRef.current!.currentTime;

            // Setup Input Stream Processing
            const ctx = inputAudioContextRef.current!;
            const source = ctx.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            // ScriptProcessor (Deprecated but standard for this API usage currently)
            const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(ctx.destination);
            
            // Save session for cleanup
            sessionPromise.then(s => sessionRef.current = s);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64EncodedAudioString && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              // Ensure nextStartTime is at least current time
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                ctx,
                24000,
                1
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle interruption
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              sourcesRef.current.forEach(source => {
                try { source.stop(); } catch(e) {}
                sourcesRef.current.delete(source);
              });
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error(e);
            setConnectionState('error');
            setErrorMessage("Connection error. Please try again.");
          },
          onclose: () => {
            setConnectionState('idle');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Professional female voice
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

    } catch (err: any) {
      console.error(err);
      setConnectionState('error');
      setErrorMessage(err.message || "Failed to connect microphone.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const toggleWidget = () => {
    if (isOpen) {
      stopAudio();
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Widget Window */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300 ease-out origin-bottom-right animate-in fade-in slide-in-from-bottom-10">
          
          {/* Header */}
          <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <h3 className="font-semibold text-sm">Sofia (AI Assistant)</h3>
            </div>
            <button onClick={toggleWidget} className="hover:bg-white/10 p-1 rounded-full transition">
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col items-center justify-center min-h-[250px] bg-slate-50 relative">
             <div className="absolute top-2 right-2 flex space-x-1 opacity-50">
               <span title="Spanish" className="text-xs">🇲🇽</span>
               <span title="English" className="text-xs">🇺🇸</span>
               <span title="Others" className="text-xs">🌍</span>
             </div>

             {connectionState === 'idle' && (
               <div className="text-center space-y-4">
                 <div className="bg-white p-4 rounded-full shadow-md inline-block">
                    <Globe className="w-8 h-8 text-brand-600" />
                 </div>
                 <p className="text-slate-600 text-sm">
                   I speak 10 languages! Click below to ask about certified translations in CDMX & Querétaro.
                 </p>
                 <button 
                   onClick={startSession}
                   className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-full font-medium transition flex items-center justify-center space-x-2 w-full"
                 >
                   <Mic size={18} />
                   <span>Start Talking</span>
                 </button>
               </div>
             )}

             {connectionState === 'connecting' && (
               <div className="flex flex-col items-center space-y-3 text-brand-600">
                 <Loader2 className="animate-spin w-8 h-8" />
                 <span className="text-sm font-medium">Connecting to Sofia...</span>
               </div>
             )}

             {connectionState === 'connected' && (
               <div className="w-full flex flex-col items-center space-y-6">
                 <div className="text-center space-y-1">
                   <p className="font-semibold text-brand-900">Listening...</p>
                   <p className="text-xs text-slate-500">Go ahead, ask about our services.</p>
                 </div>
                 
                 <AudioVisualizer analyser={analyserState} isListening={true} />
                 
                 <button 
                   onClick={stopAudio}
                   className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-full text-sm font-medium transition border border-red-200"
                 >
                   End Call
                 </button>
               </div>
             )}

             {connectionState === 'error' && (
               <div className="text-center space-y-3">
                 <p className="text-red-600 text-sm">{errorMessage}</p>
                 <button 
                   onClick={startSession}
                   className="text-brand-600 hover:underline text-sm"
                 >
                   Try Again
                 </button>
               </div>
             )}
          </div>
          
          {/* Footer */}
          <div className="bg-slate-100 p-2 text-center border-t border-slate-200">
            <p className="text-[10px] text-slate-400">Powered by Gemini AI • Supports 10 Languages</p>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={toggleWidget}
        className={`pointer-events-auto bg-brand-900 hover:bg-brand-800 text-white p-4 rounded-full shadow-xl transition-transform duration-300 flex items-center justify-center hover:scale-110 ${isOpen ? 'rotate-90 opacity-0 absolute' : 'rotate-0 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={28} />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </button>
      
    </div>
  );
};

export default VoiceWidget;