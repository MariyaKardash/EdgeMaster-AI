# EdgeMaster AI

Expo React Native app with TypeScript and development builds.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- **iOS:** Xcode with command-line tools and CocoaPods (`sudo gem install cocoapods`)
- **Android:** Android Studio with SDK, emulator, and `ANDROID_HOME` configured

## Getting started

Development builds use a custom native app (`expo-dev-client`) instead of Expo Go.

### First-time setup

Generate native `ios/` and `android/` projects, then build and install the dev client:

```bash
npm install
npm run prebuild
npm run ios      # or: npm run android
```

### Daily development

If the dev client is already installed on a simulator/emulator or device:

```bash
npm start
```

Open the **EdgeMaster AI** app on your device — it connects to the Metro bundler automatically.

To rebuild and launch in one step:

```bash
npm run ios      # simulator or connected device
npm run android
```

## Scripts

| Script                   | Description                                |
| ------------------------ | ------------------------------------------ |
| `npm start`              | Start Metro for the dev client             |
| `npm run ios`            | Build and run the iOS dev client           |
| `npm run android`        | Build and run the Android dev client       |
| `npm run prebuild`       | Generate native projects from `app.json`   |
| `npm run prebuild:clean` | Regenerate native projects from scratch    |
| `npm run web`            | Start and open web                         |
| `npm run lint`           | Run ESLint                                 |
| `npm run lint:fix`       | Run ESLint with auto-fix                   |
| `npm run format`         | Format all files with Prettier             |
| `npm run format:check`   | Check formatting without writing           |
| `npm run typecheck`      | Run TypeScript type checking               |
| `npm run artifacts:info` | Write `artifacts/hardware.txt` + `env.txt` |
| `npm run artifacts`      | Above, then capture a demo run log         |

## Hackathon submission (QVAC)

- **Track:** **Mobile** — Expo React Native dev client on Android/iOS devices.
- **All AI inference and RAG use the QVAC SDK** (`@qvac/sdk`).
- **Reference hardware:** see `artifacts/hardware.txt` (host + connected device).

### Collecting submission artifacts

```bash
npm run artifacts:info   # writes artifacts/hardware.txt + artifacts/env.txt only
npm run artifacts        # the above, then runs Metro and captures a timestamped run log
```

`npm run artifacts` starts Metro and tees device logs (via `adb logcat` when an Android
device is connected) to `artifacts/run-<timestamp>.log`. Open EdgeMaster AI on your
device, wait for models to load, send a campaign chat message (and optionally try voice
dictation), then press `Ctrl-C`. The script also extracts structured `[qvac-audit]` lines
into `artifacts/inference-audit-<timestamp>.json`.

Pair the artifacts with a screen-recorded demo video (≤ 5 min) for the full evidence
bundle. Run logs are gitignored — upload them with your DoraHacks BUIDL submission.

To pin a specific Android device:

```bash
ADB_DEVICE=<serial> npm run artifacts
```

## Tooling

- **TypeScript** — strict mode enabled
- **ESLint** — `eslint-config-expo` with Prettier integration
- **Prettier** — consistent code formatting
- **Husky** — runs `lint-staged` on pre-commit
- **lint-staged** — lints and formats staged files before each commit
- **expo-dev-client** — custom development build (replaces Expo Go)

## Notes

- Native folders (`ios/`, `android/`) are generated locally via `prebuild` and are gitignored.
- After changing native config in `app.json`, run `npm run prebuild` again (or `prebuild:clean` for a full reset).
