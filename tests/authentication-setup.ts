// playwright-setup.ts
import { Page } from 'playwright';

const USER_EMAIL = 'melTestSpam@gmail.com';
const USER_PASSWORD ='68a~4YN,XC}X';

export async function logInWithGoogle(page: Page) {
    // Click on the "Login with Google" button which should open a new popup
    const [popup] = await Promise.all([
        page.context().waitForEvent('page'),
        await page.getByRole('button', { name: 'Login' }).click(),
    ]);

    // Fill in the Google login form
    // Please note Google periodically changes their login form, so these selectors may need updating
    await popup.fill('input[type="email"]', USER_EMAIL);
    await popup.press('input[type="email"]', 'Enter');
    await popup.fill('input[type="password"]', USER_PASSWORD);

    // Submit the form
    await Promise.all([
        popup.waitForNavigation(),
        popup.press('input[type="password"]', 'Enter')
    ]);

    // You should now be logged into your app via Google OAuth
    await page.getByRole('button', { name: 'Logout' }).waitFor();

    // Add check to confirm login
}