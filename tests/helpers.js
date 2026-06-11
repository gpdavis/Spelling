// Shared test helpers: deterministic word/maths fixtures + mascot frame math.
// We replace words.js and maths.js at request time so tests know the exact
// answers without depending on the random production lists.

const TEST_LEVEL = "Year 1";
const TEST_WORD = "cat";
const TEST_MATHS_QUESTION = "2 + 3 = ?";
const TEST_MATHS_ANSWER = "5";

const TEST_WORDS_JS = `
window.WORD_LISTS = {
  "${TEST_LEVEL}": {
    "Test pattern": [
      { word: "${TEST_WORD}", sentence: "The test ${TEST_WORD}." }
    ]
  }
};
`;

const TEST_MATHS_JS = `
window.MATHS_GENERATORS = {};
window.MATHS_LISTS = {
  "${TEST_LEVEL}": {
    "Test sums": [
      { question: "${TEST_MATHS_QUESTION}", answer: "${TEST_MATHS_ANSWER}" }
    ]
  }
};
`;

async function installFixtures(page) {
  await page.route("**/words.js", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: TEST_WORDS_JS })
  );
  await page.route("**/maths.js", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: TEST_MATHS_JS })
  );
  // Streaks read the Form's linked Sheet as CSV. Stub it with just a header row
  // so tests stay offline and deterministic (no real streak history).
  await page.route("**/gviz/tq*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/csv",
      body: '"Timestamp","Name","Level","Score","Total","Percent","Missed words"\n',
    })
  );
  // Swallow the results POST so test runs don't inject rows into the real Sheet.
  await page.route("**/formResponse*", (route) =>
    route.fulfill({ status: 200, contentType: "text/plain", body: "" })
  );
}

// Mirrors app.js: 6x3 grid, frames 12-14 are unhappy, the rest are happy.
const HAPPY_FRAMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 16, 17];
const UNHAPPY_FRAMES = [12, 13, 14];

function framePosition(frame) {
  const col = frame % 6;
  const row = Math.floor(frame / 6);
  return `${(col / 5) * 100}% ${(row / 2) * 100}%`;
}

const HAPPY_POSITIONS = new Set(HAPPY_FRAMES.map(framePosition));
const UNHAPPY_POSITIONS = new Set(UNHAPPY_FRAMES.map(framePosition));

module.exports = {
  TEST_LEVEL,
  TEST_WORD,
  TEST_MATHS_QUESTION,
  TEST_MATHS_ANSWER,
  installFixtures,
  HAPPY_POSITIONS,
  UNHAPPY_POSITIONS,
};
