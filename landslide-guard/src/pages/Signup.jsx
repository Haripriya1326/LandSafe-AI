import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiMountainsDuotone } from "react-icons/pi";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/ToastContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const { signup, loginWithProvider } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const result = signup({ name, email, password, confirmPassword });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    navigate("/", { replace: true });
  }

  function handleProvider(provider) {
    setOauthLoading(provider);
    setTimeout(() => {
      const result = loginWithProvider(provider);
      setOauthLoading(null);
      showToast(`Account created with ${result.label}`, "success");
      navigate("/", { replace: true });
    }, 700);
  }

  return (
    <div className="min-h-screen bg-base-deep flex flex-col contour-field">
      <header className="relative z-10 flex items-center justify-center px-6 py-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-signal/10 border border-signal/30 flex items-center justify-center">
            <PiMountainsDuotone className="text-signal" size={20} aria-hidden="true" />
          </div>
          <span className="font-display font-semibold tracking-wide text-sm">LANDSLIDE GUARD</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="text-center mb-6">
            <p className="eyebrow mb-1.5">Get started</p>
            <h1 className="text-2xl font-display font-semibold text-ink-hi">Create your account</h1>
            <p className="text-sm text-ink-mid mt-1.5">Join the early warning network</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="glass-panel p-6 space-y-4">
            {error && (
              <p role="alert" className="text-xs text-risk-critical flex items-center gap-1.5 bg-risk-critical/10 border border-risk-critical/30 rounded-lg px-3 py-2.5">
                <FiAlertTriangle size={14} className="shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}

            <div>
              <label htmlFor="name" className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2 block">
                Full Name
              </label>
              <div className="flex items-center gap-2 bg-base-panel2 border border-base-line focus-within:border-signal rounded-lg px-3.5 py-2.5">
                <FiUser className="text-ink-mid shrink-0" size={15} aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-transparent text-sm text-ink-hi placeholder:text-ink-low outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2 block">
                Email
              </label>
              <div className="flex items-center gap-2 bg-base-panel2 border border-base-line focus-within:border-signal rounded-lg px-3.5 py-2.5">
                <FiMail className="text-ink-mid shrink-0" size={15} aria-hidden="true" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-ink-hi placeholder:text-ink-low outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2 block">
                Password
              </label>
              <div className="flex items-center gap-2 bg-base-panel2 border border-base-line focus-within:border-signal rounded-lg px-3.5 py-2.5">
                <FiLock className="text-ink-mid shrink-0" size={15} aria-hidden="true" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent text-sm text-ink-hi placeholder:text-ink-low outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-ink-mid hover:text-ink-hi shrink-0"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="text-xs font-mono text-ink-mid uppercase tracking-wide mb-2 block">
                Confirm Password
              </label>
              <div className="flex items-center gap-2 bg-base-panel2 border border-base-line focus-within:border-signal rounded-lg px-3.5 py-2.5">
                <FiLock className="text-ink-mid shrink-0" size={15} aria-hidden="true" />
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full bg-transparent text-sm text-ink-hi placeholder:text-ink-low outline-none"
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? "Creating account…" : "Create Account"}
              {!submitting && <FiArrowRight size={15} aria-hidden="true" />}
            </button>

            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-base-line" />
              <span className="text-[11px] font-mono text-ink-mid uppercase tracking-wide">or continue with</span>
              <div className="h-px flex-1 bg-base-line" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleProvider("google")}
                disabled={oauthLoading !== null}
                className="btn-oauth"
              >
                <FcGoogle size={17} aria-hidden="true" />
                {oauthLoading === "google" ? "Connecting…" : "Google"}
              </button>
              <button
                type="button"
                onClick={() => handleProvider("linkedin")}
                disabled={oauthLoading !== null}
                className="btn-oauth"
              >
                <FaLinkedin size={17} className="text-[#0A66C2]" aria-hidden="true" />
                {oauthLoading === "linkedin" ? "Connecting…" : "LinkedIn"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-ink-mid mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-signal font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-[11px] font-mono text-ink-low mt-6">
            SIH DEMO — accounts are stored locally in your browser only
          </p>
        </div>
      </main>
    </div>
  );
}
