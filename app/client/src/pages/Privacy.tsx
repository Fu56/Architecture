import { Shield, Eye, ArrowLeft, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] font-inter selection:bg-[#DF8142]/20 selection:text-white">
      {/* ── Compact Architectural Header ── */}
      <header className="relative bg-[#5A270F] pt-12 pb-10 overflow-hidden border-b-2 border-[#DF8142]">
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 architectural-dot-grid opacity-5 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-[6.5px] font-black uppercase tracking-[0.3em] text-[#EEB38C] hover:text-white mb-6 transition-all p-1.5 bg-white/5 rounded border border-white/5"
          >
            <ArrowLeft className="h-2.5 w-2.5 group-hover:-translate-x-1 transition-transform" />
            PROTOCOL_ROOT_EXIT
          </Link>

          <div className="flex flex-col items-start gap-2">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-[#EEB38C]/10 border border-[#EEB38C]/20 rounded-md text-[7px] font-black uppercase tracking-[0.4em] text-[#EEB38C] backdrop-blur-md">
              <Shield className="h-2.5 w-2.5 text-[#DF8142]" /> 
              DATA_SOVEREIGNTY_v2.1
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[0.85] italic mb-4 drop-shadow-xl">
              PRIVACY <br />
              <span className="text-[#DF8142] not-italic text-2xl md:text-4xl">PROTOCOLS.</span>
            </h1>
            
            <div className="max-w-xl border-l-2 border-[#DF8142]/40 pl-4">
              <p className="text-[#EEB38C]/60 font-medium text-sm leading-tight uppercase tracking-tight">
                YOUR DATA IS YOUR ARCHITECTURE. WE ENSURE THE 
                <span className="text-white"> STRUCTURAL INTEGRITY</span> AND 
                <span className="text-white"> SECURITY</span> OF EVERY METADATA POINT.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-4 text-[8px] font-black text-white/5 uppercase tracking-[0.8em] select-none pointer-events-none">
          SECURE_NODE_0x2B9
        </div>
      </header>

      {/* ── Content Core - Tightened ── */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Directives Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Protocol 01 */}
            <section className="relative group">
              <div className="flex items-center gap-3 mb-4">
                 <div className="h-8 w-8 bg-[#5A270F] rounded-lg flex items-center justify-center text-[#EEB38C] font-black text-[10px] shadow-md">01</div>
                 <h2 className="text-lg font-black uppercase tracking-tighter text-[#5A270F] dark:text-white italic">Collection Logic</h2>
                 <div className="h-px flex-1 bg-gradient-to-r from-[#DF8142]/20 to-transparent" />
              </div>
              <div className="prose prose-slate max-w-none pl-11">
                <p className="text-[10px] font-bold text-[#5A270F]/80 dark:text-[#EEB38C]/60 leading-relaxed uppercase tracking-tight">
                  We collect only the telemetry and personal identifiers necessary to maintain your access to the architectural CDN. 
                  This includes session tokens and contribution logs. Intellectual property is never transmitted to <strong>third-party nodes</strong>.
                </p>
              </div>
            </section>

            {/* Protocol 02 */}
            <section className="relative group">
              <div className="flex items-center gap-3 mb-4">
                 <div className="h-8 w-8 bg-[#5A270F] rounded-lg flex items-center justify-center text-[#EEB38C] font-black text-[10px] shadow-md">02</div>
                 <h2 className="text-lg font-black uppercase tracking-tighter text-[#5A270F] dark:text-white italic">Encrypted Sequestration</h2>
                 <div className="h-px flex-1 bg-gradient-to-r from-[#DF8142]/20 to-transparent" />
              </div>
              <div className="prose prose-slate max-w-none pl-11">
                <p className="text-[10px] font-bold text-[#5A270F]/80 dark:text-[#EEB38C]/60 leading-relaxed uppercase tracking-tight italic border-l border-[#DF8142]/20 pl-4">
                  Every asset uploaded is stored behind multiple layers of authorization. We employ industry-standard encryption protocols. 
                  Even in a nexus breach, your data remains <strong>indecipherable</strong> to unauthorized actors.
                </p>
              </div>
            </section>

            {/* Protocol 03 */}
            <section className="relative group">
              <div className="flex items-center gap-3 mb-4">
                 <div className="h-8 w-8 bg-[#5A270F] rounded-lg flex items-center justify-center text-[#EEB38C] font-black text-[10px] shadow-md">03</div>
                 <h2 className="text-lg font-black uppercase tracking-tighter text-[#5A270F] dark:text-white italic">Data Sovereignty Rights</h2>
                 <div className="h-px flex-1 bg-gradient-to-r from-[#DF8142]/20 to-transparent" />
              </div>
              <div className="prose prose-slate max-w-none pl-11">
                <p className="text-[10px] font-bold text-[#5A270F]/80 dark:text-[#EEB38C]/60 leading-relaxed uppercase tracking-tight">
                  You retain absolute sovereignty over your data. You may request a <strong>full export</strong> of your profile metadata 
                  or the permanent deletion of your credentials through the administration terminal.
                </p>
              </div>
            </section>
          </div>

          {/* ── Sidebar Compact Nexus Modules ── */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
            
            {/* Compliance Module */}
            <div className="bg-[#5A270F] p-4 rounded-xl text-white relative overflow-hidden shadow-lg border-2 border-[#DF8142]/20">
               <div className="absolute inset-0 architectural-dot-grid opacity-10" />
               <Shield className="h-6 w-6 text-[#DF8142] mb-4 relative z-10" />
               <div className="relative z-10">
                 <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#EEB38C] mb-1">GDPR_COMPLIANCE</h3>
                 <p className="text-[7.5px] font-black text-white/40 uppercase tracking-widest leading-loose">
                   Nexus operations adhere to global protection standards.
                 </p>
               </div>
            </div>

            {/* Transparency Module */}
            <div className="bg-white dark:bg-[#1A0B02]/30 p-4 rounded-xl border border-[#D9D9C2] dark:border-white/5 shadow-md group">
               <Eye className="h-6 w-6 text-[#DF8142] mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] mb-2">TRANSPARENCY_NODE</h3>
               <p className="text-[7.5px] font-bold text-[#92664A] dark:text-white/20 uppercase tracking-widest leading-relaxed">
                 Access and view all collected metadata from your dashboard.
               </p>
            </div>

            {/* Security Contact */}
            <div className="bg-white dark:bg-[#1A0B02]/30 p-4 rounded-xl border border-[#D9D9C2] dark:border-white/5 relative overflow-hidden group">
               <Hexagon className="h-6 w-6 text-[#DF8142] mb-4 group-hover:rotate-12 transition-all" />
               <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] mb-2">SECURITY_INTEL</h3>
               <p className="text-[7.5px] font-bold text-[#92664A] dark:text-white/20 uppercase tracking-widest mb-4 leading-relaxed">
                 Request detailed field intel on our security measures.
               </p>
               <Link
                to="/about"
                className="w-full inline-flex items-center justify-center py-2 bg-[#5A270F] text-[#EEB38C] rounded-lg text-[6.5px] font-black uppercase tracking-[0.3em] hover:bg-[#DF8142] transition-all shadow-md"
              >
                OPEN_SECURE_CHANNEL
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer Protocol Termination ── */}
      <footer className="py-12 bg-[#E5E5CA]/30 dark:bg-black/40 border-t border-[#5A270F] text-center relative overflow-hidden">
        <div className="absolute inset-0 architectural-dot-grid opacity-5" />
        <p className="text-[7.5px] font-black uppercase tracking-[0.4em] text-[#5A270F]/40 dark:text-white/10 relative z-10">
          ── END_OF_PRIVACY_TRANSMISSION // ID_002P ──
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
