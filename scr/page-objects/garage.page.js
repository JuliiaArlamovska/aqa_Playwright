export class GaragePage {
    constructor(page) {
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Garage' });
        this.profileButton = page.getByRole('button', { name: /My profile|Profile/i });
    }

    async open() {
        await this.page.goto('/panel/garage');
    }
}
