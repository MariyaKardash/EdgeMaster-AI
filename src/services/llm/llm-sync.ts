import { LLMService } from './LLMService';

let sharedService: LLMService | null = null;

export function getSharedLLMService(): LLMService {
  if (!sharedService) {
    sharedService = new LLMService();
  }

  return sharedService;
}

/** @internal Resets the singleton — for tests only. */
export function resetSharedLLMService(): void {
  sharedService = null;
}
