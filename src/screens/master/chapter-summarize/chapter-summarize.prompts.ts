import { LLM_MAX_CTX_SIZE } from '@/services/llm';

/** Context window passed to useLLMModel on the summarize screen. */
export const CHAPTER_SUMMARY_CTX_SIZE = LLM_MAX_CTX_SIZE;

/** Max chapter background chars included when events exist (setting names/tone only). */
export const CHAPTER_BACKGROUND_MAX_CHARS = 280;

export const SUMMARY_SYSTEM_PROMPT =
  'You are a chronicler for a tabletop RPG campaign. ' +
  'Write a vivid narrative summary in 2–3 paragraphs of plain prose. ' +
  'Use past tense. Output plain prose only — no titles, no headings, no bold labels, ' +
  'no markdown, no bullet points, no meta commentary. ' +
  'Begin directly with the first sentence of the narrative.';

export const SUMMARY_WITH_EVENTS_SYSTEM_PROMPT =
  SUMMARY_SYSTEM_PROMPT +
  ' The event log is the ONLY source of what happened at the table. ' +
  'Do NOT retell, rewrite, or continue the chapter background. ' +
  'Do NOT invent scenes that are not supported by the events. ' +
  'Weave the listed events into a coherent chronological recap.';

export const SUMMARY_WITHOUT_EVENTS_SYSTEM_PROMPT =
  SUMMARY_SYSTEM_PROMPT + ' Use the chapter background below as the sole source material.';

export const SUMMARY_WITH_EVENTS_USER_PREAMBLE =
  'Write a session recap driven ONLY by the events below. ' +
  'The chapter background is optional context for names and setting — do not narrate it.';

export const SUMMARY_WITHOUT_EVENTS_USER_PREAMBLE =
  'Write a session recap based on the chapter background below.';

export const SUMMARY_FIX_SYSTEM_PROMPT =
  'You are a text formatter for a tabletop RPG chapter summary. ' +
  'Fix punctuation, grammar, and flow without changing meaning or adding new plot. ' +
  'Do NOT add titles, headings, or markdown. Return only the corrected prose.';
