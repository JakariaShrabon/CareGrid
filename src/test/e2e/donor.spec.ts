import { test, expect } from "@playwright/test";

test.describe("Public Living Donor Flow", () => {
  test("Can complete unauthenticated registration and receive reference", async ({ page }) => {
    // Navigate to public donor landing
    await page.goto("/donor");
    await expect(page.getByRole('heading', { name: 'Living Donor Registration' })).toBeVisible();

    // Start registration
    await page.click('text=Start Registration');
    await expect(page.getByRole('heading', { name: 'Registration Details' })).toBeVisible();

    // Fill form
    await page.selectOption('select#organInterest', 'KIDNEY');
    await page.click('button:has-text("Continue to Screening")');
    
    await expect(page).toHaveURL(/.*\/donor\/screening.*/);
    await expect(page.getByRole('heading', { name: 'Eligibility Screening' })).toBeVisible();
    await page.check('input[name="consentSubmit"]');
    await page.check('input[name="confirmAccuracy"]');
    await page.check('input[name="willingToContact"]');

    await page.waitForTimeout(300); // Wait for React Hook Form to register changes

    // Submit
    await page.click('button[type="submit"]');

    // Success page
    await expect(page).toHaveURL(/\/donor\/success\?ref=LD-.+/);
    await expect(page.getByRole('heading', { name: 'Registration Received' })).toBeVisible();
    await expect(page.getByText(/LD-/)).toBeVisible();
  });
});
