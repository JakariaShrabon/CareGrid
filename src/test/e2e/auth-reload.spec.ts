import { test, expect } from "@playwright/test";

test.describe("Auth Session Hydration", () => {
  test("Survives full page reload", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(1000);
    await page.fill('input[name="identifier"]', "doctor@caregrid.demo");
    await page.fill('input[name="password"]', "CareGrid123!");
    await page.waitForTimeout(1000);
    await page.click('button[type="submit"]');
    
    // wait for dashboard
    await expect(page).not.toHaveURL(/\/login/);
    
    // go to prescription builder
    await page.getByRole('link', { name: 'Pharmacy' }).first().click();
    await page.getByRole('link', { name: 'Create Prescription' }).click();
    await expect(page.getByRole("heading", { name: "Digital Prescription" })).toBeVisible();
    
    // perform full reload
    await page.reload();
    
    // verify it stays on prescription builder and does not redirect to login
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Digital Prescription" })).toBeVisible();
    
    // ensure that the patient selection form is usable and no silent failure occurs
    // fill in basic info
    await page.selectOption('select[name="patientId"]', { index: 1 });
    await page.selectOption('select[name="items.0.medicineId"]', { index: 1 });
    await page.fill('input[name="items.0.dosage"]', "500mg");
    await page.fill('input[name="items.0.frequency"]', "BD");
    await page.fill('input[name="items.0.duration"]', "5 Days");
    
    // check safety
    await page.click('button:has-text("Review & Check Safety")');
    await expect(page.getByText("Safety Check: Cleared")).toBeVisible();
    
    // click finalize and sign. it should navigate to the list
    await page.click('button:has-text("Finalize & Sign")');
    
    // Check if it successfully submits and goes to queue
    await expect(page).toHaveURL(/\/pharmacy\/prescriptions$/);
  });
});
