export interface FeaturedPromptCard {
  id: string;
  title: string;
  category: 'ARCHITECTURAL VISUALIZATION' | 'INTERIOR DESIGN' | 'RENOVATION' | 'PARAMETRIC FACADES';
  image: string;
  previewPrompt: string;
  fullPrompt: string;
  badge: 'FREE' | 'PREMIUM';
  engine: string;
  materials: string[];
}

export const featuredPromptsList: FeaturedPromptCard[] = [
  {
    id: 'travertine-zenith-light',
    title: 'Monolithic Travertine & Concrete Sanctuary',
    category: 'ARCHITECTURAL VISUALIZATION',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    previewPrompt: 'brutalist minimalist luxury villa, rough-hewn roman travertine slabs cantilevered over dark volcanic stone pool...',
    fullPrompt: 'brutalist minimalist luxury villa, rough-hewn roman travertine slabs cantilevered over dark volcanic stone pool, floor-to-ceiling recessed glazing, zen garden olive tree centerpiece, early morning overcast fog, high architectural elegance, ultra-detailed architectural photography --ar 16:9 --v 6.1 --style raw --s 400',
    badge: 'FREE',
    engine: 'Midjourney v6.1 Photographic',
    materials: ['Pitted Roman Travertine', 'Board-Formed Concrete', 'Black Steel']
  },
  {
    id: 'biophilic-glulam-atrium',
    title: 'Biophilic Mass Timber Conservatory Atrium',
    category: 'INTERIOR DESIGN',
    image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=1200&auto=format&fit=crop',
    previewPrompt: 'soaring interior architectural atrium, sculptural curved glulam timber columns branching like forest canopies...',
    fullPrompt: 'soaring 5-storey interior architectural atrium, sculptural curved glulam timber columns branching like forest canopies, cascading indoor hanging gardens, diffuse northern skylight casting dappled shadows on polished terrazzo flooring, visitors in scale, warm neutral palette, architectural digest editorial --ar 16:9 --v 6.1 --s 280',
    badge: 'PREMIUM',
    engine: 'SDXL Architecture + ControlNet',
    materials: ['Glulam Timber', 'White Terrazzo', 'Acoustic Felt']
  },
  {
    id: 'heritage-corten-adaptive-reuse',
    title: 'Industrial Brick & Perforated Corten Renovation',
    category: 'RENOVATION',
    image: 'https://images.unsplash.com/photo-1574958269340-fa927304f2dd?q=80&w=1200&auto=format&fit=crop',
    previewPrompt: 'adaptive reuse historic brick warehouse, contemporary perforated oxidized corten steel box cantilevered above...',
    fullPrompt: 'adaptive reuse historic brick warehouse, contemporary perforated oxidized corten steel box cantilevered above, industrial steel sash double-height windows, warm internal gallery spotlighting, dusk blue hour architectural photography, crisp geometric contrast --ar 16:9 --v 6.1 --style raw',
    badge: 'PREMIUM',
    engine: 'Midjourney v6.1 + LoRA',
    materials: ['Oxidized Corten', 'Heritage Red Brick', 'Slim Steel Profiles']
  }
];
