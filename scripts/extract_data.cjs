const fs = require('fs');
const path = require('path');

const refDir = path.resolve(__dirname, '../../ref_beu_pyqs');
const outDir = path.resolve(__dirname, '../public/data');
const papersOutDir = path.join(outDir, 'papers');

// Ensure output directories exist
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(papersOutDir)) fs.mkdirSync(papersOutDir, { recursive: true });

const papersIndex = JSON.parse(fs.readFileSync(path.join(refDir, 'papers_index.json'), 'utf8'));
const html = fs.readFileSync(path.join(refDir, 'index.html'), 'utf8');

const parts = html.split('<section class="info-card paper-section');
console.log(`Extracting data from ${parts.length - 1} sections...`);

function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

function parsePaper(sectionHtml, indexItem) {
  // Extract instructions
  const instMatch = sectionHtml.match(/<div class="paper-instructions">([\s\S]*?)<\/div>/);
  const instructions = [];
  if (instMatch) {
    const liMatches = instMatch[1].match(/<li>([\s\S]*?)<\/li>/g) || [];
    liMatches.forEach(li => {
      instructions.push(cleanText(li.replace(/<\/?li>/g, '')));
    });
  }

  // Extract Question Blocks
  const qBlocks = sectionHtml.split('<div class="question-block">');
  const questions = [];
  let paperMaxFreq = 1;
  let paperHasMcq = false;

  for (let qIdx = 1; qIdx < qBlocks.length; qIdx++) {
    const qBlockHtml = qBlocks[qIdx].split('</section>')[0];
    
    // Question title & marks
    const titleMatch = qBlockHtml.match(/<div class="question-title"><span>([\s\S]*?)<\/span>(?:<span class="marks">([\s\S]*?)<\/span>)?<\/div>/);
    const qTitle = titleMatch ? cleanText(titleMatch[1]) : '';
    const qMarks = titleMatch && titleMatch[2] ? cleanText(titleMatch[2]) : '';

    // Sub-questions
    const subQuestions = [];
    const subPieces = qBlockHtml.split(/<li class="sub-question"([^>]*)>/);
    
    for (let sIdx = 1; sIdx < subPieces.length; sIdx += 2) {
      const attrs = subPieces[sIdx];
      let content = subPieces[sIdx + 1];
      // strip trailing </li> and outer </ol>
      content = content.replace(/<\/li>\s*(?:<\/ol>)?\s*$/, '');

      const freqMatch = attrs.match(/data-freq="(\d+)"/);
      const freq = freqMatch ? parseInt(freqMatch[1], 10) : 1;
      if (freq > paperMaxFreq) paperMaxFreq = freq;

      const starsMatch = attrs.match(/data-stars="([^"]+)"/);
      const stars = starsMatch ? starsMatch[1] : '';

      const pMatch = content.match(/<p>([\s\S]*?)<\/p>/);
      const text = pMatch ? cleanText(pMatch[1]) : '';

      const optMatch = content.match(/<ol class="options-list">([\s\S]*?)<\/ol>/);
      const options = [];
      if (optMatch) {
        paperHasMcq = true;
        const liMatches = optMatch[1].match(/<li>([\s\S]*?)<\/li>/g) || [];
        liMatches.forEach(li => options.push(cleanText(li.replace(/<\/?li>/g, ''))));
      }

      // Check images
      const imgMatches = content.match(/src="([^"]+)"/g) || [];
      const images = imgMatches.map(m => m.replace(/src="|"/g, ''));

      subQuestions.push({
        id: `${indexItem.id}_q${qIdx}_s${(sIdx + 1) / 2}`,
        subNumber: String.fromCharCode(96 + (sIdx + 1) / 2),
        text,
        freq,
        stars,
        options: options.length > 0 ? options : undefined,
        images: images.length > 0 ? images : undefined
      });
    }

    questions.push({
      id: `${indexItem.id}_q${qIdx}`,
      number: qIdx,
      title: qTitle,
      marks: qMarks,
      subQuestions
    });
  }

  // Header metadata
  const timeMatch = sectionHtml.match(/Time:\s*([^<]+)/i);
  const fullMarksMatch = sectionHtml.match(/Full Marks:\s*(\d+)/i);
  const examCodeMatch = sectionHtml.match(/Code:\s*([A-Za-z0-9_\-\/\s]+?)(?:<\/span>|Full Marks|<)/i);

  const code = examCodeMatch ? cleanText(examCodeMatch[1]) : indexItem.exam_code;

  return {
    id: indexItem.id,
    semester: indexItem.semester,
    subject_code: indexItem.subject_code,
    subject_name: indexItem.subject_name,
    year: indexItem.year,
    exam_code: code,
    full_marks: fullMarksMatch ? fullMarksMatch[1] : '70',
    duration: timeMatch ? cleanText(timeMatch[1]) : '03 Hours',
    title: indexItem.title,
    question_count: questions.length,
    total_subquestions: questions.reduce((acc, q) => acc + q.subQuestions.length, 0),
    max_freq: paperMaxFreq,
    has_mcq: paperHasMcq,
    instructions,
    questions
  };
}

const allPapers = [];
const catalog = [];
const subjectMap = {};
const semesterStats = { 1: 0, 2: 0, 3: 0, 4: 0 };
const yearStats = {};
let totalSubQuestionsCount = 0;
let totalQuestionsCount = 0;

for (let i = 1; i < parts.length; i++) {
  const paper = parsePaper(parts[i], papersIndex[i - 1]);
  allPapers.push(paper);

  // Write individual paper file
  fs.writeFileSync(path.join(papersOutDir, `${paper.id}.json`), JSON.stringify(paper, null, 2));

  // Add to catalog
  catalog.push({
    id: paper.id,
    semester: paper.semester,
    subject_code: paper.subject_code,
    subject_name: paper.subject_name,
    year: paper.year,
    exam_code: paper.exam_code,
    duration: paper.duration,
    full_marks: paper.full_marks,
    question_count: paper.question_count,
    total_subquestions: paper.total_subquestions,
    max_freq: paper.max_freq,
    has_mcq: paper.has_mcq,
    title: paper.title
  });

  // Aggregates
  semesterStats[paper.semester] = (semesterStats[paper.semester] || 0) + 1;
  yearStats[paper.year] = (yearStats[paper.year] || 0) + 1;
  totalSubQuestionsCount += paper.total_subquestions;
  totalQuestionsCount += paper.question_count;

  if (!subjectMap[paper.subject_code]) {
    subjectMap[paper.subject_code] = {
      code: paper.subject_code,
      name: paper.subject_name,
      semesters: new Set(),
      years: new Set(),
      paperCount: 0,
      totalSubquestions: 0,
      maxFreq: 1
    };
  }
  const s = subjectMap[paper.subject_code];
  s.semesters.add(paper.semester);
  s.years.add(paper.year);
  s.paperCount++;
  s.totalSubquestions += paper.total_subquestions;
  if (paper.max_freq > s.maxFreq) s.maxFreq = paper.max_freq;
}

// Format subjects list
const subjects = Object.values(subjectMap).map(s => ({
  code: s.code,
  name: s.name,
  semesters: Array.from(s.semesters).sort((a, b) => a - b),
  years: Array.from(s.years).sort(),
  paperCount: s.paperCount,
  totalSubquestions: s.totalSubquestions,
  maxFreq: s.maxFreq
})).sort((a, b) => a.name.localeCompare(b.name));

const stats = {
  totalPapers: allPapers.length,
  totalSubjects: subjects.length,
  totalSemesters: Object.keys(semesterStats).length,
  totalSubQuestions: totalSubQuestionsCount,
  totalQuestions: totalQuestionsCount,
  semesterDistribution: semesterStats,
  yearDistribution: yearStats,
  topSubjects: [...subjects].sort((a, b) => b.paperCount - a.paperCount).slice(0, 10)
};

// Write catalog, subjects, and stats
fs.writeFileSync(path.join(outDir, 'papers_catalog.json'), JSON.stringify(catalog, null, 2));
fs.writeFileSync(path.join(outDir, 'subjects.json'), JSON.stringify(subjects, null, 2));
fs.writeFileSync(path.join(outDir, 'stats.json'), JSON.stringify(stats, null, 2));

console.log('--- Extraction Complete ---');
console.log(`Saved ${allPapers.length} paper JSON files to public/data/papers/`);
console.log(`Saved papers_catalog.json (${catalog.length} items)`);
console.log(`Saved subjects.json (${subjects.length} subjects)`);
console.log(`Saved stats.json`);
console.log('Stats:', stats);
