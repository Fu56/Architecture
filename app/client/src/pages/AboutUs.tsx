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

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-[#DF8142]/20">
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
              <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                REDEFINING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#DF8142]">
                  ARCHITECTURAL SHARE.
                </span>
              </h1>
              <p className="max-w-xl text-gray-500 text-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
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
                  className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] group hover:bg-white/10 transition-all duration-500"
                >
                  <item.icon className="h-10 w-10 text-[#DF8142] mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-4xl font-black text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#5A270F]">
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
          <div className="bg-[#EFEDED] rounded-[4rem] p-12 sm:p-24 border border-[#D9D9C2] relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/10 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-20">
              <div className="lg:w-1/3">
                <h2 className="text-4xl sm:text-5xl font-black text-[#5A270F] tracking-tighter mb-6 leading-[0.9]">
                  MISSION <br /> CRITICAL.
                </h2>
                <p className="text-[#5A270F] font-medium">
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
                    <div className="shrink-0 h-16 w-16 bg-white rounded-2xl flex items-center justify-center border border-[#D9D9C2] shadow-sm group-hover:bg-[#DF8142] transition-all duration-500">
                      <item.icon className="h-6 w-6 text-gray-500 group-hover:text-white transition-all" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#5A270F] mb-3 tracking-tight group-hover:text-[#DF8142] transition-colors uppercase text-sm">
                        {item.title}
                      </h4>
                      <p className="text-[#5A270F] font-medium leading-relaxed text-sm">
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
                  <h3 className="text-white text-2xl font-black uppercase tracking-tight">
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
              <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-10 leading-[0.9]">
                ENGINEERED BY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#DF8142]">
                  DUAL PERSPECTIVES.
                </span>
              </h2>
              <div className="space-y-8">
                <p className="text-gray-400 text-lg font-medium leading-relaxed italic border-l-4 border-[#DF8142] pl-8">
                  "The most powerful architectural tools aren't built in
                  isolation. They are born at the intersection of spatial
                  creativity and algorithmic precision."
                </p>
                <div className="grid sm:grid-cols-2 gap-8 pt-8">
                  <div className="space-y-4">
                    <h4 className="text-[#EEB38C] font-black uppercase tracking-widest text-xs">
                      Architecture Students
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Defining the spatial logic, resource criticality, and the
                      professional benchmarks that drive the library's curation.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[#DF8142] font-black uppercase tracking-widest text-xs">
                      Software Students
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
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

      {/* Wollo University Legacy Milestone */}
      <section className="py-32 bg-[#EFEDED]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-[#D9D9C2] rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] mb-8">
              <Award className="h-3 w-3 text-[#DF8142]" /> Specialized Milestone
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-[#5A270F] tracking-tighter leading-[0.9] mb-8">
              THE WOLLO <br /> UNIVERSITY{" "}
              <span className="text-[#DF8142]">LEGACY.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-[#D9D9C2] shadow-sm transform hover:-translate-y-2 transition-transform duration-500 group">
              <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-[0.3em] mb-4">
                Historical Origin
              </p>
              <h3 className="text-2xl font-black text-[#5A270F] mb-6 uppercase tracking-tight">
                Prototype Genesis
              </h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
                The foundational matrix was conceptualized and prototyped during
                the collaborative research phase of the 2025 graduating class.
              </p>
              <div className="flex items-center gap-4 text-[#5A270F]">
                <Map className="h-5 w-5" />
                <span className="font-bold tracking-widest text-xs uppercase">
                  March 2025
                </span>
              </div>
            </div>

            <div className="lg:col-span-1 bg-[#5A270F] p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/20 blur-[60px]" />
              <p className="text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.3em] mb-4">
                Core Collaboration
              </p>
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                Interdisciplinary Alpha
              </h3>
              <p className="text-white/70 font-medium text-sm leading-relaxed mb-8">
                Architecture and Software Engineering students from Wollo
                University achieved full synchronization, merging spatial design
                with digital scalability.
              </p>
              <div className="flex items-center gap-4 text-[#EEB38C]">
                <Users className="h-5 w-5" />
                <span className="font-black tracking-[0.2em] text-[10px] uppercase">
                  Class of 2025 Collaboration
                </span>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-[#D9D9C2] shadow-sm transform hover:-translate-y-2 transition-transform duration-500 group">
              <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-[0.3em] mb-4">
                Final Deployment
              </p>
              <h3 className="text-2xl font-black text-[#5A270F] mb-6 uppercase tracking-tight">
                Global Integration
              </h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
                The platform's transition from academic prototype to the fully
                functional Architectural Matrix currently serving the university
                node.
              </p>
              <div className="flex items-center gap-4 text-[#5A270F]">
                <Globe className="h-5 w-5" />
                <span className="font-bold tracking-widest text-xs uppercase">
                  February 2026
                </span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">
              Powered by the Pioneering Synergy of Wollo University
            </p>
          </div>
        </div>
      </section>

      {/* Visionary Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-[7xl] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#EFEDED] border border-[#D9D9C2] rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] mb-8">
              <Sparkles className="h-3 w-3 text-[#DF8142]" /> The Long-term
              Vision
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tighter mb-12 leading-[0.9]">
              TOWARDS A GLOBAL <br />
              <span className="text-[#DF8142]">ARCHITECTURAL CDN.</span>
            </h2>
            <p className="text-xl text-[#5A270F] font-medium leading-relaxed mb-16">
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
                className="w-full sm:w-auto px-12 py-6 bg-white border border-[#D9D9C2] text-[#5A270F] font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#EFEDED] transition-all duration-500 flex items-center justify-center gap-3"
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
