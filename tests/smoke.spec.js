const { test, expect } = require("@playwright/test");

test.describe("home screen smoke", () => {
  test("loads with both mascots and both subject buttons", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".home-mascot-anim[data-mascot='Monty']")).toBeVisible();
    await expect(page.locator(".home-mascot-anim[data-mascot='NinjaBunny']")).toBeVisible();

    await expect(page.locator("#start-spelling-btn")).toBeVisible();
    await expect(page.locator("#start-maths-btn")).toBeVisible();
    await expect(page.locator("#name-input")).toBeVisible();
    await expect(page.locator("#level-select")).toBeVisible();
  });

  test("home mascots show frame 0 (no animation)", async ({ page }) => {
    await page.goto("/");

    for (const mascot of ["Monty", "NinjaBunny"]) {
      const el = page.locator(`.home-mascot-anim[data-mascot='${mascot}']`);
      const bg = await el.evaluate((n) => n.style.backgroundPosition);
      expect(bg).toBe("0% 0%");
    }
  });
});
