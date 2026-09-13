export const sectionTargets = {
  home: 'hero',
  work: 'ai-architecture',
  shop: 'shop',
  about: 'about',
  consult: 'consult',
} as const;

export type SectionLinkKey = keyof typeof sectionTargets;

export const sectionPath = (section: SectionLinkKey) => `/#${sectionTargets[section]}`;

