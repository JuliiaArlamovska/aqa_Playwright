import fs from 'fs';
import path from 'path';
import { test as base, expect } from '@playwright/test';
import { MainPage } from '../../scr/page-objects/main.page.js';
import { LoginModal } from '../../scr/page-objects/login-modal.page.js';
import { GaragePage } from '../../scr/page-objects/garage.page.js';

const STORAGE_STATE_PATH = path.join(process.cwd(), 'storageState', 'userGarage.json');
const LOGIN_EMAIL = 'yulchuk.if@gmail.com';
const LOGIN_PASSWORD = 'Testuser123';
const BASE_URL = 'https://qauto.forstudy.space/';

function isValidStorageState(pathToState) {
    if (!fs.existsSync(pathToState)) {
        return false;
    }

    try {
        const state = JSON.parse(fs.readFileSync(pathToState, 'utf-8'));
        const hasValidCookie = Array.isArray(state.cookies)
            && state.cookies.some(cookie => cookie.name === 'sid' && cookie.value);
        return hasValidCookie;
    } catch {
        return false;
    }
}

async function createStorageState(browser) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const mainPage = new MainPage(page);
    const loginModal = new LoginModal(page);

    await mainPage.open();
    await mainPage.clickLogin();
    await expect(loginModal.container).toBeVisible();
    await loginModal.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL(/.*\/panel\/garage$/, { timeout: 15000 });

    await context.storageState({ path: STORAGE_STATE_PATH });
    await context.close();
}

export const test = base.extend({
    userGaragePage: async ({ browser }, use) => {
        if (!isValidStorageState(STORAGE_STATE_PATH)) {
            await createStorageState(browser);
        }

        const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
        const page = await context.newPage();
        const garagePage = new GaragePage(page);

        await garagePage.open();
        await expect(garagePage.header).toBeVisible();

        await use(garagePage);
        await context.close();
    }
});

export { expect };
