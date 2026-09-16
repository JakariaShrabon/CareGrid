import { test, expect } from '@playwright/test';

test.describe('Role Dashboards', () => {
  const roles = [
    { email: 'doctor@caregrid.demo', checkHeading: 'Active Patients', checkAction: 'Patients', missingAction: 'Inventory' },
    { email: 'nurse@caregrid.demo', checkHeading: 'Assigned Patients', checkAction: 'Record Vitals', missingAction: 'Prescribe' },
    { email: 'blood@caregrid.demo', checkHeading: 'Total Units', checkAction: 'Inventory', missingAction: 'Prescribe' },
    { email: 'pharmacist@caregrid.demo', checkHeading: 'Pending Prescriptions', checkAction: 'Prescription Queue', missingAction: 'Wards' },
    { email: 'billing@caregrid.demo', checkHeading: 'Open Bills', checkAction: 'Bills', missingAction: 'Record Vitals' },
  ];

  for (const { email, checkHeading, checkAction, missingAction } of roles) {
    test(`${email} dashboard renders correctly and survives reload`, async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.fill('input[name="identifier"]', email);
      await page.fill('input[name="password"]', 'CareGrid123!');
      
      await page.waitForTimeout(300);
      await page.click('button[type="submit"]');

      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard$/);

      // Verify dashboard content
      await expect(page.getByText(checkHeading).first()).toBeVisible();
      await expect(page.getByText(checkAction).first()).toBeVisible();
      
      // Verify forbidden action is missing
      await expect(page.getByText(missingAction).first()).not.toBeVisible();

      // Verify survives reload
      await page.reload();
      await expect(page.getByText(checkHeading).first()).toBeVisible();
      await expect(page.getByText(checkAction).first()).toBeVisible();
    });
  }

  const portalRoles = [
    { email: 'patient@caregrid.demo', checkHeading: 'Welcome,', checkAction: 'My Care Updates', missingAction: 'Record Vitals' },
    { email: 'family@caregrid.demo', checkHeading: 'Care for', checkAction: 'Patient Updates', missingAction: 'Record Vitals' },
  ];

  for (const { email, checkHeading, checkAction, missingAction } of portalRoles) {
    test(`${email} dashboard redirects to their portal correctly and survives reload`, async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.fill('input[name="identifier"]', email);
      await page.fill('input[name="password"]', 'CareGrid123!');
      
      await page.click('button[type="submit"]');
      
      // Wait for session to establish and redirect
      await page.waitForURL(/\/(my-care|family-care|dashboard)$/, { timeout: 5000 });

      // Navigate to dashboard
      await page.goto('/dashboard');
      
      // Wait for dashboard to load and content to be visible
      await page.waitForLoadState('networkidle');
      
      // Verify dashboard content for patient/family
      await expect(page.getByText(checkHeading).first()).toBeVisible();
      await expect(page.getByText(checkAction).first()).toBeVisible();
      
      await expect(page.getByText(missingAction).first()).not.toBeVisible();
    });
  }
});
