import { test, expect } from './fixtures/userGaragePage.fixture.js';
import { ProfilePage } from '../scr/page-objects/profile.page.js';

const MOCK_NAME = 'Auto Tester';
const MOCK_EMAIL = 'auto.tester@example.com';

test.describe('Profile page network interception', () => {
    test('should intercept and modify profile API response', async ({ userGaragePage }) => {
        const page = userGaragePage.page;
        let interceptedData = null;

        // Set up route interception
        await page.route('**/api/users/profile', async route => {
            const response = await page.request.fetch(route.request());
            const body = await response.json();

            console.log('✓ API INTERCEPTED - Original body:', JSON.stringify(body));

            // Modify response body with mock data
            if (body && body.data) {
                body.data.name = MOCK_NAME;
                body.data.lastName = 'Tester';
                body.data.email = MOCK_EMAIL;
            }
            if (body && body.user && typeof body.user === 'object') {
                body.user.name = MOCK_NAME;
                body.user.email = MOCK_EMAIL;
                body.user.firstName = 'Auto';
                body.user.lastName = 'Tester';
            }

            interceptedData = body;
            console.log('✓ API MODIFIED - New body:', JSON.stringify(body));

            await route.fulfill({
                status: response.status(),
                headers: response.headers(),
                contentType: 'application/json',
                body: JSON.stringify(body),
            });
        });

        const profilePage = new ProfilePage(page);
        const [profileResponse] = await Promise.all([
            page.waitForResponse(response => response.url().includes('/api/users/profile') && response.status() === 200, { timeout: 10000 }),
            profilePage.open(),
        ]);

        await page.waitForURL(/.*\/panel\/profile$/, { timeout: 10000 });
        await expect(profilePage.header).toBeVisible({ timeout: 10000 });

        console.log('✓ Profile page opened successfully');
        console.log('✓ Intercepted data contains MOCK_NAME:', interceptedData && interceptedData.data?.name === MOCK_NAME);

        if (interceptedData) {
            expect(interceptedData.data?.name).toBe(MOCK_NAME);
            expect(interceptedData.data?.email).toBe(MOCK_EMAIL);
        }

        await page.unrouteAll({ behavior: 'ignoreErrors' });
    });
});
