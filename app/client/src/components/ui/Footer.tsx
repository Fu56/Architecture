import { Link } from "react-router-dom";
import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-32 pb-12 overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 transition-transform duration-500 group-hover:rotate-12">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white leading-none">
                  ARC
                  <span className="text-indigo-500 underline decoration-2 underline-offset-4">
                    HIVE
                  </span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
                  Infrastructure
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              The premier digital ecosystem for architectural excellence.
              Bridging the gap between academic research and professional
              implementation through collaborative knowledge.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">
              Platform
            </h3>
            <ul className="space-y-4 text-[14px] font-bold">
              {[
                { label: "Browse Collective", to: "/browse" },
                { label: "Faculty Insights", to: "/blog" },
                { label: "Contribute Work", to: "/upload" },
                { label: "Member Access", to: "/login" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="hover:text-white transition-colors flex items-center gap-2 group/link"
                  >
                    <span className="w-0 h-px bg-indigo-500 transition-all group-hover/link:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">
              Resources
            </h3>
            <ul className="space-y-4 text-[14px] font-bold">
              {[
                { label: "BIM Models", to: "/browse?type=rfa" },
                { label: "Social Housing", to: "/browse?tag=social" },
                { label: "Urban Planning", to: "/browse?tag=urban" },
                { label: "Software Docs", to: "/browse?type=pdf" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="hover:text-white transition-colors flex items-center gap-2 group/link"
                  >
                    <span className="w-0 h-px bg-indigo-500 transition-all group-hover/link:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 bg-white/5 p-8 rounded-[32px] border border-white/5">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-6">
              Join our Newsletter
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Receive the latest architectural trends and faculty research
              monthly.
            </p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all"
              />
              <button className="absolute right-2 top-2 p-2.5 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">
                <ArrowRight className="h-5 w-5 text-white" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-xs font-bold text-gray-600">
              &copy; {new Date().getFullYear()} ARCHIVE INFRASTRUCTURE. OPERATED
              BY DIGITAL LIBRARY CORP.
            </p>
            <div className="flex items-center gap-6 text-[10px] font-black tracking-widest uppercase">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <span className="w-1 h-1 bg-gray-800 rounded-full" />
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span className="w-1 h-1 bg-gray-800 rounded-full" />
              <Link to="/cookie" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2 text-emerald-500">
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Global CDN Active
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-800 uppercase">
              Latency: 14ms
            </p>
          </div>
        </div>
      </div>

      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
    </footer>
  );
};

const Globe = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

export default Footer;
