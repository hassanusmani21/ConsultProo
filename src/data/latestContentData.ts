export interface LatestContentItem {
  id: string;
  title: string;
  category: 'AI VIDEO' | 'PROMPT OF THE WEEK' | 'WORKFLOW' | 'REVIT TIP';
  platform: 'YouTube' | 'Instagram' | 'Prompt Vault' | 'Tutorial';
  thumbnail: string;
  date: string;
  readOrWatchTime: string;
  type: 'video' | 'prompt' | 'tutorial';
  url?: string;
  summary: string;
}

export const latestContentList: LatestContentItem[] = [
  {
    id: 'ai-video-breakdown',
    title: 'AI Video Breakdown: Turning Generative Midjourney Concepts into 3D Geometry',
    category: 'AI VIDEO',
    platform: 'YouTube',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    date: 'Latest Release',
    readOrWatchTime: '12 min video',
    type: 'video',
    summary: 'A step-by-step masterclass turning diffuse generative sketches into rational, buildable parametric surfaces using ControlNet Depth.'
  },
  {
    id: 'prompt-of-the-week',
    title: 'Prompt of the Week: Minimalist Raw Concrete & Fluted Timber Villa',
    category: 'PROMPT OF THE WEEK',
    platform: 'Prompt Vault',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    date: 'Weekly Matrix',
    readOrWatchTime: 'Copyable Prompt',
    type: 'prompt',
    summary: 'The exact camera angle, natural overcast lighting formulas, and material syntax to produce crisp architectural joinery without artifacts.'
  },
  {
    id: 'sketch-to-reality-workflow',
    title: 'Architecture & Interior Workflow: Hand Sketch to Client-Ready 4K Render',
    category: 'WORKFLOW',
    platform: 'Instagram',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    date: 'Reel Breakdown',
    readOrWatchTime: '3 min watch',
    type: 'video',
    summary: 'Watch the entire pipeline from rough iPad Procreate concept sketch to photorealistic interior daylight render in under 20 minutes.'
  },
  {
    id: 'revit-tip-sheet-production',
    title: 'Revit Tip: Automated Sheet Production & Parametric LOD 350 Schedules',
    category: 'REVIT TIP',
    platform: 'YouTube',
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    date: 'Pro Tip',
    readOrWatchTime: '8 min tutorial',
    type: 'tutorial',
    summary: 'Eliminate manual drafting errors by automating door/window joinery tags and exporting clean contractor-ready drawing sets.'
  }
];
