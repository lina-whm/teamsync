export function AppSidebar() {
  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">TeamSync</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <a
          href="/dashboard"
          className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Board
        </a>
        <a
          href="/dashboard/analytics"
          className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Analytics
        </a>
        <a
          href="/dashboard/settings"
          className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Settings
        </a>
      </nav>
    </aside>
  )
}
