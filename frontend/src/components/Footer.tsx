import { Link2 } from "lucide-react";
import { useTranslation } from "../contexts/AuthContext";

export const Footer: React.FC = () => {
  const t = useTranslation();
  return (
    <footer className="py-8 mt-auto bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/[0.06] transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700"><Link2 className="w-4 h-4 text-white" /></div>
            <div>
              <span className="font-display font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">LinkPulse</span>
              <span className="text-sm block md:hidden text-slate-500 dark:text-slate-500">{t.footer.taglineMobile}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1"><span className="text-sm text-slate-500 dark:text-slate-500">{t.footer.taglineDesktop}</span></div>
          <div className="flex gap-6">
            <a href="#" className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">{t.footer.privacy}</a>
            <a href="#" className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">{t.footer.terms}</a>
            <a href="#" className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">{t.footer.contact}</a>
          </div>
        </div>
        <div className="text-center text-sm mt-6 text-slate-400 dark:text-slate-600">{t.footer.copyright.replace("{year}", String(new Date().getFullYear()))}</div>
      </div>
    </footer>
  );
};
