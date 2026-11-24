// worst-app-idea-01 — The Worst App Idea Ever Pitched (make.fun)
// Writes one sentence (<= 240 chars) pitching the worst, most useless
// app imaginable to <output-dir>/entry.txt.
//
// The pitch: RainRadar — live satellite data tells commuters it is
// raining, for $9.99 a month, so they never have to glance out a window.
// A problem nobody has, solved with absurd overkill, pitched deadpan
// by a founder who means every word.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ENTRY =
  "RainRadar uses live satellite data to warn commuters the moment it starts raining, for just $9.99 a month, so they will never again have to glance out a window like some kind of animal.";

// Output directory: MAKEFUN_OUTPUT_DIR wins, then OUTPUT_DIR, else /output.
// Refuse "." so the entry can never land in the working directory.
function outputDir(): string {
  const raw =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
  const dir = resolve(raw);
  if (dir === resolve(".")) {
    throw new Error('refusing to write entry into "." as the output directory');
  }
  return dir;
}

// Gate checks, mirroring the competition gate:
// 1-240 chars, non-blank, one line, one sentence, no control characters.
function validate(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("entry is blank");
  }
  if (text.length < 1 || text.length > 240) {
    throw new Error(`entry is ${text.length} chars, must be 1-240`);
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(text)) {
    throw new Error("entry contains control characters");
  }
  // Count sentence-ending punctuation only where it actually ends a
  // sentence (end of text, or followed by whitespace + a capital):
  // a decimal like "$9.99" must not count as two sentences.
  const endings = text.match(/[.!?]+(?=\s+[A-Z]|$)/g) ?? [];
  if (endings.length !== 1) {
    throw new Error(`entry must be exactly one sentence, found ${endings.length} endings`);
  }
  if (!/[.!?]$/.test(text)) {
    throw new Error("entry must end with sentence-ending punctuation");
  }
}

function main(): void {
  validate(ENTRY);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  // No trailing newline: the file holds exactly the entry text.
  writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
  console.log(`wrote ${ENTRY.length}-char entry to ${join(dir, "entry.txt")}`);
}

main();
