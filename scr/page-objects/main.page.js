export class MainPage {
    constructor(page) {
        this.page = page;
        // Локатор кнопки Sign up на головній сторінці
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    }

    async open() {
        await this.page.goto('/');
    }

    async clickSignUp() {
        await this.signUpButton.click();
    }
}