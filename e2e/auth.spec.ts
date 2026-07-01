import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("логин с верными данными → /board", async ({ page }) => {
    await page.goto("/login")
    await page.fill("#email", "admin@teamsync.dev")
    await page.fill("#password", "password123")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/board")
  })

  test("логин с неверными данными → ошибка", async ({ page }) => {
    await page.goto("/login")
    await page.fill("#email", "admin@teamsync.dev")
    await page.fill("#password", "wrongpassword")
    await page.click('button[type="submit"]')
    await expect(page.getByRole("alert")).toBeVisible()
  })

  test("неавторизованный /board → /login", async ({ page }) => {
    await page.goto("/board")
    await expect(page).toHaveURL("/login")
  })
})
