import React from 'react';
import { Layers, Github, Sparkles, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onAdminClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onAdminClick }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              IApp Funnels
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={onAdminClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 transition-all"
              title="Panel de Administración (PIN: 1234)"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors hidden sm:block">
              Documentación
            </a>
            <a href="https://github.com/LuisMiSan/IApp-Funnels.git" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            Impulsado por Google Gemini <Sparkles className="h-3 w-3 text-indigo-500" />
          </p>
          <p className="text-xs text-gray-400 mt-2">
            &copy; {new Date().getFullYear()} IApp Funnels. Inspirado en el repositorio de LuisMiSan.
          </p>
        </div>
      </footer>
    </div>
  );
};