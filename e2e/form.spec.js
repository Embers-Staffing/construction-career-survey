import { test, expect } from '@playwright/test';

test.describe('Career Survey Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the form correctly', async ({ page }) => {
    await expect(page.locator('h2:has-text("Personal Profile")')).toBeVisible();
    await expect(page.locator('h2:has-text("Personality & Skills")')).toBeVisible();
    await expect(page.locator('h2:has-text("Skills & Experience")')).toBeVisible();
    await expect(page.locator('h2:has-text("Work Preferences")')).toBeVisible();
    await expect(page.locator('h2:has-text("Goals & Development")')).toBeVisible();
  });

  test('should toggle form mode correctly', async ({ page }) => {
    // Start in manual mode
    await expect(page.locator('#careerForm')).toBeVisible();
    
    // Switch to auto-fill mode
    await page.locator('#fillModeToggle').click();
    await expect(page.locator('.notification:has-text("Auto-fill")')).toBeVisible();
    
    // Switch back to manual mode
    await page.locator('#fillModeToggle').click();
    await expect(page.locator('.notification:has-text("Manual")')).toBeVisible();
  });

  test('should auto-fill form when toggled', async ({ page }) => {
    await page.locator('#fillModeToggle').click();
    
    // Wait for auto-fill to complete
    await page.waitForTimeout(1000);
    
    // Check auto-filled values in Personal Profile
    await expect(page.locator('#name')).toHaveValue();
    await expect(page.locator('#age')).toHaveValue();
    
    // Check Personality & Skills
    await expect(page.locator('#mbti')).toHaveValue();
    await expect(page.locator('.holland-code:checked')).toHaveCount(3);
    
    // Check Skills & Experience
    await expect(page.locator('#skills')).toHaveValue();
    
    // Check Work Preferences
    await expect(page.locator('#workStyle')).toHaveValue();
  });

  test('should validate form fields', async ({ page }) => {
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();
    
    // Check for validation errors (Bootstrap's invalid class)
    await expect(page.locator('#name:invalid')).toBeVisible();
    await expect(page.locator('#age:invalid')).toBeVisible();
    await expect(page.locator('#mbti:invalid')).toBeVisible();
    await expect(page.locator('#skills:invalid')).toBeVisible();
    await expect(page.locator('#workStyle:invalid')).toBeVisible();
  });

  test('should submit form and show recommendations', async ({ page }) => {
    // Fill out form manually
    await page.locator('#name').fill('Jane Doe');
    await page.selectOption('#age', '30-40');
    await page.locator('#mbti').fill('ENFP');
    await page.locator('.holland-code').first().check();
    await page.locator('#skills').fill('Leadership, Communication');
    await page.selectOption('#workStyle', 'management');
    await page.locator('#goals').fill('Lead construction projects');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Check for recommendations
    await expect(page.locator('#results')).toBeVisible();
    await expect(page.locator('.recommendation')).toBeVisible();
  });

  test('should preserve form data between mode switches', async ({ page }) => {
    // Fill form manually
    await page.locator('#name').fill('Jane Doe');
    await page.selectOption('#age', '30-40');
    await page.locator('#mbti').fill('ENFP');

    // Switch to auto-fill mode and back
    await page.locator('#fillModeToggle').click();
    await page.locator('#fillModeToggle').click();

    // Check if data is preserved
    await expect(page.locator('#name')).toHaveValue('Jane Doe');
    await expect(page.locator('#age')).toHaveValue('30-40');
    await expect(page.locator('#mbti')).toHaveValue('ENFP');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock failed API response
    await page.route('**/api/recommendations', route => route.abort());

    // Fill and submit form
    await page.locator('#fillModeToggle').click();
    await page.locator('button[type="submit"]').click();

    // Check for error message
    await expect(page.locator('.notification.error')).toBeVisible();
    await expect(page.locator('#results')).not.toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('#fillModeToggle')).toBeFocused();

    // Fill form with keyboard
    await page.keyboard.press('Space'); // Toggle auto-fill
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Submit form

    // Check if form was submitted
    await expect(page.locator('#results')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('#careerForm')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('#careerForm')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('#careerForm')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
  });
});
