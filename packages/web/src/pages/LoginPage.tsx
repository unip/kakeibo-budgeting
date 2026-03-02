import { useState } from "react";
import { authClient } from "../lib/auth-client";

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (error) {
          setError(error.message || "Signup failed");
          return;
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) {
          setError(error.message || "Login failed");
          return;
        }
      }
      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Kakeibo</h1>
          <p className="mt-1 text-sm text-gray-400">
            {mode === "login" ? "Sign in to your account" : "Create an account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 py-3 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50 transition-colors"
          >
            {loading
              ? "..."
              : mode === "login"
                ? "Sign In"
                : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-purple-400 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-purple-400 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
