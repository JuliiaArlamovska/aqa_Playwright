import { test, expect } from '@playwright/test';
import { MainPage } from '../scr/page-objects/main.page.js';
import { LoginModal } from '../scr/page-objects/login-modal.page.js';

const LOGIN_EMAIL = process.env.LOGIN_EMAIL ?? 'yulchuk.if@gmail.com';
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD ?? 'Testuser123';

test.describe('Login flow with POM', () => {
    let mainPage;
    let loginModal;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        loginModal = new LoginModal(page);
        await mainPage.open();
        await mainPage.clickLogin();
        await expect(loginModal.container).toBeVisible();
    });

    test('Should login successfully with valid credentials', async () => {
        await loginModal.login(LOGIN_EMAIL, LOGIN_PASSWORD);
        await expect(loginModal.container).toBeHidden();
        await expect(mainPage.loginButton).toBeHidden();
        await expect(mainPage.page).toHaveURL(/.*\/panel\/garage$/);
    });
});
