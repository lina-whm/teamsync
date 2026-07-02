import { useUnit } from "effector-react"
import { type Store, type EventCallable } from "effector"
import { type ComponentType } from "react"

export function reflect<
  TBind extends Record<string, Store<any> | EventCallable<any>>,
  TViewProps extends Record<string, any>,
>(
  config: {
    view: ComponentType<TViewProps>
    bind: TBind
  },
): ComponentType<Omit<TViewProps, keyof TBind>> {
  const displayName = config.view.displayName || config.view.name || "Reflect"
  const Component = (ownProps: any) => {
    const boundValues = useUnit(config.bind)
    return <config.view {...ownProps} {...boundValues} />
  }
  Component.displayName = `Reflect(${displayName})`
  return Component as any
}
