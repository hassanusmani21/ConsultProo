import { AiCategory, AiPromptData, AiPromptStep } from '../types';

const categories = new Set<AiCategory>([
  'ARCHITECTURE', 'INTERIOR DESIGN', 'RENOVATION', 'EXTERIOR', 'MATERIALS', 'LIGHTING', 'VISUALIZATION',
]);

const asText = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const asRecord = (value: unknown): Record<string, unknown> => (
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
);

export const getPromptSourceId = (prompt: Pick<AiPromptData, 'id'> & { sourcePromptId?: string }) => (
  prompt.sourcePromptId || prompt.id
);

export const normalizeAiPrompt = (value: unknown, fallbackId = ''): AiPromptData | null => {
  const record = asRecord(value);
  const id = asText(record.id, fallbackId).trim();
  if (!id) return null;

  const rawSteps = Array.isArray(record.steps) ? record.steps : [];
  const steps: AiPromptStep[] = rawSteps
    .map((rawStep, index) => {
      const step = asRecord(rawStep);
      const stepId = asText(step.id, `${id}-step-${index + 1}`).trim();
      if (!stepId) return null;
      return {
        id: stepId,
        stepOrder: Number.isFinite(Number(step.stepOrder)) ? Number(step.stepOrder) : index + 1,
        promptText: asText(step.promptText),
        thumbnail: asText(step.thumbnail),
      };
    })
    .filter((step): step is AiPromptStep => Boolean(step))
    .sort((left, right) => left.stepOrder - right.stepOrder)
    .map((step, index) => ({ ...step, stepOrder: index + 1 }));

  return {
    ...record,
    id,
    code: asText(record.code),
    title: asText(record.title, 'Untitled prompt'),
    category: categories.has(record.category as AiCategory) ? record.category as AiCategory : 'ARCHITECTURE',
    type: String(record.type).toUpperCase() === 'PREMIUM' ? 'PREMIUM' : 'FREE',
    previewText: asText(record.previewText),
    fullPrompt: asText(record.fullPrompt),
    thumbnail: asText(record.thumbnail),
    resultImage: asText(record.resultImage),
    steps,
    published: record.published !== false,
  } as AiPromptData;
};

export interface PromptLibraryEntry extends AiPromptData {
  sourcePromptId: string;
  stepId?: string;
  stepNumber?: number;
  stepCount?: number;
}

/**
 * A collection remains one product, but each of its saved steps becomes a
 * visible, copyable prompt in public libraries. Legacy single-prompt records
 * are returned unchanged (apart from the source id used for checkout/files).
 */
export const getPromptSteps = (prompt: AiPromptData): AiPromptStep[] => {
  if (prompt.steps?.length) return [...prompt.steps].sort((left, right) => left.stepOrder - right.stepOrder);
  return [{
    id: prompt.id,
    stepOrder: 1,
    promptText: prompt.fullPrompt,
    thumbnail: prompt.resultImage || prompt.thumbnail,
  }];
};

/** Public libraries show one card per workflow collection, never one card per step. */
export const getPromptLibraryEntries = (value: unknown): PromptLibraryEntry[] => {
  const prompts = Array.isArray(value) ? value : [];
  return prompts
    .map(rawPrompt => normalizeAiPrompt(rawPrompt))
    .filter((prompt): prompt is AiPromptData => Boolean(prompt && prompt.published !== false))
    .map(prompt => ({ ...prompt, sourcePromptId: prompt.id }));
};

export const getPromptCodeSuffix = (code: unknown, fallback = '001') => {
  const value = asText(code).trim();
  return value.split('/').at(-1)?.trim() || fallback;
};
