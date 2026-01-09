import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/dashboard");
    }, 6000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <h1 className="text-8xl font-extrabold mb-4 animate-pulse">404</h1>

      <p className="text-xl text-gray-300 mb-2">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <p className="text-sm text-gray-400 mb-6">
        Redirecting to dashboard in <span className="font-bold">{count}</span>{" "}
        seconds...
      </p>

      <Link
        to="/dashboard"
        className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
      >
        Go to Dashboard Now
      </Link>
    </div>
  );
}

export default NotFound;
