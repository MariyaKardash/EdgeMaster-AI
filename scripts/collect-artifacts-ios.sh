#!/usr/bin/env bash
#
# iOS release artifact capture (physical iPhone/iPad over USB).
# Mirror of collect-artifacts.sh --release for adb on Android.
#
# Usage:
#   bash scripts/collect-artifacts-ios.sh              # syslog capture + audit JSON
#   bash scripts/collect-artifacts-ios.sh --info       # hardware + env only
#   IOS_DEVICE=<udid> bash scripts/collect-artifacts-ios.sh
#
# Requires: brew install libimobiledevice

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/artifacts"
TS="$(date +%Y%m%d-%H%M%S)"
SKIP_RUN=false
IOS_DEVICE="${IOS_DEVICE:-}"

while [ $# -gt 0 ]; do
  case "$1" in
    --info)
      SKIP_RUN=true
      ;;
    --ios)
      shift
      IOS_DEVICE="${1:-}"
      ;;
    --ios=*)
      IOS_DEVICE="${1#--ios=}"
      ;;
  esac
  shift
done

if [ "$(uname -s)" != "Darwin" ]; then
  echo "ERROR: iOS capture requires macOS."
  exit 1
fi

mkdir -p "$OUT"

if command -v idevice_id >/dev/null 2>&1 && [ -z "$IOS_DEVICE" ]; then
  IOS_DEVICE="$(idevice_id -l 2>/dev/null | head -1 || true)"
fi

if [ -n "$IOS_DEVICE" ]; then
  export IOS_DEVICE
fi

bash "$ROOT/scripts/collect-artifacts.sh" --info --release

if [ "$SKIP_RUN" = true ]; then
  echo "==> --info given; skipping iOS demo run."
  exit 0
fi

if ! command -v idevicesyslog >/dev/null 2>&1; then
  echo "ERROR: idevicesyslog not found. Run: brew install libimobiledevice"
  exit 1
fi

if [ -z "$IOS_DEVICE" ]; then
  echo "ERROR: No iPhone connected via USB (or not trusted)."
  echo "       Run: idevice_id -l"
  exit 1
fi

LOG="$OUT/run-ios-release-$TS.log"
AUDIT="$OUT/inference-audit-ios-release-$TS.json"
SYSLOG_PID=""

extract_audit_json() {
  if [ ! -f "$LOG" ]; then
    return
  fi
  echo "==> Extracting [qvac-audit] lines → $(basename "$AUDIT")"
  python3 - "$LOG" "$AUDIT" <<'PY'
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
print(f"    {len(events)} audit event(s) written.")
PY
}

stop_syslog() {
  if [ -n "$SYSLOG_PID" ] && kill -0 "$SYSLOG_PID" 2>/dev/null; then
    kill -INT "$SYSLOG_PID" 2>/dev/null || true
    sleep 0.5
    kill -9 "$SYSLOG_PID" 2>/dev/null || true
    wait "$SYSLOG_PID" 2>/dev/null || true
    SYSLOG_PID=""
  fi
}

on_exit() {
  stop_syslog
  extract_audit_json
  echo "----------------------------------------------------------------------"
  echo "==> Saved run log → $LOG"
  echo "==> Artifacts in $OUT:"
  ls -la "$OUT"
}

trap on_exit EXIT INT TERM

echo "==> Starting iOS release demo capture — output tee'd to $(basename "$LOG")"
echo "    Using iOS device: $IOS_DEVICE"
echo "    Force-close the app, relaunch release build, run demo, then Ctrl-C."
echo "----------------------------------------------------------------------"

{
  echo "# EdgeMaster AI iOS demo run — started $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "# Release build — device logs ([device] = idevicesyslog)"
  echo "# device: $IOS_DEVICE"
  echo
} > "$LOG"

idevicesyslog -u "$IOS_DEVICE" 2>&1 \
  | grep --line-buffered -E 'qvac-audit|ReactNativeJS|EdgeMaster' \
  | while IFS= read -r line; do
      printf '%s [device] %s\n' "$(date -u +%H:%M:%S)" "$line"
    done >> "$LOG" &
SYSLOG_PID=$!

wait "$SYSLOG_PID" 2>/dev/null || true
