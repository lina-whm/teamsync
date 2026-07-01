import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { server } from "../mocks/server"
import { renderWithProviders } from "../utils"
import { CreateTaskModal } from "@/features/create-task"
import { createTaskDialogOpened } from "@/features/create-task/model/create-task.model"

describe("create-task", () => {
  beforeEach(() => {
    createTaskDialogOpened()
  })

  it("рендерит модалку создания задачи", () => {
    renderWithProviders(<CreateTaskModal />)

    expect(screen.getByText("Новая задача")).toBeVisible()
    expect(screen.getByLabelText("Название")).toBeVisible()
    expect(screen.getByLabelText("Приоритет")).toBeVisible()
    expect(screen.getByRole("button", { name: "Создать задачу" })).toBeVisible()
  })

  it("показывает ошибку валидации при пустом названии", async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateTaskModal />)

    const submitBtn = screen.getByRole("button", { name: "Создать задачу" })
    await user.click(submitBtn)

    expect(screen.getByText("Title is required")).toBeVisible()
  })

  it("закрывается по кнопке X", async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateTaskModal />)

    const heading = screen.getByText("Новая задача")
    expect(heading).toBeVisible()

    const closeBtn = heading.parentElement?.querySelector("button")
    expect(closeBtn).toBeTruthy()
    if (closeBtn) await user.click(closeBtn)

    expect(screen.queryByText("Новая задача")).toBeNull()
  })
})
