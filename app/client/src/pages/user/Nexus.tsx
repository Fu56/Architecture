// cSpell:ignore departmenthead kobicha
// NEXUS_MODAL_COMPACT_THEMED_1879
import { useState, useEffect, useRef, useCallback } from "react";
import { 
    Send, Users, Shield, Zap, Search, ArrowLeft,
    Plus, Globe, Lock, Check, X, UserPlus, Loader2
} from "lucide-react";
import React from "react";
import { useSession } from "../../lib/auth-client";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import { useTheme } from "../../context/useTheme";

interface Channel {
  id: number;
  name: string;
  batch?: number;
  isPublic: boolean;
  isSubscribed: boolean;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

interface Message {
  id: number;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    first_name: string;
    last_name: string;
    role: { name: string } | string;
    image?: string;
  };
}

interface FoundUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: { name: string } | string;
  image?: string;
}

interface UserIdentity {
    role?: { name: string } | string;
    id?: string;
}

const Nexus = () => {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const { theme } = useTheme();
  const isLight = theme === "light";

  const getRoleName = (u: UserIdentity | null | undefined) => {
    if (!u?.role) return "";
    return (typeof u.role === "string" ? u.role : (u.role as { name: string }).name || "").toLowerCase();
  };

  const currentRole = getRoleName(currentUser as UserIdentity | null | undefined);
  const isDeptHead = ["departmenthead", "admin", "superadmin"].includes(currentRole);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelBatch, setNewChannelBatch] = useState("");
  const [isPublicChannel, setIsPublicChannel] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState<FoundUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [channelMembers, setChannelMembers] = useState<FoundUser[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); }, []);

  const activeChannelRef = useRef<Channel | null>(activeChannel);
  useEffect(() => { activeChannelRef.current = activeChannel; }, [activeChannel]);

  const fetchChannels = useCallback(async () => {
    try {
      const { data } = await api.get("/chat/channels");
      setChannels(data);
    } catch { console.error("Spectrum Sync Failure"); }
    finally { setLoading(false); }
  }, []);

  const fetchMessages = useCallback(async (channelId: number) => {
    try { const { data } = await api.get(`/chat/channels/${channelId}/messages`); setMessages(data); } catch { console.error("Signal Retrieval Error"); }
  }, []);

  const fetchMembers = useCallback(async (channelId: number) => {
    setLoadingMembers(true);
    try { const { data } = await api.get(`/chat/channels/${channelId}/members`); setChannelMembers(data); } catch { toast.error("Participant data mismatch."); }
    finally { setLoadingMembers(false); }
  }, []);

  useEffect(() => { fetchChannels(); }, [fetchChannels]);

  useEffect(() => {
    const m = setInterval(() => { if (activeChannel) fetchMessages(activeChannel.id); }, 5000); 
    const c = setInterval(() => { fetchChannels(); }, 30000);
    return () => { clearInterval(m); clearInterval(c); };
  }, [activeChannel, fetchChannels, fetchMessages]);

  useEffect(() => { if (messages.length > 0) messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannel || sending) return;
    setSending(true);
    try {
      const { data } = await api.post(`/chat/channels/${activeChannel.id}/messages`, { content: newMessage });
      setMessages(p => [...p, data]);
      setNewMessage("");
    } catch { toast.error("Packet transmission lost."); }
    finally { setSending(false); }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newChannelName.trim()) return toast.error("Identity shard required.");
      setIsCreating(true);
      try {
          await api.post("/chat/channels", {
              name: newChannelName,
              batch: newChannelBatch ? Number(newChannelBatch) : null,
              isPublic: isPublicChannel
          });
          toast.success("Initialized.");
          setShowCreateModal(false);
          setNewChannelName("");
          setNewChannelBatch("");
          fetchChannels();
      } catch (err: unknown) {
          const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Protocol Failure.";
          toast.error(m);
      } finally { setIsCreating(false); }
  };

  useEffect(() => {
    if (!searchQuery.trim() || !showInviteModal) { setFoundUsers([]); return; }
    const t = setTimeout(async () => {
        setSearching(true);
        try {
            const { data } = await api.get(`/admin/users?search=${searchQuery}`);
            setFoundUsers(data.users || []);
        } catch { console.error("Spectrum scan fail"); }
        finally { setSearching(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery, showInviteModal]);

  const handleInviteUser = async (targetUserId: string) => {
    if (!activeChannel) return;
    setInvitingId(targetUserId);
    try {
        await api.post(`/chat/channels/${activeChannel.id}/add-user`, { targetUserId });
        toast.success("Uplink successful.");
    } catch { toast.error("Identity lock failure."); }
    finally { setInvitingId(null); }
  };

  const handleBackToSpectrum = () => {
      setActiveChannel(null);
      setMessages([]);
  };

  if (loading) return <div className="h-full w-full flex items-center justify-center bg-white"><Zap className="h-8 w-8 text-[#DF8142] animate-bounce" /></div>;

  return (
    <div className={`h-[85vh] rounded-[32px] overflow-hidden border flex relative animate-in fade-in duration-1000 ${
      isLight ? "bg-white border-slate-100 shadow-xl" : "bg-[#100704] border-white/5 shadow-2xl shadow-black/80"
    }`}>
      {/* SIDEBAR */}
      <div className={`w-[240px] border-r shrink-0 flex flex-col transition-all duration-500 ${!activeChannel ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[240px] w-0 opacity-0 lg:opacity-100 hidden lg:flex"} ${isLight ? "bg-[#FAF8F4]/80 border-slate-100" : "bg-black/10 border-white/5"}`}>
        <div className="p-6 flex flex-col h-full shrink-0 min-w-[240px]">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2.5">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${isLight ? "bg-white border-[#DF8142]/20 text-[#5A270F] shadow-sm" : "bg-white/5 border-white/10 text-[#DF8142]"}`}>
                    <Users className="h-4.5 w-4.5" />
                </div>
                <div>
                    <h2 className={`text-[12px] font-black uppercase tracking-wider ${isLight ? "text-[#5A270F]" : "text-white"}`}>Spectrum</h2>
                    <p className={`text-[8px] font-bold uppercase tracking-[0.15em] ${isLight ? "text-[#5A270F]/30" : "text-white/20"}`}>HUB vR.2</p>
                </div>
            </div>
            {isDeptHead && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  title="New Node"
                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white hover:scale-110 active:scale-95`}
                >
                    <Plus className="h-4.5 w-4.5" />
                </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar-thin space-y-6">
            <div className="space-y-2 px-1">
              <p className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 mb-4 ${isLight ? "text-[#5A270F]/20" : "text-white/10"}`}>Frequencies</p>
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                    activeChannel?.id === ch.id
                      ? "bg-gradient-to-r from-[#DF8142] to-[#6C3B1C] text-white shadow-xl shadow-[#DF8142]/10"
                      : isLight ? "hover:bg-white text-[#5A270F]/60 hover:text-[#5A270F] hover:shadow-sm" : "hover:bg-white/5 text-white/30 hover:text-white"
                  }`}
                >
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${activeChannel?.id === ch.id ? "bg-white/20" : isLight ? "bg-white border border-slate-100 shadow-sm text-[#5A270F]" : "bg-white/5 text-white/40"}`}>
                      {ch.isPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  </div>
                  <span className={`text-[10.5px] font-black tracking-tight truncate uppercase ${activeChannel?.id === ch.id ? "text-white" : ""}`}>{ch.name || `Batch ${ch.batch}`}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`mt-auto pt-6 border-t ${isLight ? "border-slate-50" : "border-white/5"}`}>
             <div className="flex items-center gap-3 px-2">
                <Shield className={`h-4.5 w-4.5 ${isLight ? "text-[#5A270F]" : "text-[#DF8142]"}`} />
                <p className={`text-[8.5px] font-black tracking-[0.1em] uppercase ${isLight ? "text-[#5A270F]/40" : "text-white/20"}`}>Registrar Authority v.4.1</p>
             </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-500 ${isLight ? "bg-[#FAF8F4]/20" : "bg-transparent"}`}>
        {!activeChannel ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8 animate-in zoom-in-95 duration-700">
                <div className={`h-20 w-20 rounded-[30px] flex items-center justify-center border-2 border-dashed ${isLight ? "bg-white border-[#DF8142]/20 shadow-xl shadow-[#DF8142]/5" : "bg-white/5 border-white/5"}`}>
                    <Globe className="h-10 w-10 text-[#DF8142] animate-pulse" />
                </div>
                <div>
                    <h3 className={`text-xl font-black uppercase tracking-widest mb-2 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Registry Spectrum</h3>
                    <p className={`text-[9.5px] font-bold uppercase tracking-[0.4em] opacity-30 ${isLight ? "text-[#5A270F]" : "text-white"}`}>AWAITING FREQUENCY UPLINK</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-4xl px-4">
                    {channels.slice(0, 8).map(c => (
                        <button key={c.id} onClick={() => setActiveChannel(c)} className={`group p-4 rounded-3xl border flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 ${isLight ? "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-[#DF8142]/20" : "bg-white/10 border-white/10 hover:bg-white/20"}`}>
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white flex items-center justify-center transition-transform group-hover:rotate-12">{c.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}</div>
                            <span className={`text-[9px] font-black uppercase truncate w-full ${isLight ? "text-[#5A270F]" : "text-white"}`}>{c.name || `Batch ${c.batch}`}</span>
                        </button>
                    ))}
                    {isDeptHead && (
                        <button onClick={() => setShowCreateModal(true)} className={`p-4 rounded-3xl border-2 border-dashed flex flex-col items-center gap-3 transition-all hover:bg-[#DF8142]/5 ${isLight ? "border-slate-200 text-slate-300 hover:border-[#DF8142] hover:text-[#DF8142]" : "border-white/10 text-white/10 hover:border-[#DF8142] hover:text-[#DF8142]"}`}>
                            <Plus className="h-8 w-8" />
                            <span className="text-[9px] font-black uppercase">Initialize Node</span>
                        </button>
                    )}
                </div>
            </div>
        ) : (
            <>
                <header className={`h-16 px-6 lg:px-10 flex items-center justify-between border-b ${isLight ? "bg-white border-slate-100 shadow-sm" : "bg-transparent border-white/5"}`}>
                  <div className="flex items-center gap-4">
                    <button onClick={handleBackToSpectrum} title="Back to Registry" className={`h-8 px-3 rounded-lg flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${isLight ? "bg-slate-50 text-[#5A270F] hover:bg-[#DF8142] hover:text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}>
                        <ArrowLeft className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Back</span>
                    </button>
                    <div className="h-8 w-px bg-slate-100 mx-1 hidden lg:block" />
                    <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shadow-lg bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white`}>
                            {activeChannel?.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </div>
                        <div>
                            <h3 className={`text-[12.5px] font-black uppercase tracking-tight ${isLight ? "text-[#5A270F]" : "text-white"}`}>{activeChannel?.name || "Initializing..."}</h3>
                            <p className={`text-[8.5px] font-bold uppercase tracking-widest opacity-40 ${isLight ? "text-[#5A270F]" : "text-white"}`}>{activeChannel?.isPublic ? "Open" : "Secure"}</p>
                        </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex gap-1.5 p-1 rounded-lg border ${isLight ? "bg-white border-slate-100 shadow-sm" : "bg-white/5 border-white/10"}`}>
                        <button title="Uplink Entity" onClick={() => setShowInviteModal(true)} className={`h-8 w-8 rounded-md flex items-center justify-center transition-all ${isLight ? "bg-slate-50 text-[#5A270F] hover:bg-[#DF8142] hover:text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}><UserPlus className="h-4 w-4" /></button>
                        <button title="Broadcasters" onClick={() => { fetchMembers(activeChannel.id); setShowMembersModal(true); }} className={`h-8 w-8 rounded-md flex items-center justify-center transition-all ${isLight ? "bg-slate-50 text-[#5A270F] hover:bg-[#DF8142] hover:text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}><Users className="h-4 w-4" /></button>
                    </div>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 custom-scrollbar scroll-smooth">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <Zap className="h-10 w-10 text-[#DF8142] animate-pulse" />
                        <p className={`text-[10px] font-black uppercase tracking-[0.5em] mt-5 ${isLight ? "text-[#5A270F]" : "text-white"}`}>FREQUENCY SILENT</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isSelf = m.userId === currentUser?.id;
                      return (
                        <div key={m.id} className={`flex gap-4 ${isSelf ? "flex-row-reverse" : "flex-row"} animate-in zoom-in-95 duration-500`}>
                          <div className={`h-9 w-9 rounded-lg overflow-hidden shadow-sm shrink-0 border border-white/5 ${isSelf ? "border-[#DF8142]" : isLight ? "border-slate-100 shadow-inner" : ""}`}>
                            {m.user?.image ? <img src={m.user.image} className="h-full w-full object-cover" alt="Node" /> : <div className={`h-full w-full flex items-center justify-center text-[10px] font-black text-white ${isSelf ? "bg-[#DF8142]" : "bg-slate-300"}`}>{m.user?.first_name?.[0]}</div>}
                          </div>
                          <div className={`flex flex-col max-w-[85%] ${isSelf ? "items-end" : "items-start"}`}>
                            <div className="flex items-center gap-2 mb-1.5 px-1 text-[9px] font-black uppercase tracking-[0.1em]">
                                <span className={`${isSelf ? "text-[#DF8142]" : isLight ? "text-[#5A270F]" : "text-white/40"}`}>{m.user?.first_name}</span>
                                {getRoleName(m.user) !== 'student' && <span className="text-[6.5px] font-black px-1.5 py-0.5 rounded-[3px] bg-[#DF8142] text-white shadow-sm uppercase">{getRoleName(m.user)}</span>}
                            </div>
                            <div className={`px-5 py-3 rounded-2xl text-[12px] font-extrabold leading-relaxed shadow-xl border transition-all ${isSelf ? "bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] border-[#DF8142] text-white rounded-tr-none shadow-[#DF8142]/20" : isLight ? "bg-white border-slate-100 text-[#5A270F] rounded-tl-none shadow-slate-200/50" : "bg-white/5 border-white/5 text-white/90 rounded-tl-none"}`}>
                                {m.content}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messageEndRef} />
                </div>

                <footer className={`p-5 lg:p-8 bg-white/60 border-t ${isLight ? "border-slate-100" : "border-white/5"}`}>
                  <form onSubmit={handleSendMessage} className={`flex items-center gap-3 p-1 rounded-2xl px-5 border transition-all ${isLight ? "bg-white border-slate-200 focus-within:border-[#DF8142]" : "bg-black/20 border-white/10"}`}>
                     <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="INJECT TRANSMISSION..." className={`flex-1 bg-transparent py-3.5 text-[12px] font-black outline-none placeholder:opacity-30 uppercase tracking-[0.2em] ${isLight ? "text-[#5A270F]" : "text-white"}`} />
                     <button title="Broadcast" disabled={!newMessage.trim() || sending} className={`h-10 px-6 rounded-xl flex items-center gap-3 active:scale-95 transition-all ${newMessage.trim() ? "bg-gradient-to-r from-[#DF8142] to-[#6C3B1C] text-white shadow-xl shadow-[#DF8142]/20" : "bg-slate-50 text-slate-200"}`}>
                        <Send className="h-4 w-4" />
                     </button>
                  </form>
                </footer>
            </>
        )}
      </div>

      {/* COMPACT THEMED CREATE MODAL */}
      {showCreateModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500">
              <div className={`w-full max-w-xs rounded-[40px] overflow-hidden shadow-2xl border transition-all duration-700 ${isLight ? "bg-white border-[#EEB38C]/30" : "bg-[#1A0B02] border-white/10"}`}>
                  {/* COMPACT ACCENT BAR */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#DF8142] to-[#6C3B1C]" />
                  
                  <div className="p-8 w-full flex flex-col items-center">
                    <div className={`h-12 w-12 rounded-[18px] flex items-center justify-center mb-6 shadow-xl transition-all ${isLight ? "bg-[#FAF8F4] border border-[#EEB38C]/40 text-[#DF8142]" : "bg-white/5 border border-white/5 text-[#DF8142]"}`}>
                        <Plus className="h-6 w-6 font-black animate-pulse" />
                    </div>
                    
                    <h2 className={`text-lg font-black uppercase tracking-tight mb-1 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Initialize Node</h2>
                    <p className={`text-[8px] font-black uppercase tracking-[0.4em] mb-8 ${isLight ? "text-[#DF8142]" : "text-[#DF8142]/60"}`}>NEW FREQUENCY</p>

                    <form onSubmit={handleCreateChannel} className="w-full space-y-4">
                        <div className="space-y-1.5">
                            <label className={`text-[9px] font-black uppercase tracking-[0.1em] ml-3 opacity-60 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Identity</label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                                <input value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} placeholder="FREQUENCY NAME..." className={`w-full pl-11 pr-5 py-3.5 rounded-xl text-[11px] font-black outline-none border-2 transition-all uppercase tracking-widest ${isLight ? "bg-[#FAF8F4] border-[#EEB38C]/10 focus:border-[#DF8142] text-[#5A270F]" : "bg-white/5 border-white/5 focus:border-[#DF8142] text-white"}`} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className={`text-[9px] font-black uppercase tracking-[0.1em] ml-3 opacity-60 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Batch</label>
                                <input type="number" value={newChannelBatch} onChange={(e) => setNewChannelBatch(e.target.value)} placeholder="0" className={`w-full px-5 py-3.5 rounded-xl text-[11px] font-black outline-none border-2 transition-all ${isLight ? "bg-[#FAF8F4] border-[#EEB38C]/10 focus:border-[#DF8142] text-[#5A270F]" : "bg-white/5 border-white/5 focus:border-[#DF8142] text-white"}`} />
                            </div>
                            <div className="space-y-1.5">
                                <label className={`text-[9px] font-black uppercase tracking-[0.1em] ml-3 opacity-60 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Access</label>
                                <button type="button" onClick={() => setIsPublicChannel(!isPublicChannel)} className={`w-full h-[47px] rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${isPublicChannel ? "bg-[#DF8142] text-white border-[#DF8142] shadow-lg shadow-[#DF8142]/10" : isLight ? "bg-[#FAF8F4] border-[#EEB38C]/10 text-[#5A270F]/30" : "bg-white/5 border-white/5 text-white/20"}`}>
                                    {isPublicChannel ? "Open" : "Locked"}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <button disabled={isCreating} className="w-full h-13 rounded-xl bg-gradient-to-r from-[#DF8142] to-[#6C3B1C] text-white text-[12px] font-black uppercase tracking-[0.5em] shadow-xl hover:shadow-[#DF8142]/30 active:scale-95 transition-all">
                                {isCreating ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-white" /> : "SYNCHRONIZE"}
                            </button>
                            <button type="button" onClick={() => setShowCreateModal(false)} className={`w-full py-2 text-[10px] font-black uppercase tracking-[0.4em] transition-all opacity-30 hover:opacity-100 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Dismiss</button>
                        </div>
                    </form>
                  </div>
              </div>
          </div>
      )}

      {/* OTHER MODALS COMPACTED TOO */}
      {showInviteModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/85 backdrop-blur-3xl animate-in fade-in duration-300">
              <div className={`w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl border transition-all ${isLight ? "bg-white border-[#EEB38C]/30" : "bg-[#1A0B02] border-white/10"} flex flex-col h-[480px]`}>
                  <div className="p-8 pb-3 shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className={`text-lg font-black uppercase tracking-tight ${isLight ? "text-[#5A270F]" : "text-white"}`}>Node Sync</h2>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#DF8142] opacity-50">SCANNIG SPECTRUM</p>
                        </div>
                        <button title="Abort" onClick={() => setShowInviteModal(false)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:text-red-500 transition-all"><X className="h-5 w-5" /></button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DF8142]" />
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="FREQUENCY SEARCH..." className={`w-full pl-12 pr-6 py-4 rounded-xl text-[11px] font-black outline-none border transition-all uppercase tracking-widest ${isLight ? "bg-[#FAF8F4] border-slate-100 focus:border-[#DF8142] text-[#5A270F]" : "bg-white/5 border-white/5 focus:border-[#DF8142] text-white"}`} />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-8 pb-8 mt-4 custom-scrollbar-thin">
                    {searching ? <div className="py-20 flex flex-col items-center gap-4 opacity-40"><Loader2 className="h-8 w-8 animate-spin text-[#DF8142]" /></div> : foundUsers.length === 0 ? <div className="py-20 text-center opacity-30 text-[10px] font-black uppercase tracking-[0.4em] text-[#DF8142]">SILENCE</div> : (
                        <div className="space-y-3">
                            {foundUsers.map(u => (
                                <div key={u.id} className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all group ${isLight ? "bg-[#FAF8F4]/50 border-slate-100 hover:border-[#DF8142]/40" : "bg-white/5 border-white/5 hover:bg-white/10"}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-[#DF8142] text-white flex items-center justify-center text-[12px] font-black shadow-lg shadow-[#DF8142]/20">{u.first_name?.[0]}</div>
                                        <div>
                                            <p className={`text-[12.5px] font-black ${isLight ? "text-[#5A270F]" : "text-white"}`}>{u.first_name} {u.last_name}</p>
                                            <p className="text-[9px] font-black text-[#DF8142] uppercase">{getRoleName(u)}</p>
                                        </div>
                                    </div>
                                    <button title="Uplink" disabled={invitingId === u.id} onClick={() => handleInviteUser(u.id)} className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white shadow-xl active:scale-95 ${invitingId === u.id ? "opacity-30" : ""}`}>{invitingId === u.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-4.5 w-4.5 font-black" />}</button>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
              </div>
          </div>
      )}

      {showMembersModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/85 backdrop-blur-3xl animate-in fade-in duration-300">
             <div className={`w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl border transition-all ${isLight ? "bg-white border-[#EEB38C]/30" : "bg-[#1A0B02] border-white/10"} flex flex-col h-[480px]`}>
                  <div className={`p-8 pb-5 shrink-0 flex items-center justify-between border-b ${isLight ? "border-slate-50" : "border-white/5"}`}>
                    <div>
                        <h2 className={`text-lg font-black uppercase tracking-tight ${isLight ? "text-[#5A270F]" : "text-white"}`}>Active Shards</h2>
                        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#DF8142] opacity-40">SYNC ALIGNMENT</p>
                    </div>
                    <button title="Abort" onClick={() => setShowMembersModal(false)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:text-red-500 transition-all"><X className="h-6 w-6" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-8 pb-8 mt-5 space-y-5 custom-scrollbar-thin">
                    {loadingMembers ? <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-[#DF8142] opacity-30" /></div> : channelMembers.map((m) => (
                        <div key={m.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-black text-[14px] transition-transform ${isLight ? "bg-[#FAF8F4] border border-slate-100 text-[#5A270F]" : "bg-white/5 border border-white/5 text-white"}`}>{m.first_name?.[0]}</div>
                                <div className="flex flex-col">
                                    <p className={`text-[13px] font-black ${isLight ? "text-[#5A270F]" : "text-white"}`}>{m.first_name} {m.last_name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-[9px] font-black text-[#DF8142] uppercase">{getRoleName(m)}</p>
                                        {m.id === currentUser?.id && <Check className="h-3 w-3 text-emerald-500" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                  </div>
                  <div className={`p-8 border-t flex justify-center ${isLight ? "bg-slate-50/50 border-slate-50" : "bg-white/5 border-white/5"}`}>
                      <button title="Disconnect" onClick={() => setShowMembersModal(false)} className={`px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] border transition-all ${isLight ? "bg-white border-[#EEB38C]/20 text-[#5A270F] shadow-sm hover:text-[#DF8142] hover:border-[#DF8142]" : "bg-white/5 border-white/5 text-white/40 hover:text-white"}`}>Dismiss</button>
                  </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default Nexus;
