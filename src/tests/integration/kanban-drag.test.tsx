import { render, screen, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http, HttpResponse } from "msw"
import { server } from "../mocks/server"
import { KanbanBoard } from "@/widgets/kanban-board"
import { boardMounted } from "@/widgets/kanban-board/model/board.model"

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  )
}

describe("kanban-drag", () => {
  beforeEach(() => {
    server.use(
      http.get("/api/sprints", () => {
        return HttpResponse.json([
          {
            id: "sprint-2",
            name: "Sprint 2",
            goal: "Test sprint",
            startDate: "2026-06-15",
            endDate: "2026-06-28",
            status: "ACTIVE",
          },
        ])
      }),
      http.get("/api/users", () => {
        return HttpResponse.json([
          { id: "user-1", name: "Admin", avatar: null },
          { id: "user-2", name: "Alice", avatar: null },
        ])
      }),
    )
    boardMounted()
  })

  it("отображает заголовок доски задач", () => {
    renderWithQueryClient(<KanbanBoard />)

    expect(screen.getByText("Доска задач")).toBeVisible()
  })
})
