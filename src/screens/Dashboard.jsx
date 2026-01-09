import React, { useEffect, useState } from "react";
import { ClipboardList, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { API_URL } from "../utils/BackendApi";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/task`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError("Unable to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 🔢 Counts
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const stats = [
    {
      title: "Total Tasks",
      value: total,
      icon: ClipboardList,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Loader2,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      bg: "bg-green-100",
      text: "text-green-600",
    },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of your tasks and activities
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border shadow-sm p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {item.value}
                </p>
              </div>

              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${item.bg}`}
              >
                <Icon size={22} className={item.text} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Tasks
        </h2>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">
            No tasks yet. Create your first task to get started!
          </p>
        ) : (
          <ul className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <li
                key={task._id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : task.status === "in-progress"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
