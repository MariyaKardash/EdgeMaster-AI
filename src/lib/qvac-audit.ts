import type { CompletionStats } from '@qvac/sdk';

/** Structured audit lines for QVAC hackathon submission logs (`[qvac-audit]` prefix). */
export function qvacAudit(payload: Record<string, unknown>) {
  console.log(`[qvac-audit] ${JSON.stringify({ ts: new Date().toISOString(), ...payload })}`);
}

export function auditModelLoad(model: string, modelType: string, modelId: string, device?: string) {
  qvacAudit({ event: 'model_load', model, modelType, modelId, device });
}

export function auditModelUnload(model: string, modelId: string) {
  qvacAudit({ event: 'model_unload', model, modelId });
}

export function auditCompletion(
  operation: string,
  stats: CompletionStats | undefined,
  extra?: Record<string, unknown>,
) {
  qvacAudit({
    event: 'inference',
    operation,
    promptTokens: stats?.promptTokens,
    generatedTokens: stats?.generatedTokens,
    ttftMs: stats?.timeToFirstToken,
    tokensPerSecond: stats?.tokensPerSecond,
    backendDevice: stats?.backendDevice,
    cacheTokens: stats?.cacheTokens,
    ...extra,
  });
}
