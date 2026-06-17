import type { ChapterInputTab } from './new-chapter.types';

export const TAB_LABELS: Record<ChapterInputTab, string> = {
  manual: 'Manual',
  prompt: 'Prompt',
  doc: 'Document',
};

export const TABS: ChapterInputTab[] = ['manual', 'prompt', 'doc'];

export const DESCRIPTION_PLACEHOLDER = 'Describe this chapter — its setting, tone, key events…';
export const DESCRIPTION_PLACEHOLDER_PROMPT = 'Generated description will appear here…';
export const DESCRIPTION_PLACEHOLDER_DOC = 'Extracted text will appear here…';

export const TITLE_PLACEHOLDER = 'Chapter title';

export const PROMPT_PLACEHOLDER =
  'e.g. "The party enters a cursed forest at dusk, hunted by shadow wolves. Tense, survival horror tone."';

/** Maximum file size accepted for document upload (1 MB) */
export const MAX_FILE_BYTES = 1_048_576;

/** MIME types accepted by the document picker */
export const SUPPORTED_MIME_TYPES = ['text/plain', 'text/markdown'];

/** File extensions considered supported for plain-text reading */
export const SUPPORTED_EXTENSIONS = ['.txt', '.md'];

export const FIX_SYSTEM_PROMPT =
  'You are a text formatter for a tabletop RPG campaign. ' +
  'Fix punctuation, grammar, and flow of the following text without changing its meaning or ideas. ' +
  'Do NOT add titles, headings, chapter labels, or any new structure. ' +
  'Return only the corrected prose with no extra commentary.';

export const GENERATE_SYSTEM_PROMPT_BASE =
  'You are a creative writer for a tabletop RPG campaign. Generate a vivid and engaging ' +
  'chapter description based on the following prompt. The description should set the scene, ' +
  'establish the tone, and hint at the adventure ahead. ' +
  'Return only the chapter description as plain prose with no extra commentary. ' +
  'Do NOT start with a title, heading, bold label, or any markdown formatting. ' +
  'Begin directly with the scene.';

export function buildGenerateSystemPrompt(priorChapters: { title: string; description: string }[]) {
  if (priorChapters.length === 0) return GENERATE_SYSTEM_PROMPT_BASE;

  const context = priorChapters
    .map((c, i) => `Chapter ${i + 1} — "${c.title}": ${c.description.slice(0, 300)}`)
    .join('\n');

  return (
    GENERATE_SYSTEM_PROMPT_BASE +
    `\n\nPrevious chapters for narrative context (do not repeat these, continue the story):\n${context}`
  );
}
