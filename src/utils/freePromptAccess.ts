import { AiPromptData } from '../types';

export const getPromptFilePath = (prompt: Pick<AiPromptData, 'storagePath' | 'pdfStoragePath' | 'pdfUrl'>) => (
  prompt.storagePath || prompt.pdfStoragePath || prompt.pdfUrl || ''
);

export const hasPromptFile = (prompt: Pick<AiPromptData, 'storagePath' | 'pdfStoragePath' | 'pdfUrl'>) => (
  Boolean(getPromptFilePath(prompt).trim())
);

export const getFreePromptDownloadUrl = (prompt: Pick<AiPromptData, 'id' | 'storagePath' | 'pdfStoragePath' | 'pdfUrl'>) => {
  const filePath = getPromptFilePath(prompt).trim();
  if (!filePath) return '';
  if (/^(https?:|data:|blob:)/i.test(filePath)) return filePath;
  return `/api/access?collection=aiPrompts&id=${encodeURIComponent(prompt.id)}`;
};

export const getFreePromptCompareAtPrice = (prompt: Pick<AiPromptData, 'price' | 'compareAtPrice'>) => {
  if (prompt.compareAtPrice !== undefined && prompt.compareAtPrice !== '') return prompt.compareAtPrice;
  const numericPrice = Number(String(prompt.price ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numericPrice) && numericPrice > 0 ? prompt.price : undefined;
};
