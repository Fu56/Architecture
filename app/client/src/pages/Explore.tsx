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
    <div className="min-h-screen bg-[#EFEDED] selection:bg-primary/20 selection:text-[#2A1205]">
      {/* Dynamic Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-[#2A1205]">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.2),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-2/3 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/90/10 border border-primary/90/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                <Compass className="h-3 w-3" /> Navigation Nexus
              </div>
              <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-left-4 duration-1000 delay-200">
                UNCOVER THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 via-purple-400 to-primary/80">
                  ARCHITECT'S MINT.
                </span>
              </h1>
              <p className="max-w-xl text-gray-500 text-xl font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                A decentralized perimeter for architectural intelligence.
                Navigate through high-fidelity BIM families, thesis protocols,
                and technical schemas.
              </p>

              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                <Link
                  to="/browse"
                  className="px-8 py-5 bg-primary hover:bg-white hover:text-[#2A1205] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-500 shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95"
                >
                  Enter Library <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/blog"
                  className="px-8 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-500 flex items-center gap-3"
                >
                  Insights Feed
                </Link>
              </div>
            </div>

            {/* Abstract 3D UI Element */}
            <div className="lg:w-1/3 relative hidden lg:block animate-in zoom-in-95 duration-1000 delay-300">
              <div className="aspect-square relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/90/20 blur-[120px] rounded-full animate-pulse" />
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  {[Box, Cpu, Globe, Database].map((Icon, i) => (
                    <div
                      key={i}
                      className="h-32 w-32 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center justify-center group hover:bg-white/10 transition-all duration-500"
                    >
                      <Icon className="h-10 w-10 text-primary/80 group-hover:scale-110 transition-all duration-500" />
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
                className="bg-white p-8 rounded-[2.5rem] border border-[#D9D9C2] shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:border-primary/40 transition-all duration-500"
              >
                <div className="h-14 w-14 bg-[#EFEDED] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <stat.icon className="h-6 w-6 text-gray-500 group-hover:text-white" />
                </div>
                <h4 className="text-4xl font-black text-[#2A1205] tracking-tighter mb-2">
                  {stat.value.toLocaleString()}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
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
              <h2 className="text-4xl sm:text-5xl font-black text-[#5A270F] tracking-tighter mb-4 leading-none">
                THEMATIC CLUSTERS.
              </h2>
              <p className="text-[#5A270F] font-medium">
                Navigate the library through specific design stage nodes. Each
                cluster contains curated assets tailored for project benchmarks.
              </p>
            </div>
            <Link
              to="/browse"
              className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1 hover:text-[#2A1205] hover:border-[#2A1205] transition-all"
            >
              Full Repository Map
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stages.map((stage) => (
              <Link
                key={stage.id}
                to={`/browse?stage=${stage.id}`}
                className="group relative bg-white p-10 rounded-[3rem] border border-[#D9D9C2] shadow-lg shadow-slate-200/40 overflow-hidden hover:shadow-2xl hover:shadow-primary/30/50 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EFEDED] rounded-bl-[5rem] group-hover:bg-primary transition-all duration-500 flex items-center justify-end pr-8 pt-8">
                  <Sparkles className="h-6 w-6 text-[#EEB38C] group-hover:text-white transition-all" />
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">
                    Segment Node
                  </span>
                  <h3 className="text-2xl font-black text-[#5A270F] group-hover:text-primary transition-colors mb-4 leading-tight">
                    {stage.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                    Verify Access{" "}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Assets */}
      <section className="py-24 bg-[#2A1205] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white underline underline-offset-4 decoration-primary/90 mb-8">
              <Zap className="h-3 w-3 text-primary/80" /> High-Voltage Assets
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-4">
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
              className="inline-flex items-center justify-center px-12 py-6 bg-white text-[#2A1205] font-black uppercase tracking-widest text-xs rounded-[2rem] hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
            >
              View Complete Cluster Matrix
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl sm:text-7xl font-black text-[#2A1205] tracking-tight leading-[0.9] mb-10">
              READY TO <br />
              <span className="text-primary hover:tracking-widest transition-all duration-700 cursor-default">
                CONTRIBUTE?
              </span>
            </h2>
            <p className="text-xl text-[#5A270F] font-medium mb-12">
              Join the inner circle of architectural minds. Securely transmit
              your design protocols, technical briefs, and 3D schemas to our
              global CDN.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center h-24 w-24 bg-primary text-white rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 group"
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
