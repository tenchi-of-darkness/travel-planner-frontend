// playwright-setup.ts
import { Page } from 'playwright';
import {popup} from "leaflet";

const USER_EMAIL = 'melTestSpam@gmail.com';
const USER_PASSWORD = '68a~4YN,XC}X';

export async function logInWithGoogle(page: Page) {
    const [popup] = await Promise.all([
        page.context().waitForEvent('page'),
        await page.getByRole('button', { name: 'Login' }).click(),
    ]);

    await popup.fill('input[type="email"]', USER_EMAIL);
    await popup.press('input[type="email"]', 'Enter');
    await popup.waitForSelector('input[type="password"]');
    await popup.fill('input[type="password"]', USER_PASSWORD);
    await popup.click('#passwordNext');
    await popup
        .waitForSelector(`input[type="password"]`, {timeout:0})
        .then(() => {
            console.log("Success")});
    await Promise.all([
        popup.waitForNavigation(),
        popup.press('input[type="password"]', 'Enter')
    ]);

    await page.getByRole('button', { name: 'Logout' }).waitFor();
}