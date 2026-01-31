import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputForm } from './components/InputForm';
import { FunnelResults } from './components/FunnelResults';
import { AdminPanel } from './components/AdminPanel';
import { AppState, FunnelInput, GeneratedFunnel, AdminSettings, DEFAULT_ADMIN_SETTINGS, FunnelTemplate, DEFAULT_TEMPLATES } from './types';
import { generateFunnel } from './services/geminiService';
import { AlertCircle, ShieldAlert, Lock, X, ChevronRight } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [results, setResults] = useState<GeneratedFunnel | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Admin & History State
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [history, setHistory] = useState<GeneratedFunnel[]>([]);
  const [templates, setTemplates] = useState<FunnelTemplate[]>(DEFAULT_TEMPLATES);

  // Pin Modal State
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('iapp_admin_settings');
    const savedHistory = localStorage.getItem('iapp_funnel_history');
    const savedTemplates = localStorage.getItem('iapp_funnel_templates');
    
    if (savedSettings) {
      try { setAdminSettings(JSON.parse(savedSettings)); } catch(e) {}
    }
    
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch(e) {}
    }

    if (savedTemplates) {
      try { setTemplates(JSON.parse(savedTemplates)); } catch(e) {}
    }
  }, []);

  const saveSettings = (newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
    localStorage.setItem('iapp_admin_settings', JSON.stringify(newSettings));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('iapp_funnel_history');
  };

  const saveTemplates = (newTemplates: FunnelTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem('iapp_funnel_templates', JSON.stringify(newTemplates));
  };

  const handleImportData = (data: { settings?: AdminSettings, history?: GeneratedFunnel[], templates?: FunnelTemplate[] }) => {
    if (data.settings) {
        saveSettings(data.settings);
    }
    if (data.history) {
        setHistory(data.history);
        localStorage.setItem('iapp_funnel_history', JSON.stringify(data.history));
    }
    if (data.templates) {
        saveTemplates(data.templates);
    }
    alert('✅ Datos restaurados correctamente.');
  };

  const handleAdminClick = () => {
    setShowPinModal(true);
    setPinInput('');
    setPinError(false);
  };

  const verifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "1234") {
      setShowPinModal(false);
      setShowAdmin(true);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleGenerate = async (data: FunnelInput) => {
    setAppState(AppState.LOADING);
    setError(null);
    try {
      const funnel = await generateFunnel(data, adminSettings);
      
      // Save to history
      const newHistory = [funnel, ...history];
      setHistory(newHistory);
      localStorage.setItem('iapp_funnel_history', JSON.stringify(newHistory));

      setResults(funnel);
      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error inesperado al generar el funnel.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setAppState(AppState.INPUT);
  };

  const handleViewFromHistory = (funnel: GeneratedFunnel) => {
    setResults(funnel);
    setAppState(AppState.RESULTS);
    setShowAdmin(false);
  };

  return (
    <>
      <Layout onAdminClick={handleAdminClick}>
        <div className="animate-fadeIn">
          
          {appState === AppState.INPUT && (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Crea Embudos de Venta de Alta Conversión
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  La herramienta definitiva para marketers y emprendedores. Genera textos persuasivos para tu landing page, emails y anuncios en segundos usando Inteligencia Artificial.
                </p>
              </div>
              <InputForm 
                onSubmit={handleGenerate} 
                isLoading={false} 
                templates={templates}
              />
            </div>
          )}

          {appState === AppState.LOADING && (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <InputForm onSubmit={() => {}} isLoading={true} templates={[]} />
              <div className="mt-8 text-center text-gray-500 max-w-md animate-pulse">
                <p>La IA está analizando tu público objetivo...</p>
                <p className="text-sm mt-2">Redactando copy persuasivo y estructurando la oferta utilizando la configuración actual.</p>
              </div>
            </div>
          )}

          {appState === AppState.RESULTS && results && (
            <FunnelResults results={results} onReset={handleReset} />
          )}

          {appState === AppState.ERROR && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center w-full shadow-sm">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  {error === "MISSING_API_KEY_SECURITY_WARNING" ? "Configuración Requerida" : "Algo salió mal"}
                </h3>
                
                <p className="text-red-700 mb-6 font-medium">
                  {error === "MISSING_API_KEY_SECURITY_WARNING" 
                    ? "No se ha detectado la API Key de Gemini." 
                    : error}
                </p>

                {error === "MISSING_API_KEY_SECURITY_WARNING" && (
                  <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 shadow-sm text-left text-sm text-gray-600 mb-8">
                    <div className="flex items-center gap-2 mb-3 text-red-700 font-bold text-base">
                      <ShieldAlert className="h-5 w-5" />
                      Advertencia de Seguridad
                    </div>
                    <p className="mb-3">
                      Para proteger tus datos, esta aplicación requiere que la API Key se configure a través de variables de entorno seguras.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>
                        <strong>NUNCA</strong> subas tus claves API a GitHub ni las escribas directamente en el código.
                      </li>
                      <li>
                        Asegúrate de tener la variable <code>API_KEY</code> configurada en tu entorno.
                      </li>
                    </ul>
                  </div>
                )}

                <button 
                  onClick={handleReset}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          )}

        </div>
      </Layout>

      {/* PIN Entry Modal - Outside Layout to prevent clipping */}
      {showPinModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-800 font-bold">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Lock className="h-5 w-5 text-indigo-600" />
                </div>
                Acceso Restringido
              </div>
              <button 
                onClick={() => setShowPinModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={verifyPin} className="p-8">
              <p className="text-center text-gray-600 mb-6">
                Introduce el PIN de administrador para acceder a la configuración avanzada.
              </p>
              
              <div className="mb-6 relative">
                <input
                  type="password"
                  autoFocus
                  placeholder="PIN (1234)"
                  className={`w-full text-center text-2xl tracking-[0.5em] py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    pinError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-900 placeholder-red-300' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100 text-gray-800'
                  }`}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if(pinError) setPinError(false);
                  }}
                  maxLength={4}
                />
                {pinError && (
                  <p className="text-red-500 text-sm font-medium mt-2 text-center absolute w-full animate-shake">
                    PIN Incorrecto
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Acceder al Panel <ChevronRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel Overlay - Outside Layout to prevent clipping */}
      {showAdmin && (
        <AdminPanel 
          currentSettings={adminSettings}
          onSaveSettings={saveSettings}
          history={history}
          onClearHistory={clearHistory}
          onClose={() => setShowAdmin(false)}
          onViewFunnel={handleViewFromHistory}
          templates={templates}
          onSaveTemplates={saveTemplates}
          onImportData={handleImportData}
        />
      )}
    </>
  );
}