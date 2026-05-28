const { test, expect } = require("@playwright/test");
const {
  installFixtures,
  TEST_LEVEL,
  TEST_MATHS_QUESTION,
  TEST_MATHS_ANSWER,
} = require("./helpers");

test.describe("maths happy path", () => {
  test.beforeEach(async ({ page }) => {
    await installFixtures(page);
    await page.goto("/");
  });

  test("answers a maths question correctly and reaches results", async ({ page }) => {
    await page.locator("#name-input").fill("Tester");
    await page.locator("#level-select").selectOption(TEST_LEVEL);
    await page.locator("#start-maths-btn").click();

    await expect(page.locator("#quiz")).toBeVisible();
    await expect(page.locator("#question-text")).toHaveText(TEST_MATHS_QUESTION);

    await page.locator("#answer-input").fill(TEST_MATHS_ANSWER);
    await page.locator("#answer-form button[type=submit]").click();

    await expect(page.locator("#feedback")).toContainText("Correct");
    await expect(page.locator("#results")).toBeVisible();
    await expect(page.locator("#score")).toContainText("1 of 1 correct");
  });
});
