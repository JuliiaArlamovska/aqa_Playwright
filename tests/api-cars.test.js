import { test, expect, request } from '@playwright/test';
import { MainPage } from '../scr/page-objects/main.page.js';
import { LoginModal } from '../scr/page-objects/login-modal.page.js';

const LOGIN_EMAIL = 'yulchuk.if@gmail.com';
const LOGIN_PASSWORD = 'Testuser123';
const BASE_URL = process.env.BASE_URL ?? 'https://qauto.forstudy.space/';

async function createAuthenticatedApiContext(page) {
    const mainPage = new MainPage(page);
    const loginModal = new LoginModal(page);

    await mainPage.open();
    await mainPage.clickLogin();
    await expect(loginModal.container).toBeVisible();
    await loginModal.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL(/.*\/panel\/garage$/, { timeout: 15000 });

    const storageState = await page.context().storageState();
    return await request.newContext({ baseURL: BASE_URL, storageState });
}

function getCarPayload(overrides = {}) {
    return {
        carBrandId: 1,
        carModelId: 1,
        mileage: 122,
        ...overrides,
    };
}

function getCreatedCar(body) {
    if (!body) return body;
    if (body.data && typeof body.data === 'object') return body.data;
    return body;
}

test.describe('Cars API tests with APIRequestContext', () => {
    test('should create new car successfully', async ({ page }) => {
        const apiContext = await createAuthenticatedApiContext(page);

        const response = await apiContext.post('/api/cars', {
            data: getCarPayload(),
        });

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBeGreaterThanOrEqual(200);
        expect(response.status()).toBeLessThan(300);

        const body = await response.json();
        const createdCar = getCreatedCar(body);

        expect(createdCar).toBeTruthy();
        expect(createdCar.carBrandId).toBe(1);
        expect(createdCar.carModelId).toBe(1);
        expect(createdCar.mileage).toBe(122);
        expect(createdCar.id || createdCar.carId || createdCar._id).toBeTruthy();

        await apiContext.dispose();
    });

    test('should return validation error when mileage is missing', async ({ page }) => {
        const apiContext = await createAuthenticatedApiContext(page);

        const response = await apiContext.post('/api/cars', {
            data: {
                carBrandId: 1,
                carModelId: 1,
            },
        });

        expect(response.ok()).toBeFalsy();
        expect(response.status()).toBeGreaterThanOrEqual(400);
        expect(response.status()).toBeLessThan(500);

        const body = await response.json();
        expect(body).toBeTruthy();
        await apiContext.dispose();
    });

    test('should return validation error when mileage is invalid', async ({ page }) => {
        const apiContext = await createAuthenticatedApiContext(page);

        const response = await apiContext.post('/api/cars', {
            data: getCarPayload({ mileage: -100 }),
        });

        expect(response.ok()).toBeFalsy();
        expect(response.status()).toBeGreaterThanOrEqual(400);
        expect(response.status()).toBeLessThan(500);

        const body = await response.json();
        expect(body).toBeTruthy();
        await apiContext.dispose();
    });
});