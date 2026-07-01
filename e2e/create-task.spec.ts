import { expect } from "@playwright/test"
import { test } from "./fixtures/auth.fixture"

test.describe("Create Task", () => {
  test("создание задачи появляется на доске", async ({ page }) => {
    await page.getByRole("button", { name: "+ Новая задача" }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.getByLabel("Название").fill("E2E Test Task")
    await page.getByRole("button", { name: "Создать" }).click()
    await expect(page.getByRole("dialog")).not.toBeVisible()
    await expect(page.getByText("E2E Test Task")).toBeVisible()
  })
})
