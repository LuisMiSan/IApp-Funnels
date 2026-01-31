import React, { useState } from 'react';
import { FunnelInput, FunnelTemplate } from '../types';
import { Send, Sparkles, BookOpen, ChevronDown } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: FunnelInput) => void;
  isLoading: boolean;
  templates: FunnelTemplate[];
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, templates }) => {
  const [formData, setFormData] = useState<FunnelInput>({
    productName: '',
    targetAudience: '',
    painPoints: '',
    benefits: '',
    tone: 'professional',
    language: 'es'
  });
  const [showTemplates, setShowTemplates] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoadTemplate = (template: FunnelTemplate) => {
    setFormData(template.data);
    setShowTemplates(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Definimos una clase común para mantener la consistencia y el estilo solicitado
  const inputClassName = "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none";

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            Configura tu Funnel
          </h2>
          <p className="text-indigo-700 mt-1">
            Describe tu producto y deja que la IA redacte tu estrategia.
          </p>
        </div>
        
        {/* Template Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-white px-3 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Cargar Ejemplo
            <ChevronDown className="h-3 w-3" />
          </button>
          
          {showTemplates && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowTemplates(false)}></div>
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden animate-fadeIn">
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <span className="text-xs font-bold text-gray-500 uppercase">Biblioteca de Ejemplos</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {templates.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No hay plantillas disponibles.</div>
                  ) : (
                    templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleLoadTemplate(t)}
                        className="w-full text-left p-3 hover:bg-indigo-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
                        <div className="text-xs text-gray-500 truncate">{t.description}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nombre del Producto / Servicio</label>
            <input
              type="text"
              name="productName"
              required
              placeholder="Ej. Curso de Marketing Digital 360"
              className={inputClassName}
              value={formData.productName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Público Objetivo</label>
            <input
              type="text"
              name="targetAudience"
              required
              placeholder="Ej. Emprendedores principiantes"
              className={inputClassName}
              value={formData.targetAudience}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Puntos de Dolor (Pain Points)</label>
          <textarea
            name="painPoints"
            required
            rows={3}
            placeholder="¿Qué problemas tiene tu cliente? Ej. No saben conseguir leads, gastan mucho en ads sin retorno..."
            className={`${inputClassName} resize-none`}
            value={formData.painPoints}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Beneficios Principales</label>
          <textarea
            name="benefits"
            required
            rows={3}
            placeholder="¿Cómo ayuda tu producto? Ej. Aprenderás paso a paso, plantillas incluidas, soporte 24/7..."
            className={`${inputClassName} resize-none`}
            value={formData.benefits}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tono de Voz</label>
            <select
              name="tone"
              className={inputClassName}
              value={formData.tone}
              onChange={handleChange}
            >
              <option value="professional">Profesional y Autoritario</option>
              <option value="friendly">Amigable y Cercano</option>
              <option value="urgent">Urgente y Persuasivo</option>
              <option value="luxury">Exclusivo y Lujoso</option>
            </select>
          </div>
           <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Idioma de Salida</label>
            <select
              name="language"
              className={inputClassName}
              value={formData.language}
              onChange={handleChange}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all flex items-center justify-center gap-3
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-500/30 hover:-translate-y-1 active:scale-95'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando Estrategia...
              </>
            ) : (
              <>
                Generar Funnel IA <Send className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};