const { test, expect } = require("@playwright/test");
const { installFixtures, TEST_LEVEL, TEST_WORD } = require("./helpers");

test.describe("spelling happy path", () => {
  test.beforeEach(async ({ page }) => {
    await installFixtures(page);
    await page.goto("/");
  });

  test("answers a word correctly and reaches results", async ({ page }) => {
    await page.locator("#name-input").fill("Tester");
    await page.locator("#level-select").selectOption(TEST_LEVEL);
    await page.locator("#start-spelling-btn").click();

    await expect(page.locator("#quiz")).toBeVisible();
    await expect(page.locator("#answer-input")).toBeFocused();

    await page.locator("#answer-input").fill(TEST_WORD);
    await page.locator("#answer-form button[type=submit]").click();

    await expect(page.locator("#feedback")).toContainText("Correct");

    // With a single-word fixture, the quiz auto-advances to the results screen.
    await expect(page.locator("#results")).toBeVisible();
    await expect(page.locator("#score")).toContainText("1 of 1 correct");
  });

  test("wrong answer reveals the right one and shows Next", async ({ page }) => {
    await page.locator("#name-input").fill("Tester");
    await page.locator("#level-select").selectOption(TEST_LEVEL);
    await page.locator("#start-spelling-btn").click();

    await page.locator("#answer-input").fill("wrong");
    await page.locator("#answer-form button[type=submit]").click();

    await expect(page.locator("#feedback")).toContainText(TEST_WORD);
    await expect(page.locator("#next-btn")).toBeVisible();
    await expect(page.locator("#answer-form")).toBeHidden();
  });
});
