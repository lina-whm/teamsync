import {
  createEvent,
  createStore,
  type Store,
  type EventCallable,
} from "effector"

interface FilterDef {
  name: string
  defaultValue?: string
}

export function createFilterStore(defs: FilterDef[]) {
  const reset = createEvent()
  const result: Record<string, Store<string> | EventCallable<string> | EventCallable<void>> = {
    reset,
  }

  for (const { name, defaultValue = "" } of defs) {
    const changed = createEvent<string>()
    const $store = createStore<string>(defaultValue)
      .on(changed, (_, v) => v)
      .reset(reset)

    result[`$${name}`] = $store
    result[`${name}Changed`] = changed
  }

  return result as Record<string, Store<string> | EventCallable<string> | EventCallable<void>>
}
