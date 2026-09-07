export type ProjectCategory = 'all' | 'architecture' | 'interior' | 'ai';

export type AiCategory = 'ARCHITECTURE' | 'INTERIOR DESIGN' | 'RENOVATION' | 'EXTERIOR' | 'MATERIALS' | 'LIGHTING' | 'VISUALIZATION';

export interface AiVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
  promptId: string;
  featured: boolean;
  duration?: string;
}

export interface AiPromptData {
  id: string;
  code: string;
  title: string;
  category: AiCategory;
  type: 'FREE' | 'PREMIUM';
  previewText: string;
  fullPrompt: string;
  thumbnail: string;
  resultImage: string;
  beforeImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  videoUrl?: string;
  price?: string;
  currency?: string;
  purchaseUrl?: string;
  featured?: boolean;
  workflowStep?: string;
  parameters?: {
    engine: string;
    stylize?: number;
    aspectRatio?: string;
    lighting?: string;
    materials?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'architecture' | 'interior' | 'ai';
  year: string;
  location: string;
  role: string;
  thumbnail: string;
  heroImage: string;
  gallery: string[];
  cadDrawing?: string;
  concept: string;
  description: string;
  featured: boolean;
}

export interface VillaPlan {
  id: string;
  title: string;
  planCode: string;
  areaSqFt: string;
  bedrooms: number;
  bathrooms: number;
  levels: string;
  plotSizes: string[];
  style: string;
  previewImage: string;
  elevationImage: string;
  floorPlanPreview: string;
  description: string;
  price: string;
  currency: string;
  pdfUrl?: string;
  purchaseUrl: string;
  status: 'available' | 'coming_soon';
  featured: boolean;
  includes: string[];
  lockedDrawingUrl?: string;
}

export interface EbookProduct {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  description: string;
  highlights: string[];
  price: string;
  currency: string;
  purchaseUrl: string;
  pagesCount: string;
  format: string;
  badge?: string;
  sampleChapters?: string[];
}

export interface DigitalProduct {
  id: string;
  title: string;
  category: 'courses' | 'prompts' | 'models' | 'ebooks' | 'masterclasses' | 'plans';
  tagline: string;
  description: string;
  thumbnail: string;
  previewImages?: string[];
  badge?: string;
  specs: {
    format: string;
    itemsCount?: string;
    software?: string[];
    skillLevel?: string;
    duration?: string;
  };
  contentHighlights: string[];
  promptSnippet?: string;
  linkText?: string;
}

export interface PromptDemo {
  id: string;
  title: string;
  category: string;
  promptText: string;
  negativePrompt?: string;
  aspectRatio: string;
  parameters: {
    engine: string;
    stylize: number;
    chaos: number;
    lighting: string;
    materials: string;
  };
  stages: {
    stage: 'Prompt Input' | 'Spatial Wireframe' | 'Volumetric Diffusion' | 'Photorealistic Visualization';
    progress: number;
    image: string;
    description: string;
  }[];
}

export interface Article {
  id: string;
  title: string;
  category: 'Architecture' | 'BIM & Revit' | 'AI Workflows' | 'Career';
  readTime: string;
  date: string;
  summary: string;
  coverImage: string;
  keyTakeaways: string[];
  content: string[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  highlights: string[];
  tools: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialId?: string;
  description: string;
  verified: boolean;
  badge: string;
  skills: string[];
}

export interface ConsultationSubmission {
  needs: string[];
  projectType: string;
  description: string;
  timeline: string;
  name: string;
  email: string;
  companyOrStudio?: string;
  preferredTime: string;
  timezone: string;
}
