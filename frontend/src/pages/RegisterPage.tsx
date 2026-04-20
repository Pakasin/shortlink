import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { RegisterRequest } from "shortlink-shared";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

// ─── Design Tokens (Dark Theme - LandingPage Style) ─────────────────
const C = {
  bg: "#0f172a",
  bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)",
  glass: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  primary: "#3b82f6",
  primaryGradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
  text: "#ffffff",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  inputBg: "rgba(255,255,255,0.06)",
  inputBorder: "rgba(255,255,255,0.08)",
  error: "#f87171",
  errorBg: "rgba(248,113,113,0.1)",
};

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  minLength,
  hint,
  icon,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  hint?: string;
  icon?: React.ReactNode;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: focused ? C.primary : C.textMuted, fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </label>
      <div
        className="relative rounded-xl transition-all"
        style={{
          background: C.inputBg,
          border: `1px solid ${focused ? C.primary : C.inputBorder}`,
          boxShadow: focused ? `0 0 0 2px rgba(59,130,246,0.2)` : "none",
        }}
      >
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }}>
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="w-full bg-transparent py-3.5 px-4 text-sm font-medium outline-none transition-all"
          style={{
            color: C.text,
            fontFamily: "'Inter', sans-serif",
            paddingLeft: icon ? "2.75rem" : "1rem",
          }}
        />
      </div>
      {hint && (
        <p className="text-xs mt-1.5" style={{ color: C.textDim }}>
          {hint}
        </p>
      )}
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: C.bgGradient,
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .gradient-bg {
          background: linear-gradient(-45deg, #0f172a, #1e293b, #1e3a8a, #312e81);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        .float-blob { animation: float 8s ease-in-out infinite; }
      `}</style>

      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none gradient-bg">
        <div
          className="float-blob absolute rounded-full blur-[120px] opacity-30"
          style={{
            top: "-10%",
            left: "-10%",
            width: "50%",
            height: "50%",
            background: "rgba(59,130,246,0.3)",
          }}
        />
        <div
          className="float-blob absolute rounded-full blur-[120px] opacity-20"
          style={{
            bottom: "-10%",
            right: "-10%",
            width: "40%",
            height: "40%",
            background: "rgba(139,92,246,0.25)",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Branding */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mr-3"
                style={{ background: C.primaryGradient }}
              >
                <User size={24} color="white" />
              </div>
              <h1
                className="text-3xl font-extrabold tracking-tighter"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  background: "linear-gradient(to right, #fff, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                LinkPulse
              </h1>
            </div>
            <p className="font-medium text-sm" style={{ color: C.textMuted }}>
              Create your free account and start tracking.
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8 md:p-9"
            style={{
              ...C.glass,
              borderRadius: "24px",
              padding: "36px",
            }}
          >
            {/* Error Banner */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2"
                style={{ backgroundColor: C.errorBg, color: C.error }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke={C.error}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                id="name"
                label="Full Name"
                value={formData.name || ""}
                onChange={(v) => setFormData({ ...formData, name: v })}
                placeholder="John Doe"
                icon={<User size={16} />}
              />
              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })}
                placeholder="you@example.com"
                required
                icon={<Mail size={16} />}
              />
              <InputField
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v })}
                placeholder="••••••••"
                required
                minLength={6}
                hint="Must be at least 6 characters"
                icon={<Lock size={16} />}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-base text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: C.primaryGradient,
                  fontFamily: "'Manrope', sans-serif",
                  boxShadow: isLoading ? "none" : "0 8px 24px rgba(59,130,246,0.35)",
                  fontSize: "15px",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-4 text-xs font-bold uppercase tracking-widest"
                  style={{ color: C.textDim }}
                >
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: C.text,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: C.text,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={C.text}>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.071 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.57 9.57 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm font-medium" style={{ color: C.textMuted }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold hover:underline decoration-2 underline-offset-4 ml-0.5 transition-all"
              style={{ color: C.primary }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};
