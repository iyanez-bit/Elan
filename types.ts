import React from 'react';

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// Audio Types
export interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isListening: boolean;
}