import { Article } from '../types';

export const learningHubArticles: Article[] = [
  {
    id: 'ai-prompt-engineering-for-architects',
    title: 'Precision Over Randomness: The Architect’s Guide to AI Prompting',
    category: 'AI Workflows',
    readTime: '6 min read',
    date: 'February 2025',
    summary: 'Why generic text prompts yield generic fantasy buildings — and how spatial terminology, material science, and optical camera descriptors create buildable architectural concepts.',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    keyTakeaways: [
      'Replace vague adjectives ("modern", "futuristic") with specific structural typologies (e.g. "cantilevered diagrid", "post-tensioned concrete slab").',
      'Specify material finishes using industry nomenclature ("rough-sawn formwork", "honed travertine", "oxidized copper").',
      'Use lens and focal length parameters to control spatial compression and perspective distortion (e.g. 35mm tilt-shift for elevation integrity).'
    ],
    content: [
      'The early wave of generative AI in architecture produced an overwhelming flood of surreal, liquid-form fantasy structures. While visually fascinating, most were structurally impossible and functionally ungrounded.',
      'As architects, our differentiator is spatial syntax. When we prompt a neural network, we are not asking it to replace our design thinking; we are setting the constraints of a high-dimensional design search.',
      'By controlling structural hierarchy, daylight orientation (e.g. "low-angle winter sun at 32 degrees azimuth"), and material thermal mass, the output transitions from arbitrary digital art into meaningful conceptual exploration that can be directly imported into Rhino or Revit for volumetric validation.'
    ]
  },
  {
    id: 'bim-lod-standards-in-practice',
    title: 'Demystifying LOD 200 vs LOD 350 in Fast-Track UAE Projects',
    category: 'BIM & Revit',
    readTime: '8 min read',
    date: 'January 2025',
    summary: 'A field breakdown of Level of Development standards, coordination workflows, and how to avoid over-modeling while ensuring zero on-site contractor disputes.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    keyTakeaways: [
      'Over-modeling too early (e.g. LOD 400 details at schematic design) causes file bloat and coordination friction.',
      'LOD 350 is the golden threshold for multi-discipline coordination: it includes interfaces, connections, and service clearances.',
      'Parametric shared parameters must follow a single consistent BIM execution plan (BEP) across all architectural and engineering consultants.'
    ],
    content: [
      'In high-density commercial developments across Dubai and the broader GCC, project timelines demand simultaneous design iteration and fast-track procurement.',
      'The primary failure point in many Revit projects is not a lack of modeling skill, but a failure of Level of Development discipline. Modeling every screw and bolt in a curtain wall system during the design development phase slows down model regeneration without adding decision-making value.',
      'By anchoring our workflows in clear LOD 300 to 350 milestones, we ensure that structural steel, HVAC duct banks, and facade anchorages are fully clash-free in Navisworks while keeping file performance agile.'
    ]
  },
  {
    id: 'the-hybrid-architectural-career',
    title: 'The Hybrid Architect: Thriving in an Automated Industry',
    category: 'Career',
    readTime: '5 min read',
    date: 'December 2024',
    summary: 'How emerging professionals can bridge the gap between traditional architectural foundations, technical BIM rigor, and artificial intelligence.',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    keyTakeaways: [
      'Master the core architectural fundamentals: spatial proportion, human scale, building codes, and material tactility.',
      'Combine technical production fluency (Revit, Navisworks) with high-speed conceptual synthesis (Generative AI, Grasshopper).',
      'The highest leverage architects are those who can communicate clearly between client vision, algorithmic tools, and construction trades.'
    ],
    content: [
      'The debate between "hand-drawn craftsmanship" and "algorithmic automation" is a false dichotomy. The most effective architects throughout history have always adopted the most powerful instruments of their era.',
      'Today, that means understanding how space feels when light enters a room, while simultaneously leveraging computational scripts to optimize solar shading and automated BIM schedules to verify cost efficiency.',
      'Our role is not diminishing; it is expanding into that of a spatial orchestrator.'
    ]
  }
];
