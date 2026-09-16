import { test, expect } from "@playwright/test";

test.describe("Pharmacy Cross-Role Workflow", () => {
  test("Doctor creates a new prescription and Pharmacist dispenses it", async ({ page }) => {
    // 1. Doctor Logs In
    await page.goto("/login");
    await page.fill('input[name="identifier"]', "doctor@caregrid.demo");
    await page.fill('input[name="password"]', "CareGrid123!");
    await page.waitForTimeout(1000); // Wait for MSW to initialize
    await page.click('button[type="submit"]');

    // Verify successful login
    await expect(page).not.toHaveURL(/\/login/);

    // 2. Navigate to New Prescription Page
    await page.getByRole('link', { name: 'Pharmacy' }).first().click();
    await page.getByRole('link', { name: 'Create Prescription' }).click();
    await expect(page.getByRole("heading", { name: "Digital Prescription" })).toBeVisible();

    // 3. Fill Prescription Form
    // Select Patient (Emma Thompson - pat_001)
    await page.selectOption('select[name="patientId"]', { index: 1 });

    // Select Medication
    await page.selectOption('select[name="items.0.medicineId"]', { index: 1 });
    await page.fill('input[name="items.0.dosage"]', "500mg");
    await page.fill('input[name="items.0.frequency"]', "TID");
    await page.fill('input[name="items.0.duration"]', "5 days");
    await page.fill('input[name="items.0.instructions"]', "After meals");

    // 4. Pre-Submit Safety Check
    await page.click('button:has-text("Review & Check Safety")');

    // Verify Safety Check passed (Wait for mock API response)
    await expect(page.getByText("Safety Check: Cleared")).toBeVisible();

    // 5. Finalize Submission
    await page.click('button:has-text("Finalize & Sign")');

    // Expect redirect to prescriptions queue
    await expect(page).toHaveURL(/\/pharmacy\/prescriptions$/);
    
    // The newly created prescription should be at the top of the queue.
    await expect(page.getByText("Pending", { exact: true }).first()).toBeVisible();
    
    // Navigate to the newly created prescription's details
    const viewDetailsLink = page.getByText("View Details").first();
    const href = await viewDetailsLink.getAttribute("href");
    const prescriptionId = href?.split("/").pop() || "";
    expect(prescriptionId).toBeTruthy();

    await viewDetailsLink.click();
    await expect(page).toHaveURL(new RegExp(`/pharmacy/prescriptions/${prescriptionId}`));

    // Verify Prescription Details
    await expect(page.getByText("Pending", { exact: true }).first()).toBeVisible();

    // 6. Doctor Logs Out
    await page.click('button[aria-label="Logout"]');

    // Wait for redirect to login
    await expect(page).toHaveURL(/\/login/);

    // 7. Pharmacist Logs In
    await page.fill('input[name="identifier"]', "pharmacist@caregrid.demo");
    await page.fill('input[name="password"]', "CareGrid123!");
    await page.waitForTimeout(1000); // Wait for MSW to initialize
    await page.click('button[type="submit"]');

    // Verify successful login
    await expect(page).not.toHaveURL(/\/login/);

    await page.getByRole('link', { name: 'Pharmacy' }).first().click();
    await page.getByRole('link', { name: 'Prescription Queue' }).click();
    await page.getByText("View Details").first().click();

    // Verify Prescription is in Pending state
    await expect(page.getByText("Pending", { exact: true }).first()).toBeVisible();

    // 9. Dispense Prescription
    await page.click('button:has-text("Dispense Medication")');

    await page.click('button:has-text("Confirm Dispense")');

    // 10. Verify Dispense Success
    await expect(page.getByText("Dispensed").first()).toBeVisible();

    // Verify Dispensed By
    await expect(page.getByText("Priya Patel").first()).toBeVisible();
  });
});
