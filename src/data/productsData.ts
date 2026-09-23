import { DigitalProduct } from '../types';

export const digitalProducts: DigitalProduct[] = [
  {
    id: 'ai-architecture-masterclass',
    title: 'The AI Architecture Workflow Masterclass',
    category: 'courses',
    tagline: 'From Conceptual Text Prompting to Parametric Geometry & Render Synthesis',
    description: 'A comprehensive, end-to-end framework teaching practicing architects and designers how to integrate Midjourney, ControlNet, Stable Diffusion, and Rhino Grasshopper into professional studio pipelines.',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574958269340-fa927304f2dd?q=80&w=1200&auto=format&fit=crop'
    ],
    badge: 'Flagship Curriculum',
    specs: {
      format: 'On-Demand Video Modules + Live Workshops',
      skillLevel: 'Intermediate to Advanced Architects',
      software: ['Midjourney v6', 'ControlNet', 'Stable Diffusion', 'Rhino Grasshopper', 'Photoshop'],
      duration: '6 Comprehensive Modules (18 Hours Total)'
    },
    contentHighlights: [
      'Module 01: Precision Prompt Grammar for Spatial Concepts & Typologies',
      'Module 02: Image-to-Geometry Pipelines with ControlNet Depth & Normals',
      'Module 03: Iterative Material Studies (Rammed Earth, Glulam, Titanium, Corten)',
      'Module 04: AI Massing to Rhino / Grasshopper Parametric Translation',
      'Module 05: Client Presentation Strategy & Ethical AI Disclosures',
      'Bonus: 150+ Curated Architecture Prompt Vault & LoRA Reference Weights'
    ],
    linkText: 'Explore Course Curriculum'
  },
  {
    id: 'architectural-prompt-vault',
    title: 'Architectural AI Prompt Matrix (Vol. 01 & 02)',
    category: 'prompts',
    tagline: '500+ Tested, Production-Ready Prompts for Exterior, Interior & Materiality',
    description: 'A structured prompt engineering system tailored specifically for architectural typologies, camera lenses, lighting temperatures, and material realism.',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    badge: '500+ Curated Prompts',
    specs: {
      format: 'Notion Database + PDF Cheat Sheet + JSON Presets',
      itemsCount: '520 Categorized Prompts',
      software: ['Midjourney v6.1', 'DALL-E 3', 'SDXL', 'Stable Diffusion'],
      skillLevel: 'All Levels'
    },
    contentHighlights: [
      '01. Exterior Massing & Façade Morphology (High-rise, Pavilion, Cultural, Residential)',
      '02. Interior Atmospheric Spaces (Terrazzo, Glulam, Brutalist, Japandi, Biophilic)',
      '03. Material & Micro-Texture Studies (Travertine, Board-Formed Concrete, Patinated Zinc)',
      '04. Environmental & Lighting Conditions (Blue Hour, Overcast Fog, Zenith Sun, Golden Dust)',
      '05. Lens & Architectural Camera Emulations (35mm Tilt-Shift, 50mm Anamorphic, Drone Aerial)'
    ],
    promptSnippet: 'brutalist travertine museum pavilion, cantilevered cast-concrete slabs, dramatic zenith lightwell casting sharp shadows on reflecting pool, architectural photography by Julius Shulman --ar 16:9 --v 6.1 --style raw',
    linkText: 'Access Prompt Matrix'
  },
  {
    id: 'bim-revit-standard-families',
    title: 'Parametric BIM & Revit 2025 Component Library',
    category: 'models',
    tagline: 'Production-Grade Revit Families with Embedded LOD 350 Parameter Data',
    description: 'Clean, fully parametric Revit (.rfa) families with standardized shared parameters, MEP connectors, and IFC classification codes ready for tender documentation.',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    badge: 'Revit 2024 / 2025 Ready',
    specs: {
      format: '.RFA Files + .RVT Project Template + Dynamo Scripts',
      itemsCount: '120+ Parametric Families',
      software: ['Autodesk Revit 2024+', 'Dynamo BIM', 'Navisworks'],
      skillLevel: 'BIM Modelers & Architects'
    },
    contentHighlights: [
      'Parametric Kinetic Louver Systems with Dynamic Sun Angle Formulas',
      'Curtain Wall Unitized Panel Assemblies with Embedded U-Values',
      'Custom Biophilic Atrium Joinery & Stair Families',
      'Automated Revit Schedule Templates for Area, Volume & Carbon Quantities',
      'Zero Duplicate Shared Parameter Guids for Conflict-Free Coordination'
    ],
    linkText: 'Download BIM Library'
  },
  {
    id: 'the-hybrid-architect-ebook',
    title: 'The Hybrid Architect: AI, BIM & Future Practice',
    category: 'ebooks',
    tagline: 'A Strategic Guide for Architects Navigating the Technological Shift',
    description: 'An in-depth 140-page whitepaper and design manual breaking down how individual architects and studios can master both high-tech automation and spatial craftsmanship.',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    badge: '140-Page Field Guide',
    specs: {
      format: 'Interactive Digital PDF + EPUB + Audio Summary',
      skillLevel: 'Architects, Students, Studio Directors',
      duration: '4-Hour Comprehensive Read'
    },
    contentHighlights: [
      'Chapter 01: The Evolution of Architectural Representation (Hand → CAD → BIM → AI)',
      'Chapter 02: Deconstructing the AI Hype: Where AI Excels and Where it Fails',
      'Chapter 03: Building a Sustainable Computational Practice in UAE & International Markets',
      'Chapter 04: Practical Case Studies: Real Projects Coordinated with BIM & AI',
      'Chapter 05: The Future of Architectural Intellectual Property & Career Longevity'
    ],
    linkText: 'Read Free Chapter Preview'
  },
  {
    id: 'exclusive-bim-ai-masterclass',
    title: 'Live Masterclass: BIM Coordination × Generative AI',
    category: 'masterclasses',
    tagline: 'Interactive 3-Day Intensive Studio Workshop with Live Q&A',
    description: 'Small-cohort live workshop where participants build an actual mixed-use project from AI concept generation to coordinated Revit LOD 350 documentation.',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200&auto=format&fit=crop',
    badge: 'Live Cohort Intensive',
    specs: {
      format: 'Live Virtual Studio (3 Sessions × 3.5 Hours)',
      skillLevel: 'Practicing Architects & BIM Professionals',
      software: ['Revit', 'Midjourney', 'Navisworks', 'Rhino']
    },
    contentHighlights: [
      'Day 1: AI Ideation, ControlNet Geometry Guidance, and Feasibility Checks',
      'Day 2: Parametric Translation into Revit Massing & Envelope Assemblies',
      'Day 3: Clash Detection Auditing, Technical Documentation & Client Pitch Storytelling',
      'Includes 1-on-1 Portfolio & Workflow Feedback Session with Ar. Ahmed Usmani'
    ],
    linkText: 'Reserve Cohort Seat'
  }
];
