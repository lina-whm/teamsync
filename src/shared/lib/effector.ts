import { fork, type Scope } from "effector"

export function createIsomorphicScope(): Scope {
  return fork()
}
