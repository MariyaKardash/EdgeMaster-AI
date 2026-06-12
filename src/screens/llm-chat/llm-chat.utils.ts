import type { MessageStats } from './llm-chat.types';

export function formatStats(stats: MessageStats): string {
  const parts: string[] = [];
  if (stats.ttftMs != null) {
    const value =
      stats.ttftMs >= 1000
        ? `${(stats.ttftMs / 1000).toFixed(2)}s`
        : `${stats.ttftMs.toFixed(0)}ms`;
    parts.push(`TTFT ${value}`);
  }
  if (stats.tps != null) {
    parts.push(`TPS ${stats.tps.toFixed(1)}`);
  }
  return parts.join(' • ');
}
