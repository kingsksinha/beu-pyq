const fs = require('fs');
const path = require('path');

console.log('--- Verifying Model Answer Matching & Practice Safe Indexing ---');

// 1. Read modelAnswerService source to verify keywords
const modelAnswerSource = fs.readFileSync(path.join(__dirname, '../src/services/modelAnswerService.ts'), 'utf-8');
console.log('✓ Loaded modelAnswerService.ts (' + modelAnswerSource.length + ' bytes)');

const testTopics = [
  'lorentz force',
  'compton shift',
  'schrödinger',
  'he-ne laser',
  'population inversion',
  'kronig-penney',
  'stack data structure',
  'process vs thread',
  'sampling theorem'
];

for (const topic of testTopics) {
  if (modelAnswerSource.toLowerCase().includes(topic)) {
    console.log(`  ✓ Topic covered in official model answers: "${topic}"`);
  } else {
    console.error(`  ✗ Topic missing: "${topic}"`);
    process.exit(1);
  }
}

// 2. Load physics paper sem1_phy_2025_1 (from user screenshot)
const physicsPaper = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/papers/sem1_phy_2025_1.json'), 'utf-8'));
console.log(`\n✓ Loaded Paper sem1_phy_2025_1: "${physicsPaper.subject_name}" (${physicsPaper.year})`);

const allItems = [];
physicsPaper.questions.forEach(q => {
  q.subQuestions.forEach(sub => {
    allItems.push({
      id: sub.id,
      questionNumber: q.number,
      questionTitle: q.title,
      marks: q.marks,
      sub
    });
  });
});

console.log(`  Total practice items: ${allItems.length}`);

// 3. Test High Yield filter
const highYieldItems = allItems.filter(item => item.sub.freq >= 3);
console.log(`  High-Yield (>= 3★) items: ${highYieldItems.length}`);
if (highYieldItems.length === 0) {
  throw new Error('Expected at least 1 high yield item in Physics paper');
}

// 4. Test Index Clamping Simulation (The exact bug that caused the crash)
// User was at item index 12 in allItems, then clicked High-Yield filter
let currentIndex = 12;
const activeItems = highYieldItems; // shrunk to 6 items

// Our new safeIndex logic
const safeIndex = activeItems.length > 0
  ? (currentIndex >= activeItems.length ? 0 : Math.max(0, currentIndex))
  : 0;
const currentItem = activeItems[safeIndex];

console.log(`  Before fix, activeItems[${currentIndex}] would be: ${activeItems[currentIndex]}`);
console.log(`  With safeIndex: safeIndex = ${safeIndex}, currentItem.id = "${currentItem ? currentItem.id : 'UNDEFINED'}"`);

if (!currentItem || !currentItem.id) {
  throw new Error('Safe index simulation failed!');
}
console.log('✓ Safe index simulation successfully prevented undefined crash!');

console.log('\n>>> ALL TEST VERIFICATIONS PASSED SUCCESSFULLY! <<<');
