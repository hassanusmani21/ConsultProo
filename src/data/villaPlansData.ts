import { VillaPlan } from '../types';

export const villaPlans: VillaPlan[] = [
  {
    id: 'modern-villa-v1',
    title: 'Modern Villa V1',
    planCode: 'VILLA-M01',
    areaSqFt: '4,500 sq ft',
    bedrooms: 5,
    bathrooms: 6,
    levels: 'G+1',
    plotSizes: ['50 × 100 FT', '60 × 120 FT', '55 × 90 FT'],
    style: 'Modern Minimalist Villa',
    previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop',
    elevationImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop',
    floorPlanPreview: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
    description: 'A contemporary 5-bedroom luxury villa with central double-height atrium, integrated plunge pool courtyard, separate formal/family majlis, and cantilevered upper bedroom balconies.',
    price: '19999',
    currency: 'INR',
    purchaseUrl: 'mailto:ar.ahmedusmani@gmail.com?subject=Purchase%20Villa%20Plan:%20Modern%20Villa%20V1',
    status: 'available',
    featured: true,
    includes: [
      'Dimensioned Floor Plans (Ground & First Floor) in AutoCAD DWG + PDF',
      'All 4 Exterior Elevation Drawings with Exact Material Specs',
      '2 Longitudinal & Transverse Building Sections',
      'Door & Window Schedule with Dimensions',
      'Electrical, Lighting & Plumbing Schematic Layouts',
      '3D High-Resolution Exterior Render Pack (Day & Night)'
    ],
    lockedDrawingUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'minimalist-courtyard-v2',
    title: 'Minimalist Courtyard Villa V2',
    planCode: 'VILLA-C02',
    areaSqFt: '3,800 sq ft',
    bedrooms: 4,
    bathrooms: 5,
    levels: 'G+1',
    plotSizes: ['40 × 80 FT', '45 × 90 FT', '50 × 100 FT'],
    style: 'Biophilic Courtyard Residence',
    previewImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop',
    elevationImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop',
    floorPlanPreview: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop',
    description: 'Oriented around an internal Japanese-inspired water and stone courtyard. Features passive cross-ventilation, shaded deep overhangs, and a secluded private master wing.',
    price: '15999',
    currency: 'INR',
    purchaseUrl: 'mailto:ar.ahmedusmani@gmail.com?subject=Purchase%20Villa%20Plan:%20Courtyard%20Villa%20V2',
    status: 'available',
    featured: true,
    includes: [
      'Full Working Drawing Set (AutoCAD .DWG & Printable PDF)',
      'North, South, East & West Exterior Elevations',
      'Courtyard Microclimate Section Details',
      'Joinery & Custom Cabinetry Detail Sheets',
      'High-Res Exterior & Interior 3D Visuals'
    ],
    lockedDrawingUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'compact-luxury-v3',
    title: 'Compact Urban Villa V3',
    planCode: 'VILLA-U03',
    areaSqFt: '2,600 sq ft',
    bedrooms: 3,
    bathrooms: 4,
    levels: 'G+2',
    plotSizes: ['30 × 50 FT', '35 × 45 FT', '30 × 60 FT'],
    style: 'Urban Vertical Residence',
    previewImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop',
    elevationImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop',
    floorPlanPreview: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
    description: 'Designed for compact and narrow urban plots. Features a rooftop infinity sky deck, sunken basement media room, ground-floor parking, and continuous vertical skylight core.',
    price: '11999',
    currency: 'INR',
    purchaseUrl: 'mailto:ar.ahmedusmani@gmail.com?subject=Purchase%20Villa%20Plan:%20Compact%20Urban%20V3',
    status: 'available',
    featured: true,
    includes: [
      'G+2 Architectural Working Drawing Set in DWG + PDF',
      'Structural Framing & Column Grid Layout',
      'Staircase & Vertical Core Engineering Details',
      'Roof Garden & Sky Deck Drainage Specifications',
      'Ready-to-Submit Municipal Drawing Templates'
    ],
    lockedDrawingUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop'
  }
];
