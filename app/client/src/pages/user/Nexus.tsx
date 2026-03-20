// cSpell:ignore departmenthead kobicha
// NEXUS_MODAL_COMPACT_THEMED_1879
import { useState, useEffect, useRef, useCallback } from "react";
import { 
    Send, Users, Shield, Zap, Search, ArrowLeft,
    Plus, Globe, Lock, X, UserPlus, Loader2, Cpu, Radio, Network, Trash2
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

/**
 * Nexus Portal UI: Advanced Spectrum Architecture.
 * High-density professional interface for department synchronization.
 */
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

  const handleDeleteChannel = async (channelId: number) => {
    toast.warning("Dismantle node frequency?", {
        description: "Permanent decommission of this spectrum node cannot be undone.",
        action: {
            label: "Confirm Deletion",
            onClick: async () => {
                try {
                    await api.delete(`/chat/channels/${channelId}`);
                    toast.success("Frequency decommissioned.");
                    fetchChannels();
                    if (activeChannel?.id === channelId) setActiveChannel(null);
                } catch { toast.error("Protocol failure: Unable to dismantle node."); }
            }
        },
        cancel: {
            label: "Abort",
            onClick: () => {}
        }
    });
  };

  if (loading) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white dark:bg-[#0C0603] space-y-4">
      <Zap className="h-10 w-10 text-[#DF8142] animate-bounce" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#5A270F] dark:text-[#EEB38C] opacity-40">Synchronizing Spectrum...</p>
    </div>
  );

  return (
    <div className={`h-[85vh] rounded-[40px] overflow-hidden border flex relative animate-in fade-in duration-1000 ${
      isLight ? "bg-white border-[#D9D9C2] shadow-2xl" : "bg-[#0C0603] border-white/5 shadow-2xl shadow-black/80"
    }`}>
      {/* Dynamic Atmospheric Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FAF8F4] dark:bg-white/5 -skew-x-12 translate-x-1/4" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DF8142]/5 blur-[120px] rounded-full" />
      </div>

      {/* SIDEBAR - Spectrum Selection */}
      <div className={`w-[280px] border-r shrink-0 flex flex-col relative z-20 transition-all duration-500 ${!activeChannel ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[280px] w-0 opacity-0 lg:opacity-100 hidden lg:flex"} ${isLight ? "bg-[#FAF8F4]/90 border-[#D9D9C2] backdrop-blur-3xl" : "bg-black/20 border-white/5 backdrop-blur-3xl"}`}>
        <div className="p-8 flex flex-col h-full shrink-0 min-w-[280px]">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3.5">
                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border-2 transition-all ${isLight ? "bg-white border-[#DF8142]/20 text-[#5A270F] shadow-lg shadow-[#DF8142]/5" : "bg-white/5 border-white/10 text-[#DF8142] shadow-2xl shadow-black"}`}>
                    <Network className="h-5 w-5" />
                </div>
                <div>
                    <h2 className={`text-[13px] font-black uppercase tracking-widest ${isLight ? "text-[#5A270F]" : "text-white"}`}>Spectrum</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#DF8142] animate-pulse" />
                        <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${isLight ? "text-[#5A270F]/40" : "text-white/30"}`}>NODE_ACTIVE</p>
                    </div>
                </div>
            </div>
            {isDeptHead && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  title="Initialize Node Cluster"
                  aria-label="Create Node"
                  className="h-10 w-10 rounded-xl flex items-center justify-center transition-all bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white hover:scale-110 active:scale-95 shadow-lg shadow-[#DF8142]/30"
                >
                    <Plus className="h-5 w-5" />
                </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar-thin space-y-8 pr-2">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 mb-5 ${isLight ? "text-[#5A270F]/30" : "text-white/20"}`}>Frequencies</p>
              <div className="space-y-2">
                {channels.map((ch) => (
                  <div key={ch.id} className="group relative">
                    <button
                      onClick={() => setActiveChannel(ch)}
                      title={`Uplink to ${ch.name || 'Batch Node'}`}
                      aria-label={`Join channel ${ch.name}`}
                      className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-2xl transition-all duration-300 ${
                        activeChannel?.id === ch.id
                          ? "bg-[#5A270F] dark:bg-[#DF8142] text-white shadow-xl shadow-[#5A270F]/20"
                          : isLight ? "hover:bg-white text-[#5A270F]/60 hover:text-[#5A270F] hover:shadow-lg" : "hover:bg-white/5 text-white/40 hover:text-white"
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${activeChannel?.id === ch.id ? "bg-white/20" : isLight ? "bg-white border border-[#D9D9C2] shadow-sm text-[#5A270F]" : "bg-white/5 text-white/40"}`}>
                          {ch.isPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      </div>
                      <span className={`text-[11px] font-black tracking-tight truncate uppercase ${activeChannel?.id === ch.id ? "text-white" : ""}`}>{ch.name || `Batch ${ch.batch}`}</span>
                    </button>
                    {isDeptHead && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteChannel(ch.id); }}
                        title="Dismantle Frequency"
                        aria-label="Delete channel"
                        className={`absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                          activeChannel?.id === ch.id ? "text-white hover:bg-black/20" : "text-[#5A270F]/40 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`mt-auto pt-8 border-t ${isLight ? "border-slate-100" : "border-white/5"}`}>
             <div className="flex items-center gap-4 px-3 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                <Shield className={`h-5 w-5 ${isLight ? "text-[#5A270F]" : "text-[#DF8142]"}`} />
                <div>
                    <p className={`text-[9px] font-black tracking-[0.15em] uppercase ${isLight ? "text-[#5A270F]" : "text-white"}`}>Authority Shield</p>
                    <p className={`text-[7px] font-bold uppercase tracking-widest ${isLight ? "text-[#5A270F]/40" : "text-white/20"}`}>VERIFIED_PROTOCOL v4.1</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT Area (Chat/Dashboard) */}
      <div className={`flex-1 flex flex-col relative z-10 transition-all duration-500 ${isLight ? "bg-white" : "bg-transparent"}`}>
        {!activeChannel ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10 animate-in zoom-in-95 duration-1000">
                <div className={`h-24 w-24 rounded-[35px] flex items-center justify-center border-2 border-dashed ${isLight ? "bg-[#FAF8F4] border-[#DF8142]/30 shadow-2xl shadow-[#DF8142]/5" : "bg-white/5 border-white/10"}`}>
                    <Radio className="h-11 w-11 text-[#DF8142] animate-pulse" />
                </div>
                <div className="space-y-3">
                    <h3 className={`text-3xl font-black uppercase tracking-tighter italic ${isLight ? "text-[#5A270F]" : "text-white"}`}>Registry <span className="text-[#DF8142] not-italic">Spectrum_</span></h3>
                    <p className={`text-[11px] font-black uppercase tracking-[0.5em] ${isLight ? "text-[#5A270F]/40" : "text-white/20"}`}>Select Frequency for Uplink</p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
                    {channels.slice(0, 8).map(c => (
                        <button 
                          key={c.id} 
                          onClick={() => setActiveChannel(c)} 
                          title={`Navigate to ${c.name || 'Batch Node'}`}
                          aria-label={`Enter ${c.name || 'node'}`}
                          className={`group p-6 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all duration-500 hover:scale-[1.03] active:scale-95 ${
                            isLight ? "bg-white border-[#D9D9C2] shadow-sm hover:shadow-2xl hover:border-[#DF8142]/30" : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-[#DF8142]/20"
                          }`}
                        >
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white flex items-center justify-center shadow-lg group-hover:rotate-[15deg] transition-transform">
                                {c.isPublic ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                            </div>
                            <span className={`text-[10px] font-black uppercase truncate w-full ${isLight ? "text-[#5A270F]" : "text-white"}`}>{c.name || `Batch ${c.batch}`}</span>
                        </button>
                    ))}
                    {isDeptHead && (
                        <button 
                          onClick={() => setShowCreateModal(true)} 
                          title="Initialize Node Shard"
                          aria-label="Create new node cluster"
                          className={`p-6 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all hover:bg-[#DF8142]/5 min-h-[140px] ${
                            isLight ? "border-[#D9D9C2] text-[#5A270F]/20 hover:border-[#DF8142] hover:text-[#DF8142]" : "border-white/10 text-white/10 hover:border-[#DF8142] hover:text-[#DF8142]"
                          }`}
                        >
                            <Plus className="h-10 w-10" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Init node</span>
                        </button>
                    )}
                </div>
            </div>
        ) : (
            <>
                <header className={`h-20 px-8 lg:px-12 flex items-center justify-between border-b relative z-30 ${isLight ? "bg-white/80 border-[#D9D9C2] backdrop-blur-xl shadow-sm" : "bg-black/40 border-white/5 backdrop-blur-xl shadow-2xl"}`}>
                  <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setActiveChannel(null)} 
                        title="Back to Registry Spectrum"
                        aria-label="Back to channels"
                        className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all ${
                            isLight ? "bg-[#FAF8F4] text-[#5A270F] hover:bg-[#DF8142] hover:text-white shadow-sm" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="h-10 w-px bg-slate-100 dark:bg-white/5 hidden lg:block" />
                    <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-[1.25rem] flex items-center justify-center shadow-2xl bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white`}>
                            {activeChannel?.isPublic ? <Globe className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                        </div>
                        <div>
                            <h3 className={`text-[15px] font-black uppercase tracking-tighter ${isLight ? "text-[#5A270F]" : "text-white"}`}>{activeChannel?.name || "Initializing..."}</h3>
                            <div className="flex items-center gap-2">
                                <Radio className="h-3 w-3 text-[#DF8142]" />
                                <p className={`text-[9px] font-bold uppercase tracking-[0.2em] opacity-50 ${isLight ? "text-[#5A270F]" : "text-white"}`}>FREQUENCY_SYNCED</p>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex gap-2 p-1.5 rounded-2xl border ${isLight ? "bg-[#FAF8F4] border-[#D9D9C2] shadow-sm" : "bg-white/5 border-white/10"}`}>
                        <button title="Uplink Entity" aria-label="Invite to node" onClick={() => setShowInviteModal(true)} className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isLight ? "bg-white text-[#5A270F] shadow-sm hover:bg-[#DF8142] hover:text-white" : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"}`}><UserPlus className="h-5 w-5" /></button>
                        <button title="Broadcasters" aria-label="View members" onClick={() => { fetchMembers(activeChannel.id); setShowMembersModal(true); }} className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isLight ? "bg-white text-[#5A270F] shadow-sm hover:bg-[#DF8142] hover:text-white" : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"}`}><Users className="h-5 w-5" /></button>
                    </div>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 custom-scrollbar scroll-smooth relative z-20">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-[#DF8142]/20 to-transparent flex items-center justify-center border border-[#DF8142]/20">
                            <Radio className="h-8 w-8 text-[#DF8142] animate-pulse" />
                        </div>
                        <p className={`text-[12px] font-black uppercase tracking-[0.6em] ${isLight ? "text-[#5A270F]" : "text-white"}`}>Awaiting Incoming_Signals</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isSelf = m.userId === currentUser?.id;
                      return (
                        <div key={m.id} className={`flex gap-5 ${isSelf ? "flex-row-reverse" : "flex-row"} animate-in slide-in-from-bottom-4 duration-700`}>
                          <div className={`h-11 w-11 rounded-2xl overflow-hidden shadow-2xl shrink-0 border-2 transition-all ${isSelf ? "border-[#DF8142]" : isLight ? "border-white shadow-xl" : "border-white/10"}`}>
                            {m.user?.image ? <img src={m.user.image} className="h-full w-full object-cover" alt="Node" /> : <div className={`h-full w-full flex items-center justify-center text-[13px] font-black text-white ${isSelf ? "bg-[#DF8142]" : "bg-[#5A270F]"}`}>{m.user?.first_name?.[0]}</div>}
                          </div>
                          <div className={`flex flex-col max-w-[80%] ${isSelf ? "items-end" : "items-start"}`}>
                            <div className="flex items-center gap-3 mb-2 px-1 text-[10px] font-black uppercase tracking-[0.15em]">
                                <span className={`${isSelf ? "text-[#DF8142]" : isLight ? "text-[#5A270F]" : "text-white/60"}`}>{m.user?.first_name} {m.user?.last_name}</span>
                                {getRoleName(m.user) !== 'student' && <span className="text-[7.5px] font-black px-2 py-0.5 rounded-[4px] bg-[#DF8142] text-white shadow-lg uppercase">{getRoleName(m.user)}</span>}
                            </div>
                            <div className={`px-6 py-4 rounded-[2rem] text-[13.5px] font-bold leading-relaxed shadow-2xl border transition-all ${
                                isSelf 
                                  ? "bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] border-[#DF8142]/50 text-white rounded-tr-none shadow-[#DF8142]/30" 
                                  : isLight ? "bg-white border-[#D9D9C2] text-[#5A270F] rounded-tl-none shadow-xl" : "bg-white/10 border-white/10 text-white rounded-tl-none shadow-black/40"
                            }`}>
                                {m.content}
                                <p className={`text-[8px] mt-2 opacity-50 font-black tracking-widest ${isSelf ? "text-white" : isLight ? "text-[#5A270F]" : "text-white"}`}>
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // SIGNAL_STAMP
                                </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messageEndRef} />
                </div>

                <footer className={`p-2 lg:p-3 backdrop-blur-3xl border-t relative z-30 ${isLight ? "bg-white border-[#D9D9C2]" : "bg-black/20 border-white/5"}`}>
                  <form onSubmit={handleSendMessage} className={`flex items-center gap-2 p-1 rounded-xl px-4 border transition-all group ${
                    isLight ? "bg-[#FAF8F4] border-[#D9D9C2] focus-within:border-[#DF8142] shadow-sm" : "bg-white/5 border-white/5 focus-within:border-[#DF8142] focus-within:bg-white/10"
                  }`}>
                     <Cpu className="h-3.5 w-3.5 text-[#DF8142] transition-transform duration-700 group-focus-within:rotate-[360deg]" />
                     <input 
                       type="text" 
                       value={newMessage} 
                       onChange={(e) => setNewMessage(e.target.value)} 
                       placeholder="INJECT COMMAND..." 
                       className={`flex-1 bg-transparent py-1.5 text-[11px] font-black outline-none placeholder:opacity-30 uppercase tracking-[0.1em] ${isLight ? "text-[#5A270F]" : "text-white"}`} 
                     />
                     <button title="Broadcast Signals" aria-label="Send signal" disabled={!newMessage.trim() || sending} className={`h-8 px-4 rounded-lg flex items-center gap-2 active:scale-95 transition-all shadow-md ${newMessage.trim() ? "bg-gradient-to-r from-[#DF8142] to-[#6C3B1C] text-white hover:scale-[1.03]" : isLight ? "bg-[#5A270F]/5 text-[#5A270F]/20" : "bg-white/5 text-white/10"}`}>
                        <span className="text-[8px] font-black uppercase tracking-widest hidden sm:block">Send</span>
                        <Send className="h-3 w-3" />
                     </button>
                  </form>
                </footer>
            </>
        )}
      </div>

      {/* CREATE MODAL - High Fidelity Overlay */}
      {showCreateModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-700">
              <div className={`w-full max-w-sm rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-15px_rgba(0,0,0,0.5)] border-2 transition-all duration-700 ${isLight ? "bg-white border-[#EEB38C]/30" : "bg-[#0C0603] border-white/10"}`}>
                  <div className="h-2 w-full bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] to-[#DF8142] animate-gradient-x" />
                  
                  <div className="p-10 w-full flex flex-col items-center">
                    <div className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] flex items-center justify-center mb-8 shadow-2xl shadow-[#DF8142]/40">
                        <Radio className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    
                    <h2 className={`text-2xl font-black uppercase tracking-tighter mb-1 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Initialize Node</h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] mb-10 text-[#DF8142]">SPECTRUM_ALLOCATION</p>

                    <form onSubmit={handleCreateChannel} className="w-full space-y-6">
                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 opacity-50 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Identify Frequency</label>
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity text-[#DF8142]" />
                                <input value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} placeholder="FREQUENCY ID..." className={`w-full pl-14 pr-6 py-4.5 rounded-[1.5rem] text-[12.5px] font-black outline-none border-2 transition-all uppercase tracking-widest ${isLight ? "bg-[#FAF8F4] border-[#EEB38C]/10 focus:border-[#DF8142] text-[#5A270F]" : "bg-white/5 border-white/5 focus:border-[#DF8142] text-white"}`} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 opacity-50 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Batch_Ref</label>
                                <input type="number" value={newChannelBatch} onChange={(e) => setNewChannelBatch(e.target.value)} placeholder="000" className={`w-full px-6 py-4.5 rounded-[1.5rem] text-[12.5px] font-black outline-none border-2 transition-all ${isLight ? "bg-[#FAF8F4] border-[#EEB38C]/10 focus:border-[#DF8142] text-[#5A270F]" : "bg-white/5 border-white/5 focus:border-[#DF8142] text-white"}`} />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 opacity-50 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Access_Lvl</label>
                                <button type="button" onClick={() => setIsPublicChannel(!isPublicChannel)} title="Toggle Node Security" aria-label="Toggle public access" className={`w-full h-[58px] rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] border-2 transition-all ${isPublicChannel ? "bg-[#DF8142] text-white border-[#DF8142] shadow-2xl shadow-[#DF8142]/20" : isLight ? "bg-[#FAF8F4] border-[#EEB38C]/10 text-[#5A270F]/40" : "bg-white/5 border-white/5 text-white/30"}`}>
                                    {isPublicChannel ? "OpenLink" : "SecureNode"}
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col gap-4">
                            <button disabled={isCreating} title="Finalize Node Stabilization" aria-label="Sync node" className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] to-[#DF8142] text-white text-[14px] font-black uppercase tracking-[0.6em] shadow-[0_20px_40px_-10px_rgba(223,129,66,0.5)] hover:scale-[1.02] active:scale-95 transition-all">
                                {isCreating ? <Loader2 className="h-7 w-7 animate-spin mx-auto" /> : "SYNCHRONIZE NODE"}
                            </button>
                            <button type="button" onClick={() => setShowCreateModal(false)} title="Dismiss Initialization" aria-label="Cancel" className={`w-full py-2 text-[11px] font-black uppercase tracking-[0.5em] transition-all opacity-30 hover:opacity-100 ${isLight ? "text-[#5A270F]" : "text-white"}`}>Abort Initialization</button>
                        </div>
                    </form>
                  </div>
              </div>
          </div>
      )}

      {/* INVITE MODAL - Search Spectrum */}
      {showInviteModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
              <div className={`w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl border-2 transition-all ${isLight ? "bg-white border-[#D9D9C2]" : "bg-[#0C0603] border-white/10"} flex flex-col h-[560px]`}>
                  <div className="p-10 pb-5 shrink-0">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className={`text-2xl font-black uppercase tracking-tight ${isLight ? "text-[#5A270F]" : "text-white"}`}>Spectrum Scan</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#DF8142] opacity-50">SEARCH_UPLINK</p>
                        </div>
                        <button onClick={() => setShowInviteModal(false)} title="Close Search" aria-label="Close" className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#5A270F]/5 dark:bg-white/5 text-slate-400 hover:text-red-500 transition-all"><X className="h-6 w-6" /></button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142]" />
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="FREQUENCY SCAN..." className={`w-full pl-14 pr-7 py-5 rounded-[1.5rem] text-[13px] font-black outline-none border transition-all uppercase tracking-widest ${isLight ? "bg-[#FAF8F4] border-slate-100 focus:border-[#DF8142] text-[#5A270F]" : "bg-white/5 border-white/5 focus:border-[#DF8142] text-white"}`} />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-10 pb-10 mt-4 custom-scrollbar-thin">
                    {searching ? <div className="py-24 flex flex-col items-center gap-6"><Loader2 className="h-10 w-10 animate-spin text-[#DF8142]" /><p className="text-[10px] font-black tracking-widest text-[#DF8142]">Scanning Frequency...</p></div> : foundUsers.length === 0 ? <div className="py-24 text-center space-y-4 opacity-30"><Radio className="h-12 w-12 mx-auto text-[#DF8142] animate-bounce" /><p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#DF8142]">Spectrum Silence</p></div> : (
                        <div className="space-y-4">
                            {foundUsers.map(u => (
                                <div key={u.id} className={`p-5 rounded-[2rem] border-2 flex items-center justify-between transition-all group ${isLight ? "bg-[#FAF8F4] border-[#D9D9C2] hover:border-[#DF8142]/40 shadow-sm" : "bg-white/5 border-white/5 hover:bg-white/10"}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white flex items-center justify-center text-[15px] font-black shadow-2xl shadow-[#DF8142]/20">{u.first_name?.[0]}</div>
                                        <div>
                                            <p className={`text-[14px] font-black ${isLight ? "text-[#5A270F]" : "text-white"}`}>{u.first_name} {u.last_name}</p>
                                            <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-wider">{getRoleName(u)}</p>
                                        </div>
                                    </div>
                                    <button disabled={invitingId === u.id} onClick={() => handleInviteUser(u.id)} title={`Connect to ${u.first_name}`} aria-label="Invite" className={`h-11 px-6 rounded-2xl flex items-center justify-center transition-all bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white shadow-2xl hover:scale-105 active:scale-95 ${invitingId === u.id ? "opacity-30" : ""}`}>
                                        {invitingId === u.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="text-[9px] font-black uppercase tracking-widest">Uplink</span>}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
              </div>
          </div>
      )}

      {showMembersModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
             <div className={`w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl border-2 transition-all ${isLight ? "bg-white border-[#D9D9C2]" : "bg-[#0C0603] border-white/10"} flex flex-col h-[600px]`}>
                  <div className={`p-10 pb-8 shrink-0 flex items-center justify-between border-b ${isLight ? "border-slate-50" : "border-white/5"}`}>
                    <div>
                        <h2 className={`text-2xl font-black uppercase tracking-tight ${isLight ? "text-[#5A270F]" : "text-white"}`}>Active Shards</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#DF8142] opacity-50">SYNC_PARTICIPANTS</p>
                    </div>
                    <button onClick={() => setShowMembersModal(false)} title="Close Participants View" aria-label="Close" className="h-12 w-12 flex items-center justify-center rounded-[1.25rem] bg-[#5A270F]/5 dark:bg-white/5 text-slate-400 hover:text-red-500 transition-all"><X className="h-7 w-7" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-10 pb-10 mt-8 space-y-6 custom-scrollbar-thin">
                    {loadingMembers ? <div className="py-24 flex justify-center"><Loader2 className="h-12 w-12 animate-spin text-[#DF8142] opacity-40" /></div> : channelMembers.map((m) => (
                        <div key={m.id} className="flex items-center justify-between group p-2 hover:bg-[#FAF8F4] dark:hover:bg-white/5 rounded-2xl transition-all">
                            <div className="flex items-center gap-5">
                                <div className={`h-13 w-13 rounded-2xl flex items-center justify-center font-black text-[18px] transition-transform shadow-lg ${isLight ? "bg-white border border-[#D9D9C2] text-[#5A270F]" : "bg-white/10 border border-white/10 text-white"}`}>{m.first_name?.[0]}</div>
                                <div className="flex flex-col">
                                    <p className={`text-[15px] font-black ${isLight ? "text-[#5A270F]" : "text-white"}`}>{m.first_name} {m.last_name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-[11px] font-black text-[#DF8142] uppercase tracking-widest">{getRoleName(m)}</p>
                                        {m.id === currentUser?.id && <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-[9px] font-black text-emerald-500 uppercase">You</span></div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                  </div>
                  <div className={`p-10 border-t flex justify-center ${isLight ? "bg-[#FAF8F4]/40 border-slate-50" : "bg-white/5 border-white/5"}`}>
                      <button onClick={() => setShowMembersModal(false)} title="Dismiss View" aria-label="Close members gallery" className={`w-full py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] border-2 transition-all ${isLight ? "bg-white border-[#EEB38C]/30 text-[#5A270F] shadow-sm hover:text-[#DF8142] hover:border-[#DF8142]" : "bg-white/10 border-white/10 text-white/60 hover:text-white hover:border-white/20"}`}>Terminate View</button>
                  </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default Nexus;
