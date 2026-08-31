export interface BimLayerData {
  id: string;
  name: string;
  lod: 'LOD 200' | 'LOD 300' | 'LOD 400';
  discipline: 'Architectural' | 'Structural' | 'MEP Coordination' | 'Documentation';
  description: string;
  image: string;
  tags: string[];
  parameters: {
    category: string;
    family: string;
    fireRating: string;
    uValue: string;
    omniClass: string;
    assemblyCode: string;
  };
  clashesDetected: number;
  clashesResolved: number;
}

export const bimShowcaseLayers: BimLayerData[] = [
  {
    id: 'lod-200-massing',
    name: 'Schematic Massing & Volumetric Zoning',
    lod: 'LOD 200',
    discipline: 'Architectural',
    description: 'Approximate spatial geometry, gross floor area calculations, building envelope orientations, and preliminary solar angle studies.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop',
    tags: ['Massing Study', 'Volume Zoning', 'Solar Envelope', 'Concept Geometry'],
    parameters: {
      category: 'Mass / Generic Model',
      family: 'Parametric_Canopy_Envelope_v1.rfa',
      fireRating: 'Unrated (Schematic)',
      uValue: 'Target: 0.28 W/m²K',
      omniClass: '21-01 10 10 Concept Mass',
      assemblyCode: 'B1010 Floor Construction'
    },
    clashesDetected: 42,
    clashesResolved: 42
  },
  {
    id: 'lod-300-coordination',
    name: 'Integrated Architectural & Structural Assemblies',
    lod: 'LOD 300',
    discipline: 'Structural',
    description: 'Accurate composite walls, steel truss framing, curtain wall mullion layouts, floor finishes, and coordinated vertical shafts.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1400&auto=format&fit=crop',
    tags: ['Revit Modeling', 'Multi-Discipline', 'Shaft Coordination', 'Curtain Wall Grid'],
    parameters: {
      category: 'Basic Wall / Curtain Wall',
      family: 'CW_DoubleGlazed_Unitized_200mm.rfa',
      fireRating: '2 Hours Fire Barrier',
      uValue: '0.22 W/m²K',
      omniClass: '23-13 23 11 Metal Curtain Wall',
      assemblyCode: 'B2020 Exterior Windows'
    },
    clashesDetected: 128,
    clashesResolved: 128
  },
  {
    id: 'lod-400-fabrication',
    name: 'Fabrication Detail, MEP Ducts & Rebar Density',
    lod: 'LOD 400',
    discipline: 'MEP Coordination',
    description: 'Exact fabrication dimensions, HVAC duct routing with insulation clearance, pipe fittings, cable trays, and precast concrete connections.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1400&auto=format&fit=crop',
    tags: ['Navisworks Audit', 'LOD 400 Shop Drawings', 'MEP Clearance', 'Fabrication Ready'],
    parameters: {
      category: 'Duct / Structural Framing',
      family: 'HVAC_Rectangular_Duct_Insulated.rfa',
      fireRating: 'Class A Smoke Damper Protected',
      uValue: 'N/A (Mechanical)',
      omniClass: '23-33 13 13 HVAC Ductwork',
      assemblyCode: 'D3040 Distribution Systems'
    },
    clashesDetected: 312,
    clashesResolved: 312
  }
];

export const drawingComparisonData = {
  cadView: {
    title: '01. 2D Architectural Blueprint & CAD Linework',
    badge: 'Vector Linework / Orthographic Plan',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600&auto=format&fit=crop',
    description: 'Traditional 2D vector geometry, dimension strings, and sectional cutting planes.'
  },
  bimView: {
    title: '02. Coordinated 3D Revit Information Model (BIM)',
    badge: 'Parametric LOD 350 / Smart Metadata',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
    description: 'Parametric BIM elements with embedded thermal properties, schedules, and clash-free coordination.'
  },
  renderView: {
    title: '03. Photorealistic Materiality & Cinematic Render',
    badge: 'Atmospheric Light & Realized Architecture',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    description: 'Ray-traced lighting, physically accurate materials, environmental vegetation, and realized spatial drama.'
  }
};
