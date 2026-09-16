import { test, expect } from "@playwright/test";

test.describe("Billing Cross-Role Workflow", () => {
  test("Billing Officer reviews bills, claims, and discharges", async ({ page }) => {
    // 1. Billing Officer Logs In
    await page.goto("/login");
    await page.fill('input[name="identifier"]', "billing@caregrid.demo");
    await page.fill('input[name="password"]', "CareGrid123!");
    await page.waitForTimeout(1000); // Wait for MSW to initialize
    await page.click('button[type="submit"]');

    // Verify successful login
    await expect(page).toHaveURL(/\/dashboard/);

    // 2. Navigate to Billing Overview
    await page.getByRole('link', { name: 'Billing' }).first().click();
    await expect(page.getByRole("heading", { name: "Billing Overview" })).toBeVisible();

    // 3. View Patient Bills
    await page.goto("/billing/bills");
    await expect(page.getByRole("heading", { name: "Patient Bills", level: 1 })).toBeVisible();
    await expect(page.getByRole("row").nth(1)).toBeVisible();
    
    // 4. View Bill Detail
    await page.getByRole("link", { name: /View/i }).first().click();
    await expect(page.getByRole("heading", { name: /Invoice/i })).toBeVisible();
    await expect(page.getByText("Subtotal")).toBeVisible();
    await expect(page.getByText("Patient Payable")).toBeVisible();

    // 5. Navigate to Insurance Claims
    await page.goto("/billing/claims");
    await expect(page.getByRole("heading", { name: "Insurance Claims", level: 1 })).toBeVisible();
    await expect(page.getByRole("row").nth(1)).toBeVisible();

    // 6. View Claim Detail
    await page.getByRole("link", { name: /View/i }).first().click();
    await expect(page.getByRole("heading", { name: /Claim:/i })).toBeVisible();
    
    // 7. Navigate to Discharge
    await page.goto("/billing/discharge");
    await expect(page.getByRole("heading", { name: "Discharges", level: 1 })).toBeVisible();

    // 8. View Discharge Summary
    await page.getByRole("link", { name: /View Summary/i }).first().click();
    await expect(page.getByRole("heading", { name: "Discharge Summary", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Stay Information" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Lab Results" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Post-Discharge Medication" })).toBeVisible();

    // 9. Verify PDF Download Button
    await expect(page.getByRole("button", { name: /Download PDF/i })).toBeVisible();
  });
});
