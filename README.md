# EdgeMaster AI

Expo React Native app (iOS and Android) with TypeScript and development builds. On-device AI inference and RAG run through the QVAC SDK (`@qvac/sdk`); multiplayer sessions sync over Holepunch P2P.

## User flows

The **master** hosts a campaign over Holepunch P2P; **players** join with a session code. On-device AI (QVAC) helps with chapters, live events, summaries, and campaign chat.

Both roles: **Welcome** → **Get started** → **Choose role**.

### Master

1. **Create or continue** a campaign (3-step setup: details → heroes → artifacts).
2. **Start session** on the dashboard and share the session code (`XXXX-XXXX`).
3. **Add chapters** (type, prompt, or upload a document), then **start** one as active.
4. **Run live control** — add events that sync to players; **summarize & end** when done.
5. Use **Players** to manage the party and **Chat** for on-device RAG chat.

### Player

1. **Join session** with the master’s code.
2. **Pick a hero** and open **Game view**.
3. Follow the **live event log** as the master runs the chapter.
4. Open **Campaign chat** anytime for on-device RAG chat.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- **iOS:** Xcode with command-line tools and CocoaPods (`sudo gem install cocoapods`)
- **Android:** Android Studio with SDK, emulator, and `ANDROID_HOME` configured
- **Optional (artifact capture):** `libimobiledevice` on macOS for physical iPhone specs and syslog (`brew install libimobiledevice`)

## Getting started

Development builds use a custom native app (`expo-dev-client`) instead of Expo Go.

### First-time setup

Generate native `ios/` and `android/` projects, then build and install the dev client:

```bash
npm install
npm run prebuild
npm run ios      # or: npm run android
```

`npm run ios` and `npm run android` automatically run `bundle:holepunch` first to rebuild the Holepunch P2P Bare worklet bundle.

### Daily development

If the dev client is already installed on a simulator/emulator or device:

```bash
npm start
```

Open the **EdgeMaster AI** app on your device — it connects to the Metro bundler automatically.

To rebuild and launch in one step:

```bash
npm run ios      # simulator or connected device
npm run android  # physical device (--device)
```

If Metro misbehaves, try:

```bash
npm run start:diagnose
```

## Scripts

| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm start`                 | Start Metro for the dev client                                              |
| `npm run start:diagnose`    | Start Metro with `--clear` and Metro require diagnostics                    |
| `npm run ios`               | Bundle Holepunch, then build and run the iOS dev client                     |
| `npm run android`           | Bundle Holepunch, then build and run on a physical device                   |
| `npm run ios:release`       | Release build on a physical iOS device                                      |
| `npm run android:release`   | Release build on a physical Android device                                  |
| `npm run bundle:holepunch`  | Rebuild the P2P Bare worklet bundle (also runs via `preios` / `preandroid`) |
| `npm run prebuild`          | Generate native projects from `app.json`                                    |
| `npm run prebuild:clean`    | Regenerate native projects from scratch                                     |
| `npm run lint`              | Run ESLint                                                                  |
| `npm run lint:fix`          | Run ESLint with auto-fix                                                    |
| `npm run format`            | Format all files with Prettier                                              |
| `npm run format:check`      | Check formatting without writing                                            |
| `npm run typecheck`         | Run TypeScript type checking                                                |
| `npm run test`              | Run Jest unit tests                                                         |
| `npm run artifacts:info`    | Write `artifacts/hardware.txt` + `env.txt`                                  |
| `npm run artifacts`         | Dev build: above, then capture Metro + device logs                          |
| `npm run artifacts:release` | Release build: above, then capture device logs only (no Metro)              |

## Hackathon submission (QVAC)

- **Track:** **Mobile** — Expo React Native dev client on Android/iOS devices.
- **All AI inference and RAG use the QVAC SDK** (`@qvac/sdk`).
- **Reference hardware:** see `artifacts/hardware.txt` (host + connected device).

**Recommended for judges:** install a **release build** on a physical device and collect artifacts with `npm run artifacts:release`. Release builds bundle JavaScript into the app (no Metro at runtime). See [COLLECT-ANALYTICS.md](./COLLECT-ANALYTICS.md) for the full release workflow on Android and iOS.

### Collecting submission artifacts

**Dev build** (Metro + dev client):

```bash
npm run artifacts:info   # writes artifacts/hardware.txt + artifacts/env.txt only
npm run artifacts        # the above, then runs Metro and captures a timestamped run log
```

`npm run artifacts` starts Metro and tees device logs (via `adb logcat` when an Android
device is connected) to `artifacts/run-<timestamp>.log`. Open EdgeMaster AI on your
device, wait for models to load, send a campaign chat message (and optionally try voice
dictation), then press `Ctrl-C`. The script also extracts structured `[qvac-audit]` lines
into `artifacts/inference-audit-<timestamp>.json`.

**Release build** (standalone app, no Metro):

```bash
npm run android:release   # or: npm run ios:release
npm run artifacts:release
```

To pin a specific device:

```bash
ADB_DEVICE=<serial> npm run artifacts
ADB_DEVICE=<serial> npm run artifacts:release
IOS_DEVICE=<udid> bash scripts/collect-artifacts.sh --info --release
```

Pair the artifacts with a screen-recorded demo video (≤ 5 min) for the full evidence
bundle. Run logs are gitignored — upload them with your DoraHacks BUIDL submission.

## Tooling

- **TypeScript** — strict mode enabled
- **ESLint** — `eslint-config-expo` with Prettier integration
- **Prettier** — consistent code formatting
- **Husky** — runs `lint-staged` on pre-commit
- **lint-staged** — lints and formats staged files before each commit
- **Jest** — unit tests via `jest-expo`
- **expo-dev-client** — custom development build (replaces Expo Go)

## Notes

- Native folders (`ios/`, `android/`) are generated locally via `prebuild` and are gitignored.
- After changing native config in `app.json`, run `npm run prebuild` again (or `prebuild:clean` for a full reset).
- After changing Holepunch P2P runtime code under `src/lib/holepunch/bare/`, run `npm run bundle:holepunch` (or any `ios` / `android` build).
