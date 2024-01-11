// playwright-setup.ts
import { Page } from 'playwright';

const USER_EMAIL = 'melTestSpam@gmail.com';
const USER_PASSWORD = '68a~4YN,XC}X';

export async function logInWithGoogle(page: Page) {
    const [popup] = await Promise.all([
        page.context().waitForEvent('page'),
        await page.getByRole('button', { name: 'Login' }).click(),
    ]);

    await popup.fill('input[type="email"]', USER_EMAIL);
    await popup.press('input[type="email"]', 'Enter');
    await popup.fill('input[type="password"]', USER_PASSWORD);

    await Promise.all([
        popup.waitForNavigation(),
        popup.press('input[type="password"]', 'Enter')
    ]);

    await page.getByRole('button', { name: 'Logout' }).waitFor();
}