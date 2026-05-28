const { test, expect } = require("@playwright/test");
const {
  installFixtures,
  TEST_LEVEL,
  TEST_WORD,
  HAPPY_POSITIONS,
  UNHAPPY_POSITIONS,
} = require("./helpers");

// The mascot picks a random frame from a pool, so each run could land on any
// frame in the set. We assert membership of the inline backgroundPosition
// against the precomputed pool of valid positions.

async function startSpelling(page) {
  await installFixtures(page);
  await page.goto("/");
  await page.locator("#name-input").fill("Tester");
  await page.locator("#level-select").selectOption(TEST_LEVEL);
  await page.locator("#start-spelling-btn").click();
  await expect(page.locator("#quiz")).toBeVisible();
}

async function quizMascotPosition(page) {
  return page.locator("#quiz-mascot").evaluate((n) => n.style.backgroundPosition);
}

test.describe("mascot frame selection", () => {
  test("initial quiz mascot is frame 0", async ({ page }) => {
    await startSpelling(page);
    expect(await quizMascotPosition(page)).toBe("0% 0%");
  });

  test("correct answer picks a happy frame (0-11, 15-17)", async ({ page }) => {
    await startSpelling(page);

    await page.locator("#answer-input").fill(TEST_WORD);
    await page.locator("#answer-form button[type=submit]").click();

    // Read the mascot position before the 900ms auto-advance fires.
    await expect(page.locator("#feedback")).toContainText("Correct");
    const pos = await quizMascotPosition(page);
    expect(HAPPY_POSITIONS.has(pos)).toBe(true);
  });

  test("wrong answer picks an unhappy frame (12-14)", async ({ page }) => {
    await startSpelling(page);

    await page.locator("#answer-input").fill("wrong");
    await page.locator("#answer-form button[type=submit]").click();

    await expect(page.locator("#next-btn")).toBeVisible();
    const pos = await quizMascotPosition(page);
    expect(UNHAPPY_POSITIONS.has(pos)).toBe(true);
  });
});
