import { test, expect } from './fixtures/userGaragePage.fixture.js';

test.describe('Garage page as logged-in user', () => {
    test('should open Garage page with stored user session', async ({ userGaragePage }) => {
        await expect(userGaragePage.header).toBeVisible();
        await expect(userGaragePage.page).toHaveURL(/.*\/panel\/garage$/);
        await expect(userGaragePage.profileButton).toBeVisible();
    });
});
