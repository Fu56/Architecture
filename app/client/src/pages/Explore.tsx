import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Layers,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Hexagon,
  Compass,
  Cpu,
  Globe,
  Database,
} from "lucide-react";
import { api } from "../lib/api";
import type { Resource, DesignStage } from "../models";
import ResourceCard from "../components/ui/ResourceCard";
import { useTheme } from "../context/useTheme";

interface Stats {
  totalResources: number;
  totalUsers: number;
  totalDownloads: number;
  facultyCount: number;
}

const Explore = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [stages, setStages] = useState<DesignStage[]>([]);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const FONT_LINK_ID = "explore-page-fonts";
    if (!document.getElementById(FONT_LINK_ID)) {
      const link = document.createElement("link");
      link.id = FONT_LINK_ID;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }

    const fetchData = async () => {
      try {
        const [statsRes, stagesRes, resourcesRes] = await Promise.all([
          api.get("/common/stats"),
          api.get("/common/design-stages"),
          api.get("/resources?status=student&sort=newest"),
        ]);

        setStats(statsRes.data);
        setStages(stagesRes.data);
        setRecentResources(resourcesRes.data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch explore data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0F0602] font-inter selection:bg-[#DF8142]/20 selection:text-[#5A270F] transition-colors duration-500">
      {/* Dynamic Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-[#5A270F] dark:bg-[#1A0B02] transition-colors duration-700">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(223,129,66,0.2),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(223,129,66,0.1),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(146,102,74,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(146,102,74,0.05),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-2/3 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#DF8142]/10 border border-[#DF8142]/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#DF8142] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                <Compass className="h-3 w-3" /> Navigation Nexus
              </div>
              <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-left-4 duration-1000 delay-200 font-space-grotesk">
                UNCOVER THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#DF8142]">
                  ARCHITECT'S MINT.
                </span>
              </h1>
              <p className="max-w-xl text-[#92664A] dark:text-[#EEB38C]/60 text-xl font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 transition-colors">
                A decentralized perimeter for architectural intelligence.
                Navigate through high-fidelity BIM families, thesis protocols,
                and technical schemas.
              </p>

              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                <Link
                  to="/browse"
                  className="px-8 py-5 bg-[#DF8142] hover:bg-white dark:bg-card hover:text-[#5A270F] dark:text-[#EEB38C] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-500 shadow-xl shadow-[#DF8142]/20 flex items-center gap-3 active:scale-95"
                >
                  Enter Library <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/blog"
                  className="px-8 py-5 bg-white/5 dark:bg-card/5 border border-white/10 hover:bg-white/10 dark:bg-card/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-500 flex items-center gap-3"
                >
                  Get Notified
                </Link>
              </div>
            </div>

            {/* Abstract 3D UI Element */}
            <div className="lg:w-1/3 relative hidden lg:block animate-in zoom-in-95 duration-1000 delay-300">
              <div className="aspect-square relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#DF8142]/20 blur-[120px] rounded-full animate-pulse" />
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  {[Box, Cpu, Globe, Database].map((Icon, i) => (
                    <div
                      key={i}
                      className="h-32 w-32 bg-white/5 dark:bg-card/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center justify-center group hover:bg-white/10 dark:bg-card/10 transition-all duration-500"
                    >
                      <Icon className="h-10 w-10 text-[#DF8142] group-hover:scale-110 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Pulse (Stats) */}
      <section className="py-20 relative -mt-10 z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Assets Isolated",
                value: stats?.totalResources || 0,
                icon: Layers,
              },
              {
                label: "Studio Access",
                value: stats?.totalUsers || 0,
                icon: ShieldCheck,
              },
              {
                label: "Data Transmissions",
                value: stats?.totalDownloads || 0,
                icon: Zap,
              },
              {
                label: "Node Directors",
                value: stats?.facultyCount || 0,
                icon: Hexagon,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center text-center group hover:border-[#DF8142]/40 dark:hover:border-[#DF8142]/30 transition-all duration-500"
              >
                <div className="h-14 w-14 bg-[#FAF8F4] dark:bg-white/5 border border-[#EEB38C]/30 dark:border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#DF8142] group-hover:text-white transition-all duration-500">
                  <stat.icon className="h-6 w-6 text-[#DF8142] dark:text-[#EEB38C]/60 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-4xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter mb-2 transition-colors font-space-grotesk">
                  {stat.value.toLocaleString()}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#92664A] dark:text-foreground/40 transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Navigator */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <h2 className={`text-4xl sm:text-5xl font-black tracking-tighter mb-4 leading-none transition-colors font-space-grotesk ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>
                DESIGN STAGES.
              </h2>
              <p className={`font-medium transition-colors ${isLight ? "text-[#92664A]" : "text-white/60"}`}>
                Navigate the library through specific design stage nodes. Each
                cluster contains curated assets tailored for project benchmarks.
              </p>
            </div>
            <Link
              to="/browse"
              className="text-xs font-black uppercase tracking-widest text-[#DF8142] border-b-2 border-[#DF8142] pb-1 hover:text-[#5A270F] dark:text-[#EEB38C] hover:border-[#5A270F] transition-all"
            >
              Full Repository Map
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stages.map((stage) => (
              <Link
                key={stage.id}
                to={`/browse?stage=${stage.id}`}
                className={`group relative p-10 rounded-[3rem] border shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 ${isLight ? "bg-white border-[#92664A]/20 shadow-[#DF8142]/10 hover:shadow-[#DF8142]/30 hover:border-[#DF8142]/30" : "bg-card border-white/10 shadow-none hover:border-[#DF8142]/20"}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[5rem] group-hover:bg-[#DF8142] transition-all duration-500 flex items-center justify-end pr-8 pt-8 border-l border-b ${isLight ? "bg-[#EEB38C]/10 border-[#92664A]/10 group-hover:border-[#DF8142]" : "bg-white/5 border-transparent"}`}>
                  <Sparkles className={`h-6 w-6 group-hover:text-white transition-all ${isLight ? "text-[#DF8142]" : "text-[#EEB38C]/40"}`} />
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#DF8142] mb-4 block">
                    Design Stage
                  </span>
                  <h3 className={`text-2xl font-black group-hover:text-[#DF8142] transition-colors mb-4 leading-tight font-space-grotesk ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>
                    {stage.name}
                  </h3>
                  <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest group-hover:text-[#DF8142] transition-colors ${isLight ? "text-[#92664A]" : "text-white/40"}`}>
                    Get Resources{" "}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Assets */}
      <section className="py-24 bg-[#5A270F] dark:bg-[#1A0B02] transition-colors duration-700 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 dark:bg-card/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white underline underline-offset-4 decoration-[#DF8142]/90 mb-8">
              <Zap className="h-3 w-3 text-[#DF8142]/80" /> High-Voltage Assets
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-4 font-space-grotesk">
              RECENTLY ISOLATED.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentResources.map((resource) => (
              <div key={resource.id} className="h-full">
                <ResourceCard resource={resource} />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center px-12 py-6 bg-white dark:bg-card text-[#5A270F] dark:text-[#EEB38C] font-black uppercase tracking-widest text-xs rounded-[2rem] hover:bg-[#DF8142] hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
            >
              View Complete Cluster Matrix
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white dark:bg-card transition-colors duration-700">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl sm:text-7xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight leading-[0.9] mb-10 transition-colors font-space-grotesk">
              READY TO <br />
              <span className="text-[#DF8142] hover:tracking-widest transition-all duration-700 cursor-default">
                CONTRIBUTE?
              </span>
            </h2>
            <p className="text-xl text-[#5A270F] dark:text-foreground/70 font-medium mb-12 transition-colors">
              Join the inner circle of architectural minds. Securely transmit
              your design protocols, technical briefs, and 3D schemas to our
              global CDN.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center h-24 w-24 bg-[#DF8142] text-white rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-[#DF8142]/50 transition-all duration-500 group"
            >
              <ArrowRight className="h-10 w-10 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;
