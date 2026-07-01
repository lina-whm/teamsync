import { http, HttpResponse } from "msw"
import { mockUsers } from "../fixtures/users"

export const userHandlers = [
  http.get("/api/users", () => {
    return HttpResponse.json(
      mockUsers.map((u) => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
      })),
    )
  }),

  http.get("/api/users/:id", ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.id)
    if (!user) return HttpResponse.json({ error: "Not found" }, { status: 404 })
    return HttpResponse.json(user)
  }),
]
