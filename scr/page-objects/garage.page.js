export class GaragePage {
    constructor(page) {
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Garage' });
        this.profileButton = page.getByRole('button', { name: /My profile|Profile/i });
    }

    async open() {
        const baseUrl = process.env.BASE_URL ?? 'https://qauto.forstudy.space/';
        await this.page.goto(new URL('/panel/garage', baseUrl).toString());
    }
}
