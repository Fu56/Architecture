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
  Cpu,
  Layers,
} from "lucide-react";

/**
 * Premium Footer Component
 * Designed with high-fidelity architectural aesthetics and digital intelligence theme.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-32 pb-12 overflow-hidden relative">
      {/* Decorative Blueprint Background */}
      <div className="absolute top-0 left-0 w-full h-full blueprint-grid-dark opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand Identity Module */}
          <div className="lg:col-span-5 space-y-12">
            <Link to="/" className="flex items-center gap-5 group">
              <div className="relative p-3.5 bg-indigo-600 rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110">
                <BookOpen className="h-8 w-8 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-tighter text-white leading-none italic uppercase">
                  ARCH
                  <span className="text-indigo-400">VAULT.</span>
                </span>
                <span className="text-[10px] font-black tracking-[0.5em] uppercase text-indigo-400/80 mt-1.5 px-1 py-0.5 bg-indigo-400/5 rounded border border-indigo-400/10 inline-block w-fit">
                  EST. 2024 / NODE-01
                </span>
              </div>
            </Link>

            <p className="text-slate-500 text-xl leading-relaxed max-w-md font-bold italic border-l-2 border-indigo-500/30 pl-8">
              The pre-eminent digital archive for visionary architects.
              Accelerating professional evolution through verified intellectual
              property.
            </p>

            <div className="flex gap-4">
              {[
                { icon: Facebook, label: "Meta" },
                { icon: Twitter, label: "X-Network" },
                { icon: Instagram, label: "Visuals" },
                { icon: Linkedin, label: "Professional" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-5 bg-white/[0.03] border border-white/5 rounded-[1.8rem] text-white/30 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-500 hover:-translate-y-2 group/social shadow-2xl"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 mb-12 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              SYSTEM INDEX
            </h3>
            <ul className="space-y-6 text-[16px] font-black uppercase tracking-tight">
              {[
                { label: "Collective Archive", to: "/browse" },
                { label: "Research Journal", to: "/blog" },
                { label: "Faculty Portal", to: "/login" },
                { label: "Submit Artifact", to: "/upload" },
                { label: "Design Console", to: "/explore" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-500 hover:text-white transition-all flex items-center gap-4 group/link"
                  >
                    <div className="w-2 h-[1px] bg-slate-800 group-hover:w-6 group-hover:bg-indigo-500 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Infrastructure Metrics Module */}
          <div className="lg:col-span-4 bg-white/[0.02] p-12 rounded-[4.5rem] border border-white/5 relative overflow-hidden group/signup">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/signup:opacity-[0.08] transition-all duration-1000 group-hover/signup:rotate-12 group-hover/signup:scale-125">
              <Cpu className="h-48 w-48 text-indigo-500" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <Layers className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                  METRIC SUBSCRIPTION
                </h3>
              </div>

              <p className="text-lg text-slate-500 mb-10 font-bold leading-relaxed">
                Execute registration for our monthly technical publication.
                Zero-Trust verified transmission.
              </p>

              <form className="relative group/input mb-10">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] blur opacity-0 group-focus-within/input:opacity-20 transition" />
                <input
                  type="email"
                  id="footer-subscribe-email"
                  title="Subscription Email"
                  placeholder="STUDIO_IDENTIFIER@SECURE.COM"
                  className="relative w-full bg-slate-950 border border-white/10 rounded-[2rem] py-6 pl-8 pr-20 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-indigo-500 transition-all shadow-2xl placeholder:text-white/10"
                />
                <button
                  type="button"
                  title="Execute Subscription"
                  aria-label="Subscribe to newsletter"
                  className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-600 rounded-[1.5rem] hover:bg-white hover:text-slate-950 transition-all duration-500 text-white shadow-xl shadow-indigo-600/30"
                >
                  <ArrowRight className="h-6 w-6" />
                </button>
              </form>

              <div className="flex items-center gap-4 py-5 px-8 bg-slate-950/80 rounded-[2rem] border border-white/5 shadow-inner">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?u=${i + 60}`}
                        className="grayscale"
                        alt="Subscriber"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">
                    ACTIVE SQUAD
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    5,281 ARCHITECTS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Protocol & Legal */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="flex flex-col items-center lg:items-start gap-6">
            <p className="text-[10px] font-bold tracking-[0.4em] text-slate-700 uppercase">
              &copy; {currentYear} ARCHVAULT DIGITAL ARCHITECTURAL SYSTEMS.
              [BUILD 2024.1.0]
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-12 gap-y-6">
              {[
                { label: "PRIVACY PROTOCOL", to: "/privacy" },
                { label: "SERVICE TERMS", to: "/terms" },
                { label: "DATA COOKIES", to: "/cookies" },
                { label: "ETHICAL CORE", to: "/ethics" },
                { label: "LEGAL REGISTRY", to: "/legal" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-500 hover:text-indigo-400 transition-all relative group/footer-link"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-indigo-600 transition-all group-hover/footer-link:w-full rounded-full" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-2">
            <div className="flex items-center gap-5 px-8 py-4 bg-white/[0.03] rounded-full border border-white/5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 text-emerald-500">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_infinite] shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
                <Globe className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  GLOBAL RELAY: ACTIVE
                </span>
              </div>
              <div className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">
                  ENCRYPTED TLS 1.3
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
