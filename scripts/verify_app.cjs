const fs = require('fs');
const path = require('path');

console.log('=== Running Production & Dataset Integrity Verification ===\n');

// Detect whether dist or public directory should be verified
const distDir = path.resolve(__dirname, '../dist');
const publicDir = path.resolve(__dirname, '../public');
const targetDir = fs.existsSync(distDir) && fs.existsSync(path.join(distDir, 'data'))
  ? distDir
  : publicDir;

const isDist = targetDir === distDir;
console.log(`Target Directory: ${targetDir} (${isDist ? 'Production Build' : 'Source Public Assets'})`);

const dataDir = path.join(targetDir, 'data');
const papersDir = path.join(dataDir, 'papers');

// 1. Verify index.html (if testing dist)
if (isDist) {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error('dist/index.html is missing');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  if (!indexHtml.includes('<div id="root">')) throw new Error('Missing #root in dist/index.html');
  console.log('✓ dist/index.html verified');
}

// 2. Verify papers_catalog.json dynamically
const catalogPath = path.join(dataDir, 'papers_catalog.json');
if (!fs.existsSync(catalogPath)) throw new Error('papers_catalog.json is missing');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
if (!Array.isArray(catalog) || catalog.length === 0) {
  throw new Error(`Catalog is empty or invalid array (found ${catalog?.length})`);
}
console.log(`✓ papers_catalog.json verified (${catalog.length} papers in catalogue)`);

// Check unique IDs in catalog
const catalogIds = new Set();
for (const p of catalog) {
  if (!p.id || typeof p.id !== 'string') throw new Error(`Missing or invalid id in catalog entry: ${JSON.stringify(p)}`);
  if (catalogIds.has(p.id)) throw new Error(`Duplicate paper ID in catalog: ${p.id}`);
  catalogIds.add(p.id);
}
console.log(`✓ All ${catalogIds.size} catalog entries have unique IDs`);

// 3. Verify subjects.json dynamically
const subjectsPath = path.join(dataDir, 'subjects.json');
if (!fs.existsSync(subjectsPath)) throw new Error('subjects.json is missing');
const subjects = JSON.parse(fs.readFileSync(subjectsPath, 'utf8'));
if (!Array.isArray(subjects) || subjects.length === 0) {
  throw new Error(`subjects.json is empty or invalid`);
}
const subjectCodes = new Set(subjects.map(s => s.code));
console.log(`✓ subjects.json verified (${subjects.length} unique subject codes)`);

// 4. Verify stats.json dynamically matches catalog
const statsPath = path.join(dataDir, 'stats.json');
if (!fs.existsSync(statsPath)) throw new Error('stats.json is missing');
const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

// Handle both total_papers (snake_case) and totalPapers (camelCase)
const recordedPaperCount = stats.total_papers ?? stats.totalPapers;
if (recordedPaperCount !== catalog.length) {
  throw new Error(`Stats mismatch: stats says ${recordedPaperCount} papers, but catalogue contains ${catalog.length}`);
}
console.log(`✓ stats.json verified (Papers: ${recordedPaperCount}, Subject Count: ${stats.total_subjects ?? stats.totalSubjects})`);

// 5. Verify individual paper JSON files
if (!fs.existsSync(papersDir)) throw new Error(`papers directory missing at ${papersDir}`);
const paperFiles = fs.readdirSync(papersDir).filter(f => f.endsWith('.json'));

if (paperFiles.length !== catalog.length) {
  throw new Error(`Mismatch between catalog length (${catalog.length}) and files in papers directory (${paperFiles.length})`);
}

let totalQuestionsCount = 0;
let totalSubQuestionsCount = 0;
let totalMcqCount = 0;
let totalDiagramCount = 0;

for (const file of paperFiles) {
  const paperIdFromFile = file.replace(/\.json$/, '');
  if (!catalogIds.has(paperIdFromFile)) {
    throw new Error(`Orphaned paper file found: ${file} does not exist in papers_catalog.json`);
  }

  const content = JSON.parse(fs.readFileSync(path.join(papersDir, file), 'utf8'));
  if (!content.id || !content.subject_name || !content.year) {
    throw new Error(`Corrupted metadata in ${file}`);
  }
  if (!Array.isArray(content.questions) || content.questions.length === 0) {
    throw new Error(`Invalid questions array in ${file}`);
  }

  totalQuestionsCount += content.questions.length;
  for (const q of content.questions) {
    if (typeof q.number !== 'number') {
      throw new Error(`Question missing number in ${file}`);
    }
    if (!Array.isArray(q.subQuestions)) {
      throw new Error(`Question ${q.number} in ${file} has invalid subQuestions`);
    }

    for (const sub of q.subQuestions) {
      totalSubQuestionsCount++;
      if (!sub.id || typeof sub.text !== 'string') {
        throw new Error(`SubQuestion in ${file} missing id or text: ${JSON.stringify(sub)}`);
      }
      if (sub.options && Array.isArray(sub.options)) {
        totalMcqCount++;
        if (sub.options.length < 2) {
          throw new Error(`MCQ ${sub.id} in ${file} has fewer than 2 options`);
        }
      }
      if (sub.images && Array.isArray(sub.images) && sub.images.length > 0) {
        totalDiagramCount += sub.images.length;
        for (const img of sub.images) {
          if (!/^img\/[a-zA-Z0-9_/.-]+$/i.test(img)) {
            throw new Error(`Suspicious diagram image path in ${file}: ${img}`);
          }
        }
      }
    }
  }
}

console.log(`✓ All ${paperFiles.length} paper JSON files verified:`);
console.log(`  - Total Questions: ${totalQuestionsCount}`);
console.log(`  - Total Sub-Questions: ${totalSubQuestionsCount}`);
console.log(`  - Total MCQs: ${totalMcqCount}`);
console.log(`  - Total Diagram References: ${totalDiagramCount}`);

// 6. Check asset bundles if verifying production build
if (isDist) {
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const assetFiles = fs.readdirSync(assetsDir);
    const hasJs = assetFiles.some(f => f.endsWith('.js'));
    const hasCss = assetFiles.some(f => f.endsWith('.css'));
    if (!hasJs || !hasCss) throw new Error('Missing JS or CSS in dist/assets');
    console.log(`✓ Assets bundle verified (${assetFiles.length} files in dist/assets)`);
  }
}

console.log('\n=== ALL ACADEMIC & DATASET VERIFICATION CHECKS PASSED ===');
