import { test, expect } from '@playwright/test';
import {logInWithGoogle} from "./authentication-setup";

test('update profile', async ({ page,context  }) => {
  var userName= "Tester"+Math.floor(Math.random() * 100) + 1;

  await page.goto('https://travel-planner.melanievandegraaf.nl/');
  await logInWithGoogle(page);
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByLabel('Username').fill(userName);
  await page.getByLabel('Bio').fill("This is a end to end test");
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText(userName)).toBeVisible();
});
