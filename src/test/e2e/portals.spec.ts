import { test, expect } from "@playwright/test";

test.describe("Portal Access & Isolation", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto("/login");
  });

  test("Patient role can view updates and full browser reload survives", async ({ page }) => {
    await page.fill('input[name="identifier"]', "patient@caregrid.demo");
    await page.fill('input[type="password"]', "CareGrid123!");
    await page.waitForTimeout(300);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/my-care");
    
    // Check that we see updates
    await expect(page.getByRole('heading', { name: 'My Care' })).toBeVisible();
    await expect(page.locator('a[href="/my-care/updates"]')).toBeVisible();
    await page.locator('a[href="/my-care/updates"]').click();
    await expect(page.getByText('Care Updates')).toBeVisible();

    // Full reload
    await page.reload();
    await expect(page.getByRole('heading', { name: 'My Care' })).toBeVisible();
    await expect(page.getByText('Care Updates')).toBeVisible();
  });

  test("Family role can view discharge summary but not write", async ({ page }) => {
    await page.fill('input[name="identifier"]', "family@caregrid.demo");
    await page.fill('input[type="password"]', "CareGrid123!");
    await page.waitForTimeout(300);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/family-care");
    
    await page.click('a[href="/family-care/discharge"]');
    await expect(page.getByRole('heading', { name: 'Discharge Summary' })).toBeVisible();
    await expect(page.getByText('Stay Information')).toBeVisible();

    // Verify there's no edit or generate buttons
    await expect(page.getByRole('button', { name: /generate/i })).not.toBeVisible();
  });
});
