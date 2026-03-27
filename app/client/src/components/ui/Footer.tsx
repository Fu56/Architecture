import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Users } from "lucide-react";
import { toast } from "../../lib/toast";
import { api } from "../../lib/api";
import { useTheme } from "../../context/useTheme";

interface Stats {
  totalUsers: number;
  newsletterCount: number;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerEmail, setFooterEmail] = useState("");
  const [footerSubscribing, setFooterSubscribing] = useState(false);
  const [footerSubscribed, setFooterSubscribed] = useState(false);
  const [footerError, setFooterError] = useState("");
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newsletterCount: 0,
  });

  const { theme } = useTheme();
  const isLight = theme === "light";

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/common/stats");
      if (data) {
        setStats({
          totalUsers: data.totalUsers || 0,
          newsletterCount: data.newsletterCount || 0,
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
      setFooterError("Please enter a valid email address.");
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
      fetchStats();
      setTimeout(() => setFooterSubscribed(false), 3000);
    } catch (error: unknown) {
      let message = "Subscription failed. Please try again.";
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
    <footer
      className={`relative py-20 transition-colors duration-500 overflow-hidden ${isLight ? "bg-[#FAF8F4] border-t border-[#EEB38C]/30" : "bg-[#080402] border-t border-white/5"}`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(223,129,66,0.03),transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(146,102,74,0.05),transparent_70%)] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Brand & Introduction */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#DF8142] to-[#5A270F] flex items-center justify-center rounded-2xl shadow-xl shadow-[#DF8142]/20 group-hover:scale-105 transition-transform duration-500">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-3xl font-black tracking-tight uppercase leading-none font-space-grotesk ${isLight ? "text-[#5A270F]" : "text-white"}`}
                >
                  ARCH<span className="text-[#DF8142]">VAULT.</span>
                </span>
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/60"}`}
                >
                  Wollo University KIOT CAMPUS <br></br>
                  Faculty Of Architecture
                </span>
              </div>
            </Link>

            <p
              className={`text-base font-medium leading-relaxed max-w-sm pt-2 ${isLight ? "text-[#5A270F] text-opacity-80" : "text-[#EEB38C] text-opacity-70"}`}
            >
              The authenticated architectural archive for professional thesis
              standards and engineering blueprints. Navigating the future of
              spatial intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 lg:col-start-6 space-y-8">
            <h3
              className={`text-sm font-black uppercase tracking-widest ${isLight ? "text-[#5A270F]" : "text-white"}`}
            >
              Navigation
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Explore Library", to: "/explore" },
                { label: "Asset Protocols", to: "/browse" },
                { label: "Knowledge Base", to: "/blog" },
                { label: "Portal Access", to: "/login" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={`text-sm font-medium transition-colors hover:text-[#DF8142] ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/60"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Community */}
          <div className="lg:col-span-4 space-y-8">
            <h3
              className={`text-sm font-black uppercase tracking-widest ${isLight ? "text-[#5A270F]" : "text-white"}`}
            >
              Join The Studio
            </h3>
            <p
              className={`text-sm font-medium ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/60"}`}
            >
              Subscribe to receive weekly curated assets, thesis briefs, and
              premium design patterns directly.
            </p>

            <form onSubmit={handleFooterSubscribe} className="relative mt-2">
              <div
                className={`flex items-center p-1.5 rounded-full border transition-all duration-300 focus-within:ring-4 focus-within:ring-[#DF8142]/20 focus-within:border-[#DF8142] ${isLight ? "bg-white border-[#EEB38C]/50 shadow-sm" : "bg-white/5 border-white/10"}`}
              >
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => {
                    setFooterEmail(e.target.value);
                    if (footerError) setFooterError("");
                  }}
                  placeholder="Enter your email..."
                  className={`flex-1 bg-transparent px-5 py-3 text-sm font-medium outline-none ${isLight ? "text-[#5A270F] placeholder:text-[#92664A]/50" : "text-white placeholder:text-[#EEB38C]/40"}`}
                />
                <button
                  type="submit"
                  disabled={footerSubscribing || footerSubscribed}
                  className="px-6 py-3 bg-[#DF8142] hover:bg-[#5A270F] text-white rounded-full font-bold text-sm transition-all duration-300 disabled:opacity-50 flex items-center gap-2 group whitespace-nowrap"
                >
                  {footerSubscribing ? "Joining..." : "Subscribe"}
                  {!footerSubscribing && (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
              {footerError && (
                <p className="absolute -bottom-6 left-4 text-xs font-bold text-red-500">
                  {footerError}
                </p>
              )}
            </form>

            <div
              className={`flex items-center gap-4 pt-6 mt-4 border-t ${isLight ? "border-[#EEB38C]/20" : "border-white/5"}`}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isLight ? "bg-[#FAF8F4] border-white" : "bg-[#1A0B02] border-[#080402]"}`}
                  >
                    <Users
                      className={`w-3.5 h-3.5 ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/60"}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-xs font-black ${isLight ? "text-[#5A270F]" : "text-white"}`}
                >
                  {(stats.totalUsers + stats.newsletterCount).toLocaleString()}+
                  Architects
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/40"}`}
                >
                  Global Community
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${isLight ? "border-[#EEB38C]/30" : "border-white/5"}`}
        >
          <p
            className={`text-xs font-bold uppercase tracking-widest ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/40"}`}
          >
            &copy; {currentYear} ARCHVAULT. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link
              to="/privacy"
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${isLight ? "text-[#92664A] hover:text-[#DF8142]" : "text-[#EEB38C]/40 hover:text-white"}`}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${isLight ? "text-[#92664A] hover:text-[#DF8142]" : "text-[#EEB38C]/40 hover:text-white"}`}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
