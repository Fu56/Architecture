import { Scale, ShieldAlert, CheckCircle2, ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-card selection:bg-primary/20">
      {/* Minimal High-Tech Header */}
      <header className="bg-[#2A1205] pt-32 pb-24 overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(79,70,229,0.15),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] hover:text-primary/80 mb-12 transition-all group"
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
          <p className="text-gray-500 dark:text-white/40 font-medium text-lg max-w-2xl mx-auto">
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
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[#5A270F] dark:text-[#EEB38C]
                        prose-p:text-[#5A270F] dark:text-[#EEB38C]/80 prose-p:leading-relaxed prose-p:font-medium
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
                03. Conduct Benchmarks & Content Safety
              </h2>
              <div className="space-y-6">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-3xl my-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="h-6 w-6 text-amber-600" />
                    <h3 className="font-black text-amber-900 uppercase tracking-tight text-lg">
                      Important Notice – Responsible Use Required
                    </h3>
                  </div>
                  <p className="text-amber-900/80 font-bold leading-relaxed mb-6">
                    This digital library platform is an academic resource intended exclusively for educational use 
                    within the Department of Architecture.
                  </p>
                  
                  <div className="space-y-4">
                    <p className="text-amber-900 font-black uppercase text-xs tracking-widest">
                      By accessing this system, you agree not to upload, distribute, or share:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Malicious software, viruses, or harmful files",
                        "Fraudulent or deceptive links",
                        "Offensive, indecent, or unlawful content",
                        "Materials that violate copyright or integrity",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-amber-800/80 font-medium bg-white/50 dark:bg-card/50 p-3 rounded-xl border border-amber-200">
                          <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6 text-[#5A270F] dark:text-[#EEB38C]/80">
                  <p className="font-bold">
                    All user activities on this platform are logged and traceable. 
                    The nexus maintains a zero-tolerance policy regarding the integrity of our digital perimeter.
                  </p>
                  
                  <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-3xl my-8">
                    <p className="font-black text-red-900 uppercase tracking-tight mb-4 text-sm">
                      Enforcement Protocols:
                    </p>
                    <p className="text-red-800/90 text-sm leading-relaxed mb-4">
                      Any attempt to upload malicious files, indecent materials, or illegal digital content may result in:
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex gap-3 text-sm font-bold text-red-900/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        Immediate suspension or permanent removal of your account
                      </li>
                      <li className="flex gap-3 text-sm font-bold text-red-900/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        Institutional disciplinary action under university regulations
                      </li>
                      <li className="flex gap-3 text-sm font-bold text-red-900/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        Legal liability under Ethiopian law, including:
                      </li>
                    </ul>
                    <div className="bg-white/40 dark:bg-card/40 p-5 rounded-2xl border border-red-200 text-[11px] font-bold text-red-900/70 leading-relaxed italic">
                      Computer Crime Proclamation No. 958/2016 and the Hate Speech and Disinformation 
                      Prevention and Suppression Proclamation No. 1185/2020, which provide for 
                      criminal penalties such as fines and imprisonment for cybercrime and illegal 
                      digital content distribution.
                    </div>
                  </div>

                  <p className="bg-[#2A1205] text-white p-6 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-center">
                    By proceeding, you confirm that you understand these rules and agree to use this system responsibly and lawfully.
                  </p>
                </div>
              </div>
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
            <div className="bg-[#EFEDED] dark:bg-background p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/10">
              <ShieldAlert className="h-8 w-8 text-[#DF8142] mb-6" />
              <h3 className="text-sm font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] mb-2">
                Policy Enforcement
              </h3>
              <p className="text-xs text-[#5A270F] dark:text-[#EEB38C] font-medium leading-relaxed">
                Violations lead to immediate credential suspension.
              </p>
            </div>
            <div className="bg-[#EFEDED] dark:bg-background p-8 rounded-[2.5rem] border border-[#D9D9C2] dark:border-white/10">
              <CheckCircle2 className="h-8 w-8 text-[#5A270F] dark:text-[#EEB38C] mb-6" />
              <h3 className="text-sm font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] mb-2">
                Verified Content
              </h3>
              <p className="text-xs text-[#5A270F] dark:text-[#EEB38C] font-medium leading-relaxed">
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
      <footer className="py-20 bg-[#EFEDED] dark:bg-background border-t border-[#D9D9C2] dark:border-white/10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/30">
          End of Terms Protocol Transmission
        </p>
      </footer>
    </div>
  );
};

export default TermsOfService;
