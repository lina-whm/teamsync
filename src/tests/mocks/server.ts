import { setupServer } from "msw/node"
import { taskHandlers } from "./handlers/tasks"
import { sprintHandlers } from "./handlers/sprints"
import { userHandlers } from "./handlers/users"

export const server = setupServer(...taskHandlers, ...sprintHandlers, ...userHandlers)
