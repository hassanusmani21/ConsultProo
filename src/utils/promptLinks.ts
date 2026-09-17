export const promptSharePath = (promptId: string) => `/prompts/${encodeURIComponent(promptId)}`;

export const getPromptShareUrl = (promptId: string) => {
  if (typeof window === 'undefined') return promptSharePath(promptId);
  return `${window.location.origin}${promptSharePath(promptId)}`;
};
