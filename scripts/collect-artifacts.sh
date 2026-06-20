#!/usr/bin/env bash
#
# Collects submission artifacts for the QVAC hackathon:
#   - hardware.txt         : host + target device hardware proof
#   - env.txt              : toolchain versions + git commit (reproducibility)
#   - run-<ts>.log         : Metro + device logs during a demo session
#   - inference-audit.json : structured [qvac-audit] lines extracted from the run log
#
# Usage:
#   bash scripts/collect-artifacts.sh                 # dev build: hardware + env + Metro + adb logcat
#   bash scripts/collect-artifacts.sh --release       # release build: hardware + env + adb logcat only
#   bash scripts/collect-artifacts.sh --info          # hardware + env only (no app run)
#   bash scripts/collect-artifacts.sh --android ID    # pin a specific adb device serial
#
# Demo run (default):
#   1. Connect a device or boot a simulator with the dev client installed.
#   2. Run this script — it starts Metro and tees device logs.
#   3. Open EdgeMaster AI, wait for models to load, send a campaign chat message.
#   4. Press Ctrl-C; logs are flushed and inference-audit.json is generated.
#
# Pair artifacts/ with a ≤5 min demo video for the full evidence bundle.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/artifacts"
TS="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

OS="$(uname -s)"
ADB_DEVICE="${ADB_DEVICE:-}"
IOS_DEVICE="${IOS_DEVICE:-}"
SKIP_RUN=false
BUILD_TYPE="dev"

while [ $# -gt 0 ]; do
  case "$1" in
    --info)
      SKIP_RUN=true
      ;;
    --release)
      BUILD_TYPE="release"
      ;;
    --android)
      shift
      ADB_DEVICE="${1:-}"
      ;;
    --android=*)
      ADB_DEVICE="${1#--android=}"
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

capture_android_device() {
  local serial="$1"
  {
    echo "## Android device ($serial)"
    echo "model: $(adb -s "$serial" shell getprop ro.product.model 2>/dev/null | tr -d '\r')"
    echo "manufacturer: $(adb -s "$serial" shell getprop ro.product.manufacturer 2>/dev/null | tr -d '\r')"
    echo "brand: $(adb -s "$serial" shell getprop ro.product.brand 2>/dev/null | tr -d '\r')"
    echo "device: $(adb -s "$serial" shell getprop ro.product.device 2>/dev/null | tr -d '\r')"
    echo "android: $(adb -s "$serial" shell getprop ro.build.version.release 2>/dev/null | tr -d '\r') (SDK $(adb -s "$serial" shell getprop ro.build.version.sdk 2>/dev/null | tr -d '\r'))"
    echo "board: $(adb -s "$serial" shell getprop ro.board.platform 2>/dev/null | tr -d '\r')"
    echo "abi: $(adb -s "$serial" shell getprop ro.product.cpu.abi 2>/dev/null | tr -d '\r')"
    echo "hardware: $(adb -s "$serial" shell getprop ro.hardware 2>/dev/null | tr -d '\r')"
    adb -s "$serial" shell grep -m1 MemTotal /proc/meminfo 2>/dev/null | tr -d '\r' || true
    adb -s "$serial" shell grep -m1 MemAvailable /proc/meminfo 2>/dev/null | tr -d '\r' || true
    echo "battery: $(adb -s "$serial" shell dumpsys battery 2>/dev/null | grep -E 'level:|status:' | tr -d '\r' | sed 's/^ *//')"
  } 2>/dev/null
}

capture_ios_product_specs() {
  local product_type="$1"
  case "$product_type" in
    iPhone14,5) echo "marketing_name: iPhone 13"; echo "chip: Apple A15 Bionic"; echo "ram: 4 GB (typical for this model; not exposed over USB)" ;;
    iPhone14,4) echo "marketing_name: iPhone 13 mini"; echo "chip: Apple A15 Bionic"; echo "ram: 4 GB (typical for this model; not exposed over USB)" ;;
    iPhone14,2) echo "marketing_name: iPhone 13 Pro"; echo "chip: Apple A15 Bionic"; echo "ram: 6 GB (typical for this model; not exposed over USB)" ;;
    iPhone14,3) echo "marketing_name: iPhone 13 Pro Max"; echo "chip: Apple A15 Bionic"; echo "ram: 6 GB (typical for this model; not exposed over USB)" ;;
    iPhone15,4) echo "marketing_name: iPhone 15"; echo "chip: Apple A16 Bionic"; echo "ram: 6 GB (typical for this model; not exposed over USB)" ;;
    iPhone15,5) echo "marketing_name: iPhone 15 Plus"; echo "chip: Apple A16 Bionic"; echo "ram: 6 GB (typical for this model; not exposed over USB)" ;;
    iPhone16,1) echo "marketing_name: iPhone 15 Pro"; echo "chip: Apple A17 Pro"; echo "ram: 8 GB (typical for this model; not exposed over USB)" ;;
    iPhone16,2) echo "marketing_name: iPhone 15 Pro Max"; echo "chip: Apple A17 Pro"; echo "ram: 8 GB (typical for this model; not exposed over USB)" ;;
    iPhone17,3) echo "marketing_name: iPhone 16"; echo "chip: Apple A18"; echo "ram: 8 GB (typical for this model; not exposed over USB)" ;;
    iPhone17,4) echo "marketing_name: iPhone 16 Plus"; echo "chip: Apple A18"; echo "ram: 8 GB (typical for this model; not exposed over USB)" ;;
    *)
      echo "marketing_name: unknown (ProductType $product_type)"
      echo "chip: see https://apple.com for ProductType $product_type"
      echo "ram: not exposed over USB — check Settings → General → About or Apple spec sheet"
      ;;
  esac
}

capture_ios_physical_device() {
  local udid="$1"
  local product_type
  local total_disk total_data data_available

  product_type="$(ideviceinfo -u "$udid" -k ProductType 2>/dev/null | tr -d '\r')"
  total_disk="$(ideviceinfo -u "$udid" -q com.apple.disk_usage -k TotalDiskCapacity 2>/dev/null | tr -d '\r')"
  total_data="$(ideviceinfo -u "$udid" -q com.apple.disk_usage -k TotalDataCapacity 2>/dev/null | tr -d '\r')"
  data_available="$(ideviceinfo -u "$udid" -q com.apple.disk_usage -k AmountDataAvailable 2>/dev/null | tr -d '\r')"

  {
    echo "## iOS device ($udid)"
    echo "device_name: $(ideviceinfo -u "$udid" -k DeviceName 2>/dev/null | tr -d '\r')"
    echo "device_class: $(ideviceinfo -u "$udid" -k DeviceClass 2>/dev/null | tr -d '\r')"
    echo "product_type: $product_type"
    capture_ios_product_specs "$product_type"
    echo "ios: $(ideviceinfo -u "$udid" -k ProductVersion 2>/dev/null | tr -d '\r')"
    echo "build: $(ideviceinfo -u "$udid" -k BuildVersion 2>/dev/null | tr -d '\r')"
    echo "model_number: $(ideviceinfo -u "$udid" -k ModelNumber 2>/dev/null | tr -d '\r')"
    echo "hardware_model: $(ideviceinfo -u "$udid" -k HardwareModel 2>/dev/null | tr -d '\r')"
    echo "hardware_platform: $(ideviceinfo -u "$udid" -k HardwarePlatform 2>/dev/null | tr -d '\r')"
    echo "cpu_architecture: $(ideviceinfo -u "$udid" -k CPUArchitecture 2>/dev/null | tr -d '\r')"
    if [ -n "$total_disk" ] && [ "$total_disk" -gt 0 ] 2>/dev/null; then
      echo "storage_total_gb: $(( total_disk / 1000000000 ))"
    fi
    if [ -n "$total_data" ] && [ "$total_data" -gt 0 ] 2>/dev/null; then
      echo "storage_data_gb: $(( total_data / 1000000000 ))"
    fi
    if [ -n "$data_available" ] && [ "$data_available" -gt 0 ] 2>/dev/null; then
      echo "storage_available_gb: $(( data_available / 1000000000 ))"
    fi
  } 2>/dev/null
}

capture_ios_physical_devices() {
  if ! command -v ideviceinfo >/dev/null 2>&1 || ! command -v idevice_id >/dev/null 2>&1; then
    echo "## iOS device: libimobiledevice not installed (brew install libimobiledevice)"
    return
  fi

  local udids=()
  local udid

  if [ -n "$IOS_DEVICE" ]; then
    udids=("$IOS_DEVICE")
  else
    while IFS= read -r udid; do
      [ -n "$udid" ] && udids+=("$udid")
    done < <(idevice_id -l 2>/dev/null)
  fi

  if [ "${#udids[@]}" -eq 0 ]; then
    echo "## iOS device: none connected via USB"
    echo "hint: connect iPhone, tap Trust, run: brew install libimobiledevice"
    return
  fi

  for udid in "${udids[@]}"; do
    capture_ios_physical_device "$udid"
    echo
  done
}

capture_ios_simulator() {
  local udid
  udid="$(xcrun simctl list devices booted 2>/dev/null | grep -Eo '[0-9A-F-]{36}' | head -1 || true)"
  if [ -z "$udid" ]; then
    echo "## iOS simulator: none booted"
    return
  fi
  {
    echo "## iOS simulator ($udid)"
    xcrun simctl list devices booted 2>/dev/null | sed 's/^ *//'
    echo
    xcrun simctl getenv "$udid" SIMULATOR_MODEL_IDENTIFIER 2>/dev/null \
      | sed 's/^/model_identifier: /' || true
  } 2>/dev/null
}

echo "==> Collecting hardware info → artifacts/hardware.txt"
{
  echo "# Hardware proof — generated $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "host_uname: $(uname -a)"
  echo
  if [ "$OS" = "Darwin" ]; then
    echo "## Host CPU"
    sysctl -n machdep.cpu.brand_string 2>/dev/null
    echo "cores: $(sysctl -n hw.ncpu 2>/dev/null)"
    echo "## Host memory"
    echo "$(( $(sysctl -n hw.memsize 2>/dev/null) / 1024 / 1024 )) MB"
    echo "## Host model"
    sysctl -n hw.model 2>/dev/null
    echo "## Host GPU / chip"
    system_profiler SPHardwareDataType SPDisplaysDataType 2>/dev/null \
      | grep -Ei "chip|model name|memory|cores|chipset|vendor|vram|metal" | sed 's/^ *//'
  elif [ "$OS" = "Linux" ]; then
    echo "## Host CPU"
    grep -m1 "model name" /proc/cpuinfo 2>/dev/null | cut -d: -f2- | sed 's/^ *//'
    echo "cores: $(nproc 2>/dev/null)"
    echo "## Host memory"
    grep MemTotal /proc/meminfo 2>/dev/null
    echo "## Host GPU"
    (lspci 2>/dev/null | grep -Ei "vga|3d|display") || echo "lspci unavailable"
    command -v nvidia-smi >/dev/null 2>&1 && nvidia-smi 2>/dev/null | head -15
  else
    echo "Unsupported host OS for auto capture: $OS — fill in manually."
  fi
  echo
  echo "## Host disk"
  df -h "$ROOT" 2>/dev/null
  echo
  if command -v adb >/dev/null 2>&1; then
    if [ -z "$ADB_DEVICE" ]; then
      ADB_DEVICE="$(adb devices 2>/dev/null | awk 'NR>1 && $2=="device" {print $1; exit}')"
    fi
    if [ -n "$ADB_DEVICE" ]; then
      capture_android_device "$ADB_DEVICE"
    else
      echo "## Android device: none connected (adb devices empty)"
    fi
  else
    echo "## Android device: adb not installed"
  fi
  echo
  if [ "$OS" = "Darwin" ]; then
    capture_ios_physical_devices
    if command -v xcrun >/dev/null 2>&1; then
      capture_ios_simulator
    fi
  fi
} > "$OUT/hardware.txt"

echo "==> Collecting toolchain / reproducibility info → artifacts/env.txt"
{
  echo "# Environment — generated $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "node:           $(node -v 2>/dev/null)"
  echo "npm:            $(npm -v 2>/dev/null)"
  echo "expo:           $(node -e "try{process.stdout.write(require('$ROOT/node_modules/expo/package.json').version)}catch(e){process.stdout.write('n/a')}" 2>/dev/null)"
  echo "react-native:   $(node -e "try{process.stdout.write(require('$ROOT/node_modules/react-native/package.json').version)}catch(e){process.stdout.write('n/a')}" 2>/dev/null)"
  echo "@qvac/sdk:      $(node -e "try{process.stdout.write(require('$ROOT/node_modules/@qvac/sdk/package.json').version)}catch(e){process.stdout.write('not installed')}" 2>/dev/null)"
  echo "app version:    $(node -e "process.stdout.write(require('$ROOT/package.json').version)" 2>/dev/null)"
  echo "bundle id:      com.edgemaster.ai"
  echo "build type:     $BUILD_TYPE"
  if command -v adb >/dev/null 2>&1 && [ -n "${ADB_DEVICE:-}" ]; then
    echo "adb device:     $ADB_DEVICE"
  fi
  if [ -n "${IOS_DEVICE:-}" ]; then
    echo "ios device:     $IOS_DEVICE"
  fi
  echo "git commit:     $(git -C "$ROOT" rev-parse HEAD 2>/dev/null)"
  echo "git branch:     $(git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null)"
  echo "git status:"
  git -C "$ROOT" status --short 2>/dev/null
} > "$OUT/env.txt"

echo "    hardware.txt and env.txt written."

if [ "$SKIP_RUN" = true ]; then
  echo "==> --info given; skipping demo run."
  exit 0
fi

LOG="$OUT/run-$TS.log"
AUDIT="$OUT/inference-audit-$TS.json"
LOGCAT_PID=""

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

stop_logcat() {
  if [ -n "$LOGCAT_PID" ] && kill -0 "$LOGCAT_PID" 2>/dev/null; then
    kill "$LOGCAT_PID" 2>/dev/null || true
    wait "$LOGCAT_PID" 2>/dev/null || true
    LOGCAT_PID=""
  fi
}

on_exit() {
  stop_logcat
  extract_audit_json
  echo "----------------------------------------------------------------------"
  echo "==> Saved run log → $LOG"
  echo "==> Artifacts in $OUT:"
  ls -la "$OUT"
}

trap on_exit EXIT INT TERM

if [ "$BUILD_TYPE" = "release" ]; then
  echo "==> Starting release demo capture — output tee'd to artifacts/run-$TS.log"
  echo "    Launch the release build on your device, exercise the app, then Ctrl-C."
else
  echo "==> Starting dev demo capture — output tee'd to artifacts/run-$TS.log"
  echo "    Open EdgeMaster AI (dev client + Metro), exercise the app, then Ctrl-C."
fi
echo "----------------------------------------------------------------------"

{
  echo "# EdgeMaster AI demo run — started $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  if [ "$BUILD_TYPE" = "release" ]; then
    echo "# Release build — device logs only ([device] = adb logcat)"
  else
    echo "# Dev build — Metro + device logs ([metro] = bundler, [device] = adb logcat)"
  fi
  echo
} > "$LOG"

if command -v adb >/dev/null 2>&1 && [ -n "${ADB_DEVICE:-}" ]; then
  echo "    Using adb device: $ADB_DEVICE"
  if [ "$BUILD_TYPE" != "release" ]; then
    adb -s "$ADB_DEVICE" reverse tcp:8081 tcp:8081 2>/dev/null || true
  fi
  adb -s "$ADB_DEVICE" logcat -c 2>/dev/null || true
  (
    adb -s "$ADB_DEVICE" logcat -v time ReactNativeJS:I ReactNative:V '*:S' 2>/dev/null \
      || adb -s "$ADB_DEVICE" logcat -v time 2>/dev/null
  ) | while IFS= read -r line; do
    printf '%s [device] %s\n' "$(date -u +%H:%M:%S)" "$line"
  done >> "$LOG" &
  LOGCAT_PID=$!
elif [ "$BUILD_TYPE" = "release" ]; then
  echo "    ERROR: release capture requires a USB-connected Android device (adb)."
  echo "    Connect a device and re-run, or use: ADB_DEVICE=<serial> bash scripts/collect-artifacts.sh --release"
  exit 1
else
  echo "    No adb device — only Metro output will be captured."
  echo "    Connect a device and re-run, or use: ADB_DEVICE=<serial> bash scripts/collect-artifacts.sh"
fi

if [ "$BUILD_TYPE" = "release" ]; then
  if [ -n "$LOGCAT_PID" ]; then
    wait "$LOGCAT_PID"
  else
    # Keep the script alive until Ctrl-C if logcat failed to start.
    while true; do sleep 1; done
  fi
else
  ( cd "$ROOT" && npm start 2>&1 ) | while IFS= read -r line; do
    printf '%s [metro] %s\n' "$(date -u +%H:%M:%S)" "$line"
  done | tee -a "$LOG"
fi
