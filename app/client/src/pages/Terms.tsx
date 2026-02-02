import { Scale, ShieldAlert, CheckCircle2, ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-primary/20">
      {/* Minimal High-Tech Header */}
      <header className="bg-[#2A1205] pt-32 pb-24 overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(79,70,229,0.15),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] hover:text-primary/80 mb-12 transition-all group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Main Nexus
          </Link>

          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mb-8 border-b-2">
            <Scale className="h-3 w-3" /> Operational Guidelines
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
            TERMS OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 to-purple-400">
              OPERATION.
            </span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            By entering this digital perimeter, you agree to adhere to the
            structural protocols and ethical benchmarks of our design
            collective.
          </p>
        </div>
      </header>

      {/* Content Core */}
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div
            className="md:col-span-2 prose prose-slate prose-lg max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[#5A270F]
                        prose-p:text-[#5A270F]/80 prose-p:leading-relaxed prose-p:font-medium
                        prose-strong:text-[#2A1205] prose-strong:font-black"
          >
            <section className="mb-16">
              <h2 className="text-3xl uppercase tracking-tighter mb-8 flex items-center gap-4">
                <span className="h-1.5 w-12 bg-primary rounded-full" />
                01. Nexus Access
              </h2>
              <p>
                Access to the architectural library and CDN is granted subject
                to these terms. Users must be active students or validated
                faculty members of the nexus. Unauthorized attempts to scrape,
                flood, or penetrate the perimeter logic will result in immediate
                termination of access credentials.
              </p>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl uppercase tracking-tighter mb-8 flex items-center gap-4">
                <span className="h-1.5 w-12 bg-primary rounded-full" />
                02. Intellectual Assets
              </h2>
              <p>
                All assets (BIM families, text documents, images) uploaded to
                the platform remain the property of the original architect.
                However, by uploading, you grant the nexus a non-exclusive
                license to store and distribute these assets to other validated
                members for academic synthesis.
              </p>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl uppercase tracking-tighter mb-8 flex items-center gap-4">
                <span className="h-1.5 w-12 bg-primary rounded-full" />
                03. Conduct Benchmarks
              </h2>
              <p>
                Users must not upload malicious code, unauthorized proprietary
                content, or assets that violate the integrity of architectural
                standards. Every transmission is logged and subject to community
                flag protocols.
              </p>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl uppercase tracking-tighter mb-8 flex items-center gap-4">
                <span className="h-1.5 w-12 bg-primary rounded-full" />
                04. Liability Clause
              </h2>
              <p>
                The digital library provides assets "as-is". We do not guarantee
                the structural accuracy or industrial safety of designs shared
                by community members. Use assets as academic references only.
              </p>
            </section>
          </div>

          {/* Sidebar Stats/Info */}
          <div className="space-y-8">
            <div className="bg-[#EFEDED] p-8 rounded-[2.5rem] border border-[#D9D9C2]">
              <ShieldAlert className="h-8 w-8 text-[#DF8142] mb-6" />
              <h3 className="text-sm font-black uppercase tracking-widest text-[#5A270F] mb-2">
                Policy Enforcement
              </h3>
              <p className="text-xs text-[#5A270F] font-medium leading-relaxed">
                Violations lead to immediate credential suspension.
              </p>
            </div>
            <div className="bg-[#EFEDED] p-8 rounded-[2.5rem] border border-[#D9D9C2]">
              <CheckCircle2 className="h-8 w-8 text-[#5A270F] mb-6" />
              <h3 className="text-sm font-black uppercase tracking-widest text-[#5A270F] mb-2">
                Verified Content
              </h3>
              <p className="text-xs text-[#5A270F] font-medium leading-relaxed">
                Top-tier assets undergo faculty validation checks.
              </p>
            </div>
            <div className="bg-[#2A1205] p-8 rounded-[2.5rem] shadow-xl shadow-primary/10 text-white">
              <Zap className="h-8 w-8 text-primary/80 mb-6" />
              <h3 className="text-sm font-black uppercase tracking-widest mb-2 text-white">
                Rapid Dispute
              </h3>
              <p className="text-xs text-white/50 font-medium leading-relaxed mb-6">
                Contact the administration nexus for asset disputes.
              </p>
              <Link
                to="/about"
                className="text-[10px] font-black uppercase tracking-widest text-primary/80"
              >
                Initialize Claim
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Termination */}
      <footer className="py-20 bg-[#EFEDED] border-t border-[#D9D9C2] text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
          End of Terms Protocol Transmission
        </p>
      </footer>
    </div>
  );
};

export default TermsOfService;
