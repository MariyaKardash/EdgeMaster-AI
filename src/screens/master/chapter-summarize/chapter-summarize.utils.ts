import { completion } from '@qvac/sdk';

import type { Chapter, GameEvent } from '@/database';
import { auditCompletion } from '@/lib/qvac-audit';

import {
  CHAPTER_BACKGROUND_MAX_CHARS,
  SUMMARY_FIX_SYSTEM_PROMPT,
  SUMMARY_WITHOUT_EVENTS_SYSTEM_PROMPT,
  SUMMARY_WITHOUT_EVENTS_USER_PREAMBLE,
  SUMMARY_WITH_EVENTS_SYSTEM_PROMPT,
  SUMMARY_WITH_EVENTS_USER_PREAMBLE,
} from './chapter-summarize.prompts';

export type SummaryPrompt = {
  systemContent: string;
  userContent: string;
};

export type GenerateChapterSummaryParams = {
  modelId: string;
  chapter: Chapter;
  events: GameEvent[];
  onDelta?: (text: string) => void;
};

export type GenerateChapterSummaryResult = {
  summary: string;
  systemContent: string;
  userContent: string;
};

export function truncateChapterBackground(description: string, maxChars: number): string {
  const trimmed = description.trim();
  if (trimmed.length <= maxChars) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxChars - 1).trimEnd()}…`;
}

export function formatEventsForPrompt(events: GameEvent[]): string {
  return events
    .map((event, index) => {
      const header = `${index + 1}. ${event.title}`;
      const body = event.body.trim();
      return body ? `${header}\n   ${body}` : header;
    })
    .join('\n\n');
}

export function buildSummaryPrompt(chapter: Chapter, events: GameEvent[]): SummaryPrompt {
  const hasEvents = events.length > 0;

  if (!hasEvents) {
    return {
      systemContent: SUMMARY_WITHOUT_EVENTS_SYSTEM_PROMPT,
      userContent:
        `${SUMMARY_WITHOUT_EVENTS_USER_PREAMBLE}\n\n` +
        `Chapter title: ${chapter.title}\n` +
        `Chapter background:\n${chapter.description.trim()}`,
    };
  }

  const backgroundSnippet = truncateChapterBackground(
    chapter.description,
    CHAPTER_BACKGROUND_MAX_CHARS,
  );

  return {
    systemContent: SUMMARY_WITH_EVENTS_SYSTEM_PROMPT,
    userContent:
      `${SUMMARY_WITH_EVENTS_USER_PREAMBLE}\n\n` +
      `Chapter title: ${chapter.title}\n` +
      (backgroundSnippet
        ? `Setting context (do not narrate this):\n${backgroundSnippet}\n\n`
        : '') +
      `Events that took place (in order):\n${formatEventsForPrompt(events)}`,
  };
}

/** Strip common LLM formatting artifacts from streamed summary text. */
export function cleanGeneratedSummary(raw: string): string {
  return raw
    .replace(/^\*{1,3}[^*\n]+\*{1,3}\n?/, '')
    .replace(/^Theassistant\s*/i, '')
    .replace(/^assistant\s*/i, '')
    .trimStart();
}

export async function generateChapterSummary({
  modelId,
  chapter,
  events,
  onDelta,
}: GenerateChapterSummaryParams): Promise<GenerateChapterSummaryResult> {
  const { systemContent, userContent } = buildSummaryPrompt(chapter, events);

  if (__DEV__) {
    console.log('[chapter-summary] system prompt:', systemContent);
    console.log('[chapter-summary] user prompt:', userContent);
  }

  const run = completion({
    modelId,
    history: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userContent },
    ],
    stream: true,
  });

  let acc = '';
  for await (const event of run.events) {
    if (event.type === 'contentDelta') {
      acc += event.text;
      onDelta?.(cleanGeneratedSummary(acc));
    }
  }

  const final = await run.final;
  auditCompletion('chapter_summarize', final.stats, {
    eventCount: events.length,
    promptChars: userContent.length,
  });

  return {
    summary: cleanGeneratedSummary(acc),
    systemContent,
    userContent,
  };
}

export async function fixChapterSummary(modelId: string, summaryText: string): Promise<string> {
  const run = completion({
    modelId,
    history: [
      { role: 'system', content: SUMMARY_FIX_SYSTEM_PROMPT },
      { role: 'user', content: summaryText },
    ],
    stream: true,
  });

  let result = '';
  for await (const event of run.events) {
    if (event.type === 'contentDelta') {
      result += event.text;
    }
  }

  const final = await run.final;
  auditCompletion('chapter_summarize_fix', final.stats, {
    summaryChars: summaryText.length,
  });

  return cleanGeneratedSummary(result.trim());
}
