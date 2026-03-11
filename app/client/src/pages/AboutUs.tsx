import {
  Users,
  Target,
  ShieldCheck,
  Map,
  Globe,
  Award,
  ArrowRight,
  Hexagon,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/useTheme";

const AboutUs = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0F0602] font-inter selection:bg-[#DF8142]/20 selection:text-[#5A270F] transition-colors duration-500">
      {/* Split Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32 bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(223,129,66,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(90,39,15,0.1),transparent_50%)]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#DF8142]/10 border border-[#DF8142]/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#DF8142] mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <Hexagon className="h-3 w-3" /> Core Identity
              </div>
              <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-left-4 duration-700 delay-200 font-space-grotesk">
                REDEFINING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#DF8142]">
                  ARCHITECTURAL SHARE.
                </span>
              </h1>
              <p className="max-w-xl text-[#EEB38C]/80 dark:text-white/40 text-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                We are the architectural pulse of digital intelligence. A
                centralized repository engineered for students, nurtured by
                faculty, and scaled for the future of design.
              </p>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-6 animate-in zoom-in-95 duration-1000 delay-300">
              {[
                { title: "20+", label: "Academic Hubs", icon: Map },
                { title: "Global", label: "Access Control", icon: Globe },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#FAF8F4]/5 dark:bg-card/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] group hover:bg-[#FAF8F4]/10 dark:bg-card/10 transition-all duration-500"
                >
                  <item.icon className="h-10 w-10 text-[#DF8142] mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-4xl font-black text-white mb-2 tracking-tight font-space-grotesk">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Critical Section */}
      <section className="py-32">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-[#FAF8F4] dark:bg-background rounded-[4rem] p-12 sm:p-24 border border-[#BCAF9C] dark:border-white/10 relative overflow-hidden text-[#5A270F] dark:text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-20">
              <div className="lg:w-1/3">
                <h2 className="text-4xl sm:text-5xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter mb-6 leading-[0.9] font-space-grotesk">
                  MISSION <br /> CRITICAL.
                </h2>
                <p className="text-[#5A270F] dark:text-[#EEB38C] font-medium">
                  Engineered to bridge the gap between academic theory and
                  technical implementation through shared intelligence.
                </p>
              </div>

              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  {
                    title: "Knowledge Parity",
                    desc: "Ensuring every student has access to top-tier BIM families, thesis protocols, and design schemas regardless of their local nexus.",
                    icon: Target,
                  },
                  {
                    title: "Faculty Synergy",
                    desc: "Providing educators with a high-fidelity platform to distribute curated technical specifications and industrial standards.",
                    icon: Users,
                  },
                  {
                    title: "Metadata Integrity",
                    desc: "Rigorous verification systems ensuring every asset distributed meets the structural benchmarks of the architectural matrix.",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Excellence Protocol",
                    desc: "A reward-driven ecosystem where top-performing assets are highlighted through community evaluation and peer validation.",
                    icon: Award,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="shrink-0 h-16 w-16 bg-white dark:bg-card rounded-2xl flex items-center justify-center border border-[#BCAF9C] dark:border-white/10 shadow-md group-hover:bg-[#DF8142] transition-all duration-500">
                      <item.icon className="h-7 w-7 text-[#DF8142] group-hover:text-white transition-all" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#1A0B04] dark:text-[#EEB38C] mb-3 tracking-tight group-hover:text-[#DF8142] transition-colors uppercase text-sm font-space-grotesk">
                        {item.title}
                      </h4>
                      <p className="text-[#3E1C0A] dark:text-[#EEB38C]/80 font-bold leading-relaxed text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborative Nexus - Interdisciplinary Engineering */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(223,129,66,0.1),transparent_50%)]" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(90,39,15,0.15),transparent_50%)]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse gap-24 items-center">
            {/* Structural Imagery */}
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#DF8142] to-[#5A270F] rounded-[4rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10 shadow-3xl">
                <img
                  src="/assets/collaborators.png"
                  className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-[2s] scale-105 group-hover:scale-110"
                  alt="Interdisciplinary Engineering Team"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1205] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-10 left-10 p-8 glass-morphism rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                  <p className="text-[#EEB38C] text-xs font-black uppercase tracking-[0.4em] mb-2">
                    SYNERGY STATUS
                  </p>
                  <h3 className="text-white text-2xl font-black uppercase tracking-tight font-space-grotesk">
                    FULLY INTEGRATED
                  </h3>
                </div>
              </div>
            </div>

            {/* Strategic Narrative */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#DF8142]/10 border border-[#DF8142]/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#DF8142] mb-8">
                DEPT COLLABORATION
              </div>
              <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-10 leading-[0.9] font-space-grotesk">
                ENGINEERED BY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#DF8142]">
                  DUAL PERSPECTIVES.
                </span>
              </h2>
              <div className="space-y-8">
                <p className="text-gray-300 dark:text-white/30 text-lg font-medium leading-relaxed italic border-l-4 border-[#DF8142] pl-8">
                  "The most powerful architectural tools aren't built in
                  isolation. They are born at the intersection of spatial
                  creativity and algorithmic precision."
                </p>
                <div className="grid sm:grid-cols-2 gap-8 pt-8">
                  <div className="space-y-4">
                    <h4 className="text-[#EEB38C] font-black uppercase tracking-widest text-xs">
                      Architecture Students
                    </h4>
                    <p className="text-gray-400 dark:text-white/40 text-sm leading-relaxed font-medium text-[#EEB38C]/60">
                      Defining the spatial logic, resource criticality, and the
                      professional benchmarks that drive the library's curation.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[#DF8142] font-black uppercase tracking-widest text-xs">
                      Software Students
                    </h4>
                    <p className="text-gray-400 dark:text-white/40 text-sm leading-relaxed font-medium text-[#EEB38C]/60">
                      Implementing the high-performance architecture, secure
                      distribution nodes, and the intuitive user experience
                      layers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#FAF8F4] dark:bg-background transition-colors duration-500 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BCAF9C]/20 to-transparent -translate-y-1/2 hidden lg:block" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center mb-24">
            <div className={`inline-flex items-center gap-3 px-6 py-2 ${isDark ? "bg-white/10" : "bg-[#DF8142]/10"} border border-[#BCAF9C] dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-[#DF8142] mb-8 shadow-sm`}>
              <Award className="h-4 w-4" /> THE MILESTONE LOG
            </div>
            <h2 className={`text-5xl sm:text-7xl font-black ${isDark ? "text-[#EEB38C]" : "text-[#1A0B04]"} tracking-tighter leading-[0.9] mb-8 font-space-grotesk uppercase`}>
              THE WOLLO <br /> UNIVERSITY <span className="text-[#DF8142]">LEGACY.</span>
            </h2>
            <div className="h-1 w-20 bg-[#DF8142] rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Timeline Connectors for Mobile */}
            <div className="absolute left-8 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-[#BCAF9C]/30 to-transparent lg:hidden" />

            {/* Card 1: Prototype */}
            <div className="relative bg-white dark:bg-card p-12 rounded-[3.5rem] border-2 border-[#BCAF9C]/30 dark:border-white/10 shadow-xl shadow-[#5A270F]/5 group hover:border-[#DF8142] transition-all duration-700">
              <div className="absolute -top-6 left-12 h-12 w-12 bg-white dark:bg-background border-2 border-[#BCAF9C] dark:border-white/10 rounded-2xl flex items-center justify-center text-[#1A0B04] font-black text-xs z-20 group-hover:bg-[#DF8142] group-hover:text-white transition-all">
                01
              </div>
              <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-[0.4em] mb-6">
                Historical Origin
              </p>
              <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-[#1A0B04]"} mb-8 uppercase tracking-tight font-space-grotesk leading-none`}>
                Prototype <br /> Genesis
              </h3>
              <p className={`${isDark ? "text-white/60" : "text-[#1A0B04]/80"} font-bold text-sm leading-relaxed mb-10`}>
                The foundational matrix was conceptualized and prototyped during
                the collaborative research phase of the 2025 graduating class.
              </p>
              <div className="flex items-center gap-4 text-[#1A0B04] dark:text-[#EEB38C] pt-6 border-t border-[#BCAF9C]/20">
                <Map className="h-5 w-5 text-[#DF8142]" />
                <span className={`font-black tracking-[0.2em] text-[10px] uppercase ${isDark ? "text-[#EEB38C]" : "text-[#1A0B04]"}`}>
                  Established March 2025
                </span>
              </div>
            </div>

            {/* Card 2: Collaboration (Featured) */}
            <div className="relative bg-gradient-to-br from-[#1A0B04] via-[#5A270F] to-[#1A0B04] p-12 lg:p-14 rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(26,11,4,0.6)] scale-105 z-20 overflow-hidden group border border-white/5">
              {/* Dynamic Glow & Digital Atmosphere */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/30 blur-[100px] group-hover:bg-[#DF8142]/50 transition-all duration-1000" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#EEB38C]/10 blur-[80px]" />
              
              {/* Re-engineered Badge 02 */}
              <div className="absolute -top-7 left-14 h-16 w-16 bg-[#DF8142] border-4 border-white/20 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl z-20 shadow-[0_15px_30px_-5px_rgba(223,129,66,0.6)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                02
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-[11px] font-black text-[#EEB38C] uppercase tracking-[0.5em]">
                    CORE SYNERGY
                  </p>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142] animate-pulse" />
                    <span className="text-[8px] font-black text-white/60 tracking-widest uppercase">SYNC ACTIVE</span>
                  </div>
                </div>

                <h3 className="text-2xl lg:text-3xl font-black text-white mb-8 uppercase tracking-tighter font-space-grotesk leading-tight group-hover:translate-x-2 transition-transform duration-700 break-words h-min">
                  INTERDISCIPLINARY <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EEB38C] to-white">ALPHA.</span>
                </h3>

                <p className="text-white/90 font-bold text-sm leading-relaxed mb-10 pl-6 border-l-2 border-[#DF8142]">
                  Architecture and Software Engineering students from Wollo
                  University achieved full synchronization, merging spatial design
                  with digital scalability.
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                  <div className="flex items-center gap-4 text-[#EEB38C]">
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                       <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black tracking-widest uppercase text-white/40">COLLECTION</span>
                      <span className="font-black tracking-[0.2em] text-[10px] uppercase text-white">
                        CLASS OF 2025
                      </span>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#DF8142]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Final Deployment */}
            <div className="relative bg-white dark:bg-card p-12 rounded-[3.5rem] border-2 border-[#BCAF9C]/30 dark:border-white/10 shadow-xl shadow-[#5A270F]/5 group hover:border-[#DF8142] transition-all duration-700">
              <div className="absolute -top-6 left-12 h-12 w-12 bg-white dark:bg-background border-2 border-[#BCAF9C] dark:border-white/10 rounded-2xl flex items-center justify-center text-[#1A0B04] font-black text-xs z-20 group-hover:bg-[#DF8142] group-hover:text-white transition-all">
                03
              </div>
              <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-[0.4em] mb-6">
                Final Deployment
              </p>
              <h3 className={`text-2xl font-black ${isDark ? "text-white" : "text-[#1A0B04]"} mb-8 uppercase tracking-tight font-space-grotesk leading-none`}>
                Global <br /> Integration
              </h3>
              <p className={`${isDark ? "text-white/60" : "text-[#1A0B04]/80"} font-bold text-sm leading-relaxed mb-10`}>
                The platform's transition from academic prototype to the fully
                functional Architectural Matrix currently serving the university
                node.
              </p>
              <div className="flex items-center gap-4 text-[#1A0B04] dark:text-[#EEB38C] pt-6 border-t border-[#BCAF9C]/20">
                <Globe className="h-5 w-5 text-[#DF8142]" />
                <span className={`font-black tracking-[0.2em] text-[10px] uppercase ${isDark ? "text-[#EEB38C]" : "text-[#1A0B04]"}`}>
                  Operational Feb 2026
                </span>
              </div>
            </div>
          </div>

          <div className="mt-24 text-center">
            <p className="text-[10px] font-black text-[#92664A] dark:text-white/30 uppercase tracking-[0.6em] animate-pulse">
              Powered by the Synergy of Wollo University
            </p>
          </div>
        </div>
      </section>

      {/* Visionary Section */}
      <section className="py-32 bg-white dark:bg-card overflow-hidden">
        <div className="max-w-[7xl] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#EFEDED] dark:bg-background border border-[#D9D9C2] dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] mb-8">
              <Sparkles className="h-3 w-3 text-[#DF8142]" /> The Long-term
              Vision
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-slate-950 dark:text-white tracking-tighter mb-12 leading-[0.9] font-space-grotesk">
              TOWARDS A GLOBAL <br />
              <span className="text-[#DF8142]">ARCHITECTURAL CDN.</span>
            </h2>
            <p className="text-xl text-[#5A270F] dark:text-[#EEB38C] font-medium leading-relaxed mb-16">
              We aren't just a library. We are building a global Content
              Delivery Network specifically optimized for heavy architectural
              formats—RFA, SKP, DWG, and high-res PDFs. Our roadmap includes
              automated BIM validation, AI-assisted tagging, and real-time
              collaboration nodes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/login"
                className="w-full sm:w-auto px-12 py-6 bg-slate-950 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#DF8142] transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 group"
              >
                Join the Network{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto px-12 py-6 bg-white dark:bg-card border border-[#D9D9C2] dark:border-white/10 text-[#5A270F] dark:text-[#EEB38C] font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#EFEDED] dark:bg-background transition-all duration-500 flex items-center justify-center gap-3"
              >
                Explore Matrix
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
