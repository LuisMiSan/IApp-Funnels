import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AdminSettings, GeneratedFunnel, FunnelTemplate, DEFAULT_ADMIN_SETTINGS, FunnelInput } from '../types';
import { Save, RotateCcw, Database, Settings, BarChart3, Trash2, X, Eye, BookOpen, Plus, Edit2, CheckCircle, Download, Upload, FileJson } from 'lucide-react';

// Declare GSAP on window since we load it via CDN
declare global {
  interface Window {
    gsap: any;
  }
}

interface AdminPanelProps {
  currentSettings: AdminSettings;
  onSaveSettings: (settings: AdminSettings) => void;
  history: GeneratedFunnel[];
  onClearHistory: () => void;
  onClose: () => void;
  onViewFunnel: (funnel: GeneratedFunnel) => void;
  templates: FunnelTemplate[];
  onSaveTemplates: (templates: FunnelTemplate[]) => void;
  onImportData: (data: { settings?: AdminSettings, history?: GeneratedFunnel[], templates?: FunnelTemplate[] }) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentSettings, 
  onSaveSettings, 
  history, 
  onClearHistory, 
  onClose,
  onViewFunnel,
  templates,
  onSaveTemplates,
  onImportData
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'library' | 'history' | 'analytics'>('config');
  const [tempSettings, setTempSettings] = useState<AdminSettings>(currentSettings);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Refs for animation
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Template Management State
  const [editingTemplate, setEditingTemplate] = useState<FunnelTemplate | null>(null);
  const [isNewTemplate, setIsNewTemplate] = useState(false);

  // GSAP Animation on Mount
  useEffect(() => {
    if (window.gsap && overlayRef.current && panelRef.current) {
      // Reset initial states
      window.gsap.set(overlayRef.current, { opacity: 0 });
      window.gsap.set(panelRef.current, { x: '100%' });

      // Animate in
      window.gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      window.gsap.to(panelRef.current, { x: '0%', duration: 0.5, ease: 'power3.out', delay: 0.1 });
    }
  }, []);

  const handleClose = () => {
    if (window.gsap && overlayRef.current && panelRef.current) {
      window.gsap.to(panelRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
      window.gsap.to(overlayRef.current, { 
        opacity: 0, 
        duration: 0.3, 
        delay: 0.1, 
        onComplete: onClose 
      });
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    onSaveSettings(tempSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    setTempSettings(DEFAULT_ADMIN_SETTINGS);
  };

  // Backup Functions
  const handleExportBackup = () => {
    const data = {
      settings: currentSettings,
      templates: templates,
      history: history,
      version: '1.0',
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IApp-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (confirm(`Se han encontrado:\n- ${data.history?.length || 0} items en historial\n- ${data.templates?.length || 0} plantillas\n\n¿Deseas restaurar estos datos? Esto sobrescribirá la configuración actual.`)) {
          onImportData(data);
          // Actualizar estado local si estamos en la pestaña de config
          if (data.settings) setTempSettings(data.settings);
        }
      } catch (error) {
        alert("Error al leer el archivo. Asegúrate de que es un JSON válido de IApp Funnels.");
      }
    };
    reader.readAsText(file);
    // Limpiar input para permitir subir el mismo archivo de nuevo si es necesario
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Template Helpers
  const handleEditTemplate = (template: FunnelTemplate) => {
    setEditingTemplate({...template}); 
    setIsNewTemplate(false);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate({
      id: crypto.randomUUID(),
      name: 'Nueva Plantilla',
      description: 'Descripción breve...',
      data: {
        productName: '',
        targetAudience: '',
        painPoints: '',
        benefits: '',
        tone: 'professional',
        language: 'es'
      }
    });
    setIsNewTemplate(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    let newTemplates = [...templates];
    if (isNewTemplate) {
      newTemplates.push(editingTemplate);
    } else {
      newTemplates = newTemplates.map(t => t.id === editingTemplate.id ? editingTemplate : t);
    }
    
    onSaveTemplates(newTemplates);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("¿Seguro que quieres eliminar esta plantilla?")) {
      const newTemplates = templates.filter(t => t.id !== id);
      onSaveTemplates(newTemplates);
      if (editingTemplate?.id === id) setEditingTemplate(null);
    }
  };

  const updateTemplateData = (field: keyof FunnelInput, value: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      data: {
        ...editingTemplate.data,
        [field]: value
      }
    });
  };

  // Use React Portal to render at the document body level, bypassing parent clipping
  return createPortal(
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-[9999] flex justify-end opacity-0"
    >
      <div 
        ref={panelRef}
        className="w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col translate-x-full"
      >
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-xs text-gray-400">Control Center v1.2</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 overflow-x-auto flex-shrink-0">
          <button 
            onClick={() => setActiveTab('config')}
            className={`py-4 px-6 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'config' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="h-4 w-4" /> Configuración IA
          </button>
           <button 
            onClick={() => setActiveTab('library')}
            className={`py-4 px-6 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'library' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="h-4 w-4" /> Biblioteca ({templates.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`py-4 px-6 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Database className="h-4 w-4" /> Historial ({history.length})
          </button>
           <button 
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-6 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'analytics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Analíticas
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 bg-gray-50/50">
          
          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* Data Management Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm border border-indigo-100 mb-8">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <FileJson className="h-5 w-5 text-indigo-600" />
                  Copia de Seguridad
                </h3>
                <p className="text-sm text-indigo-700 mb-4">
                  Evita perder tus datos. Descarga una copia de seguridad de tu historial, plantillas y configuración.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium shadow-sm"
                  >
                    <Download className="h-4 w-4" /> Exportar Datos
                  </button>
                  <button 
                    onClick={handleImportClick}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    <Upload className="h-4 w-4" /> Importar Datos
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".json"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                  Personalidad de la IA (System Instruction)
                </h3>
                <textarea
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-mono bg-gray-50"
                  value={tempSettings.systemInstruction}
                  onChange={(e) => setTempSettings({...tempSettings, systemInstruction: e.target.value})}
                />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                  Prompt Base
                </h3>
                <textarea
                  className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-mono bg-gray-50"
                  value={tempSettings.basePromptTemplate}
                  onChange={(e) => setTempSettings({...tempSettings, basePromptTemplate: e.target.value})}
                />
              </div>

               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                  Temperatura del Modelo: {tempSettings.modelTemperature}
                </h3>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={tempSettings.modelTemperature}
                  onChange={(e) => setTempSettings({...tempSettings, modelTemperature: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <RotateCcw className="h-4 w-4" /> Restaurar Defaults
                </button>
                <button 
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all shadow-lg ${
                    isSaved ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <Save className="h-4 w-4" /> {isSaved ? 'Guardado!' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="grid grid-cols-12 gap-6 h-full min-h-[500px]">
              {/* List */}
              <div className="col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-700">Mis Plantillas</h3>
                  <button onClick={handleCreateTemplate} className="text-indigo-600 hover:bg-indigo-100 p-1.5 rounded-lg transition-colors">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="overflow-y-auto flex-grow divide-y divide-gray-100">
                  {templates.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => handleEditTemplate(t)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${editingTemplate?.id === t.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                    >
                      <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 truncate">{t.description}</p>
                    </div>
                  ))}
                  {templates.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">No hay plantillas. Crea una nueva.</div>
                  )}
                </div>
              </div>

              {/* Editor */}
              <div className="col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
                {editingTemplate ? (
                  <>
                     <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <Edit2 className="h-4 w-4 text-gray-500" />
                           <span className="font-bold text-gray-700">{isNewTemplate ? 'Crear Nueva Plantilla' : 'Editar Plantilla'}</span>
                        </div>
                        {!isNewTemplate && (
                          <button onClick={() => handleDeleteTemplate(editingTemplate.id)} className="text-red-500 hover:bg-red-50 p-2 rounded text-xs flex items-center gap-1">
                            <Trash2 className="h-4 w-4" /> Eliminar
                          </button>
                        )}
                    </div>
                    <div className="p-6 overflow-y-auto flex-grow space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Nombre Plantilla</label>
                          <input 
                            type="text" 
                            className="w-full mt-1 p-2 border border-gray-200 rounded focus:border-indigo-500 outline-none" 
                            value={editingTemplate.name}
                            onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                          />
                        </div>
                         <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Descripción</label>
                          <input 
                            type="text" 
                            className="w-full mt-1 p-2 border border-gray-200 rounded focus:border-indigo-500 outline-none" 
                            value={editingTemplate.description}
                            onChange={(e) => setEditingTemplate({...editingTemplate, description: e.target.value})}
                          />
                        </div>
                      </div>

                      <hr className="border-gray-100 my-2" />
                      <h4 className="font-bold text-gray-800 text-sm">Datos del Formulario</h4>

                      <div>
                        <label className="text-xs font-bold text-gray-500">Producto / Servicio</label>
                        <input 
                          type="text" 
                          className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded focus:border-indigo-500 outline-none" 
                          value={editingTemplate.data.productName}
                          onChange={(e) => updateTemplateData('productName', e.target.value)}
                        />
                      </div>
                       <div>
                        <label className="text-xs font-bold text-gray-500">Público Objetivo</label>
                        <input 
                          type="text" 
                          className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded focus:border-indigo-500 outline-none" 
                          value={editingTemplate.data.targetAudience}
                          onChange={(e) => updateTemplateData('targetAudience', e.target.value)}
                        />
                      </div>
                       <div>
                        <label className="text-xs font-bold text-gray-500">Puntos de Dolor</label>
                        <textarea 
                          rows={2}
                          className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded focus:border-indigo-500 outline-none resize-none" 
                          value={editingTemplate.data.painPoints}
                          onChange={(e) => updateTemplateData('painPoints', e.target.value)}
                        />
                      </div>
                       <div>
                        <label className="text-xs font-bold text-gray-500">Beneficios</label>
                        <textarea 
                          rows={2}
                          className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded focus:border-indigo-500 outline-none resize-none" 
                          value={editingTemplate.data.benefits}
                          onChange={(e) => updateTemplateData('benefits', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs font-bold text-gray-500">Tono</label>
                            <select 
                              className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded outline-none"
                              value={editingTemplate.data.tone}
                              onChange={(e) => updateTemplateData('tone', e.target.value)}
                            >
                               <option value="professional">Professional</option>
                               <option value="friendly">Friendly</option>
                               <option value="urgent">Urgent</option>
                               <option value="luxury">Luxury</option>
                            </select>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-500">Idioma</label>
                            <select 
                              className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded outline-none"
                              value={editingTemplate.data.language}
                              onChange={(e) => updateTemplateData('language', e.target.value)}
                            >
                               <option value="es">Español</option>
                               <option value="en">English</option>
                            </select>
                         </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                         <button 
                          onClick={handleSaveTemplate}
                          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
                        >
                           <CheckCircle className="h-4 w-4" /> Guardar Plantilla
                        </button>
                      </div>

                    </div>
                  </>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                      <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                      <p>Selecciona una plantilla para editar o crea una nueva.</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-700">Generaciones Recientes</h3>
                <button 
                  onClick={() => {
                    if(confirm("¿Estás seguro de borrar todo el historial?")) onClearHistory();
                  }}
                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-medium"
                >
                  <Trash2 className="h-3 w-3" /> Borrar Todo
                </button>
              </div>
              
              {history.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Database className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No hay historial disponible aún.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {history.map((item, idx) => (
                    <div key={item.id || idx} className="p-4 hover:bg-indigo-50 transition-colors flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.input?.productName || "Producto Sin Nombre"}</h4>
                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{item.input?.language === 'es' ? 'Español' : 'Inglés'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => onViewFunnel(item)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                        title="Ver Funnel"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

           {/* Analytics Tab */}
           {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-500 text-sm font-medium">Total Generaciones</h4>
                  <Database className="h-5 w-5 text-indigo-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{history.length}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
};