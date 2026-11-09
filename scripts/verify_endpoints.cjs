const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    }).on('error', reject);
  });
}

async function verifyDevServer() {
  console.log('--- Verifying Local Dev Server & Data Endpoints ---');

  // Test 1: Home HTML
  const home = await fetchUrl('http://127.0.0.1:5173/');
  console.log(`[1] Home Page HTTP Status: ${home.statusCode} (Length: ${home.data.length} bytes)`);
  if (home.statusCode !== 200 || !home.data.includes('id="root"')) {
    throw new Error('Home page failed to return valid HTML');
  }

  // Test 2: Papers Catalog JSON
  const catalogRes = await fetchUrl('http://127.0.0.1:5173/data/papers_catalog.json');
  console.log(`[2] Papers Catalog HTTP Status: ${catalogRes.statusCode}`);
  const catalog = JSON.parse(catalogRes.data);
  console.log(`    Total Papers in Catalog: ${catalog.length}`);
  if (catalog.length !== 363) {
    throw new Error(`Expected 363 papers in catalog, got ${catalog.length}`);
  }

  // Test 3: Subjects JSON
  const subjectsRes = await fetchUrl('http://127.0.0.1:5173/data/subjects.json');
  const subjects = JSON.parse(subjectsRes.data);
  console.log(`[3] Subjects HTTP Status: ${subjectsRes.statusCode}, Total Subjects: ${subjects.length}`);
  if (subjects.length !== 92) {
    throw new Error(`Expected 92 subjects, got ${subjects.length}`);
  }

  // Test 4: Stats JSON
  const statsRes = await fetchUrl('http://127.0.0.1:5173/data/stats.json');
  const stats = JSON.parse(statsRes.data);
  console.log(`[4] Stats: ${stats.totalPapers} papers, ${stats.totalQuestions} questions, ${stats.totalSubjects} subjects, ${stats.yearSpan}`);

  // Test 5: Verify random 5 papers load valid JSON
  const samplePapers = [catalog[0], catalog[10], catalog[50], catalog[150], catalog[300]];
  for (const p of samplePapers) {
    const res = await fetchUrl(`http://127.0.0.1:5173/data/papers/${p.id}.json`);
    if (res.statusCode !== 200) {
      throw new Error(`Failed to fetch paper JSON for ${p.id}: status ${res.statusCode}`);
    }
    const paper = JSON.parse(res.data);
    console.log(`[5] Sample Paper "${paper.subject_name}" (${paper.year}, Sem ${paper.semester}): ${paper.questions.length} question blocks`);
  }

  console.log('\n>>> ALL LOCAL SERVER ENDPOINTS PASSED WITH 100% SUCCESS! <<<');
}

verifyDevServer().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
