#!/usr/bin/env node

import { spawnSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const DEFAULT_DEVICES = [
  '9b010059305331323800716437d7c0',
  'R68T1036FSL',
];
const PACKAGE_ID = 'com.edgemaster.ai';
const MAIN_ACTIVITY = `${PACKAGE_ID}/.MainActivity`;
const APK_PATH = path.join(
  projectRoot,
  'android/app/build/outputs/apk/debug/app-debug.apk',
);

const devices = (process.env.ANDROID_DEVICES ?? DEFAULT_DEVICES.join(','))
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: '127.0.0.1',
};

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function adb(deviceId, ...args) {
  run('adb', ['-s', deviceId, ...args]);
}

const [primaryDevice, ...extraDevices] = devices;

if (!primaryDevice) {
  console.error('No Android devices configured.');
  process.exit(1);
}

console.log(`Building and installing on ${primaryDevice}...`);
run('npx', ['expo', 'run:android', '--device', primaryDevice, '--no-bundler']);

if (!existsSync(APK_PATH)) {
  console.error(`APK not found at ${APK_PATH}`);
  process.exit(1);
}

for (const deviceId of extraDevices) {
  console.log(`Installing on ${deviceId}...`);
  adb(deviceId, 'install', '-r', APK_PATH);
}

console.log('Starting Metro...');
const metro = spawn(
  'npx',
  ['expo', 'start', '--dev-client', '--localhost'],
  {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
  },
);

for (const deviceId of devices) {
  console.log(`Launching app on ${deviceId}...`);
  adb(deviceId, 'reverse', 'tcp:8081', 'tcp:8081');
  adb(deviceId, 'shell', 'am', 'start', '-n', MAIN_ACTIVITY);
}

metro.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGINT', () => {
  metro.kill('SIGINT');
});
