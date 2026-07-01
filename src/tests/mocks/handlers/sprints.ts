import { http, HttpResponse } from "msw"
import { mockSprints } from "../fixtures/sprints"

export const sprintHandlers = [
  http.get("/api/sprints", () => {
    return HttpResponse.json(mockSprints)
  }),
]
