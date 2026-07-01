import { expect } from "@playwright/test"
import { test } from "./fixtures/auth.fixture"

test.describe("Board", () => {
  test("доска загружается с 4 колонками", async ({ page }) => {
    await expect(page.getByTestId("column-BACKLOG")).toBeVisible()
    await expect(page.getByTestId("column-IN_PROGRESS")).toBeVisible()
    await expect(page.getByTestId("column-REVIEW")).toBeVisible()
    await expect(page.getByTestId("column-DONE")).toBeVisible()
  })

  test("клик на задачу открывает TaskDetailPanel", async ({ page }) => {
    await page.getByTestId("task-card").first().click()
    await expect(page.getByRole("dialog")).toBeVisible()
  })

  test("drag задачи в другую колонку", async ({ page }) => {
    const task = page.getByTestId("task-card").first()
    const doneColumn = page.getByTestId("column-DONE")
    await task.dragTo(doneColumn)
    await expect(doneColumn.getByTestId("task-card")).toHaveCount(1)
  })
})
