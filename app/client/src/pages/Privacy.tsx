import { Shield, Lock, Eye, ArrowLeft, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100">
      {/* Minimal High-Tech Header */}
      <header className="bg-slate-950 pt-32 pb-24 overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.15),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-400 mb-12 transition-all group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Main Nexus
          </Link>

          <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 underline underline-offset-8 decoration-indigo-500/50">
            <Lock className="h-3 w-3" /> Data Sovereignty
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
            PRIVACY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              PROTOCOLS.
            </span>
          </h1>
          <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">
            Your data is your architecture. We ensure the structural integrity
            and security of every metadata point collected across the nexus.
          </p>
        </div>
      </header>

      {/* Content Core */}
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div
            className="md:col-span-2 prose prose-slate prose-lg max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                        prose-strong:text-slate-950 prose-strong:font-black"
          >
            <section className="mb-16">
              <h2 className="text-3xl uppercase tracking-tighter mb-8 flex items-center gap-4">
                <span className="h-2 w-8 bg-indigo-600 rounded-full" />
                Collection Logic
              </h2>
              <p>
                We collect only the telemetry and personal identifiers necessary
                to maintain your access to the architectural CDN. This includes
                session tokens, profile metadata, and contribution logs. At no
                point is your intellectual property or personal data transmited
                to third-party nodes without explicit cryptographic approval.
              </p>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl uppercase tracking-tighter mb-8 flex items-center gap-4">
                <span className="h-2 w-8 bg-indigo-600 rounded-full" />
                Secure Storage
              </h2>
              <p>
                Every asset uploaded is stored behind multiple layers of
                authorization. We employ industry-standard encryption protocols
                to ensure that even in a nexus breach, your data remains
                indecipherable to unauthorized actors.
              </p>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl uppercase tracking-tighter mb-8 flex items-center gap-4">
                <span className="h-2 w-8 bg-indigo-600 rounded-full" />
                Your Rights
              </h2>
              <p>
                You retain absolute sovereignty over your data. You may request
                a full export of your profile metadata or the permanent deletion
                of your credentials at any time through the administration
                terminal.
              </p>
            </section>
          </div>

          {/* Sidebar Stats/Info */}
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <Shield className="h-8 w-8 text-indigo-600 mb-6" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">
                GDPR Compliant
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Our nexus operates under global data protection standards.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <Eye className="h-8 w-8 text-indigo-600 mb-6" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">
                Transparency Node
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                View all collected metadata from your user dashboard.
              </p>
            </div>
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-600/20 text-white">
              <Hexagon className="h-8 w-8 text-white/50 mb-6" />
              <h3 className="text-sm font-black uppercase tracking-widest mb-2 text-white">
                Contact Security
              </h3>
              <p className="text-xs text-white/70 font-medium leading-relaxed mb-6">
                Need field intel on our security measures?
              </p>
              <Link
                to="/about"
                className="text-[10px] font-black uppercase tracking-widest underline decoration-white/40"
              >
                Open Channel
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Termination */}
      <footer className="py-20 bg-slate-50 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          End of Privacy Protocol Transmission
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
