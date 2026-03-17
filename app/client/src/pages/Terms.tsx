import { Scale, ShieldAlert, CheckCircle2, ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
              <Scale className="h-2.5 w-2.5 text-[#DF8142]" /> 
              OPERATIONAL_GOVERNANCE_v4.2
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[0.85] italic mb-4 drop-shadow-xl">
              TERMS OF <br />
              <span className="text-[#DF8142] not-italic text-2xl md:text-4xl">ENGAGEMENT.</span>
            </h1>
            
            <div className="max-w-xl border-l-2 border-[#DF8142]/40 pl-4">
              <p className="text-[#EEB38C]/60 font-medium text-sm leading-tight uppercase tracking-tight">
                BY PENETRATING THE ARCHITECTURAL PERIMETER, YOU CONSENT TO THE 
                <span className="text-white"> ETHICAL BENCHMARKS</span> AND 
                <span className="text-white text-[#DF8142]"> SECURITY PROTOCOLS</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-4 text-[8px] font-black text-white/5 uppercase tracking-[0.8em] select-none pointer-events-none">
          STAMP_0x7F2A
        </div>
      </header>

      {/* ── Content Core - Tightened ── */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Directives Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Directive 01 */}
            <section className="relative group">
              <div className="flex items-center gap-3 mb-4">
                 <div className="h-8 w-8 bg-[#5A270F] rounded-lg flex items-center justify-center text-[#EEB38C] font-black text-[10px] shadow-md">01</div>
                 <h2 className="text-lg font-black uppercase tracking-tighter text-[#5A270F] dark:text-white italic">Perimeter Access Logic</h2>
                 <div className="h-px flex-1 bg-gradient-to-r from-[#DF8142]/20 to-transparent" />
              </div>
              <div className="prose prose-slate max-w-none pl-11">
                <p className="text-[10px] font-bold text-[#5A270F]/80 dark:text-[#EEB38C]/60 leading-relaxed uppercase tracking-tight">
                  Access to the <strong>Architectural Intelligence Library</strong> and CDN is strictly granted to validated personnel. 
                  Maintenance of an active academic node is mandatory. Credentials will be <strong>sequestrated</strong> on any breach attempt.
                </p>
              </div>
            </section>

            {/* Directive 02 */}
            <section className="relative group">
              <div className="flex items-center gap-3 mb-4">
                 <div className="h-8 w-8 bg-[#5A270F] rounded-lg flex items-center justify-center text-[#EEB38C] font-black text-[10px] shadow-md">02</div>
                 <h2 className="text-lg font-black uppercase tracking-tighter text-[#5A270F] dark:text-white italic">Intellectual Asset Flux</h2>
                 <div className="h-px flex-1 bg-gradient-to-r from-[#DF8142]/20 to-transparent" />
              </div>
              <div className="prose prose-slate max-w-none pl-11">
                <p className="text-[10px] font-bold text-[#5A270F]/80 dark:text-[#EEB38C]/60 leading-relaxed uppercase tracking-tight">
                  All uploaded artifacts remain the primary intellectual property of the originating architect. 
                  Synchronization with the nexus grants a <strong>Non-Exclusive License</strong> for redistribution within the collective.
                </p>
              </div>
            </section>

            {/* Directive 03 - Compact Warning Node */}
            <section className="relative bg-white dark:bg-[#1A0B02]/40 rounded-xl border border-[#D9D9C2] dark:border-white/5 p-6 shadow-lg overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 blueprint-grid opacity-5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               
               <div className="flex items-center gap-3 mb-6 overflow-hidden">
                  <div className="h-10 w-10 shrink-0 bg-[#DF8142] rounded-xl flex items-center justify-center text-white shadow-md">
                    <ShieldAlert className="h-4 w-4 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-sm font-black uppercase tracking-tighter text-[#5A270F] dark:text-white leading-none mb-1">CONDUCT_BENCHMARKS</h2>
                    <p className="text-[8px] font-black text-[#DF8142] uppercase tracking-[0.2em]">Security Directives</p>
                  </div>
                  <div className="h-px flex-1 bg-[#D9D9C2] dark:bg-white/10" />
               </div>

               <div className="space-y-6 pl-3 border-l-2 border-[#DF8142]/20">
                  <div className="p-4 bg-[#FAF8F4] dark:bg-black/40 rounded-lg border border-[#D9D9C2] dark:border-white/5 relative">
                    <p className="text-[#5A270F] dark:text-[#EEB38C] font-bold text-[11px] leading-tight mb-4 uppercase tracking-tight">
                      THIS PLATFORM IS AN <span className="text-[#DF8142]">ACADEMIC SAFE-ZONE</span>. INTEGRITY IS MONITORED.
                    </p>
                    
                    <div className="grid gap-2 sm:grid-cols-2">
                       {[
                         "Malicious Injection Packets",
                         "Fraudulent/Deceptive Links",
                         "Indecent/Unlawful Artifacts",
                         "Copyright Breach Materials"
                       ].map((item, i) => (
                         <div key={i} className="flex items-center gap-2 p-2 bg-white dark:bg-[#5A270F]/10 rounded border border-[#D9D9C2] dark:border-white/10">
                            <CheckCircle2 className="h-3 w-3 text-[#DF8142]" />
                            <span className="text-[7.5px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tighter">{item}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Enforcement Protocols Terminal - Tiny */}
                  <div className="bg-[#1A0100] p-4 rounded-xl border border-rose-500/30 relative">
                     <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-3 w-3 text-rose-500" />
                        <h3 className="text-[7px] font-black text-rose-500 uppercase tracking-[0.3em]">ENFORCEMENT_PROTOCOLS</h3>
                     </div>
                     <div className="space-y-2 font-mono text-[8.5px] font-bold text-rose-400 opacity-90 leading-relaxed uppercase tracking-tighter italic">
                        <p className="border-b border-rose-500/10 pb-1 flex gap-2"><span className="text-white/20">01</span> ACCOUNT_SUSPENSION_PERMANENT</p>
                        <p className="border-b border-rose-500/10 pb-1 flex gap-2"><span className="text-white/20">02</span> INSTITUTIONAL_DISCIPLINARY_SYNC</p>
                        <p className="border-b border-rose-500/10 pb-1 flex gap-2"><span className="text-white/20">03</span> LEGAL_LIABILITY_958/2016</p>
                     </div>
                  </div>

                  <p className="text-center py-3 bg-[#5A270F] text-[#EEB38C] rounded-lg text-[6.5px] font-black uppercase tracking-[0.3em] shadow-md border border-[#EEB38C]/10">
                    BY PROCEEDING, YOU AUTHORIZE PROTOCOL ADHERENCE.
                  </p>
               </div>
            </section>

            {/* Directive 04 */}
            <section className="relative group">
              <div className="flex items-center gap-3 mb-4">
                 <div className="h-8 w-8 bg-[#5A270F] rounded-lg flex items-center justify-center text-[#EEB38C] font-black text-[10px] shadow-md">04</div>
                 <h2 className="text-lg font-black uppercase tracking-tighter text-[#5A270F] dark:text-white italic">Sequestration of Liability</h2>
                 <div className="h-px flex-1 bg-gradient-to-r from-[#DF8142]/20 to-transparent" />
              </div>
              <div className="prose prose-slate max-w-none pl-11">
                <p className="text-[10px] font-bold text-[#5A270F]/80 dark:text-[#EEB38C]/60 leading-relaxed uppercase tracking-tight italic border-l border-[#DF8142]/20 pl-4">
                  The nexus provides assets "AS-IS". Artifacts are intended for <strong>Academic Simulation</strong> only. Operatives assume all real-world risks.
                </p>
              </div>
            </section>
          </div>

          {/* ── Sidebar Compact Nexus Modules ── */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
            
            {/* Security Status Module */}
            <div className="bg-[#5A270F] p-4 rounded-xl text-white relative overflow-hidden shadow-lg border-2 border-[#DF8142]/20">
               <div className="absolute inset-0 architectural-dot-grid opacity-10" />
               <ShieldAlert className="h-6 w-6 text-[#DF8142] mb-4 relative z-10" />
               <div className="relative z-10">
                 <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#EEB38C] mb-1">Protocol Monitoring</h3>
                 <p className="text-[7.5px] font-black text-white/40 uppercase tracking-widest leading-loose">
                   Live feedback is active. Perimeter integrity verified.
                 </p>
               </div>
            </div>

            {/* Dispute Nexus */}
            <div className="bg-white dark:bg-[#1A0B02]/30 p-4 rounded-xl border border-[#D9D9C2] dark:border-white/5 relative overflow-hidden group">
               <Zap className="h-6 w-6 text-[#DF8142] mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] mb-2">RAPID DISPUTE</h3>
               <p className="text-[7.5px] font-bold text-[#92664A] dark:text-white/20 uppercase tracking-widest mb-4 leading-relaxed">
                 Initialize dispute regarding asset ownership.
               </p>
               <Link
                to="/about"
                className="w-full inline-flex items-center justify-center py-2 bg-[#5A270F] text-[#EEB38C] rounded-lg text-[6.5px] font-black uppercase tracking-[0.3em] hover:bg-[#DF8142] transition-all shadow-md"
              >
                INITIALIZE_CLAIM
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer Protocol Termination ── */}
      <footer className="py-12 bg-[#E5E5CA]/30 dark:bg-black/40 border-t border-[#5A270F] text-center relative overflow-hidden">
        <div className="absolute inset-0 architectural-dot-grid opacity-5" />
        <p className="text-[7.5px] font-black uppercase tracking-[0.4em] text-[#5A270F]/40 dark:text-white/10 relative z-10">
          ── END_OF_LEGAL_TRANSMISSION // ID_001A ──
        </p>
      </footer>
    </div>
  );
};

export default TermsOfService;
