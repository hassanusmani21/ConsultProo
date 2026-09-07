import { AiPromptData, AiVideoItem, PromptDemo } from '../types';

export const aiVideosList: AiVideoItem[] = [
  {
    id: 'video-arch-vis-001',
    title: 'Parametric Desert Pavilion Synthesis',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-building-with-geometric-windows-41312-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
    category: 'ARCHITECTURAL VISUALIZATION',
    promptId: 'prompt-001-desert-pavilion',
    featured: true,
    duration: '0:18'
  },
  {
    id: 'video-interior-trans-002',
    title: 'From Raw Concrete Shell to Japandi Sanctuary',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-living-room-with-furniture-41484-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
    category: 'INTERIOR DESIGN',
    promptId: 'prompt-002-japandi-penthouse',
    featured: false,
    duration: '0:22'
  },
  {
    id: 'video-renovation-003',
    title: 'Heritage Facade Biophilic Adaptive Reuse',
    videoUrl: '', // Demonstrates AI_VIDEO_PLACEHOLDER fallback if empty or offline
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    category: 'RENOVATION',
    promptId: 'prompt-003-biophilic-renovation',
    featured: false,
    duration: '0:15'
  }
];

export const aiPromptsLibrary: AiPromptData[] = [
  {
    id: 'prompt-001-desert-pavilion',
    code: 'PROMPT / 001',
    title: 'Parametric Desert Research Oasis',
    category: 'ARCHITECTURE',
    type: 'FREE',
    previewText: 'Futuristic desert research institute, undulating parametric perforated titanium roof canopy, rammed earth monolithic base walls, sunken oasis courtyard with water reflection pools, golden hour dramatic desert sunlight...',
    fullPrompt: 'futuristic desert research institute, undulating parametric perforated titanium roof canopy, rammed earth monolithic base walls, sunken oasis courtyard with water reflection pools, golden hour dramatic desert sunlight, warm atmospheric haze, architectural photography, shot on Hasselblad H6D-100c, 35mm tilt-shift lens --ar 16:9 --v 6.1 --style raw --s 320',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    resultImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
    beforeLabel: '01 / SPATIAL WIREFRAME & CAD MASSING',
    afterLabel: '02 / SYNTHESIZED ARCHITECTURAL FORM',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-building-with-geometric-windows-41312-large.mp4',
    featured: true,
    workflowStep: 'Concept Massing → ControlNet Depth → 4K Render',
    parameters: {
      engine: 'Midjourney v6.1 + ControlNet Depth',
      stylize: 320,
      aspectRatio: '16:9',
      lighting: 'Golden Hour 2800K + Diffuse Skylight',
      materials: 'Perforated Titanium, Rammed Earth, Low-E Glass'
    }
  },
  {
    id: 'prompt-002-japandi-penthouse',
    code: 'PROMPT / 002',
    title: 'Minimalist Japandi Living Atelier',
    category: 'INTERIOR DESIGN',
    type: 'PREMIUM',
    previewText: 'Ultra-luxurious double-height penthouse living salon, fluted white oak wall paneling, curved bouclé bespoke sofa, rough roman travertine fireplace plinth, recessed floor-to-ceiling perimeter glazing...',
    fullPrompt: 'ultra-luxurious double-height penthouse living salon, fluted white oak wall paneling, curved bouclé bespoke sofa, rough roman travertine fireplace plinth, recessed floor-to-ceiling perimeter glazing overlooking misty skyline, soft overcast daylight 5500K, subtle brass hardware accents, architectural digest editorial photography --ar 16:9 --v 6.1 --s 450 --style raw',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
    resultImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
    beforeLabel: 'EMPTY SHELL & 3D MASSING',
    afterLabel: 'COMPLETED INTERIOR STAGING',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-living-room-with-furniture-41484-large.mp4',
    price: '1999',
    currency: 'INR',
    purchaseUrl: 'https://ahmedusmani.gumroad.com/l/interior-ai-mastery',
    featured: true,
    workflowStep: 'Empty Shell → Material LoRA → Photorealistic Staging',
    parameters: {
      engine: 'Midjourney v6.1 + SDXL Inpainting',
      stylize: 450,
      aspectRatio: '16:9',
      lighting: 'Diffuse Overcast Daylight + 2700K Architectural LED',
      materials: 'Fluted White Oak, Roman Travertine, Textured Bouclé'
    }
  },
  {
    id: 'prompt-003-biophilic-renovation',
    code: 'PROMPT / 003',
    title: 'Adaptive Reuse Facade & Biophilic Atrium',
    category: 'RENOVATION',
    type: 'FREE',
    previewText: 'Adaptive reuse of brutalist 1970s concrete warehouse into sustainable creative headquarters, living green wall facades with cascading ivies, structural timber diagrid conservatory canopy...',
    fullPrompt: 'adaptive reuse of brutalist 1970s concrete warehouse into sustainable creative headquarters, living green wall facades with cascading ivies, structural timber diagrid conservatory canopy, triple glazed low-iron curtain walling, filtered daylight, architectural photography, shot on 35mm --ar 16:9 --v 6.1 --s 280',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    resultImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    beforeImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    beforeLabel: 'EXISTING BRUTALIST STRUCTURE',
    afterLabel: 'BIOPHILIC RETROFIT CONCEPT',
    featured: true,
    workflowStep: 'Condition Survey → ControlNet Canny → Green Facade Synthesis',
    parameters: {
      engine: 'Midjourney v6.1 + ControlNet Canny Edge',
      stylize: 280,
      aspectRatio: '16:9',
      lighting: 'Midday Filtered Sun with Deep Canopy Shadowing',
      materials: 'Exposed Aggregate Concrete, Glulam Timber, Vegetated Facades'
    }
  },
  {
    id: 'prompt-004-cantilever-exterior',
    code: 'PROMPT / 004',
    title: 'Monolithic Travertine Cantilever Villa',
    category: 'EXTERIOR',
    type: 'PREMIUM',
    previewText: 'Monolithic luxury modernist villa perched over coastal cliffs, dramatic 8-meter board-formed concrete cantilever, rough roman travertine cladding, frameless glass infinity edge pool...',
    fullPrompt: 'monolithic luxury modernist villa perched over coastal cliffs, dramatic 8-meter board-formed concrete cantilever, rough roman travertine cladding, frameless glass infinity edge pool reflecting sunset sky, architectural digest spread, ultra-crisp shadows, sharp lines, cinematic composition --ar 16:9 --v 6.1 --s 400 --style raw',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    resultImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    beforeImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
    beforeLabel: 'SKETCH MASSING GEOMETRY',
    afterLabel: 'RENDERED CANTILEVER ARCHITECTURE',
    price: '2999',
    currency: 'INR',
    purchaseUrl: 'https://ahmedusmani.gumroad.com/l/exterior-ai-vault',
    featured: true,
    workflowStep: 'Volumetric Massing → Material Mapping → Atmospheric Fog',
    parameters: {
      engine: 'Midjourney v6.1 Photorealistic',
      stylize: 400,
      aspectRatio: '16:9',
      lighting: 'Dusk Golden Hour + Warm Interior Backlight',
      materials: 'Honed Travertine, Board-Formed Concrete, Black Anodized Steel'
    }
  },
  {
    id: 'prompt-005-raw-material-study',
    code: 'PROMPT / 005',
    title: 'Tactile Material Matrix: Rammed Earth & Bronze',
    category: 'MATERIALS',
    type: 'FREE',
    previewText: 'Architectural tactile material close-up, layered desert rammed earth strata with micro pebbles, oxidized brushed bronze joinery reveal with 10mm shadow gap, cast glass block wall...',
    fullPrompt: 'architectural tactile material close-up, layered desert rammed earth strata with micro pebbles, oxidized brushed bronze joinery reveal with 10mm shadow gap, cast glass block wall transmitting diffuse amber light, macro architectural photography, shallow depth of field, Hasselblad optics --ar 16:9 --v 6.1 --s 350',
    thumbnail: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=800&auto=format&fit=crop',
    resultImage: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1600&auto=format&fit=crop',
    featured: false,
    workflowStep: 'Material Swatch → Texture Synthesizer → High-Res Map',
    parameters: {
      engine: 'Midjourney v6.1 Material Mode',
      stylize: 350,
      aspectRatio: '16:9',
      lighting: 'Raking 45-degree Studio Key Light',
      materials: 'Multi-layer Rammed Earth, Antique Brushed Bronze'
    }
  },
  {
    id: 'prompt-006-mood-lighting-sanctuary',
    code: 'PROMPT / 006',
    title: 'Chiaroscuro Lightwell & Courtyard Staging',
    category: 'LIGHTING',
    type: 'PREMIUM',
    previewText: 'Minimalist private art gallery corridor, narrow ceiling light slit casting razor-sharp beam across charcoal basalt stone wall, solitary olive tree in sunken lightwell, moody dramatic chiaroscuro...',
    fullPrompt: 'minimalist private art gallery corridor, narrow ceiling light slit casting razor-sharp beam across charcoal basalt stone wall, solitary olive tree in sunken lightwell, moody dramatic chiaroscuro lighting, deep ambient occlusion shadows, architectural photography --ar 16:9 --v 6.1 --s 500 --style raw',
    thumbnail: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800&auto=format&fit=crop',
    resultImage: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=1600&auto=format&fit=crop',
    price: '1999',
    currency: 'INR',
    purchaseUrl: 'https://ahmedusmani.gumroad.com/l/lighting-ai-vault',
    featured: false,
    workflowStep: 'Sun Angle Vector → Shadow Falloff Pass → 4K Polish',
    parameters: {
      engine: 'Midjourney v6.1 Photographic',
      stylize: 500,
      aspectRatio: '16:9',
      lighting: 'Direct Solar Slit Beams + Deep Ambient Occlusion',
      materials: 'Honed Basalt, Acoustic Plaster, Antique Bronze'
    }
  },
  {
    id: 'prompt-007-isometric-exploded-axon',
    code: 'PROMPT / 007',
    title: 'Axonometric Architectural Diagram Synthesis',
    category: 'VISUALIZATION',
    type: 'FREE',
    previewText: 'Clean architectural isometric exploded axonometric diagram of sustainable residential villa, structural steel frame, insulated rammed earth envelope, geothermal ground loops...',
    fullPrompt: 'clean architectural isometric exploded axonometric diagram of sustainable residential villa, structural steel frame, insulated rammed earth envelope, geothermal ground loops, cross-ventilation airflow arrows, clean white background, architectural competition presentation graphic, precise linework --ar 16:9 --v 6.1 --s 200',
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    resultImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
    featured: false,
    workflowStep: '3D BIM Model → Vector Axon → Exploded Diffusion',
    parameters: {
      engine: 'SDXL Architecture Model + LoRA Diagram',
      stylize: 200,
      aspectRatio: '16:9',
      lighting: 'Neutral Diffuse Diagrammatic Light',
      materials: 'Steel Profiles, Timber Joists, Glazing Plates'
    }
  }
];

// Backwards compatibility for existing imports
export const aiPromptsList: PromptDemo[] = [
  {
    id: 'desert-parametric-pavilion',
    title: 'Parametric Desert Research Oasis',
    category: 'Exterior Visualization & Passive Solar',
    promptText: 'futuristic desert research institute, undulating parametric perforated titanium roof canopy, rammed earth monolithic base walls, sunken oasis courtyard with water reflection pools, golden hour dramatic desert sunlight, warm atmospheric haze, architectural photography, shot on Hasselblad H6D-100c, 35mm tilt-shift lens --ar 16:9 --v 6.1 --style raw --s 320',
    negativePrompt: 'blurry, distorted symmetry, unrealistic physics, cartoonish, oversaturated neon, fake reflections',
    aspectRatio: '16:9',
    parameters: {
      engine: 'Midjourney v6.1 + ControlNet Depth',
      stylize: 320,
      chaos: 15,
      lighting: 'Golden Hour 2800K + Diffuse Skylight',
      materials: 'Perforated Titanium, Rammed Earth, Structural Low-E Glass'
    },
    stages: [
      {
        stage: 'Prompt Input',
        progress: 25,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
        description: 'Semantic text parsing, spatial keyword tagging, and latent spatial bounding box generation.'
      },
      {
        stage: 'Spatial Wireframe',
        progress: 50,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
        description: 'Topology alignment, ControlNet depth map synthesis, and structural massing contouring.'
      },
      {
        stage: 'Volumetric Diffusion',
        progress: 75,
        image: 'https://images.unsplash.com/photo-1574958269340-fa927304f2dd?q=80&w=1200&auto=format&fit=crop',
        description: 'Material reflectance mapping, lighting ray-direction calculations, and shadow gradient passes.'
      },
      {
        stage: 'Photorealistic Visualization',
        progress: 100,
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
        description: 'Final 4K architectural render with physical micro-textures, specular bounce, and atmospheric depth.'
      }
    ]
  }
];
