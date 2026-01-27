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
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Blueprint Background */}
      <div className="absolute top-0 left-0 w-full h-full blueprint-grid-dark opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand Identity Module */}
          <div className="lg:col-span-5 space-y-12">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative p-3 bg-indigo-600 rounded-2xl shadow-lg transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                <BookOpen className="h-7 w-7 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight text-white leading-none uppercase">
                  ARCH
                  <span className="text-indigo-400">VAULT</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-indigo-400/80 mt-1 px-1.5 py-0.5 bg-indigo-400/5 rounded border border-indigo-400/10 inline-block w-fit">
                  EST. 2024 / NODE-01
                </span>
              </div>
            </Link>

            <p className="text-slate-500 text-lg leading-relaxed max-w-sm font-medium border-l-2 border-indigo-500/20 pl-6">
              The digital archive for visionary architects. Accelerating
              evolution through verified intellectual property.
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
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/30 hover:bg-indigo-600 hover:text-white transition-all duration-500 hover:-translate-y-1 group/social"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              SYSTEM INDEX
            </h3>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-wide">
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
          <div className="lg:col-span-4 bg-white/[0.02] p-8 rounded-3xl border border-white/5 relative overflow-hidden group/signup">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/signup:opacity-[0.08] transition-all duration-1000 group-hover/signup:rotate-12 group-hover/signup:scale-125">
              <Cpu className="h-48 w-48 text-indigo-500" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <Layers className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white">
                  METRIC SUBSCRIPTION
                </h3>
              </div>

              <p className="text-base text-slate-500 mb-8 font-medium leading-relaxed">
                Registration for our monthly technical publication. Zero-Trust
                verified transmission.
              </p>

              <form className="relative group/input mb-8">
                <div className="absolute -inset-0.5 bg-indigo-600 rounded-2xl blur opacity-0 group-focus-within/input:opacity-10 transition" />
                <input
                  type="email"
                  id="footer-subscribe-email"
                  title="Subscription Email"
                  placeholder="Enter your email identifier..."
                  className="relative w-full bg-slate-950 border border-white/10 rounded-xl py-4 pl-6 pr-16 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all placeholder:text-white/10"
                />
                <button
                  type="button"
                  title="Execute Subscription"
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-600 rounded-lg hover:bg-white hover:text-slate-950 transition-all duration-300 text-white shadow-lg shadow-indigo-600/20"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <div className="flex items-center gap-4 py-4 px-6 bg-slate-950/80 rounded-2xl border border-white/5">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden"
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
                  <span className="text-[8px] font-bold text-white uppercase tracking-widest">
                    ACTIVE SQUAD
                  </span>
                  <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">
                    5,281 ARCHITECTS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Protocol & Legal */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <p className="text-[9px] font-medium tracking-widest text-slate-700 uppercase">
              &copy; {currentYear} ARCHVAULT DIGITAL ARCHITECTURAL SYSTEMS.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-10 gap-y-4">
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
                  className="text-[10px] font-bold tracking-widest uppercase text-slate-600 hover:text-indigo-400 transition-all relative group/footer-link"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover/footer-link:w-full rounded-full" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-2">
            <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/5 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3 text-emerald-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <Globe className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  GLOBAL RELAY: ACTIVE
                </span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
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
