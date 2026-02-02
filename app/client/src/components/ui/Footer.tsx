import { useState } from "react";
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
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "../../lib/toast";
import { api } from "../../lib/api";

/**
 * Premium Footer Component
 * Designed with high-fidelity architectural aesthetics and digital intelligence theme.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerEmail, setFooterEmail] = useState("");
  const [footerSubscribing, setFooterSubscribing] = useState(false);
  const [footerSubscribed, setFooterSubscribed] = useState(false);
  const [footerError, setFooterError] = useState("");

  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFooterError("");

    if (!footerEmail || !footerEmail.includes("@")) {
      setFooterError("Invalid email address. Please enter a valid email.");
      return;
    }

    setFooterSubscribing(true);
    try {
      const { data } = await api.post("/common/subscribe", {
        email: footerEmail,
      });
      toast.success(data.message || "Successfully subscribed to the digest!");
      setFooterSubscribed(true);
      setFooterEmail("");
      setTimeout(() => setFooterSubscribed(false), 3000);
    } catch (error: unknown) {
      let message = "Failed to subscribe. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        message = axiosError.response?.data?.message || message;
      }
      setFooterError(message);
    } finally {
      setFooterSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#5A270F] text-gray-400 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Blueprint Background */}
      <div className="absolute top-0 left-0 w-full h-full blueprint-grid-dark opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#DF8142]/20 to-transparent" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#DF8142]/10 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 lg:mb-24">
          {/* Brand Identity Module */}
          <div className="lg:col-span-5 space-y-12">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative p-3 bg-[#DF8142] rounded-2xl shadow-lg shadow-[#DF8142]/20 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                <BookOpen className="h-7 w-7 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight text-white leading-none uppercase">
                  ARCH
                  <span className="text-[#DF8142]">VAULT</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#EEB38C] mt-1 px-1.5 py-0.5 bg-[#DF8142]/10 rounded border border-[#DF8142]/20 inline-block w-fit">
                  EST. 2024 / NODE-01
                </span>
              </div>
            </Link>

            <p className="text-[#EEB38C]/80 text-lg leading-relaxed max-w-sm font-medium border-l-2 border-[#DF8142]/30 pl-6">
              The digital archive for visionary architects. Accelerating
              evolution through verified intellectual property.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              {[
                { icon: Facebook, label: "Meta" },
                { icon: Twitter, label: "X-Network" },
                { icon: Instagram, label: "Visuals" },
                { icon: Linkedin, label: "Professional" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/30 hover:bg-[#DF8142] hover:text-white hover:border-[#DF8142]/30 transition-all duration-500 hover:-translate-y-1 group/social"
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
              <div className="w-1.5 h-1.5 rounded-full bg-[#DF8142]" />
              SYSTEM INDEX
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-sm font-bold uppercase tracking-wide">
              {[
                { label: "Collective Archive", to: "/browse" },
                { label: "Research Journal", to: "/blog" },
                { label: "Portal", to: "/login" },

                { label: "Design Console", to: "/explore" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[#EEB38C]/70 hover:text-white transition-all flex items-center gap-4 group/link"
                  >
                    <div className="w-2 h-[1px] bg-[#92664A] group-hover/link:w-6 group-hover/link:bg-[#DF8142] transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Infrastructure Metrics Module */}
          <div className="lg:col-span-4 bg-white/[0.02] p-8 rounded-3xl border border-white/5 relative overflow-hidden group/signup">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/signup:opacity-[0.08] transition-all duration-1000 group-hover/signup:rotate-12 group-hover/signup:scale-125">
              <Cpu className="h-48 w-48 text-[#DF8142]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <Layers className="h-5 w-5 text-[#DF8142]" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white">
                  METRIC SUBSCRIPTION
                </h3>
              </div>

              <p className="text-base text-[#EEB38C]/80 mb-8 font-medium leading-relaxed">
                Registration for our monthly technical publication. Zero-Trust
                verified transmission.
              </p>

              <form
                onSubmit={handleFooterSubscribe}
                className="relative group/input mb-8"
              >
                <div className="absolute -inset-0.5 bg-[#DF8142] rounded-2xl blur opacity-0 group-focus-within/input:opacity-10 transition" />
                <div className="relative">
                  <input
                    type="email"
                    id="footer-subscribe-email"
                    title="Subscription Email"
                    value={footerEmail}
                    onChange={(e) => {
                      setFooterEmail(e.target.value);
                      if (footerError) setFooterError("");
                    }}
                    disabled={footerSubscribing || footerSubscribed}
                    placeholder="Enter your email identifier..."
                    className={`relative w-full bg-[#6C3B1C]/20 border ${footerError ? "border-red-500/50" : "border-white/10"} rounded-xl py-4 pl-6 pr-16 text-xs font-bold text-white outline-none focus:border-[#DF8142] transition-all placeholder:text-white/20 disabled:opacity-50`}
                  />
                  <button
                    type="submit"
                    disabled={footerSubscribing || footerSubscribed}
                    title="Execute Subscription"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#DF8142] rounded-lg hover:bg-white hover:text-[#5A270F] transition-all duration-300 text-white shadow-lg shadow-[#DF8142]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {footerSubscribing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : footerSubscribed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {footerError && (
                  <p className="mt-2 text-xs text-red-400 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                    {footerError}
                  </p>
                )}
              </form>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 px-4 sm:px-6 bg-[#6C3B1C]/30 rounded-2xl border border-white/5">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-[#5A270F] bg-[#92664A] overflow-hidden"
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
                  <span className="text-[9px] font-medium text-[#EEB38C] uppercase tracking-widest">
                    5,281 ARCHITECTS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Protocol & Legal */}
        <div className="pt-8 sm:pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-16">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <p className="text-[9px] font-medium tracking-widest text-[#92664A] uppercase">
              &copy; {currentYear} ARCHVAULT DIGITAL ARCHITECTURAL SYSTEMS.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 sm:gap-x-10 gap-y-3 sm:gap-y-4">
              {[
                { label: "PRIVACY PROTOCOL", to: "/privacy" },
                { label: "SERVICE TERMS", to: "/terms" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-[10px] font-bold tracking-widest uppercase text-[#EEB38C]/70 hover:text-[#DF8142] transition-all relative group/footer-link"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DF8142] transition-all group-hover/footer-link:w-full rounded-full" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-2 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 bg-white/5 rounded-full border border-white/5 shadow-xl backdrop-blur-md w-full sm:w-auto">
              <div className="flex items-center gap-3 text-[#EEB38C]">
                <div className="w-2 h-2 rounded-full bg-[#DF8142] animate-pulse shadow-[0_0_8px_rgba(223,129,66,0.4)]" />
                <Globe className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  GLOBAL RELAY: ACTIVE
                </span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#DF8142]" />
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
