const fs = require('fs');
const path = require('path');

const refDir = 'C:\\Users\\kants\\.gemini\\antigravity\\scratch\\ref_beu_pyqs';
const html = fs.readFileSync(path.join(refDir, 'index.html'), 'utf8');

const ansClass = html.match(/class="[^"]*answer[^"]*"/gi);
const corrClass = html.match(/class="[^"]*correct[^"]*"/gi);
const dataAnswer = html.match(/data-answer="[^"]*"/gi);
const dataCorrect = html.match(/data-correct="[^"]*"/gi);

console.log('Answer classes in HTML:', ansClass);
console.log('Correct classes in HTML:', corrClass);
console.log('data-answer attributes:', dataAnswer);
console.log('data-correct attributes:', dataCorrect);

// Check if any by_subject file has answers
const files = fs.readdirSync(path.join(refDir, 'by_subject'));
let foundAnswersInSubject = 0;
for (const f of files) {
  const content = fs.readFileSync(path.join(refDir, 'by_subject', f), 'utf8');
  if (content.includes('data-answer') || content.includes('data-correct') || content.includes('answer-key')) {
    foundAnswersInSubject++;
  }
}
console.log('Subject files with answers:', foundAnswersInSubject);
