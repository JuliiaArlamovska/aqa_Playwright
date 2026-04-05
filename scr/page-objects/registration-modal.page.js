export class RegistrationModal {
    constructor(page) {
        this.page = page;
        // Modal container locator
        this.container = page.locator('app-signup-modal');
        
        // fields locators
        this.nameInput = page.locator('#signupName');
        this.lastNameInput = page.locator('#signupLastName');
        this.emailInput = page.locator('#signupEmail');
        this.passwordInput = page.locator('#signupPassword');
        this.repeatPasswordInput = page.locator('#signupRepeatPassword');
        
        // Locators for common elements
        this.modalTitle = this.container.locator('.modal-title');
        this.errorMessages = page.locator('.invalid-feedback');
    }

    // Method for getting error message by input selector
    getErrorMessageByInput(selector) {
        return this.page.locator(`${selector} + .invalid-feedback`);
    }

    
}