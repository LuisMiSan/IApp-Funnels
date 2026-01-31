
export interface FunnelInput {
  productName: string;
  targetAudience: string;
  painPoints: string;
  benefits: string;
  tone: 'professional' | 'urgent' | 'friendly' | 'luxury';
  language: 'es' | 'en';
}

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  data: FunnelInput;
}

export interface LandingPageCopy {
  headline: string;
  subheadline: string;
  heroButton: string;
  features: string[];
  testimonials: string[];
  cta: string;
}

export interface EmailCopy {
  subject: string;
  body: string;
  type: 'welcome' | 'nurture' | 'sales';
}

export interface AdCopy {
  platform: 'Facebook' | 'Instagram' | 'LinkedIn';
  primaryText: string;
  headline: string;
  description: string;
}

export interface GeneratedFunnel {
  id?: string; // Added for history management
  createdAt?: string;
  input?: FunnelInput; // Store what generated this
  strategySummary: string;
  landingPage: LandingPageCopy;
  emails: EmailCopy[];
  ads: AdCopy[];
}

export enum AppState {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
  ADMIN = 'ADMIN' // New state
}

export interface AdminSettings {
  systemInstruction: string;
  basePromptTemplate: string;
  modelTemperature: number;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  systemInstruction: "You are an expert copywriter specializing in sales funnels (ClickFunnels, Russell Brunson style). You output strictly valid JSON.",
  basePromptTemplate: "Act as a world-class Direct Response Marketing Expert. Create a complete marketing funnel for the following product/service:",
  modelTemperature: 0.7
};

export const DEFAULT_TEMPLATES: FunnelTemplate[] = [
  {
    id: 't1',
    name: 'Curso Yoga Post-Parto',
    description: 'Nicho: Salud y Bienestar. Tono: Amigable.',
    data: {
      productName: 'Programa Mamá Zen 15min',
      targetAudience: 'Madres primerizas con bebés de 0-12 meses que se sienten agotadas.',
      painPoints: 'Dolor de espalda, estrés, falta de tiempo para ir al gimnasio, pérdida de identidad.',
      benefits: 'Recuperación suelo pélvico, calma mental, ejercicios de 15 min desde casa, comunidad de apoyo.',
      tone: 'friendly',
      language: 'es'
    }
  },
  {
    id: 't2',
    name: 'SaaS Gestión de Proyectos',
    description: 'Nicho: B2B Tecnología. Tono: Profesional.',
    data: {
      productName: 'FlowMaster Pro',
      targetAudience: 'Agencias de Marketing Digital con 5-20 empleados.',
      painPoints: 'Proyectos entregados tarde, clientes molestos, comunicación dispersa en emails y chats.',
      benefits: 'Todo en un solo lugar, automatización de reportes, vista de carga de trabajo del equipo.',
      tone: 'professional',
      language: 'es'
    }
  },
  {
    id: 't3',
    name: 'Asesoría Fiscal Premium',
    description: 'Nicho: High Ticket. Tono: Lujo/Exclusivo.',
    data: {
      productName: 'Estrategia Fiscal 360',
      targetAudience: 'Empresarios facturando >1M€ anuales.',
      painPoints: 'Pagan demasiados impuestos legalmente evitables, miedo a inspecciones, gestoría reactiva.',
      benefits: 'Optimización fiscal agresiva pero legal, tranquilidad absoluta, reuniones trimestrales de estrategia.',
      tone: 'luxury',
      language: 'es'
    }
  }
];
