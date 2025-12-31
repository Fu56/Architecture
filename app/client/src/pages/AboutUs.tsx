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
    <div className="min-h-screen bg-white selection:bg-indigo-100">
      {/* Split Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32 bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.1),transparent_50%)]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <Hexagon className="h-3 w-3" /> Core Identity
              </div>
              <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                REDEFINING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  ARCHITECTURAL SHARE.
                </span>
              </h1>
              <p className="max-w-xl text-slate-400 text-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
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
                  <item.icon className="h-10 w-10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-4xl font-black text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
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
          <div className="bg-slate-50 rounded-[4rem] p-12 sm:p-24 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-20">
              <div className="lg:w-1/3">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
                  MISSION <br /> CRITICAL.
                </h2>
                <p className="text-slate-500 font-medium">
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
                    <div className="shrink-0 h-16 w-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:bg-indigo-600 transition-all duration-500">
                      <item.icon className="h-6 w-6 text-slate-400 group-hover:text-white transition-all" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors uppercase text-sm">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 font-medium leading-relaxed text-sm">
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

      {/* Visionary Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-[7xl] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
              <Sparkles className="h-3 w-3" /> The Long-term Vision
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tighter mb-12 leading-[0.9]">
              TOWARDS A GLOBAL <br />
              <span className="text-indigo-600">ARCHITECTURAL CDN.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-16">
              We aren't just a library. We are building a global Content
              Delivery Network specifically optimized for heavy architectural
              formats—RFA, SKP, DWG, and high-res PDFs. Our roadmap includes
              automated BIM validation, AI-assisted tagging, and real-time
              collaboration nodes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/login"
                className="w-full sm:w-auto px-12 py-6 bg-slate-950 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-indigo-600 transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 group"
              >
                Join the Network{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto px-12 py-6 bg-white border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-xs rounded-full hover:bg-slate-50 transition-all duration-500 flex items-center justify-center gap-3"
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
