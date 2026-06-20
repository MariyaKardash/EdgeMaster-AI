# Submission artifacts — iOS release run `20260620-182945`

Frozen evidence bundle for the QVAC hackathon demo. Captured after clearing `artifacts/` so this folder contains **only** the final successful run (dictation + full LLM/RAG path).

## Demo video

[EdgeMaster AI demo (YouTube)](https://youtu.be/PfvyGT0L_oM) — release build on iPhone 13, ≤ 5 min.

## Files

| File                   | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `hardware.txt`         | Host Mac + Samsung A56 (P2P player) + iPhone 13 (master)     |
| `env.txt`              | Toolchain, `build type: release`, git commit `e37f239`       |
| `inference-audit.json` | 11 structured `[qvac-audit]` events (parsed from device log) |
| `run.log`              | Raw iOS syslog from `idevicesyslog` (~23 MB)                 |
| `REPRODUCIBILITY.md`   | Submission blurb for judges / BUIDL form                     |
| `screenshots/`         | Device proof (`devices.png`)                                 |

## Audit events captured

1. `new_chapter_generate` (Llama, GPU)
2. `model_unload` / `model_load` (Llama)
3. `model_load` (Whisper) + **`transcription`** (107 chars)
4. `chapter_summarize` (4 events)
5. `model_load` (EmbeddingGemma, CPU) + `rag_search`
6. `campaign_chat` (54 generated tokens)

## Reproduce

```bash
git checkout e37f2390bbdbfb9ad3839526456b465f93079f03
npm install && npm run prebuild && npm run ios:release
npm run artifacts:release:ios
# cold-launch app → demo → Ctrl-C
```

See `COLLECT-ANALYTICS.md` in the repo root for full instructions.
