import { test, expect } from '@playwright/test';
import { RegistrationModal } from '../scr/page-objects/registration-modal.page.js';
import { MainPage } from '../scr/page-objects/main.page.js';

test.describe('Registration Modal Tests with POM', () => {
    let regModal;
    let mainPage;


    test.beforeEach(async ({ page }) => {
        regModal = new RegistrationModal(page);
        mainPage = new MainPage(page);
        await mainPage.open();
        await mainPage.clickSignUp();
    });

    test('Should open the Registration modal', async () => {
        await expect(regModal.container).toBeVisible();
        await expect(regModal.modalTitle).toHaveText(/Registration|Reaistration/);
    });

    test('Error "Name required" shows when Name field is empty', async () => {
        await regModal.nameInput.click();
        await regModal.lastNameInput.click();

        await expect(regModal.errorMessages).toBeVisible();
        await expect(regModal.errorMessages).toHaveText('Name required');
    });

    test('Error "Last name is invalid" shows when input is too short', async () => {
        await regModal.lastNameInput.fill('1');
        await regModal.emailInput.click();
        await expect(regModal.errorMessages.first()).toHaveText(/Last name is invalid/);
    });

    test('Error "Email is incorrect" shows for invalid format', async () => {
        await regModal.emailInput.fill('yulchuk.igmail.com');
        await regModal.emailInput.blur();
        
        await expect(regModal.errorMessages).toHaveText('Email is incorrect');
        await expect(regModal.emailInput).toHaveClass(/is-invalid/);
    });

    test('Error "Password required" shows when field is empty after blur', async () => {
        await regModal.passwordInput.focus();
        await regModal.passwordInput.blur();

        await expect(regModal.errorMessages).toHaveText('Password required');
    });

    test('Error "Passwords do not match" shows when re-entered password is different', async () => {
        await regModal.passwordInput.fill('Password123');
        await regModal.repeatPasswordInput.fill('WrongPassword123');
        await regModal.repeatPasswordInput.blur();

        const repeatError = regModal.getErrorMessageByInput('#signupRepeatPassword');
        await expect(repeatError).toBeVisible();
        await expect(repeatError).toContainText('Password'); 
    });
});