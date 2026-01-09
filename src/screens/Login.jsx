import React, { useRef, useState } from "react";
import { API_URL } from "../utils/BackendApi";
import { useNavigate } from "react-router-dom";

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    let newErrors = {
      email: "",
      password: "",
    };

    if (!email || !email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password || password.length <= 5) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }
    setServerError("");

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Login failed");
        return;
      }

      console.log("Login success:", data);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full  max-w-[90%] sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg  p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Login to continue to your account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              ref={emailRef}
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
          {serverError && (
            <p className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg py-2">
              {serverError}
            </p>
          )}
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t"></div>
          <span className="mx-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t"></div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?
          <a
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
