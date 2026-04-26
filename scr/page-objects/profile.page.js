export class ProfilePage {
    constructor(page) {
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Profile' });
    }

    async open() {
        const baseUrl = process.env.BASE_URL ?? 'https://qauto.forstudy.space/';
        await this.page.goto(new URL('/panel/profile', baseUrl).toString());
    }

    getUserTextLocator(text) {
        return this.page.getByText(text, { exact: false });
    }
}
