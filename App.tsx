import React, { useState } from 'react';
import { 
  Menu, X, CheckCircle, MapPin, Phone, Mail, FileText, 
  Globe, Award, Clock, ChevronRight, UserCheck
} from 'lucide-react';
import VoiceWidget from './components/VoiceWidget';
import { Service, FaqItem } from './types';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services: Service[] = [
    {
      title: "Certified Translations",
      description: "Official 'Perito Traductor' seal accepted by Mexican and foreign authorities for legal processes.",
      icon: <Award className="w-6 h-6 text-brand-500" />
    },
    {
      title: "Legal Documents",
      description: "Birth certificates, marriage licenses, divorce decrees, wills, and police records.",
      icon: <FileText className="w-6 h-6 text-brand-500" />
    },
    {
      title: "Corporate & Technical",
      description: "Contracts, bylaws, technical manuals, and financial statements for multinational companies.",
      icon: <Globe className="w-6 h-6 text-brand-500" />
    }
  ];

  const faqs: FaqItem[] = [
    {
      question: "What is a Certified Translation?",
      answer: "A certified translation bears the seal and signature of a 'Perito Traductor' authorized by the Superior Court of Justice. It is required for official legal procedures in Mexico and abroad."
    },
    {
      question: "Which languages do you handle?",
      answer: "We specialize in English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Russian, and Korean."
    },
    {
      question: "Do you have offices in Querétaro?",
      answer: "Yes, we have reception offices in both Mexico City (Reforma) and Querétaro (Centro Sur) for document drop-off and pickup."
    },
    {
      question: "What is the turnaround time?",
      answer: "Standard delivery is 2-3 business days. We also offer express 24-hour service for urgent documents."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-brand-900" />
              <div>
                <span className="text-xl font-bold text-brand-900 block leading-none">Traducciones</span>
                <span className="text-xs text-brand-600 font-medium tracking-widest uppercase">Certificadas México</span>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#services" className="text-slate-600 hover:text-brand-600 font-medium transition">Services</a>
              <a href="#locations" className="text-slate-600 hover:text-brand-600 font-medium transition">Locations</a>
              <a href="#faq" className="text-slate-600 hover:text-brand-600 font-medium transition">FAQ</a>
              <a href="#contact" className="bg-brand-900 text-white px-6 py-2.5 rounded-full hover:bg-brand-800 transition font-medium">
                Get a Quote
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-700">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#services" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Services</a>
              <a href="#locations" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Locations</a>
              <a href="#contact" className="block px-3 py-2 text-base font-medium text-brand-600 font-bold">Get a Quote</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              Official Perito Traductor
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Certified Translations in <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-900">CDMX & Querétaro</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              Official translations valid for embassies, universities, and government agencies worldwide. Fast, accurate, and fully certified.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#contact" className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-brand-900 hover:bg-brand-800 md:text-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Request Quote
              </a>
              <a href="#services" className="inline-flex items-center justify-center px-8 py-3.5 border border-slate-200 text-base font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 md:text-lg transition">
                Our Services
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </section>

      {/* Features Grid */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Expert Language Solutions</h2>
            <p className="mt-4 text-xl text-slate-500">Connecting Mexico with the world through precision and authority.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition duration-300">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <img src="https://picsum.photos/1920/1080?grayscale&blur=2" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Strategic Locations</h2>
              <p className="text-slate-300 text-lg mb-8">
                We serve clients globally, but our heart beats in Mexico. Visit our offices for document drop-off or pickup.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-brand-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold">Mexico City (CDMX)</h3>
                    <p className="text-slate-400 mt-1">Paseo de la Reforma 222<br/>Juárez, Cuauhtémoc, 06600</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-brand-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold">Querétaro (QRO)</h3>
                    <p className="text-slate-400 mt-1">Blvd. Bernardo Quintana 7001<br/>Centro Sur, 76090</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-6">
                  <UserCheck className="w-8 h-8 text-brand-500 mr-3" />
                  <h3 className="text-2xl font-bold">10+ Years of Experience</h3>
                </div>
                <p className="text-slate-300 mb-6">
                  Our team consists of certified experts recognized by the Judiciary Council. 
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-brand-500">15k+</div>
                    <div className="text-sm text-slate-400">Documents</div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-brand-500">10</div>
                    <div className="text-sm text-slate-400">Languages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-brand-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-1/2 p-12 lg:p-16 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
              <p className="text-brand-100 mb-8 text-lg">
                Send us your document details for a free quote within 2 hours.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-brand-400" />
                  <span>+52 (55) 1234 5678</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-brand-400" />
                  <span>info@traduccionesmexico.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-brand-400" />
                  <span>Mon-Fri: 9am - 6pm</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-white p-12 lg:p-16">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Source Language</label>
                     <select className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white">
                       <option>Spanish</option>
                       <option>English</option>
                       <option>French</option>
                       <option>German</option>
                       <option>Others</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Target Language</label>
                     <select className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white">
                       <option>English</option>
                       <option>Spanish</option>
                       <option>French</option>
                       <option>German</option>
                       <option>Others</option>
                     </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="I need a certified translation for..."></textarea>
                </div>
                <button className="w-full bg-brand-600 text-white font-bold py-4 rounded-lg hover:bg-brand-700 transition flex items-center justify-center group">
                  Send Request
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-bold text-white block mb-4">Traducciones Certificadas México</span>
              <p className="max-w-xs">Your trusted partner for official translations in Mexico City and Querétaro. Authorized by the Superior Court of Justice.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#locations" className="hover:text-white transition">Locations</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Sitemap</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            © {new Date().getFullYear()} Traducciones Certificadas México. All rights reserved.
          </div>
        </div>
      </footer>

      {/* AI Voice Widget */}
      <VoiceWidget />
    </div>
  );
};

export default App;