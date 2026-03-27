import {
  Users,
  Target,
  ShieldCheck,
  Map,
  Globe,
  Award,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#5A270F] font-inter selection:bg-[#DF8142]/20 selection:text-[#5A270F] dark:selection:text-white transition-colors duration-500 overflow-x-hidden">
      {/* ── Compact Architectural Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24 bg-[#FAF8F4] dark:bg-[#2C1105] border-b border-[#EEB38C]/40 dark:border-[#DF8142]/20 transition-colors duration-700">
        <div className="absolute inset-0 blueprint-grid-dark opacity-10 dark:opacity-5 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#EEB38C]/30 dark:bg-[#DF8142]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-3/5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-[#6C3B1C] border border-[#EEB38C]/50 dark:border-[#DF8142]/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#DF8142] dark:text-[#EEB38C] shadow-sm">
                <Target className="h-3 w-3" /> System Paradigm
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#5A270F] dark:text-white tracking-tighter leading-[0.85] font-space-grotesk uppercase">
                REDEFINING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] dark:via-[#EEB38C] to-[#DF8142] italic">
                  ARCHITECTURAL SHARE.
                </span>
              </h1>

              <div className="max-w-xl pl-6 border-l-2 border-[#DF8142]">
                <p className="text-[#92664A] dark:text-[#EEB38C]/80 text-sm md:text-base font-bold leading-relaxed uppercase tracking-tight">
                  THE ARCHITECTURAL PULSE OF DIGITAL INTELLIGENCE. A
                  <span className="text-[#DF8142]"> CENTRALIZED REPOSITORY</span>{" "}
                  ENGINEERED FOR STUDENTS, NURTURED BY FACULTY, AND SCALED FOR
                  THE FUTURE.
                </p>
              </div>
            </div>

            <div className="lg:w-2/5 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              {[
                { title: "20+", label: "Academic Hubs", icon: Map },
                { title: "Global", label: "Access Control", icon: Globe },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/80 dark:bg-[#6C3B1C]/50 backdrop-blur-md border border-[#EEB38C]/50 dark:border-[#DF8142]/30 p-8 rounded-[2rem] group hover:bg-[#FAF8F4] dark:hover:bg-[#6C3B1C] hover:-translate-y-2 hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col items-start"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-700">
                    <item.icon className="h-32 w-32 text-[#5A270F] dark:text-[#DF8142]" />
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-[#EEB38C]/20 dark:bg-[#5A270F] flex items-center justify-center mb-6">
                    <item.icon className="h-6 w-6 text-[#DF8142] dark:text-[#EEB38C]" />
                  </div>
                  <h3 className="text-3xl font-black text-[#5A270F] dark:text-white mb-2 tracking-tighter font-space-grotesk italic relative z-10 group-hover:text-[#DF8142] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/70 relative z-10">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission Critical - Compact Grid ── */}
      <section className="py-24 bg-[#FDFCFB] dark:bg-[#5A270F] transition-colors duration-700">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
          <div className="bg-white dark:bg-[#6C3B1C] rounded-[3rem] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 p-10 lg:p-16 relative overflow-hidden shadow-2xl transition-all duration-700 group hover:border-[#DF8142]">
            <div className="absolute top-0 right-0 w-96 h-96 blueprint-grid-dark opacity-10 dark:opacity-5 pointer-events-none transition-opacity" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-4 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF8F4] dark:bg-[#5A270F] text-[8px] font-black uppercase tracking-[0.4em] text-[#DF8142] dark:text-[#EEB38C] rounded-md shadow-sm border border-[#EEB38C]/30 dark:border-[#DF8142]/20">
                  CORE OBJECTIVE
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#5A270F] dark:text-white tracking-tighter leading-[0.9] font-space-grotesk uppercase italic">
                  MISSION <br /> CRITICAL.
                </h2>
                <div className="h-1.5 w-16 bg-[#DF8142] rounded-full" />
                <p className="text-xs font-bold text-[#92664A] dark:text-[#EEB38C]/80 uppercase tracking-widest leading-relaxed pt-2">
                  Engineered to bridge the gap between academic theory and
                  technical implementation via shared intelligence.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  {
                    title: "Knowledge Parity",
                    desc: "Universal access to top-tier BIM families and thesis protocols.",
                    icon: Target,
                  },
                  {
                    title: "Faculty Synergy",
                    desc: "High-fidelity platform for distributing technical specifications.",
                    icon: Users,
                  },
                  {
                    title: "Metadata Integrity",
                    desc: "Rigorous verification systems ensuring asset structural benchmarks.",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Excellence Protocol",
                    desc: "Reward-driven ecosystem for peer-validated high-performance assets.",
                    icon: Award,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group/feature items-start">
                    <div className="shrink-0 h-14 w-14 bg-[#FAF8F4] dark:bg-[#5A270F] rounded-2xl flex items-center justify-center border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-sm group-hover/feature:bg-[#DF8142] dark:group-hover/feature:bg-[#DF8142] transition-colors duration-500">
                      <item.icon className="h-6 w-6 text-[#DF8142] dark:text-[#EEB38C] group-hover/feature:text-white dark:group-hover/feature:text-[#110703] transition-colors" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <h4 className="text-[11px] font-black text-[#5A270F] dark:text-white tracking-[0.2em] group-hover/feature:text-[#DF8142] transition-colors uppercase font-space-grotesk">
                        {item.title}
                      </h4>
                      <p className="text-[10px] font-bold text-[#92664A] dark:text-[#EEB38C]/60 leading-relaxed uppercase tracking-tight italic">
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

      {/* ── Collaborative Nexus ── */}
      <section className="py-28 bg-[#FAF8F4] dark:bg-[#2C1105] border-y border-[#EEB38C]/40 dark:border-[#DF8142]/20 relative overflow-hidden transition-colors duration-700">
        <div className="absolute inset-0 blueprint-grid-dark opacity-10 dark:opacity-5 pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse gap-20 items-center">
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative rounded-[2.5rem] overflow-hidden border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
                  className="w-full aspect-[4/3] object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                  alt="Interdisciplinary Team"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5A270F] dark:from-[#110703] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#FAF8F4]/90 dark:bg-[#2C1105]/80 backdrop-blur-xl p-5 rounded-[1.2rem] border border-[#EEB38C]/60 dark:border-[#DF8142]/30 shadow-2xl">
                    <p className="text-[#DF8142] text-[8px] font-black uppercase tracking-[0.4em] mb-2 drop-shadow-sm">
                      SYNERGY STATUS
                    </p>
                    <h3 className="text-[#5A270F] dark:text-white text-sm font-black uppercase tracking-widest font-space-grotesk italic">
                      FULLY_INTEGRATED.
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#6C3B1C] text-[8px] font-black uppercase tracking-[0.4em] text-[#DF8142] dark:text-[#EEB38C] rounded-md shadow-sm border border-[#EEB38C]/40 dark:border-[#DF8142]/30">
                INTERDISCIPLINARY 
              </div>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#5A270F] dark:text-white tracking-tighter leading-[0.85] font-space-grotesk uppercase italic">
                ENGINEERED BY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] dark:via-[#EEB38C] to-[#DF8142]">
                  DUAL MATRICES.
                </span>
              </h2>
              <div className="space-y-8">
                <p className="text-[#92664A] dark:text-[#EEB38C]/80 text-base font-bold leading-relaxed uppercase tracking-tight italic border-l-2 border-[#DF8142] pl-6">
                  "SPATIAL CREATIVITY MERGED WITH ALGORITHMIC PRECISION."
                </p>
                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-8 bg-white dark:bg-[#6C3B1C] rounded-[2rem] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-lg hover:-translate-y-1 hover:border-[#DF8142] transition-all">
                    <h4 className="text-[#5A270F] dark:text-white font-black uppercase tracking-widest text-[10px] mb-3">
                      Architecture <span className="text-[#DF8142]">Students</span>
                    </h4>
                    <p className="text-[#92664A] dark:text-[#EEB38C]/70 text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                      Defining spatial logic, resource criticality, and
                      professional benchmarks.
                    </p>
                  </div>
                  <div className="p-8 bg-white dark:bg-[#6C3B1C] rounded-[2rem] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-lg hover:-translate-y-1 hover:border-[#DF8142] transition-all">
                    <h4 className="text-[#5A270F] dark:text-white font-black uppercase tracking-widest text-[10px] mb-3">
                      Software <span className="text-[#DF8142]">Students</span>
                    </h4>
                    <p className="text-[#92664A] dark:text-[#EEB38C]/70 text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                      Implementing high-performance systems and secure
                      distribution nodes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Milestone Log ── */}
      <section className="py-24 relative overflow-hidden bg-[#FDFCFB] dark:bg-[#5A270F] transition-colors duration-700">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-[#5A270F] dark:text-white tracking-tighter leading-none mb-6 font-space-grotesk uppercase italic">
              THE WOLLO UNIVERSITY{" "}
              <span className="text-[#DF8142] not-italic">LEGACY.</span>
            </h2>
            <div className="h-1.5 w-24 bg-[#DF8142] rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                id: "01",
                tag: "Origin Genesis",
                title: "Prototype\nAlpha",
                desc: "Foundational Repository conceptualized during collaborative research phase.",
                date: "MAR_2025",
                icon: Map,
              },
              {
                id: "02",
                tag: "Core Synergy",
                title: "Interdisciplinary\nCollaboration",
                desc: "Architecture and Software Engineering Students achieved class-wide synchronization.",
                date: "OCT_2025",
                icon: Users,
                featured: true,
              },
              {
                id: "03",
                tag: "Deployment",
                title: "Operational\nRepository",
                desc: "Full integration and transition to current active Architectural Repository.",
                date: "FEB_2026",
                icon: Globe,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative p-10 rounded-[2.5rem] border transition-all duration-700 group flex flex-col ${
                  item.featured
                    ? "bg-[#DF8142] dark:bg-[#DF8142] border-[#DF8142] shadow-[0_30px_60px_-15px_rgba(223,129,66,0.3)] scale-[1.02] z-10"
                    : "bg-[#FAF8F4] dark:bg-[#6C3B1C] border-[#EEB38C]/40 dark:border-[#DF8142]/20 hover:border-[#DF8142] shadow-lg"
                }`}
              >
                <div
                  className={`absolute -top-4 left-8 h-12 w-12 rounded-xl flex items-center justify-center font-black text-xs shadow-xl transition-colors duration-500 ${
                    item.featured
                      ? "bg-[#5A270F] text-white"
                      : "bg-[#DF8142] text-white"
                  }`}
                >
                  {item.id}
                </div>

                <p
                  className={`text-[8px] font-black uppercase tracking-[0.4em] mb-4 mt-2 ${item.featured ? "text-[#5A270F]" : "text-[#DF8142]"}`}
                >
                  {item.tag}
                </p>
                <h3 className={`text-2xl font-black mb-6 uppercase tracking-tighter font-space-grotesk leading-[1] italic whitespace-pre-line ${item.featured ? "text-white" : "text-[#5A270F] dark:text-white"}`}>
                  {item.title}
                </h3>
                <p
                  className={`text-[11px] font-bold leading-relaxed uppercase tracking-tight mb-10 ${item.featured ? "text-white/90" : "text-[#92664A] dark:text-[#EEB38C]/70"}`}
                >
                  {item.desc}
                </p>

                <div
                  className={`flex items-center gap-3 pt-6 border-t mt-auto ${item.featured ? "border-[#5A270F]/20" : "border-[#EEB38C]/40 dark:border-[#DF8142]/20"}`}
                >
                  <item.icon
                    className={`h-4 w-4 ${item.featured ? "text-[#5A270F]" : "text-[#DF8142]"}`}
                  />
                  <span
                    className={`text-[10px] font-black tracking-widest uppercase ${item.featured ? "text-white" : "text-[#5A270F] dark:text-[#EEB38C]"}`}
                  >
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Vision ── */}
      <section className="py-28 bg-[#FAF8F4] dark:bg-[#2C1105] relative overflow-hidden border-t border-[#EEB38C]/40 dark:border-[#DF8142]/20 transition-colors duration-700">
        <div className="absolute right-0 top-0 p-8 text-[120px] font-black text-[#5A270F] dark:text-[#DF8142] opacity-[0.03] rotate-12 select-none pointer-events-none font-space-grotesk">
          CDN
        </div>
        <div className="absolute left-[-10%] top-[-10%] w-[40%] h-[40%] bg-[#DF8142]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#6C3B1C] border border-[#EEB38C]/40 dark:border-[#DF8142]/30 rounded-full text-[8px] font-black uppercase tracking-[0.4em] text-[#DF8142] dark:text-[#EEB38C] shadow-sm">
            FUTURE SCOPE
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#5A270F] dark:text-white tracking-tighter leading-[0.85] font-space-grotesk uppercase italic">
            TOWARDS A GLOBAL <br />
            <span className="text-[#DF8142] not-italic italic">
              ARCHITECTURAL CDN.
            </span>
          </h2>

          <p className="text-[13px] text-[#92664A] dark:text-[#EEB38C]/80 font-bold leading-relaxed uppercase tracking-tight max-w-3xl mx-auto border-y border-[#EEB38C]/40 dark:border-[#DF8142]/20 py-8">
            WE ARE BUILDING A CONTENT DELIVERY NETWORK OPTIMIZED FOR HEAVY
            ARCHITECTURAL FORMATS—RFA, SKP, DWG, AND HI-RES PDFs. AUTOMATED BIM
            VALIDATION AND AI-TAGGING NODES ARE ACTIVE IN ROADMAP STAGE.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="/login"
              className="w-full sm:w-auto px-12 py-5 bg-[#5A270F] dark:bg-[#DF8142] text-white dark:text-[#110703] font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-[#DF8142] dark:hover:bg-white dark:hover:text-[#5A270F] transition-all flex items-center justify-center gap-3 group shadow-2xl active:scale-95"
            >
              JOIN_THE_NETWORK{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
