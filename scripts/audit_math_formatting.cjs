const fs = require('fs');
const path = require('path');
const katex = require('katex');

const dir = path.join(__dirname, '../public/data/papers');

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
  } catch (e1) {
    let fixed = math;
    // 1. Escape unescaped % (in LaTeX, % comments out the rest of the line/macro)
    fixed = fixed.replace(/(?<!\\)%/g, '\\%');
    // 2. Fix unescaped isolated & outside matrix/cases/array environments
    if (!fixed.includes('\\begin{')) {
      fixed = fixed.replace(/(?<!\\)&/g, '\\&');
    }
    // 3. Fix superscripts without braces
    fixed = fixed.replace(/\^\\([a-zA-Z]+)/g, '^{\\$1}');
    // 4. Strip nested delimiters if any
    if (fixed.includes('\\(') || fixed.includes('\\)')) {
      fixed = fixed.replace(/\\\(|\\\)/g, '');
    }

    try {
      return katex.renderToString(fixed, { displayMode, throwOnError: true });
    } catch (e2) {
      return katex.renderToString(fixed, { displayMode, throwOnError: false });
    }
  }
}

let totalMath = 0;
const errors = [];

const files = fs.readdirSync(dir);
for (const f of files) {
  if (!f.endsWith('.json')) continue;
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));

  const checkText = (txt, loc) => {
    if (!txt) return;
    const decoded = decodeHtmlEntities(txt);
    const normalized = decoded.replace(/\\\\([()[\]])/g, '\\$1');
    const mathRegex = /(\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)|\$[^\$\n]+?\$)/g;
    const parts = normalized.split(mathRegex);

    for (const part of parts) {
      if (!part) continue;
      let math = null;
      let isBlock = false;

      if (part.startsWith('\\[') && part.endsWith('\\]')) {
        math = part.slice(2, -2).trim();
        isBlock = true;
      } else if (part.startsWith('$$') && part.endsWith('$$') && part.length > 3) {
        math = part.slice(2, -2).trim();
        isBlock = true;
      } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
        math = part.slice(2, -2).trim();
      } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2 && !part.slice(1, -1).includes('$')) {
        math = part.slice(1, -1).trim();
      }

      if (math !== null) {
        totalMath++;
        const html = renderKatexSafe(math, isBlock);
        if (html.includes('katex-error')) {
          // Extract error message
          const errMatch = html.match(/title="ParseError: ([^"]+)"/);
          errors.push({
            file: f,
            loc,
            math,
            errMsg: errMatch ? errMatch[1] : 'Unknown error'
          });
        }
      }
    }
  };

  for (const q of data.questions) {
    checkText(q.title, `Q.${q.number}`);
    for (const s of q.subQuestions) {
      checkText(s.text, `Q.${q.number}(${s.subNumber})`);
      (s.options || []).forEach((opt, idx) => {
        checkText(opt, `Q.${q.number}(${s.subNumber}) opt ${idx}`);
      });
    }
  }
}

console.log(`Audited ${totalMath} math expressions across ${files.length} papers.`);
console.log(`Found ${errors.length} KaTeX errors.`);

// Search for corrupted HTML strings in dataset
const corrupted = [];
for (const f of files) {
  if (!f.endsWith('.json')) continue;
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  if (content.includes('=""')) {
    corrupted.push(f);
  }
}
console.log(`Papers with corrupted HTML tags (="""):`, corrupted);

// Check for unclosed math delimiters
let unclosedDelimiters = 0;
for (const f of files) {
  if (!f.endsWith('.json')) continue;
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  for (const q of data.questions) {
    for (const s of q.subQuestions) {
      const openParen = (s.text.match(/\\\(/g) || []).length;
      const closeParen = (s.text.match(/\\\)/g) || []).length;
      if (openParen !== closeParen) {
        unclosedDelimiters++;
        if (unclosedDelimiters <= 5) {
          console.log(`[${f}] Q.${q.number}(${s.subNumber}): open \\(: ${openParen}, close \\): ${closeParen}`);
        }
      }
    }
  }
}
console.log(`Total subquestions with mismatched \\( vs \\):`, unclosedDelimiters);

// Check for duplicate letter prefixes in options (e.g. opt 0 starting with "(a)" or "A.")
let duplicateOptionLetters = 0;
for (const f of files) {
  if (!f.endsWith('.json')) continue;
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  for (const q of data.questions) {
    for (const s of q.subQuestions) {
      (s.options || []).forEach((opt, idx) => {
        const letter = String.fromCharCode(97 + idx); // 'a', 'b', 'c', 'd'
        if (new RegExp(`^\\s*\\(?${letter}[.)\\]]\\s*`, 'i').test(opt)) {
          duplicateOptionLetters++;
          if (duplicateOptionLetters <= 5) {
            console.log(`[${f}] Q.${q.number}(${s.subNumber}) option ${idx} has prefix: "${opt.slice(0, 30)}"`);
          }
        }
      });
    }
  }
}
console.log(`Total options with duplicate letter prefixes:`, duplicateOptionLetters);



const errorTypes = new Map();
errors.forEach(e => {
  const key = e.errMsg.split('at position')[0].trim();
  errorTypes.set(key, (errorTypes.get(key) || 0) + 1);
});

console.log('\nError Categories:');
for (const [type, count] of errorTypes.entries()) {
  console.log(`- [${count}] ${type}`);
}

console.log('\nSample Detailed Errors (up to 15):');
errors.slice(0, 15).forEach((e, i) => {
  console.log(`\n${i + 1}. [${e.file}] ${e.loc}:`);
  console.log(`   MATH: ${e.math}`);
  console.log(`   ERROR: ${e.errMsg}`);
});
