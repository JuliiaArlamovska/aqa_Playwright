import { test, expect } from '@playwright/test';


  test.describe('Registration Modal Tests', () => {

  // Цей блок виконується перед КОЖНИМ тестом
  test.beforeEach(async ({ page }) => {
    // 1. Переходимо на сайт
    await page.goto('/'); 

    // 2. Відкриваємо модалку (тепер це робиться один раз для всіх тестів нижче)
    await page.getByRole('button', { name: 'Sign up' }).click();

    // 3. Чекаємо, поки модалка з'явиться, щоб бути впевненими, що поля готові
    await expect(page.locator('app-signup-modal')).toBeVisible();
  });

  test('Should open the Registration modal', async ({ page }) => {
    // Тут уже не треба клікати, просто перевіряємо результат з beforeEach
    const registrationModal = page.locator('app-signup-modal');
    await expect(registrationModal).toBeVisible();
    
    const modalTitle = registrationModal.locator('.modal-title');
    await expect(modalTitle).toHaveText(/Registration|Reaistration/);
  });

  test('Error "Name required" shows when Name field is empty', async ({ page }) => {
    const nameInput = page.locator('#signupName');
    const lastNameInput = page.locator('#signupLastName'); 
    const errorMessage = page.locator('.invalid-feedback'); 

    // Взаємодіємо з полями (модалка вже відкрита завдяки beforeEach)
    await nameInput.click();
    await lastNameInput.click();

    // Перевірка помилки
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Name required');
  });

  test('Error "Last name is invalid" shows when input is too short', async ({ page }) => {
    const lastNameInput = page.locator('#signupLastName');
    const emailInput = page.locator('#signupEmail'); 

    await lastNameInput.fill('1');
    await emailInput.click();

    const errorMessages = page.locator('.invalid-feedback');
    await expect(errorMessages.first()).toHaveText('Last name is invalidLast name has to be from 2 to 20 characters long');
    
  });

  test('Error "Email is incorrect" shows for invalid format', async ({ page }) => {

    const emailInput = page.locator('#signupEmail');
    const passwordInput = page.locator('#signupPassword'); // To shift focus
    const errorMessage = page.locator('.invalid-feedback');

    await emailInput.fill('yulchuk.igmail.com');
    await emailInput.blur();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Email is incorrect');
    
    await expect(emailInput).toHaveClass(/is-invalid/);
  });

  test('Error "Password required" shows when field is empty after blur', async ({ page }) => {
    const passwordInput = page.locator('#signupPassword');
    
    await passwordInput.focus();
    await passwordInput.blur();

    const errorMessage = page.locator('.invalid-feedback');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Password required');
  });

  test('Error "Passwords do not match" shows when re-entered password is different', async ({ page }) => {
    const passwordInput = page.locator('#signupPassword');
    const repeatPasswordInput = page.locator('#signupRepeatPassword');

    await passwordInput.fill('Password123');
    await repeatPasswordInput.fill('WrongPassword123');
    await repeatPasswordInput.blur();

    const errorMessage = page.locator('input#signupRepeatPassword + .invalid-feedback');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
  });

});
