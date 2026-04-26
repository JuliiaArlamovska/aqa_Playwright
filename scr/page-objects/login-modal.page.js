export class LoginModal {
    constructor(page) {
        this.page = page;
        // Login modal container
        this.container = page.locator('app-signin-modal');

        // Login form fields
        this.emailInput = page.locator('#signinEmail');
        this.passwordInput = page.locator('#signinPassword');
        this.loginButton = page.locator('button', { hasText: 'Login' });
    }

    async fillEmail(email) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async login(email, password) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickLogin();
    }
}
