/** Max campaign context chars injected into the chat system prompt. */
export const CHAT_MAX_CONTEXT_CHARS = 1200;

/** Max chars per prior turn included in chat history. */
export const CHAT_MAX_HISTORY_MESSAGE_CHARS = 280;

/** Max prior user+assistant pairs sent with each request (excl. current). */
export const CHAT_MAX_HISTORY_MESSAGES = 4;

/** Stop streaming once the assistant reply reaches this length. */
export const CHAT_MAX_OUTPUT_CHARS = 480;

/** Llama n_predict — caps generation length and reduces repetition loops. */
export const CHAT_MAX_PREDICT_TOKENS = 160;
