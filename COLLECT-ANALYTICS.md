# Collecting analytics — release builds on physical devices

This guide explains how to collect EdgeMaster AI submission artifacts using **release builds** installed on **physical Android and iOS devices**.

Release builds bundle JavaScript into the app — **no Metro bundler** is required at runtime. This matches what judges evaluate: a standalone app running on real hardware.

The app emits structured `[qvac-audit]` log lines (via `console.log`, active in release):

| Event           | When it fires                                              |
| --------------- | ---------------------------------------------------------- |
| `model_load`    | LLM, embedding, or Whisper model loaded                    |
| `model_unload`  | Model unloaded on screen exit / teardown                   |
| `rag_search`    | Campaign knowledge retrieval                               |
| `inference`     | LLM completion (TTFT, tokens/sec, prompt/generated tokens) |
| `transcription` | Whisper voice dictation                                    |

Artifacts are written to `artifacts/` (gitignored). Upload them with your DoraHacks BUIDL — do not commit them.

---

## Output files

| File                                         | Description                                           |
| -------------------------------------------- | ----------------------------------------------------- |
| `artifacts/hardware.txt`                     | Host machine + physical device specs                  |
| `artifacts/env.txt`                          | Toolchain versions, git commit, `build type: release` |
| `artifacts/run-<timestamp>.log`              | Device logs from a release demo session               |
| `artifacts/inference-audit-<timestamp>.json` | Parsed `[qvac-audit]` events (JSON array)             |

Also required: a **demo video ≤ 5 minutes** recorded on the same physical device running the release build.

---

## Prerequisites

1. Dependencies and native projects:

   ```bash
   npm install
   npm run prebuild
   ```

2. Physical device connected via **USB**.

3. Device on **Wi-Fi** (needed for QVAC model downloads on first launch — not for Metro).

4. USB debugging enabled (Android) or device trusted (iOS).

### Standard demo actions

Perform the same steps on the physical device so logs and video match:

1. Launch **EdgeMaster AI** (release build).
2. Open a campaign and wait until models finish downloading and loading.
3. Send a **campaign chat message** (triggers RAG + LLM inference).
4. Optionally use **voice dictation** (triggers Whisper).
5. Stop log capture (Ctrl-C in terminal).

---

## Android (physical device, release)

### 1. Prepare the phone

1. Connect via **USB**.
2. Enable **Settings → Developer options → USB debugging**.
3. Accept the RSA fingerprint prompt.
4. Verify:

   ```bash
   adb devices
   ```

   ```
   List of devices attached
   9b010059305331323800716437d7c0    device
   ```

### 2. Build and install the release APK

```bash
npm run android:release
```

Select your physical device when prompted. This runs `expo run:android --variant release --device`, which:

- Bundles JS into the APK (no Metro at runtime).
- Builds a release-variant APK signed with the local debug keystore (fine for hackathon submission).
- Installs **EdgeMaster AI** on the phone.

**Manual alternative** (if the command above fails):

```bash
npm run prebuild
cd android
./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

### 3. Capture hardware + env

```bash
npm run artifacts:info
```

Or for release-labelled env:

```bash
bash scripts/collect-artifacts.sh --info --release
```

Confirm `artifacts/hardware.txt` contains your phone's model and RAM, and `artifacts/env.txt` shows `build type: release`.

### 4. Full analytics capture

**Terminal 1** — start log capture (no Metro):

```bash
npm run artifacts:release
```

Or with a specific device:

```bash
ADB_DEVICE=<serial> npm run artifacts:release
```

What happens:

1. Writes `hardware.txt` and `env.txt`.
2. Clears and tails `adb logcat` for `[qvac-audit]` / React Native lines.
3. Waits until you press **Ctrl-C**.
4. Extracts `inference-audit-<timestamp>.json`.

**On the phone:**

1. Open the **release** EdgeMaster AI (not a dev-client build with the Expo dev menu).
2. Run the [standard demo actions](#standard-demo-actions).
3. Press **Ctrl-C** in the terminal.

> Release builds have no Metro and no shake-to-reload. If the app was already open, force-close it and relaunch after starting log capture so model-load events are recorded.

### 5. Verify Android output

```bash
ls -la artifacts/
grep -c '\[qvac-audit\]' artifacts/run-*.log
cat artifacts/inference-audit-*.json
```

Expected events: `model_load`, `rag_search`, `inference` (with `ttftMs` and `tokensPerSecond`).

---

## iOS (physical device, release)

iOS release capture uses `idevicesyslog` or Xcode Console. Use `npm run artifacts:release:ios` (see below) or the manual steps in section 4.

### 1. Prepare the iPhone/iPad

1. Connect via **USB** and tap **Trust This Computer**.
2. Confirm the device appears in **Xcode → Window → Devices and Simulators**.
3. Ensure Wi-Fi is on (for QVAC model downloads).

### 2. Build and install the release app

```bash
npm run ios:release
```

Select your physical device in Xcode when prompted. This runs `expo run:ios --configuration Release --device`, producing a release build with bundled JS.

**Manual alternative** (Xcode):

1. `npm run prebuild`
2. Open `ios/EdgeMasterAI.xcworkspace` in Xcode.
3. Select your physical device.
4. Set scheme to **Release** (Product → Scheme → Edit Scheme → Run → Build Configuration → Release).
5. Product → Run (⌘R).

### 3. Capture hardware + env

```bash
bash scripts/collect-artifacts.sh --info --release
```

With **both phones on USB** (Android via adb, iPhone trusted), `artifacts/hardware.txt` auto-captures:

- Host Mac specs
- Android device (model, SoC board, RAM from `/proc/meminfo`, etc.)
- **Physical iPhone** via `libimobiledevice` (`ideviceinfo`) — model, iOS version, storage, chip lookup from ProductType

Install libimobiledevice if needed:

```bash
brew install libimobiledevice
```

Pin a specific iPhone:

```bash
IOS_DEVICE=00008110-000A384211F2401E bash scripts/collect-artifacts.sh --info --release
```

List UDIDs: `idevice_id -l`

> **Note:** iOS does not expose RAM over USB. The script maps common `ProductType` values (e.g. `iPhone14,5` → iPhone 13, A15, 4 GB). Add a Settings → About screenshot to `artifacts/` if judges want visual proof.

If no iPhone is connected you will see `## iOS device: none connected via USB` instead of the old simulator-only line.

### 4. Full analytics capture

Use **one terminal** for logs — no Metro needed.

Install `libimobiledevice` if needed:

```bash
brew install libimobiledevice
```

**Recommended** (same workflow as Android `artifacts:release`):

```bash
npm run artifacts:release:ios
```

Or pin a specific device:

```bash
IOS_DEVICE=00008110-000A384211F2401E npm run artifacts:release:ios
```

List UDIDs: `idevice_id -l`

What happens:

1. Writes `hardware.txt` and `env.txt` (via `collect-artifacts.sh --info --release`).
2. Tails `idevicesyslog` for `[qvac-audit]` / React Native lines.
3. Waits until you press **Ctrl-C**.
4. Extracts `inference-audit-ios-release-<timestamp>.json`.

**On the iPhone/iPad:**

1. Force-close EdgeMaster AI, then relaunch the **release** build.
2. Run the [standard demo actions](#standard-demo-actions).

**Stop capture:** Ctrl-C in the terminal. If the process hangs, run `pkill -f idevicesyslog` in another terminal.

<details>
<summary>Manual alternative (same output files)</summary>

```bash
TS=$(date +%Y%m%d-%H%M%S)
mkdir -p artifacts
LOG="artifacts/run-ios-release-$TS.log"

idevicesyslog 2>&1 \
  | grep --line-buffered -E 'qvac-audit|ReactNativeJS|EdgeMaster' \
  | while IFS= read -r line; do
      printf '%s [device] %s\n' "$(date -u +%H:%M:%S)" "$line"
    done | tee "$LOG"
```

Then extract JSON with the Python snippet below (or re-run only extraction from an existing log).

</details>

**Extract JSON audit file** (only if you used the manual syslog command above):

```bash
TS=<same-timestamp>
python3 - "artifacts/run-ios-release-$TS.log" "artifacts/inference-audit-ios-release-$TS.json" <<'PY'
import json, re, sys
log_path, out_path = sys.argv[1], sys.argv[2]
events = []
pattern = re.compile(r"\[qvac-audit\]\s*(\{.*\})")
with open(log_path, encoding="utf-8", errors="replace") as fh:
    for line in fh:
        match = pattern.search(line)
        if not match:
            continue
        try:
            events.append(json.loads(match.group(1)))
        except json.JSONDecodeError:
            pass
with open(out_path, "w", encoding="utf-8") as fh:
    json.dump(events, fh, indent=2)
    fh.write("\n")
print(f"{len(events)} audit event(s) written to {out_path}")
PY
```

### 5. Alternative — Xcode Console

1. Run `bash scripts/collect-artifacts.sh --info --release`.
2. Open **Xcode → Window → Devices and Simulators → your device → Open Console**.
3. Filter: `qvac-audit`.
4. Relaunch the release app and run the [standard demo actions](#standard-demo-actions).
5. Copy `[qvac-audit]` lines into `artifacts/run-ios-release-manual.log`.
6. Run the Python extractor above on that file.

### 6. Verify iOS output

```bash
grep '\[qvac-audit\]' artifacts/run-ios-release-*.log
cat artifacts/inference-audit-ios-release-*.json
```

---

## Dev vs release — which to use?

|                     | Dev build                         | Release build                                     |
| ------------------- | --------------------------------- | ------------------------------------------------- |
| Metro required      | Yes                               | **No**                                            |
| Install command     | `npm run android` / `npm run ios` | `npm run android:release` / `npm run ios:release` |
| Log capture         | `npm run artifacts`               | `npm run artifacts:release` (Android)             |
| Best for submission | Development only                  | **Recommended for judges**                        |

This guide targets **release builds**. For dev-client + Metro workflows, see the script flags without `--release`.

---

## Submission checklist

- [ ] Release build installed on physical device
- [ ] `artifacts/hardware.txt` (host + device specs)
- [ ] `artifacts/env.txt` (`build type: release`)
- [ ] `artifacts/run-*.log`
- [ ] `artifacts/inference-audit-*.json`
- [ ] Demo video (≤ 5 min) on the same device and build

### Example audit event

```json
{
  "ts": "2026-06-19T14:30:00.000Z",
  "event": "inference",
  "operation": "campaign_chat",
  "promptTokens": 312,
  "generatedTokens": 48,
  "ttftMs": 420,
  "tokensPerSecond": 12.3,
  "backendDevice": "gpu",
  "promptChars": 42,
  "ragContextChars": 1800
}
```

---

## Troubleshooting

| Problem                              | Platform | Fix                                                                               |
| ------------------------------------ | -------- | --------------------------------------------------------------------------------- |
| `assembleRelease` fails (signing)    | Android  | Use `npm run android:release`; local debug keystore is used automatically         |
| App shows Expo dev menu              | Both     | You installed a dev build — reinstall with `android:release` / `ios:release`      |
| Empty `inference-audit-*.json`       | Both     | Start log capture **before** launching the app; send a chat message before Ctrl-C |
| No `[qvac-audit]` in logcat          | Android  | Run `adb logcat -v time \| grep qvac-audit` without filters to debug              |
| No `[qvac-audit]` in syslog          | iOS      | Remove `grep` filter; confirm release build (not Expo Go)                         |
| `idevicesyslog` not found            | iOS      | `brew install libimobiledevice`                                                   |
| Models not downloading               | Both     | Connect device to Wi-Fi; keep screen awake during first run                       |
| `artifacts:release` errors on no adb | Android  | Connect phone via USB; run `adb devices`                                          |
| iOS capture hangs on Ctrl-C          | iOS      | `pkill -f idevicesyslog` in another terminal                                      |
| `artifacts:release:ios` no device    | iOS      | USB + Trust; run `idevice_id -l`                                                  |

---

## Quick reference

```bash
# Build release on physical device
npm run android:release          # Android
npm run ios:release              # iOS

# Hardware + env (release-labelled)
bash scripts/collect-artifacts.sh --info --release
npm run artifacts:info:ios       # same + iOS device check

# Full capture — Android release (one terminal, no Metro)
npm run artifacts:release
ADB_DEVICE=<serial> npm run artifacts:release

# Full capture — iOS release (one terminal, no Metro)
npm run artifacts:release:ios
IOS_DEVICE=<udid> npm run artifacts:release:ios
```

Script internals: `scripts/collect-artifacts.sh`, `scripts/collect-artifacts-ios.sh`.
