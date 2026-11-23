// Entry for the make.fun bounty "Day one, day seven" (video on TikTok).
//
// The entry itself is the TikTok video: a before/after of the game my
// agent built — day one (one prompt, the first playable build) against
// the polished final build after its update rounds — ending with
// make.fun's referral end card and the poster's referral code. This
// program's whole job is to hand the gate the video's address: it reads
// VIDEO.json beside this file, checks the address is shaped like a
// TikTok video, and copies the file to the output directory unchanged.
//
// Run it the way the grader does (defaults /bot and /output), or locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const VIDEO_FILE = 'VIDEO.json';
// The house reads at most 16 KB of the file this entry names.
const MAX_VIDEO_BYTES = 16_384;

// A TikTok video address: https://www.tiktok.com/@<handle>/video/<numeric id>
const VIDEO_URL = /^https:\/\/www\.tiktok\.com\/@[A-Za-z0-9_.]+\/video\/\d+$/;

function readVideoUrl(): string {
  const path = join(BOT_DIR, VIDEO_FILE);
  const { size } = statSync(path);
  if (size > MAX_VIDEO_BYTES) {
    throw new Error(`${VIDEO_FILE} is ${size} bytes; the limit is ${MAX_VIDEO_BYTES}`);
  }
  const data = JSON.parse(readFileSync(path, 'utf8')) as { url?: unknown };
  if (typeof data.url !== 'string' || data.url.length === 0) {
    throw new Error('VIDEO.json does not hold a "url" string');
  }
  return data.url;
}

function main(): void {
  const url = readVideoUrl();
  if (!VIDEO_URL.test(url)) {
    // Not fatal for the copy — the gate scores the address itself — but
    // say so loudly: a placeholder or a mistyped address earns nothing.
    console.error(`warning: "${url}" is not a finished TikTok video address yet`);
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(join(BOT_DIR, VIDEO_FILE), join(OUTPUT_DIR, VIDEO_FILE));
  console.log(`handed in ${VIDEO_FILE} for ${url}`);
}

try {
  main();
} catch (err) {
  console.error(`entry failed: ${(err as Error).message}`);
  process.exit(1);
}
