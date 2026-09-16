import { expect, test } from "@playwright/test";

test.describe("Public auth entry", () => {
  test("registers a new patient from the landing page without linking a clinical record", async ({ page }) => {
    const email = `patient.${Date.now()}@caregrid.demo`;

    await page.goto("/");
    await page.getByRole("link", { name: "Create Account" }).first().click();
    await expect(page).toHaveURL(/\/register$/);

    await page.getByLabel("Full Name").fill("New Patient");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("textbox", { name: "Password", exact: true }).fill("CareGrid123!");
    await page.getByLabel("Confirm Password").fill("CareGrid123!");
    await expect(page.getByRole("radio", { name: /^Patient/ })).toBeChecked();
    await expect(page.getByText("Doctor")).toHaveCount(0);
    await page.getByLabel(/agree to the demo/i).check();
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL(/\/my-care$/);
    await expect(
      page.getByText("Your account is not linked to a patient profile."),
    ).toBeVisible();
  });
});
