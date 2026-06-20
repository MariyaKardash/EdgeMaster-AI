# Reproducibility

**EdgeMaster AI** runs all inference on-device via the **QVAC SDK** (`@qvac/sdk` 0.12.2) — no cloud LLM.

This submission’s audit trail comes from **release build** run `20260620-182945` on **iPhone 13** (master, A15, 4 GB RAM, iOS 26.5) with **Samsung Galaxy A56** as a P2P join-only player. App: `com.edgemaster.ai` v1.0.0.

**Source:** commit `e37f2390bbdbfb9ad3839526456b465f93079f03` on `main` (Node 22.13, Expo 56, React Native 0.85.3).

**Capture workflow:** `npm run artifacts:release:ios` → force-close and cold-launch the release build → run the Thorn Hollow Run demo (AI chapter description → 4 live events including Whisper dictation on the physical device → chapter summarize → RAG-grounded campaign chat) → force-close app → Ctrl-C in the capture terminal.

**Artifacts in this folder:**

- `hardware.txt` — host + device specs
- `env.txt` — toolchain and git pin
- `inference-audit.json` — 11 auditable QVAC events
- `run.log` — raw device syslog containing `[qvac-audit]` lines

**Models exercised (all on-device):**

| Model                  | Backend | Operation                                          |
| ---------------------- | ------- | -------------------------------------------------- |
| Llama 3.2 1B Q4        | GPU     | Chapter generation, summarize, chat                |
| Whisper Tiny Q8        | CPU     | Voice dictation (107 chars transcribed in ~405 ms) |
| EmbeddingGemma 300M Q4 | CPU     | RAG indexing / search                              |

**Note:** Voice dictation requires the physical iPhone microphone. iPhone Mirroring on Mac does not pass audio to the app; dictation in this run was recorded with mirroring off.

Pair with the demo video (≤ 5 min, same release build and devices) for the full evidence bundle.
