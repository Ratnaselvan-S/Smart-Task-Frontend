import React, { useEffect, useState, useMemo } from "react";
import { API_URL } from "../utils/BackendApi";
import { useSearchParams, useNavigate } from "react-router-dom";

/* 🔦 Highlight helper */
const highlightText = (text = "", keyword) => {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, "ig");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");

  /* Modal */
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get("search") || "";

  /* 🔁 Fetch */
  useEffect(() => {
    fetchTasks();
  }, [search]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/task?search=${encodeURIComponent(search)}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error();
      setTasks(await res.json());
    } catch {
      setError("Unable to load tasks");
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 Status update (PUT) */
  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/task/${taskId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch {
      alert("Failed to update task");
    }
  };

  /* 🗑 DELETE */
  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      const res = await fetch(`${API_URL}/api/task/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch {
      alert("Failed to delete task");
    }
  };

  /* ➕ CREATE / ✏️ UPDATE */
  const saveTask = async () => {
    if (!title.trim()) return alert("Title required");

    const payload = { title, description, priority: taskPriority };
    const url = editId
      ? `${API_URL}/api/task/${editId}`
      : `${API_URL}/api/task`;

    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();

      setShowModal(false);
      setEditId(null);
      setTitle("");
      setDescription("");
      setTaskPriority("medium");
      fetchTasks();
    } catch {
      alert("Failed to save task");
    }
  };

  /* ✏️ Open Edit */
  const openEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setTaskPriority(task.priority);
    setShowModal(true);
  };

  /* 🎯 Filters */
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const p = priority === "all" || t.priority === priority;
      const s = status === "all" || t.status === status;
      return p && s;
    });
  }, [tasks, priority, status]);

  const clearSearch = () => navigate("/tasks");

  if (loading)
    return <div className="text-center text-gray-500">Loading tasks...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm text-gray-500">Manage and organize your tasks</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-3 flex-wrap">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {search && (
            <button
              onClick={clearSearch}
              className="text-sm text-red-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded border p-4 sm:p-6">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found</p>
        ) : (
          <ul className="space-y-4">
            {filteredTasks.map((task) => (
              <li
                key={task._id}
                className="border rounded p-4 flex flex-col sm:flex-row sm:justify-between gap-4"
              >
                <div>
                  <h3 className="font-medium">
                    {highlightText(task.title, search)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {highlightText(task.description, search)}
                  </p>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {task.priority}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium
    ${
      task.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : task.status === "in-progress"
        ? "bg-purple-100 text-purple-700"
        : "bg-green-100 text-green-700"
    }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 text-sm items-center">
                  {task.status === "pending" && (
                    <button
                      onClick={() => updateStatus(task._id, "in-progress")}
                      className="px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Start
                    </button>
                  )}

                  {task.status === "in-progress" && (
                    <button
                      onClick={() => updateStatus(task._id, "completed")}
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Mark Done
                    </button>
                  )}

                  {task.status === "completed" && (
                    <span className="text-green-600 font-medium">
                      ✔ Completed
                    </span>
                  )}

                  <button
                    onClick={() => openEdit(task)}
                    className="text-purple-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              {editId ? "Edit Task" : "Add Task"}
            </h2>

            <input
              className="border w-full px-3 py-2 rounded"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="border w-full px-3 py-2 rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="border w-full px-3 py-2 rounded"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={saveTask}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
