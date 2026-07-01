import { test as base } from "@playwright/test"

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto("/login")
    await page.fill("#email", "admin@teamsync.dev")
    await page.fill("#password", "password123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/board")
    await use(page)
  },
})

export { expect } from "@playwright/test"
