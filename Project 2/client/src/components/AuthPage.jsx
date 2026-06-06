import { useState } from "react";
import { ArrowRight, CheckCircle2, Layers3, Zap } from "lucide-react";
import { api, errorMessage } from "../api";
import { useAppStore } from "../store";

export default function AuthPage() {
  const setSession = useAppStore((state) => state.setSession);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "demo@collabspace.dev",
    password: "password123",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;
      const { data } = await api.post(endpoint, payload);
      setSession(data.token, data.user);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <a className="brand brand-light" href="/">
          <span className="brand-mark">
            <Layers3 size={20} />
          </span>
          CollabSpace
        </a>
        <div className="story-copy">
          <span className="eyebrow">
            <Zap size={14} fill="currentColor" /> Built for teams in motion
          </span>
          <h1>Turn ambitious ideas into work that ships.</h1>
          <p>
            Plan sprints, move work forward, and keep every teammate aligned in
            one fast, focused workspace.
          </p>
          <div className="story-points">
            <span><CheckCircle2 size={18} /> Live board updates</span>
            <span><CheckCircle2 size={18} /> Flexible Kanban workflows</span>
            <span><CheckCircle2 size={18} /> Workspace-level permissions</span>
          </div>
        </div>
        <div className="mini-board" aria-hidden="true">
          <div className="mini-column">
            <small>TO DO</small>
            <div className="mini-card accent-purple" />
            <div className="mini-card short" />
          </div>
          <div className="mini-column lifted">
            <small>IN PROGRESS</small>
            <div className="mini-card accent-orange" />
            <div className="mini-card" />
          </div>
          <div className="mini-column">
            <small>DONE</small>
            <div className="mini-card accent-green" />
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <span className="mobile-brand">
            <Layers3 size={22} /> CollabSpace
          </span>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="muted">
            {mode === "login"
              ? "Sign in to pick up where your team left off."
              : "Start a workspace and invite your team."}
          </p>
          <form onSubmit={submit}>
            {mode === "register" && (
              <label>
                Full name
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Alex Morgan"
                  required
                />
              </label>
            )}
            <label>
              Work email
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="you@company.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                minLength={8}
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                required
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="button button-primary button-block" disabled={submitting}>
              {submitting
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              {!submitting && <ArrowRight size={17} />}
            </button>
          </form>
          <p className="auth-switch">
            {mode === "login" ? "New to CollabSpace?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
          <p className="demo-hint">
            Demo login: <strong>demo@collabspace.dev</strong> /{" "}
            <strong>password123</strong>
          </p>
        </div>
      </section>
    </main>
  );
}
