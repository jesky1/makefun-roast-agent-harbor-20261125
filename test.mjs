// Own tests for the roast-your-own-agent writer.
// Run with: node --test test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROAST_LINE, findProblems, publishRoast } from './main.ts';

const LINE =
  'My agent agreed with me, disagreed with itself, then spent twenty tool calls confidently proving the wrong answer right.';

test('the roast line text is exactly the intended line', () => {
  assert.equal(ROAST_LINE, LINE);
});

test('the roast line passes every gate rule', () => {
  assert.deepEqual(findProblems(ROAST_LINE), []);
});

test('the roast line is one line of 1 to 140 characters', () => {
  assert.ok(ROAST_LINE.length >= 1 && ROAST_LINE.length <= 140);
  assert.equal(ROAST_LINE.length, 120);
  assert.ok(!/[\r\n]/.test(ROAST_LINE));
  assert.ok(ROAST_LINE.trim().length > 0);
});

test('the roast roasts our own agent: agreement, contradiction, wasted tool calls', () => {
  assert.ok(/agreed with me/i.test(ROAST_LINE), 'eager agreement');
  assert.ok(/disagreed with itself/i.test(ROAST_LINE), 'self-contradiction');
  assert.ok(/tool calls/i.test(ROAST_LINE), 'tool calls going nowhere');
  assert.ok(/wrong answer/i.test(ROAST_LINE), 'confidently wrong');
});

test('publishRoast writes entry.txt byte-identical on repeat runs', () => {
  const first = mkdtempSync(join(tmpdir(), 'roast-a-'));
  const second = mkdtempSync(join(tmpdir(), 'roast-b-'));
  publishRoast(first);
  publishRoast(second);
  const a = readFileSync(join(first, 'entry.txt'));
  const b = readFileSync(join(second, 'entry.txt'));
  assert.ok(a.equals(b));
  assert.equal(a.toString('utf8'), LINE);
  assert.ok(!a.toString('utf8').endsWith('\n'));
});

test('running main.ts as a program writes the same entry', () => {
  const dir = mkdtempSync(join(tmpdir(), 'roast-cli-'));
  execFileSync(process.execPath, ['main.ts'], {
    cwd: new URL('.', import.meta.url).pathname,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: dir },
  });
  assert.equal(readFileSync(join(dir, 'entry.txt'), 'utf8'), LINE);
});

// Negative tests: the validator must reject lines that break the gate.
test('over-limit line is rejected', () => {
  const long = 'x'.repeat(141);
  assert.ok(findProblems(long).some((p) => p.includes('length')));
});

test('whitespace-only line is rejected', () => {
  assert.ok(findProblems('   ').some((p) => p.includes('white space')));
});

test('multi-line text is rejected', () => {
  assert.ok(
    findProblems('first line\nsecond line').some((p) => p.includes('line break')),
  );
});

test('leading and trailing spaces are rejected', () => {
  assert.ok(
    findProblems(' padded line ').some((p) => p.includes('leading or trailing')),
  );
});

test('control characters are rejected', () => {
  assert.ok(
    findProblems('line with\ttab').some((p) => p.includes('control character')),
  );
});

test('a line with no letters is rejected', () => {
  assert.ok(findProblems('1234567890!').some((p) => p.includes('no letter')));
});

test('a line containing a link is rejected', () => {
  assert.ok(
    findProblems('see http://example.com for the joke').some((p) =>
      p.includes('link'),
    ),
  );
});

test('a too-short line is rejected', () => {
  assert.ok(findProblems('Ha!').some((p) => p.includes('words')));
});
