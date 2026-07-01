import type { Sprint } from "@/entities/sprint"

export const mockSprints: Sprint[] = [
  {
    id: "sprint-1",
    name: "Sprint 1",
    goal: "Initial setup and core features",
    startDate: "2026-06-01",
    endDate: "2026-06-14",
    status: "COMPLETED",
  },
  {
    id: "sprint-2",
    name: "Sprint 2",
    goal: "Dashboard and analytics",
    startDate: "2026-06-15",
    endDate: "2026-06-28",
    status: "ACTIVE",
  },
]
