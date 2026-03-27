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
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] font-inter selection:bg-[#DF8142]/20 selection:text-white selection:bg-[#DF8142]/20 transition-colors duration-500 overflow-x-hidden">
      {/* ── Compact Architectural Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-20 bg-[#5A270F] border-b-4 border-[#DF8142]">
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 architectural-dot-grid opacity-5 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#DF8142]/10 blur-[100px] rounded-full" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-16">
            <div className="lg:w-3/5 space-y-6">
              <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tighter leading-[0.85] italic drop-shadow-2xl font-space-grotesk">
                REDEFINING <br />
                <span className="text-[#DF8142] not-italic text-3xl sm:text-6xl uppercase">
                  ARCHITECTURAL SHARE.
                </span>
              </h1>

              <div className="max-w-xl border-l-2 border-[#DF8142]/40 pl-4">
                <p className="text-[#EEB38C]/80 text-sm font-bold leading-tight uppercase tracking-tight">
                  THE ARCHITECTURAL PULSE OF DIGITAL INTELLIGENCE. A
                  <span className="text-white"> CENTRALIZED REPOSITORY</span>{" "}
                  ENGINEERED FOR STUDENTS, NURTURED BY FACULTY, AND SCALED FOR
                  THE FUTURE.
                </p>
              </div>
            </div>

            <div className="lg:w-2/5 grid grid-cols-2 gap-4">
              {[
                { title: "20+", label: "Academic Hubs", icon: Map },
                { title: "Global", label: "Access Control", icon: Globe },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl group hover:bg-white/10 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <item.icon className="h-20 w-20 text-white" />
                  </div>
                  <item.icon className="h-6 w-6 text-[#DF8142] mb-4 relative z-10" />
                  <h3 className="text-2xl font-black text-white mb-1 tracking-tighter font-space-grotesk italic relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-[7.5px] font-black uppercase tracking-widest text-[#EEB38C] relative z-10">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission Critical - Compact Grid ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white dark:bg-[#1A0B02]/40 rounded-3xl border border-[#D9D9C2] dark:border-white/5 p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 blueprint-grid opacity-5 pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-4">
                <h2 className="text-3xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter leading-[0.9] font-space-grotesk uppercase italic">
                  MISSION <br /> CRITICAL.
                </h2>
                <div className="h-1 w-12 bg-[#DF8142] rounded-full" />
                <p className="text-[10px] font-bold text-[#92664A] dark:text-white/20 uppercase tracking-widest leading-relaxed">
                  Engineered to bridge the gap between academic theory and
                  technical implementation via shared intelligence.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <div key={i} className="flex gap-4 group">
                    <div className="shrink-0 h-10 w-10 bg-[#FAF8F4] dark:bg-[#5A270F]/20 rounded-xl flex items-center justify-center border border-[#D9D9C2] dark:border-white/5 shadow-inner group-hover:bg-[#DF8142] transition-all">
                      <item.icon className="h-4 w-4 text-[#DF8142] group-hover:text-white" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-[#1A0B04] dark:text-[#EEB38C] tracking-[0.2em] group-hover:text-[#DF8142] transition-colors uppercase font-space-grotesk">
                        {item.title}
                      </h4>
                      <p className="text-[9px] font-bold text-[#3E1C0A]/60 dark:text-[#EEB38C]/40 leading-tight uppercase tracking-tight italic">
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
      <section className="py-20 bg-[#1A0B03] relative overflow-hidden">
        <div className="absolute inset-0 architectural-dot-grid opacity-5 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#DF8142] to-[#5A270F] rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-3xl">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
                  className="w-full aspect-[4/3] object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
                  alt="Interdisciplinary Team"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1205] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                  <p className="text-[#EEB38C] text-[7px] font-black uppercase tracking-[0.4em] mb-1">
                    SYNERGY STATUS
                  </p>
                  <h3 className="text-white text-xs font-black uppercase tracking-widest font-space-grotesk italic">
                    FULLY_INTEGRATED
                  </h3>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-[0.9] font-space-grotesk italic">
                ENGINEERED BY <br />
                <span className="text-[#DF8142] not-italic text-3xl sm:text-5xl">
                  DUAL MATRICES.
                </span>
              </h2>
              <div className="space-y-6">
                <p className="text-[#EEB38C]/60 text-sm font-bold leading-tight uppercase tracking-tight italic border-l-2 border-[#DF8142] pl-6">
                  "SPATIAL CREATIVITY MERGED WITH ALGORITHMIC PRECISION."
                </p>
                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-[#EEB38C] font-black uppercase tracking-widest text-[8px]">
                      Architecture Students
                    </h4>
                    <p className="text-white/30 text-[9.5px] font-bold leading-tight uppercase tracking-tight">
                      Defining spatial logic, resource criticality, and
                      professional benchmarks.
                    </p>
                  </div>
                  <div className="p-4 bg-[white/5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-[#DF8142] font-black uppercase tracking-widest text-[8px]">
                      Software Students
                    </h4>
                    <p className="text-white/30 text-[9.5px] font-bold leading-tight uppercase tracking-tight">
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter leading-none mb-4 font-space-grotesk uppercase italic">
              THE WOLLO UNIVERSITY{" "}
              <span className="text-[#DF8142] not-italic">LEGACY.</span>
            </h2>
            <div className="h-1 w-16 bg-[#DF8142] rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                className={`relative p-8 rounded-2xl border transition-all duration-700 ${
                  item.featured
                    ? "bg-[#5A270F] border-[#DF8142] shadow-2xl scale-[1.02] text-white z-10"
                    : "bg-white dark:bg-[#1A0B02]/30 border-[#D9D9C2] dark:border-white/5"
                }`}
              >
                <div
                  className={`absolute -top-3 left-6 h-8 w-8 rounded-lg flex items-center justify-center font-black text-[10px] shadow-lg ${
                    item.featured
                      ? "bg-[#DF8142] text-white"
                      : "bg-[#5A270F] text-[#EEB38C]"
                  }`}
                >
                  {item.id}
                </div>

                <p
                  className={`text-[7px] font-black uppercase tracking-[0.4em] mb-4 ${item.featured ? "text-[#EEB38C]" : "text-[#DF8142]"}`}
                >
                  {item.tag}
                </p>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter font-space-grotesk leading-[0.9] italic whitespace-pre-line">
                  {item.title}
                </h3>
                <p
                  className={`text-[10px] font-bold leading-tight uppercase tracking-tight mb-8 ${item.featured ? "text-white/60" : "text-[#5A270F]/60 dark:text-[#EEB38C]/40"}`}
                >
                  {item.desc}
                </p>

                <div
                  className={`flex items-center gap-3 pt-4 border-t ${item.featured ? "border-white/10" : "border-[#D9D9C2]/20 dark:border-white/5"}`}
                >
                  <item.icon
                    className={`h-3.5 w-3.5 ${item.featured ? "text-[#DF8142]" : "text-[#92664A]"}`}
                  />
                  <span
                    className={`text-[8px] font-black tracking-widest uppercase ${item.featured ? "text-white" : "text-[#5A270F] dark:text-[#EEB38C]"}`}
                  >
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* <p className="mt-16 text-center text-[8px] font-black text-[#92664A] dark:text-white/10 uppercase tracking-[0.8em] animate-pulse">
            POWERED_BY_WOLLO_SYNAPSE
          </p> */}
        </div>
      </section>

      {/* ── Global Vision ── */}
      <section className="py-20 bg-white dark:bg-[#1A0100]/40 relative overflow-hidden border-t-2 border-[#D9D9C2]/20">
        <div className="absolute right-0 top-0 p-8 text-[80px] font-black text-[#5A270F]/5 rotate-12 select-none pointer-events-none font-space-grotesk">
          CDN
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-[#5A270F] dark:text-white tracking-tighter leading-[0.9] font-space-grotesk uppercase italic">
            TOWARDS A GLOBAL <br />
            <span className="text-[#DF8142] not-italic italic">
              ARCHITECTURAL CDN.
            </span>
          </h2>

          <p className="text-xs text-[#5A270F]/80 dark:text-[#EEB38C]/60 font-bold leading-relaxed uppercase tracking-tight max-w-2xl mx-auto italic">
            WE ARE BUILDING A CONTENT DELIVERY NETWORK OPTIMIZED FOR HEAVY
            ARCHITECTURAL FORMATS—RFA, SKP, DWG, AND HI-RES PDFS. AUTOMATED BIM
            VALIDATION AND AI-TAGGING NODES ARE ACTIVE IN ROADMAP STAGE.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-4 bg-[#5A270F] text-[#EEB38C] font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-[#DF8142] transition-all flex items-center justify-center gap-2 group shadow-xl"
            >
              JOIN_THE_NETWORK{" "}
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
