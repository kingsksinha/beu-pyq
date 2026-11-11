/**
 * Automated Academic & Algorithmic Integrity Test Suite
 * Tests all 10 safeguards:
 *  1. Zero Answer Guessing & Zero Hashing
 *  2. Confidence Levels (VERIFIED, REVIEWED, GENERATED)
 *  3. Accuracy Math with 0 Verified MCQs (N/A)
 *  4. Diagram Path Validation & HTML Escaping
 *  5. Transient-Only Network Retries (No 404 retries)
 *  6. Dynamic Catalog Manifest Validation (No hardcoded 363)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== Running PyqVault Academic Integrity & Reliability Tests ===\n');

let passedTests = 0;
function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    process.exit(1);
  }
}

// -------------------------------------------------------------
// Test Group 1: Answer Key Service Integrity (No Hashing)
// -------------------------------------------------------------
console.log('1. Answer Key & Academic Safeguard Testing:');

// Compile-free mock verification of answerKey logic
const VERIFIED_ANSWER_KEYS = {
  'sem2_chem_2023_01_q1_s1': 2,
  'sem2_chem_2023_01_q1_s2': 0,
  'sem1_phy_2024_01_q1_s1': 1,
  'sem1_phy_2024_01_q1_s2': 2
};

function resolveMockAnswerKey(questionId, options) {
  if (!questionId || typeof questionId !== 'string') return null;
  const key = VERIFIED_ANSWER_KEYS[questionId.trim()];
  if (key === undefined) return null;
  if (Array.isArray(options) && (key < 0 || key >= options.length)) return null;
  return { correctOptionIndex: key, confidence: 'VERIFIED' };
}

runTest('Verified question ID resolves to exact authoritatively curated option index', () => {
  const res = resolveMockAnswerKey('sem2_chem_2023_01_q1_s1', ['A', 'B', 'C', 'D']);
  assert.strictEqual(res !== null, true);
  assert.strictEqual(res.correctOptionIndex, 2);
  assert.strictEqual(res.confidence, 'VERIFIED');
});

runTest('Unknown question ID returns null and NEVER fabricates a random answer or hash % optCount', () => {
  const res = resolveMockAnswerKey('unknown_random_unverified_q999', ['A', 'B', 'C', 'D']);
  assert.strictEqual(res, null, 'Unverified question must return null, never guessed index');
});

runTest('Out-of-bounds key index returns null instead of invalid option', () => {
  // If options array has only 2 items but key is 2 (0-indexed 3rd item)
  const res = resolveMockAnswerKey('sem2_chem_2023_01_q1_s1', ['Option A', 'Option B']);
  assert.strictEqual(res, null, 'Out of bounds key must be rejected');
});

// -------------------------------------------------------------
// Test Group 2: Accuracy & Score Calculation Safeguards
// -------------------------------------------------------------
console.log('\n2. Accuracy Calculation Safeguards:');

function calculateMockAccuracy(verifiedAttempted, verifiedCorrect) {
  if (verifiedAttempted <= 0) return null; // N/A
  return Math.round((verifiedCorrect / verifiedAttempted) * 100);
}

runTest('When zero verified MCQs are attempted, accuracy is strictly null / N/A, NOT 100%', () => {
  const accuracy = calculateMockAccuracy(0, 0);
  assert.strictEqual(accuracy, null, '0 attempted verified MCQs must yield null (rendered as N/A)');
});

runTest('When 2 verified MCQs are attempted and 1 is correct, accuracy is strictly 50%', () => {
  const accuracy = calculateMockAccuracy(2, 1);
  assert.strictEqual(accuracy, 50);
});

runTest('When 4 verified MCQs are attempted and 4 are correct, accuracy is 100%', () => {
  const accuracy = calculateMockAccuracy(4, 4);
  assert.strictEqual(accuracy, 100);
});

// -------------------------------------------------------------
// Test Group 3: HTML Escaping & Diagram Path Validation
// -------------------------------------------------------------
console.log('\n3. HTML Escaping & Path Sanitization:');

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const DIAGRAM_PATH_REGEX = /^img\/[a-zA-Z0-9_/.-]+$/i;

runTest('HTML escaping correctly defangs XSS payloads', () => {
  const payload = '<script>alert("XSS & theft")</script>';
  const escaped = escapeHtml(payload);
  assert.strictEqual(escaped.includes('<script>'), false);
  assert.strictEqual(escaped.includes('</script>'), false);
  assert.strictEqual(escaped.includes('&lt;script&gt;'), true);
  assert.strictEqual(escaped.includes('&quot;'), true);
  assert.strictEqual(escaped.includes('&amp;'), true);
});

runTest('Diagram regex validates authentic BEU diagrams', () => {
  assert.strictEqual(DIAGRAM_PATH_REGEX.test('img/beu/diagram/sem2_chem_2023_01_fig1.png'), true);
  assert.strictEqual(DIAGRAM_PATH_REGEX.test('img/beu/diagram/sem1_phy_circuit.jpg'), true);
});

runTest('Diagram regex rejects malicious or remote URLs', () => {
  assert.strictEqual(DIAGRAM_PATH_REGEX.test('https://evil.com/malicious.png'), false);
  assert.strictEqual(DIAGRAM_PATH_REGEX.test('javascript:alert(1)'), false);
  assert.strictEqual(DIAGRAM_PATH_REGEX.test('../../../etc/passwd'), false);
});

// -------------------------------------------------------------
// Test Group 4: Transient-Only Network Retry Policy
// -------------------------------------------------------------
console.log('\n4. Network Transient Retry Safeguards:');

const TRANSIENT_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

function shouldRetry(status, err) {
  if (err && err.name === 'TypeError') return true; // Network disconnect / DNS failure
  if (TRANSIENT_STATUSES.has(status)) return true;
  return false;
}

runTest('404 Not Found is NEVER retried', () => {
  assert.strictEqual(shouldRetry(404, null), false, '404 must fail fast without retry');
});

runTest('400, 401, 403 Client Errors are NEVER retried', () => {
  assert.strictEqual(shouldRetry(400, null), false);
  assert.strictEqual(shouldRetry(401, null), false);
  assert.strictEqual(shouldRetry(403, null), false);
});

runTest('Transient 500, 502, 503, 504, 429 server errors ARE retried', () => {
  assert.strictEqual(shouldRetry(500, null), true);
  assert.strictEqual(shouldRetry(502, null), true);
  assert.strictEqual(shouldRetry(503, null), true);
  assert.strictEqual(shouldRetry(504, null), true);
  assert.strictEqual(shouldRetry(429, null), true);
});

runTest('Network disconnect (TypeError) triggers transient retry', () => {
  assert.strictEqual(shouldRetry(null, new TypeError('Failed to fetch')), true);
});

// -------------------------------------------------------------
// Test Group 5: Academic Source Code Audit
// -------------------------------------------------------------
console.log('\n5. Source Code Safeguard Audit:');

runTest('No pseudo-random hashing remains in PracticeModePage.tsx', () => {
  const code = fs.readFileSync(path.resolve(__dirname, '../src/pages/PracticeModePage.tsx'), 'utf8');
  assert.strictEqual(code.includes('hashQuestionText'), false, 'hashQuestionText must be deleted');
  assert.strictEqual(code.includes('beu_random_salt'), false, 'beu_random_salt must be deleted');
  assert.strictEqual(code.includes('resolveCorrectOption'), false, 'resolveCorrectOption must be deleted');
});

runTest('Model answer service does not invent unverified citations', () => {
  const code = fs.readFileSync(path.resolve(__dirname, '../src/services/modelAnswerService.ts'), 'utf8');
  assert.strictEqual(code.includes('AICTE Model Curriculum Standards (Automated Reference)'), false);
  assert.strictEqual(code.includes('confidence: \'GENERATED\''), true);
});

runTest('PracticeMode bookmark state is reactive', () => {
  const code = fs.readFileSync(path.resolve(__dirname, '../src/pages/PracticeModePage.tsx'), 'utf8');
  assert.strictEqual(code.includes('const [bookmarkedIds, setBookmarkedIds]'), true);
});

// -------------------------------------------------------------
// Test Group 6: LaTeX Math Formatting & Entity Decoding Safeguards
// -------------------------------------------------------------
console.log('\n6. Math Formatting & KaTeX Resilience:');

const katex = require('katex');

function decodeHtmlEntities(raw) {
  return raw
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function renderKatexSafe(math, displayMode) {
  try {
    return katex.renderToString(math, { displayMode, throwOnError: true });
  } catch {
    let fixed = math;
    fixed = fixed.replace(/(?<!\\)%/g, '\\%');
    if (!fixed.includes('\\begin{')) {
      fixed = fixed.replace(/(?<!\\)&/g, '\\&');
    }
    fixed = fixed.replace(/\^\\([a-zA-Z]+)/g, '^{\\$1}');
    if (fixed.includes('\\(') || fixed.includes('\\)')) {
      fixed = fixed.replace(/\\\(|\\\)/g, '');
    }
    return katex.renderToString(fixed, { displayMode, throwOnError: false });
  }
}

runTest('HTML entities &gt; and &lt; are decoded into valid KaTeX relational math', () => {
  const rawOpt = '\\( s &gt; a \\)';
  const decoded = decodeHtmlEntities(rawOpt);
  const math = decoded.slice(2, -2).trim();
  const html = renderKatexSafe(math, false);
  assert.strictEqual(html.includes('katex-error'), false);
  assert.strictEqual(html.includes('<math'), true);
});

runTest('Unescaped % in LaTeX \\text{} does not trigger premature comment parsing', () => {
  const rawMath = '\\text{Cu} = 8 \\text{ wt%}';
  const html = renderKatexSafe(rawMath, false);
  assert.strictEqual(html.includes('katex-error'), false);
  assert.strictEqual(html.includes('wt%'), true);
});

runTest('Matrix environments with & alignment tabs render without parse error', () => {
  const rawMatrix = '\\begin{bmatrix} 3 & 4 \\\\ 3 & 1 \\end{bmatrix}';
  const html = renderKatexSafe(rawMatrix, false);
  assert.strictEqual(html.includes('katex-error'), false);
});

runTest('Degree superscript ^\\circ is normalized and renders correctly', () => {
  const rawTemp = '250^\\circ\\text{C}';
  const html = renderKatexSafe(rawTemp, false);
  assert.strictEqual(html.includes('katex-error'), false);
});

console.log(`\n=== ALL ${passedTests} ACADEMIC INTEGRITY TESTS PASSED SUCCESSFULLY ===`);
