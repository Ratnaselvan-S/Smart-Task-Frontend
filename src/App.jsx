import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./screens/Login";
import Register from "./screens/Register";
import Dashboard from "./screens/Dashboard";
import Tasks from "./screens/Task";
import AppLayout from "./components/layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/PublicRoutes/PublicRoute";
import React from "react";
import NotFound from "./screens/NotFound";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "tasks", element: <Tasks /> },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
