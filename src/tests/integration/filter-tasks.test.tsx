import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "../utils"
import { TaskFilters } from "@/features/filter-tasks"

describe("filter-tasks", () => {
  it("рендерит все фильтры", () => {
    renderWithProviders(<TaskFilters />)

    expect(screen.getByPlaceholderText("Поиск задач...")).toBeVisible()
    expect(screen.getByRole("button", { name: /сброс/i })).toBeVisible()

    const comboboxes = screen.getAllByRole("combobox")
    expect(comboboxes).toHaveLength(3)
  })

  it("выбор статуса обновляет значение", async () => {
    const user = userEvent.setup()
    renderWithProviders(<TaskFilters />)

    const comboboxes = screen.getAllByRole("combobox")
    const statusFilter = comboboxes[0]

    await user.selectOptions(statusFilter, "IN_PROGRESS")
    expect((statusFilter as HTMLSelectElement).value).toBe("IN_PROGRESS")
  })

  it("кнопка Сбросить сбрасывает фильтры", async () => {
    const user = userEvent.setup()
    renderWithProviders(<TaskFilters />)

    const comboboxes = screen.getAllByRole("combobox")
    const statusFilter = comboboxes[0]
    const priorityFilter = comboboxes[1]

    await user.selectOptions(statusFilter, "IN_PROGRESS")
    await user.selectOptions(priorityFilter, "HIGH")

    expect((statusFilter as HTMLSelectElement).value).toBe("IN_PROGRESS")
    expect((priorityFilter as HTMLSelectElement).value).toBe("HIGH")

    const resetBtn = screen.getByRole("button", { name: /сброс/i })
    await user.click(resetBtn)

    expect((statusFilter as HTMLSelectElement).value).toBe("")
    expect((priorityFilter as HTMLSelectElement).value).toBe("")
  })
})
