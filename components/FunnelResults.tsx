import React, { useState } from 'react';
import { GeneratedFunnel } from '../types';
import { Layout, Mail, Facebook, Monitor, Copy, Check, ArrowLeft } from 'lucide-react';

interface FunnelResultsProps {
  results: GeneratedFunnel;
  onReset: () => void;
}

export const FunnelResults: React.FC<FunnelResultsProps> = ({ results, onReset }) => {
  const [activeTab, setActiveTab] = useState<'landing' | 'emails' | 'ads'>('landing');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <button 
        onClick={onReset}
        className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors font-medium mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al formulario
      </button>

      {/* Strategy Summary Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <h2 className="text-2xl font-bold mb-4 relative z-10">Estrategia Generada</h2>
        <p className="text-indigo-100 leading-relaxed relative z-10 text-lg">
          {results.strategySummary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('landing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'landing' 
                ? 'bg-white text-indigo-600 shadow-md border-l-4 border-indigo-600' 
                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
            }`}
          >
            <Monitor className="h-5 w-5" /> Landing Page
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'emails' 
                ? 'bg-white text-indigo-600 shadow-md border-l-4 border-indigo-600' 
                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
            }`}
          >
            <Mail className="h-5 w-5" /> Secuencia de Emails
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'ads' 
                ? 'bg-white text-indigo-600 shadow-md border-l-4 border-indigo-600' 
                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
            }`}
          >
            <Facebook className="h-5 w-5" /> Anuncios
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Landing Page Content */}
          {activeTab === 'landing' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Estructura de Landing Page</h3>
                <button 
                  onClick={() => handleCopy(JSON.stringify(results.landingPage, null, 2), 'lp-json')}
                  className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  {copiedIndex === 'lp-json' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  Copiar JSON
                </button>
              </div>

              <div className="space-y-8">
                <div className="border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-50 rounded-r-lg">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Headline (H1)</span>
                  <p className="text-xl font-bold text-gray-900 mt-1">{results.landingPage.headline}</p>
                </div>

                <div className="pl-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subheadline (H2)</span>
                  <p className="text-lg text-gray-600 mt-1">{results.landingPage.subheadline}</p>
                </div>

                 <div className="pl-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hero Button (CTA)</span>
                  <button className="mt-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200">
                    {results.landingPage.heroButton}
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Beneficios / Características</span>
                  <ul className="space-y-2">
                    {results.landingPage.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Testimonios Generados</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.landingPage.testimonials.map((t, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm italic text-gray-600 text-sm">
                        "{t}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Sequence Content */}
          {activeTab === 'emails' && (
            <div className="space-y-6 animate-fadeIn">
              {results.emails.map((email, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        email.type === 'welcome' ? 'bg-green-100 text-green-700' :
                        email.type === 'nurture' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {email.type}
                      </span>
                      <span className="font-semibold text-gray-700 text-sm">Email #{index + 1}</span>
                    </div>
                    <button 
                      onClick={() => handleCopy(`Subject: ${email.subject}\n\n${email.body}`, `email-${index}`)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-gray-100"
                    >
                       {copiedIndex === `email-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="text-xs text-gray-400 font-bold uppercase">Asunto</span>
                      <p className="text-gray-900 font-medium">{email.subject}</p>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                      {email.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ads Content */}
          {activeTab === 'ads' && (
            <div className="grid grid-cols-1 gap-6 animate-fadeIn">
              {results.ads.map((ad, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-gray-700 text-sm">{ad.platform} Ad Variant #{index + 1}</span>
                    </div>
                     <button 
                      onClick={() => handleCopy(`Headline: ${ad.headline}\n\n${ad.primaryText}\n\n${ad.description}`, `ad-${index}`)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-gray-100"
                    >
                       {copiedIndex === `ad-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Primary Text</span>
                      <p className="text-gray-700 whitespace-pre-line text-sm">{ad.primaryText}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Mockup Preview</span>
                      <h4 className="font-bold text-gray-900">{ad.headline}</h4>
                      <p className="text-sm text-gray-500 mt-1">{ad.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                         <span className="text-xs text-gray-400">www.tusitio.com</span>
                         <button className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded font-semibold">Más información</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};