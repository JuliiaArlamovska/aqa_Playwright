export class MainPage {
    constructor(page) {
        this.page = page;
        // Локатор кнопки Sign up на головній сторінці
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });
        // Локатор кнопки Sign In на головній сторінці
        this.loginButton = page.getByRole('button', { name: 'Sign In' });
    }

    async open() {
        await this.page.goto('/');
    }

    async clickSignUp() {
        await this.signUpButton.click();
    }

    async clickLogin() {
        await this.loginButton.click();
    }
}