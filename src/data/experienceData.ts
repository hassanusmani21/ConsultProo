import { ExperienceItem, CertificationItem } from '../types';

export const experienceTimeline: ExperienceItem[] = [
  {
    period: '2025 – PRESENT',
    role: 'Junior BIM Architect',
    company: 'International Architectural & BIM Practice',
    location: 'Dubai, UAE · Remote / Hybrid',
    description: 'Leading Revit BIM multi-discipline modeling, LOD 350-400 coordination, Navisworks clash detection audits, and generative AI design research for large-scale commercial & cultural developments.',
    highlights: [
      'Developed parametric Revit families reducing multi-unit drafting time by 35%.',
      'Orchestrated cross-discipline clash audits between architectural facades and MEP services.',
      'Piloted internal AI visualization workflows for rapid client design charrettes.'
    ],
    tools: ['Autodesk Revit', 'Navisworks Manage', 'BIM 360', 'Rhino Grasshopper', 'Midjourney AI']
  },
  {
    period: '2024 – 2025',
    role: 'Junior Architect',
    company: 'Contemporary Architecture & Urban Studio',
    location: 'India · Regional & Middle East Projects',
    description: 'Managed architectural design development, municipal approval drawings, detailed working drawing packages, and photorealistic 3D visualization for residential and cultural projects.',
    highlights: [
      'Delivered full schematic to tender drawing sets for 4,000+ m² institutional campus.',
      'Generated photorealistic spatial visualizations and daylight simulation studies.',
      'Supervised material finishes, site coordination, and structural contractor inquiries.'
    ],
    tools: ['AutoCAD Architecture', 'Autodesk Revit', 'Sketchup Pro', 'Enscape', 'Photoshop']
  },
  {
    period: '2022 – 2023',
    role: 'Architect Intern',
    company: 'Design & Environmental Studio',
    location: 'India',
    description: 'Assisted senior associates with conceptual spatial massing, physical model craftsmanship, 2D drafting, site survey documentation, and presentation graphic design.',
    highlights: [
      'Created detailed 3D spatial models and sectional axonometric illustrations.',
      'Participated in passive climate design and vernacular material research.'
    ],
    tools: ['AutoCAD', 'Sketchup', 'Adobe InDesign', 'Physical Modeling']
  }
];

export const certificationsArchive: CertificationItem[] = [
  {
    id: 'autodesk-revit-bim',
    title: 'Autodesk Certified Professional: Revit for Architectural Design',
    issuer: 'Autodesk',
    year: '2024',
    credentialId: 'AUTODESK-BIM-REVIT-8842',
    description: 'Official credential validating advanced Revit modeling, parametric family creation, multi-discipline BIM coordination, worksharing, and documentation standards.',
    verified: true,
    badge: 'Autodesk Certified',
    skills: ['Revit Architecture', 'LOD Coordination', 'Worksharing', 'Parametric Families', 'Schedules']
  },
  {
    id: 'council-of-architecture',
    title: 'Council of Architecture (CoA) Registered Architect',
    issuer: 'Council of Architecture, India',
    year: '2024',
    credentialId: 'CA/2024/VERIFIED-AR',
    description: 'Statutory registration qualifying practice as a licensed architect, adhering to building bylaws, professional ethics, and architectural standards.',
    verified: true,
    badge: 'Licensed Architect',
    skills: ['Building Bylaws', 'Contract Administration', 'Architectural Practice', 'Statutory Codes']
  },
  {
    id: 'dubai-future-ai',
    title: 'AI & Prompt Engineering for Spatial Design',
    issuer: 'Dubai Future Foundation / Emerging Tech Network',
    year: '2024',
    credentialId: 'DFF-AI-ARCH-7719',
    description: 'Specialized certification in generative AI models, latent diffusion architectures, ControlNet spatial guidance, and computational creative pipelines.',
    verified: true,
    badge: 'AI Specialist',
    skills: ['Prompt Engineering', 'ControlNet Depth', 'Latent Diffusion', 'Computational Workflows']
  }
];
