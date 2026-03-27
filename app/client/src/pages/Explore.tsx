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
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#5A270F] font-inter selection:bg-[#DF8142]/20 selection:text-[#5A270F] dark:selection:text-white transition-colors duration-500">
      {/* Dynamic Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-[#FAF8F4] dark:bg-[#2C1105] transition-colors duration-700 border-b border-[#EEB38C]/40 dark:border-[#DF8142]/20">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(223,129,66,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(223,129,66,0.1),transparent_60%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(146,102,74,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(146,102,74,0.05),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] blueprint-grid-dark pointer-events-none" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-2/3 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-[#6C3B1C] border border-[#EEB38C]/50 dark:border-[#DF8142]/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#DF8142] dark:text-[#EEB38C] mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-1000">
                <Compass className="h-3 w-3" /> Navigation Nexus
              </div>
              <h1 className="text-6xl sm:text-8xl font-black text-[#5A270F] dark:text-white tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-left-4 duration-1000 delay-200 font-space-grotesk uppercase">
                UNCOVER THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] dark:via-[#EEB38C] to-[#DF8142] italic">
                  ARCHITECT'S MINT.
                </span>
              </h1>
              <p className="max-w-xl text-[#92664A] dark:text-[#EEB38C]/80 text-xl font-bold leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 transition-colors pl-6 border-l-2 border-[#DF8142]">
                A decentralized perimeter for architectural intelligence.
                Navigate through high-fidelity BIM families, thesis protocols,
                and technical schemas.
              </p>

              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                <Link
                  to="/browse"
                  className="px-8 py-5 bg-[#5A270F] dark:bg-[#DF8142] hover:bg-[#DF8142] dark:hover:bg-white text-white dark:text-[#110703] dark:hover:text-[#5A270F] font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-500 shadow-xl shadow-[#5A270F]/10 dark:shadow-[#DF8142]/20 flex items-center gap-3 active:scale-95"
                >
                  Enter Library <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/blog"
                  className="px-8 py-5 bg-white border border-[#EEB38C] hover:border-[#DF8142] text-[#5A270F] dark:bg-[#6C3B1C] dark:border-[#DF8142]/30 dark:hover:bg-[#92664A] dark:text-[#EEB38C] font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-500 flex items-center gap-3 shadow-sm hover:shadow-lg"
                >
                  Get Notified
                </Link>
              </div>
            </div>

            {/* Abstract UI Elements */}
            <div className="lg:w-1/3 relative hidden lg:block animate-in zoom-in-95 duration-1000 delay-300">
              <div className="aspect-square relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#EEB38C]/30 dark:bg-[#DF8142]/20 blur-[120px] rounded-full animate-pulse" />
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  {[Box, Cpu, Globe, Database].map((Icon, i) => (
                    <div
                      key={i}
                      className="h-32 w-32 bg-white/80 dark:bg-[#5A270F]/80 backdrop-blur-2xl border border-[#EEB38C]/50 dark:border-[#DF8142]/30 rounded-3xl flex items-center justify-center group hover:bg-[#FAF8F4] dark:hover:bg-[#6C3B1C] hover:-translate-y-2 transition-all duration-500 shadow-xl"
                    >
                      <Icon className="h-10 w-10 text-[#DF8142] dark:text-[#EEB38C] group-hover:scale-110 transition-transform duration-500" />
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
              { label: "Assets Isolated", value: stats?.totalResources || 0, icon: Layers },
              { label: "Studio Access", value: stats?.totalUsers || 0, icon: ShieldCheck },
              { label: "Data Transmissions", value: stats?.totalDownloads || 0, icon: Zap },
              { label: "Node Directors", value: stats?.facultyCount || 0, icon: Hexagon },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#FDFCFB] dark:bg-[#6C3B1C] p-8 rounded-[2.5rem] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-lg dark:shadow-2xl flex flex-col items-center text-center group hover:border-[#DF8142] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="h-14 w-14 bg-[#FAF8F4] dark:bg-[#5A270F] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 rounded-[1rem] flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#DF8142] group-hover:text-white dark:group-hover:text-[#110703] transition-all duration-500">
                  <stat.icon className="h-6 w-6 text-[#DF8142] dark:text-[#EEB38C] group-hover:text-white dark:group-hover:text-[#110703] transition-colors" />
                </div>
                <h4 className="text-4xl font-black text-[#5A270F] dark:text-white tracking-tighter mb-2 transition-colors font-space-grotesk">
                  {stat.value.toLocaleString()}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#92664A] dark:text-[#EEB38C]/60 transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Navigator */}
      <section className="py-24 bg-[#FAF8F4] dark:bg-[#5A270F] transition-colors border-y border-[#EEB38C]/40 dark:border-[#DF8142]/20 relative">
        <div className="absolute inset-0 opacity-10 dark:opacity-5 mix-blend-overlay blueprint-grid-dark pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-[#2C1105] rounded text-[8px] font-black uppercase tracking-[0.4em] text-[#DF8142] dark:text-[#EEB38C] shadow-sm border border-[#EEB38C]/50 dark:border-[#DF8142]/20 mb-6">
                ARCHITECTURAL DOMAINS
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6 leading-none transition-colors font-space-grotesk uppercase text-[#5A270F] dark:text-white">
                DESIGN <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] dark:via-[#EEB38C] to-[#DF8142] italic">
                  STAGES.
                </span>
              </h2>
              <p className="font-bold text-[#92664A] dark:text-[#EEB38C]/80 transition-colors pl-6 border-l-2 border-[#DF8142]">
                Navigate the library through specific design stage nodes. Each
                cluster contains curated assets tailored for project benchmarks.
              </p>
            </div>
            <Link
              to="/browse"
              className="text-[9px] font-black uppercase tracking-widest text-[#DF8142] border-b border-[#DF8142] pb-1 hover:text-[#5A270F] dark:hover:text-white hover:border-[#5A270F] dark:hover:border-white transition-all"
            >
              Full Repository Map
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stages.map((stage) => (
              <Link
                key={stage.id}
                to={`/browse?stage=${stage.id}`}
                className="group relative p-10 rounded-[2.5rem] bg-[#FDFCFB] dark:bg-[#6C3B1C] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-lg dark:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#DF8142]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[4rem] group-hover:bg-[#DF8142] transition-colors duration-500 flex items-center justify-end pr-8 pt-6 border-l border-b bg-[#FAF8F4] dark:bg-[#5A270F] border-[#EEB38C]/40 dark:border-[#DF8142]/20 group-hover:border-[#DF8142]">
                  <Sparkles className="h-6 w-6 text-[#DF8142] dark:text-[#EEB38C] group-hover:text-white dark:group-hover:text-[#110703] transition-colors" />
                </div>

                <div className="relative z-10 pt-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#92664A] dark:text-[#EEB38C]/70 mb-4 block group-hover:text-[#DF8142] transition-colors">
                    Stage // Node
                  </span>
                  <h3 className="text-2xl font-black text-[#5A270F] dark:text-white group-hover:text-[#DF8142] transition-colors mb-6 leading-tight font-space-grotesk uppercase">
                    {stage.name}
                  </h3>
                  <div className="flex items-center gap-3 font-black text-[9px] uppercase tracking-widest text-[#DF8142] dark:text-[#EEB38C] group-hover:text-[#5A270F] dark:group-hover:text-white transition-colors">
                    Get Resources{" "}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Assets */}
      <section className="py-28 bg-gradient-to-br from-[#DF8142] to-[#92664A] dark:from-[#2C1105] dark:to-[#0C0502] transition-colors duration-700 overflow-hidden relative border-b border-[#EEB38C]/20 dark:border-[#DF8142]/10">
        <div className="absolute inset-0 bg-[#5A270F]/10 dark:bg-black/20" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/20 dark:bg-[#6C3B1C]/50 backdrop-blur-md border border-white/30 dark:border-[#DF8142]/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white dark:text-[#EEB38C] mb-8 shadow-xl">
              <Zap className="h-3 w-3 text-white dark:text-[#DF8142]" /> High-Voltage Assets
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-4 font-space-grotesk uppercase">
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

          <div className="mt-20 text-center">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center px-10 py-5 bg-white dark:bg-[#5A270F] text-[#5A270F] dark:text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl border dark:border-[#DF8142]/30 hover:bg-[#FAF8F4] dark:hover:bg-[#DF8142] dark:hover:text-[#110703] transition-all duration-500 shadow-2xl active:scale-95 group"
            >
              View Complete Cluster Matrix <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#FDFCFB] dark:bg-[#5A270F] transition-colors duration-700">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto rounded-[3rem] p-16 sm:p-20 bg-white dark:bg-[#6C3B1C] border border-[#EEB38C]/40 dark:border-[#DF8142]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 dark:bg-[#DF8142]/5 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EEB38C]/20 dark:bg-[#EEB38C]/10 blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-4xl sm:text-6xl font-black text-[#5A270F] dark:text-white tracking-tight leading-[0.9] mb-8 font-space-grotesk uppercase">
                READY TO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] dark:via-[#EEB38C] to-[#DF8142] italic">
                  CONTRIBUTE?
                </span>
              </h2>
              <p className="text-lg text-[#92664A] dark:text-[#EEB38C]/80 font-bold mb-12 max-w-lg mx-auto leading-relaxed">
                Join the inner circle of architectural minds. Securely transmit
                your design protocols, technical briefs, and 3D schemas to our
                global CDN.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 bg-[#5A270F] dark:bg-[#DF8142] text-white dark:text-[#110703] rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-[#DF8142]/30 transition-all duration-500 group mx-auto"
              >
                <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;
