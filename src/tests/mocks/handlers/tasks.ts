import { http, HttpResponse } from "msw"
import { mockTasks } from "../fixtures/tasks"

export const taskHandlers = [
  http.get("/api/tasks", ({ request }) => {
    const url = new URL(request.url)
    const sprintId = url.searchParams.get("sprintId")
    const status = url.searchParams.get("status")
    let result = mockTasks.filter((t) => t.sprintId === sprintId)
    if (status && status !== "all") {
      result = result.filter((t) => t.status === status)
    }
    return HttpResponse.json(result)
  }),

  http.post("/api/tasks", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newTask = {
      id: `task-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(newTask, { status: 201 })
  }),

  http.patch("/api/tasks/:id", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const task = mockTasks.find((t) => t.id === params.id)
    if (!task) return HttpResponse.json({ error: "Not found" }, { status: 404 })
    return HttpResponse.json({ ...task, ...body })
  }),

  http.delete("/api/tasks/:id", () => {
    return HttpResponse.json({ success: true })
  }),
]
