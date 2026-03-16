import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  function handleSubmit(e) {
    e.preventDefault();
    // Navigate to dashboard (auth would be added here)
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-paper-secondary flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">O</span>
            </div>
            <span className="font-display text-2xl font-semibold text-text-primary">oslo</span>
          </div>
          <p className="text-text-secondary text-sm">Pet Cloud</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-primary-25 p-8">
          <h1 className="font-display text-2xl font-semibold text-text-primary mb-1">
            Welcome to your pet cloud
          </h1>
          <p className="text-text-secondary text-sm mb-8">Sign in to manage your pets and claims</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-text-border bg-paper-secondary text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-500 text-sm"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-text-border bg-paper-secondary text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-500 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm shadow-md hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-text-secondary">
            <a href="#" className="text-primary-500 hover:underline">
              Forgot your password?
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-text-secondary mt-6 px-4">
          By logging in, you acknowledge that you have read and understood, and agree to Oslo's{" "}
          <a href="#" className="underline">Terms of use</a> &amp;{" "}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
