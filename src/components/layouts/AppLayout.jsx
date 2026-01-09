import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold">Smart Task</h1>
        <nav className="mt-6 space-y-2">
          <a href="/dashboard">Dashboard</a>
          <a href="/tasks">Tasks</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b flex items-center px-6">
          <input
            type="text"
            placeholder="Search tasks..."
            className="border px-3 py-1 rounded w-64"
          />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
