import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { RegisterRequest } from "shortlink-shared";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

const InputField = ({
  id, label, type = "text", value, onChange, placeholder, required, minLength, hint, icon,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean;
  minLength?: number; hint?: string; icon?: React.ReactNode;
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500 dark:text-slate-400">{label}</label>
    <div className="relative rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">{icon}</div>}
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required} minLength={minLength}
        className="w-full bg-transparent py-3.5 px-4 text-sm font-medium outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
        style={{ paddingLeft: icon ? "2.75rem" : "1rem" }} />
    </div>
    {hint && <p className="text-xs mt-1.5 text-slate-400 dark:text-slate-600">{hint}</p>}
  </div>
);

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, t, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setIsLoading(true);
    try { await register(formData); navigate("/dashboard"); }
    catch (err: any) { setError(err.message || "Registration failed"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors">
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mr-3 bg-gradient-to-br from-blue-500 to-blue-700">
                <User size={24} color="white" />
              </div>
              <h1 className="text-3xl font-display font-extrabold tracking-tighter bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">LinkPulse</h1>
            </div>
            <p className="font-medium text-sm text-slate-500 dark:text-slate-400">{t.auth.registerSubtitle}</p>
          </div>

          <div className="rounded-3xl p-9 bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] shadow-xl shadow-slate-200/50 dark:shadow-black/20 backdrop-blur-xl">
            {error && <div className="px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-500">⚠ {error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField id="name" label={t.auth.fullName} value={formData.name || ""}
                onChange={(v) => setFormData({ ...formData, name: v })} placeholder={t.auth.namePlaceholder} icon={<User size={16} />} />
              <InputField id="email" label={t.auth.email} type="email" value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })} placeholder={t.auth.emailPlaceholder} required icon={<Mail size={16} />} />
              <InputField id="password" label={t.auth.password} type="password" value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v })} placeholder={t.auth.passwordPlaceholder} required minLength={6}
                hint={t.auth.passwordHint} icon={<Lock size={16} />} />
              <button type="submit" disabled={isLoading}
                className="w-full py-4 rounded-xl font-heading font-bold text-[15px] text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/35 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (<><Loader2 size={18} className="animate-spin" />{t.auth.creatingAccount}</>) : (<><span>{t.auth.createAccount}</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>)}
              </button>
            </form>
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/[0.08]" /></div>
              <div className="relative flex justify-center"><span className="px-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 bg-white dark:bg-transparent">{t.auth.orSignUpWith}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95">Google</button>
              <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95">GitHub</button>
            </div>
          </div>
          <p className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            {t.auth.hasAccount}{" "}<Link to="/login" className="font-bold text-blue-500 hover:underline ml-0.5">{t.auth.signInLink}</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
