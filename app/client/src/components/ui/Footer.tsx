import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Globe,
  ShieldCheck,
  Cpu,
  Users,
} from "lucide-react";
import { toast } from "../../lib/toast";
import { api } from "../../lib/api";

interface Stats {
  totalUsers: number;
  newsletterCount: number;
  activeSquad: { email: string; image: string | null }[];
}

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
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newsletterCount: 0,
    activeSquad: [],
  });

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/common/stats");
      if (data) {
        setStats({
          totalUsers: data.totalUsers || 0,
          newsletterCount: data.newsletterCount || 0,
          activeSquad: data.activeSquad || [],
        });
      }
    } catch (err) {
      console.error("Failed to fetch footer stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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

      // Refresh real-time stats
      fetchStats();

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
    <footer className="relative bg-white dark:bg-[#080402] border-t border-[#D9D9C2]/40 dark:border-white/5 py-24 transition-colors duration-500">
      {/* Structural Document Grid */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.04] pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Institutional Branding Block */}
          <div className="lg:col-span-12 border-b border-[#D9D9C2]/40 dark:border-white/5 pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-[#5A270F] flex items-center justify-center p-2.5 rounded-lg shadow-xl">
                    <BookOpen className="w-full h-full text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-4xl font-black tracking-tighter text-[#5A270F] dark:text-white uppercase italic leading-none">
                        ARCH<span className="text-[#DF8142]">VAULT.</span>
                    </span>
                    <span className="text-[10px] font-black tracking-[0.6em] text-[#DF8142] uppercase mt-1">
                        CENTRAL_REPOSITORY
                    </span>
                </div>
              </Link>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-white">
                    Wollo University // KIOT Campus
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5A270F]/40 dark:text-white/20">
                    Faculty of Architecture & Urban Design
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-3 text-left md:text-right max-w-md">
                <p className="text-[11px] font-bold leading-relaxed text-[#6C3B1C] dark:text-white/40 uppercase tracking-widest">
                    The authenticated architectural archive for professional thesis standards and engineering blueprints at Wollo University.
                </p>
                <div className="h-0.5 w-12 bg-[#DF8142]" />
            </div>
          </div>

          {/* Site Matrix & Sync Node */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-20">
            {/* Index 01 */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5A270F] dark:text-white flex items-center gap-3">
                <div className="w-1 h-1 bg-[#DF8142]" />
                INDEX_MATRICES
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "EXPLORE_ALL", to: "/explore" },
                  { label: "BLUEPRINT_ARCHIVE", to: "/browse" },
                  { label: "THESIS_REPORTS", to: "/resources" },
                  { label: "KNOWLEDGE_BASE", to: "/blog" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#6C3B1C]/60 dark:text-white/30 hover:text-[#5A270F] dark:hover:text-white transition-all">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Index 02 */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5A270F] dark:text-white flex items-center gap-3">
                <div className="w-1 h-1 bg-[#DF8142]" />
                PROTOCOL_NODES
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "SYNC_PORTAL", to: "/login" },
                  { label: "UPLOAD_PROTOCOL", to: "/dashboard/upload" },
                  { label: "SECURITY_LEGACY", to: "/about" },
                  { label: "ACCESS_TERMS", to: "/terms" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#6C3B1C]/60 dark:text-white/30 hover:text-[#5A270F] dark:hover:text-white transition-all">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Index 03 - Technical Metadata */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5A270F] dark:text-white flex items-center gap-3">
                <div className="w-1 h-1 bg-[#5A270F] dark:bg-white" />
                SYSTEM_STATUS
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Globe className="h-3 w-3 text-[#DF8142]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5A270F]/60 dark:text-white/40">
                        RELAY: ACTIVE
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-3 w-3 text-[#DF8142]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5A270F]/60 dark:text-white/40">
                        TLS_1.3 ENCRYPTED
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Cpu className="h-3 w-3 text-[#DF8142]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5A270F]/60 dark:text-white/40">
                        KERNEL_4.2.0
                    </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Engine Module */}
          <div className="lg:col-span-4 lg:pl-16 lg:border-l border-[#D9D9C2]/40 dark:border-white/5 space-y-10">
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5A270F] dark:text-white">
                    GLOBAL_INTELLIGENCE_SYNC
                </h3>
                <p className="text-[11px] font-bold leading-relaxed text-[#6C3B1C] dark:text-white/40 uppercase tracking-widest italic">
                    Establish an encrypted relay connection for monthly architectural intelligence transmissions.
                </p>
            </div>

            <form onSubmit={handleFooterSubscribe} className="space-y-4">
                <div className="relative group">
                    <input
                        type="email"
                        value={footerEmail}
                        onChange={(e) => {
                            setFooterEmail(e.target.value);
                            if (footerError) setFooterError("");
                        }}
                        placeholder="IDENTIFIER@RECIPIENT.EDU"
                        className="w-full bg-[#EFEDED]/50 dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 px-0 py-3 text-[10px] font-black text-[#5A270F] dark:text-white outline-none focus:border-[#DF8142] transition-all placeholder:text-[#92664A]/30 transition-all border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
                    />
                    <button
                        type="submit"
                        disabled={footerSubscribing || footerSubscribed}
                        className="absolute right-0 top-0 bottom-0 text-[#DF8142] font-black text-[10px] uppercase tracking-[0.4em] hover:text-[#5A270F] dark:hover:text-white transition-all disabled:opacity-50"
                    >
                        {footerSubscribing ? "SYNCING..." : "EXECUTE"}
                    </button>
                </div>
                {footerError && <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">{footerError}</p>}
            </form>

            <div className="pt-6 border-t border-[#D9D9C2]/40 dark:border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[#DF8142] uppercase tracking-[0.3em]">
                        {(stats.totalUsers + stats.newsletterCount).toLocaleString()} UNITS
                    </span>
                    <span className="text-[8px] font-bold text-[#5A270F]/40 dark:text-white/20 uppercase tracking-[0.4em]">
                        VERIFIED_NODES
                    </span>
                </div>
                <div className="flex -space-x-1.5">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-6 h-6 rounded border border-white/20 bg-[#5A270F] flex items-center justify-center">
                            <Users className="w-3 h-3 text-[#EEB38C]" />
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Legal Protocol Bar */}
          <div className="lg:col-span-12 pt-10 border-t border-[#D9D9C2]/40 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <span className="text-[9px] font-black tracking-[0.6em] text-[#5A270F]/30 dark:text-white/20 uppercase">
                &copy; {currentYear} ARCHVAULT // CORE_REGISTRY // ALL_RIGHTS_RESERVED
            </span>
            <div className="flex items-center gap-8">
                <Link to="/privacy" className="text-[9px] font-black uppercase tracking-[0.5em] text-[#5A270F]/30 dark:text-white/20 hover:text-[#DF8142] transition-colors">
                    PRIVACY_PROTOCOL
                </Link>
                <Link to="/terms" className="text-[9px] font-black uppercase tracking-[0.5em] text-[#5A270F]/30 dark:text-white/20 hover:text-[#DF8142] transition-colors">
                    TERMS_SERVICE
                </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
