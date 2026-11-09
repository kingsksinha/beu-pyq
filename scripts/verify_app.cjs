const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const dataDir = path.join(distDir, 'data');
const papersDir = path.join(dataDir, 'papers');

console.log('=== Running Production Build Verification ===');

// 1. Check index.html
const indexPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error('dist/index.html missing');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
if (!indexHtml.includes('<div id="root">')) throw new Error('Missing #root in dist/index.html');
console.log('✓ dist/index.html verified');

// 2. Check papers_catalog.json
const catalogPath = path.join(dataDir, 'papers_catalog.json');
if (!fs.existsSync(catalogPath)) throw new Error('papers_catalog.json missing');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
if (catalog.length !== 363) throw new Error(`Expected 363 papers, got ${catalog.length}`);
console.log(`✓ papers_catalog.json verified (${catalog.length} papers)`);

// 3. Check subjects.json
const subjectsPath = path.join(dataDir, 'subjects.json');
if (!fs.existsSync(subjectsPath)) throw new Error('subjects.json missing');
const subjects = JSON.parse(fs.readFileSync(subjectsPath, 'utf8'));
if (subjects.length !== 92) throw new Error(`Expected 92 subjects, got ${subjects.length}`);
console.log(`✓ subjects.json verified (${subjects.length} subjects)`);

// 4. Check stats.json
const statsPath = path.join(dataDir, 'stats.json');
if (!fs.existsSync(statsPath)) throw new Error('stats.json missing');
const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
if (stats.totalPapers !== 363 || stats.totalSubjects !== 92) {
  throw new Error('Stats values mismatch');
}
console.log(`✓ stats.json verified (Total Papers: ${stats.totalPapers}, Sub-Questions: ${stats.totalSubQuestions})`);

// 5. Verify all 363 paper files individually
const paperFiles = fs.readdirSync(papersDir);
if (paperFiles.length !== 363) throw new Error(`Expected 363 paper files, got ${paperFiles.length}`);

let totalQuestionsCount = 0;
let totalSubQuestionsCount = 0;

for (const file of paperFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(papersDir, file), 'utf8'));
  if (!content.id || !content.subject_name || !content.year) {
    throw new Error(`Corrupted metadata in ${file}`);
  }
  if (!Array.isArray(content.questions) || content.questions.length === 0) {
    throw new Error(`Invalid questions in ${file}`);
  }
  totalQuestionsCount += content.questions.length;
  for (const q of content.questions) {
    totalSubQuestionsCount += q.subQuestions.length;
  }
}
console.log(`✓ All 363 individual paper JSON files verified (Total Questions: ${totalQuestionsCount}, Sub-Questions: ${totalSubQuestionsCount})`);

// 6. Check asset bundles
const assetsDir = path.join(distDir, 'assets');
const assetFiles = fs.readdirSync(assetsDir);
const hasJs = assetFiles.some(f => f.endsWith('.js'));
const hasCss = assetFiles.some(f => f.endsWith('.css'));
if (!hasJs || !hasCss) throw new Error('Missing JS or CSS in dist/assets');
console.log(`✓ Assets bundle verified (${assetFiles.length} files in dist/assets)`);

console.log('\n=== ALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
