import { Link } from "react-router-dom";
import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Globe,
  ShieldCheck,
} from "lucide-react";

/**
 * Premium Footer Component
 * Designed with high-contrast architectural aesthetics.
 */
const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-40 pb-16 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(circle_at_70%_10%,rgba(79,70,229,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-20 mb-32">
          {/* Brand Identity Module */}
          <div className="lg:col-span-4 space-y-10">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="p-3 bg-indigo-600 rounded-[1.25rem] shadow-2xl shadow-indigo-600/30 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-white leading-none">
                  ARCH
                  <span className="text-indigo-500 ml-1">VAULT.</span>
                </span>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-400/60 mt-1">
                  Digital Intelligence
                </span>
              </div>
            </Link>

            <p className="text-slate-500 text-lg leading-relaxed max-w-sm font-medium">
              The premier ecosystem for architectural innovation. Empowering the
              next generation through peer-reviewed research and precision
              assets.
            </p>

            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-500 hover:-translate-y-2 shadow-xl"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white mb-10 pb-4 border-b border-white/5">
              Platform
            </h3>
            <ul className="space-y-6 text-[15px] font-bold">
              {[
                { label: "Collective Archive", to: "/browse" },
                { label: "Research Journal", to: "/blog" },
                { label: "Submit Artifact", to: "/upload" },
                { label: "Member Portal", to: "/login" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-500 hover:text-white transition-all flex items-center gap-3 group/link"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 scale-0 group-hover/link:scale-100 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white mb-10 pb-4 border-b border-white/5">
              Resources
            </h3>
            <ul className="space-y-6 text-[15px] font-bold">
              {[
                { label: "BIM Libraries", to: "/browse?type=rfa" },
                { label: "Social Housing", to: "/browse?tag=social" },
                { label: "Urban Design", to: "/browse?tag=urban" },
                { label: "Technical Docs", to: "/browse?type=pdf" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-500 hover:text-white transition-all flex items-center gap-3 group/link"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 scale-0 group-hover/link:scale-100 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Status Module */}
          <div className="lg:col-span-4 bg-white/[0.02] p-10 rounded-[4rem] border border-white/5 relative overflow-hidden group/signup">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/signup:opacity-10 transition-opacity">
              <ShieldCheck className="h-32 w-32 text-indigo-500" />
            </div>
            <div className="relative z-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white mb-6">
                Industry Updates
              </h3>
              <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">
                Join 5,000+ architects receiving our monthly technical digest.
              </p>
              <form className="relative group/input">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-0 group-focus-within/input:opacity-20 transition" />
                <input
                  type="email"
                  placeholder="Studio email address"
                  className="relative w-full bg-slate-900 border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all shadow-2xl"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-2.5 bottom-2.5 px-4 bg-indigo-600 rounded-xl hover:bg-white hover:text-slate-950 transition-all duration-500 text-white"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-8 flex items-center gap-4 py-4 px-6 bg-slate-900/50 rounded-2xl border border-white/5">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  +5k Subscribed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Master Status */}
        <div className="pt-16 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center lg:items-start gap-3">
            <p className="text-[10px] font-black tracking-[0.3em] text-slate-700 uppercase">
              &copy; {new Date().getFullYear()} ARCHVAULT DIGITAL SYSTEMS. ALL
              RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-8 text-[11px] font-black tracking-widest uppercase text-slate-500">
              {["Privacy", "Terms", "Cookies", "Ethics"].map((label) => (
                <Link
                  key={label}
                  to={`/${label.toLowerCase()}`}
                  className="hover:text-white transition-all relative group/footer-link"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 transition-all group-hover/footer-link:w-full" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-2">
            <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/5 shadow-2xl">
              <div className="flex items-center gap-2.5 text-emerald-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <Globe className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Network Online
                </span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Nodes: 14 REGIONAL
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
