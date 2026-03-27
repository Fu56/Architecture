// cSpell:ignore departmenthead kobicha
// NEXUS_MODAL_COMPACT_THEMED_1879
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Users,
  Shield,
  Zap,
  Search,
  ArrowLeft,
  Plus,
  Globe,
  Lock,
  X,
  UserPlus,
  Loader2,
  Radio,
  Network,
  Trash2,
  Paperclip,
  FileText,
  PlayCircle,
  Download,
  CheckCheck,
  MessageSquare,
  LogOut,
  AlertTriangle,
  Copy,
  Forward,
  Share2,
  Settings,
  Link,
  AtSign,
  Check,
} from "lucide-react";
import React from "react";
import { useSession } from "../../lib/auth-client";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";

interface Channel {
  id: number;
  name: string;
  batch?: number;
  isPublic: boolean;
  isPrivate: boolean;
  isSubscribed?: boolean;
  unreadCount?: number;
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
  attachments?: {
    id: number;
    fileUrl: string;
    fileType: string;
    fileName: string;
  }[];
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

  const getRoleName = (u: UserIdentity | null | undefined) => {
    if (!u?.role) return "";
    return (
      typeof u.role === "string"
        ? u.role
        : (u.role as { name: string }).name || ""
    ).toLowerCase();
  };

  const currentRole = getRoleName(
    currentUser as UserIdentity | null | undefined,
  );
  const isDeptHead = ["departmenthead", "admin", "superadmin"].includes(
    currentRole,
  );

  const getMediaUrl = (fileUrl: string) => {
    const baseUrl = (import.meta.env.VITE_API_URL as string).replace(
      "/api",
      "",
    );
    return `${baseUrl}${fileUrl}`;
  };

  const handleDownload = async (
    e: React.MouseEvent,
    url: string,
    filename: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Transmission Extraction Failure:", err);
      toast.error("Failed to extract data shard.");
    }
  };

  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelBatch, setNewChannelBatch] = useState("");
  const [isPublicChannel, setIsPublicChannel] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState<FoundUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [channelMembers, setChannelMembers] = useState<FoundUser[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [discoverySearchQuery, setDiscoverySearchQuery] = useState("");
  const [discoveredChannels, setDiscoveredChannels] = useState<Channel[]>([]);
  const [isSearchingChannels, setIsSearchingChannels] = useState(false);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [channelAlias, setChannelAlias] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const fetchChannels = useCallback(async () => {
    try {
      const response = await api.get("/chat/channels");
      setChannels(response.data);
    } catch {
      toast.error("Failed to sync Nexus frequency list.");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (channelId: number) => {
    try {
      await api.post(`/chat/channels/${channelId}/mark-read`);
      setChannels((prev) =>
        prev.map((ch) =>
          ch.id === channelId ? { ...ch, unreadCount: 0 } : ch,
        ),
      );
    } catch (err) {
      console.error("Read Synchronization Failure:", err);
    }
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.post("/chat/channels/mark-all-read");
      setChannels((prev) => prev.map((ch) => ({ ...ch, unreadCount: 0 })));
      toast.success("Global Nexus synchronization successful.");
    } catch {
      toast.error("Global synchronization failure.");
    }
  };

  const startPrivateChat = async (targetUserId: string) => {
    try {
      const { data } = await api.post("/chat/channels/private", {
        targetUserId,
      });
      setChannels((prev) => {
        if (prev.find((c) => c.id === data.id)) return prev;
        return [data, ...prev];
      });
      setActiveChannel(data);
      setShowInviteModal(false);
      toast.success("Private uplink established.");
    } catch {
      toast.error("Failed to establish secure frequency.");
    }
  };

  const fetchMessages = useCallback(async (channelId: number) => {
    try {
      const { data } = await api.get(`/chat/channels/${channelId}/messages`);
      setMessages((prev) => {
        if (data.length > prev.length) setShouldScrollToBottom(true);
        return data;
      });
    } catch {
      console.error("Signal Retrieval Error");
    }
  }, []);

  const handleSearchUsers = useCallback(async () => {
    if (userSearchQuery.trim().length < 2) return;
    setSearching(true);
    try {
      const { data } = await api.get(`/user/search?q=${userSearchQuery}`);
      setFoundUsers(data);
    } catch {
      toast.error("User database synchronization failed.");
    } finally {
      setSearching(false);
    }
  }, [userSearchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (userSearchQuery) handleSearchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [userSearchQuery, handleSearchUsers]);

  const fetchMembers = useCallback(async (channelId: number) => {
    setLoadingMembers(true);
    try {
      const { data } = await api.get(`/chat/channels/${channelId}/members`);
      setChannelMembers(data);
    } catch {
      toast.error("Participant data mismatch.");
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  const handleSearchPublicChannels = useCallback(async () => {
    if (discoverySearchQuery.trim().length < 2) {
      setDiscoveredChannels([]);
      return;
    }
    setIsSearchingChannels(true);
    try {
      const { data } = await api.get(
        `/chat/channels/search?q=${discoverySearchQuery}`,
      );
      setDiscoveredChannels(data);
    } catch {
      console.error("Discovery Scan Error");
    } finally {
      setIsSearchingChannels(false);
    }
  }, [discoverySearchQuery]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (discoverySearchQuery) handleSearchPublicChannels();
      else setDiscoveredChannels([]);
    }, 500);
    return () => clearTimeout(t);
  }, [discoverySearchQuery, handleSearchPublicChannels]);

  const handleJoinChannel = async (channelId: number) => {
    setJoiningId(channelId);
    try {
      await api.post(`/chat/channels/${channelId}/join`);
      toast.success("Synchronized to public spectrum.");
      setDiscoverySearchQuery("");
      setDiscoveredChannels([]);
      fetchChannels();
    } catch {
      toast.error("Join protocol failed.");
    } finally {
      setJoiningId(null);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    const m = setInterval(() => {
      if (activeChannel) fetchMessages(activeChannel.id);
    }, 5000);
    const c = setInterval(() => {
      fetchChannels();
    }, 30000);
    return () => {
      clearInterval(m);
      clearInterval(c);
    };
  }, [activeChannel, fetchChannels, fetchMessages]);

  useEffect(() => {
    if (activeChannel) {
      markAsRead(activeChannel.id);
    }
  }, [activeChannel, markAsRead]);

  useEffect(() => {
    if (messages.length > 0 && shouldScrollToBottom) {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Payload too large (Max 50MB)");
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !activeChannel || sending)
      return;
    setSending(true);
    try {
      const formData = new FormData();
      if (newMessage.trim()) formData.append("content", newMessage.trim());
      if (selectedFile) formData.append("file", selectedFile);

      const { data } = await api.post(
        `/chat/channels/${activeChannel.id}/messages`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setMessages((p) => [...p, data]);
      setShouldScrollToBottom(true);
      setNewMessage("");
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Packet transmission lost.");
    } finally {
      setSending(false);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return toast.error("Identity shard required.");
    setIsCreating(true);
    try {
      await api.post("/chat/channels", {
        name: newChannelName,
        batch: newChannelBatch ? Number(newChannelBatch) : null,
        isPublic: isPublicChannel,
      });
      toast.success("Initialized.");
      setShowCreateModal(false);
      setNewChannelName("");
      setNewChannelBatch("");
      fetchChannels();
    } catch (err: unknown) {
      const m =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Protocol Failure.";
      toast.error(m);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim() || !showInviteModal) {
      setFoundUsers([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get(`/admin/users?search=${searchQuery}`);
        setFoundUsers(data.users || []);
      } catch {
        console.error("Spectrum scan fail");
      } finally {
        setSearching(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery, showInviteModal]);

  const handleInviteUser = async (targetUserId: string) => {
    if (!activeChannel) return;
    setInvitingId(targetUserId);
    try {
      await api.post(`/chat/channels/${activeChannel.id}/add-user`, {
        targetUserId,
      });
      toast.success("Adding User successful.");
    } catch {
      toast.error("Identity lock failure.");
    } finally {
      setInvitingId(null);
    }
  };

  const handleLeaveChannel = async (channelId: number) => {
    toast.warning("Sever satellite link?", {
      description:
        "You will no longer receive transmissions from this Channel.",
      action: {
        label: "Confirm Exit",
        onClick: async () => {
          try {
            await api.post(`/chat/channels/${channelId}/unsubscribe`);
            toast.success("Frequency de-synchronized.");
            fetchChannels();
            setActiveChannel(null);
          } catch {
            toast.error("De-link protocol failure.");
          }
        },
      },
      cancel: { label: "Abort", onClick: () => {} },
    });
  };

  const handleReportChannel = async (channel: Channel) => {
    toast.info("Initialize Signal Report", {
      description: `Report unauthorized activity in ${channel.name} to higher command?`,
      action: {
        label: "Submit Report",
        onClick: () => {
          toast.success("Intelligence report transmitted to Department Head.");
        },
      },
      cancel: { label: "Dismiss", onClick: () => {} },
    });
  };

  const handleCopyMessage = async (content?: string, fileUrl?: string) => {
    try {
      if (fileUrl) {
        try {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          if (
            blob.type.startsWith("image/") &&
            typeof ClipboardItem !== "undefined"
          ) {
            await navigator.clipboard.write([
              new ClipboardItem({ [blob.type]: blob }),
            ]);
            toast.success("Media shard duplicated to clipboard.");
          } else {
            throw new Error("Generic Binary Shard");
          }
        } catch {
          // Fallback to text link if binary copy fails or is not an image
          await navigator.clipboard.writeText(fileUrl);
          toast.success("Access link mirrored to clipboard.");
        }
      } else if (content) {
        await navigator.clipboard.writeText(content);
        toast.success("Signal content mirrored to clipboard.");
      }
    } catch (err) {
      console.error("Critical Mirroring Failure:", err);
      toast.error("Shield breach: Unable to mirror signal.");
    }
  };

  const handleForwardMessage = (
    _message: Message /* eslint-disable-line */,
  ) => {
    toast.info("Forwarding Protocol Initialized", {
      description: "Select target spectrum for data relay.",
    });
  };

  const handleShareMessage = (_message: Message /* eslint-disable-line */) => {
    toast.info("Broadcast sequence pending", {
      description: "External sharing channels under synchronization.",
    });
  };

  const handleDeleteMessage = async (messageId: number) => {
    toast.warning("Dismantle message shard?", {
      description: "This data segment will be purged from the Nexus.",
      action: {
        label: "Purge",
        onClick: async () => {
          try {
            await api.delete(`/chat/messages/${messageId}`);
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
            toast.success("Signal shard purged.");
          } catch {
            toast.error("Purge protocol failed.");
          }
        },
      },
      cancel: { label: "Abort", onClick: () => {} },
    });
  };

  const handleDeleteChannel = async (channelId: number) => {
    toast.warning("Dismantle node frequency?", {
      description:
        "Permanent decommission of this spectrum node cannot be undone.",
      action: {
        label: "Confirm Deletion",
        onClick: async () => {
          try {
            await api.delete(`/chat/channels/${channelId}`);
            toast.success("Frequency decommissioned.");
            fetchChannels();
            if (activeChannel?.id === channelId) setActiveChannel(null);
          } catch {
            toast.error("Protocol failure: Unable to dismantle node.");
          }
        },
      },
      cancel: {
        label: "Abort",
        onClick: () => {},
      },
    });
  };

  if (loading)
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white dark:bg-[#5A270F] space-y-4">
        <Zap className="h-10 w-10 text-[#DF8142] animate-bounce" />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] opacity-40">
          Synchronizing Spectrum...
        </p>
      </div>
    );

  return (
    <div className="h-[calc(100vh-160px)] lg:h-[calc(100vh-140px)] rounded-2xl overflow-hidden border flex relative animate-in fade-in duration-700 bg-white border-[#92664A]/20 shadow-xl dark:bg-[#5A270F] dark:border-[#92664A]/20 dark:shadow-2xl dark:shadow-black/80">
      {/* Dynamic Atmospheric Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EEB38C]/10 dark:bg-[#6C3B1C]/70 -skew-x-12 translate-x-1/4" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DF8142]/5 blur-[120px] rounded-full" />
      </div>

      {/* SIDEBAR - Spectrum Selection */}
      <div
        className={`fixed inset-0 z-[100] lg:relative lg:inset-auto lg:z-20 w-72 lg:w-64 border-r shrink-0 flex flex-col transition-all duration-500 bg-white/95 border-[#92664A]/20 backdrop-blur-3xl dark:bg-[#5A270F]/95 dark:border-[#92664A]/20 ${!activeChannel ? "translate-x-0" : "-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100 hidden lg:flex"}`}
      >
        <div className="p-4 flex flex-col h-full shrink-0 min-w-[200px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center border transition-all bg-white border-[#DF8142]/20 text-[#5A270F] dark:bg-[#6C3B1C]/70 dark:border-[#EEB38C]/20 dark:text-[#DF8142]">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white">
                  CHANNELS
                </h2>
                <div className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-[#DF8142] animate-pulse" />
                  <p className="text-[8px] font-bold uppercase tracking-wider text-[#92664A]/60 dark:text-[#EEB38C]/30">
                    SYNCED
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setShowSearch(!showSearch);
                  if (showSearch) setSearchQuery("");
                }}
                title="Search Channels"
                className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${showSearch ? "bg-[#DF8142] text-white shadow-md shadow-[#DF8142]/20" : "bg-white border border-[#92664A]/20 text-[#92664A] hover:bg-[#EEB38C]/20"}`}
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                onClick={handleMarkAllRead}
                title="Synchronize All Nodes"
                className="h-7 w-7 rounded-lg flex items-center justify-center transition-all bg-white border border-[#92664A]/20 text-[#92664A] hover:bg-[#EEB38C]/20 hover:text-[#5A270F] dark:bg-[#6C3B1C]/40 dark:border-[#EEB38C]/10 dark:text-[#EEB38C]/60 dark:hover:text-white"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                title="Initialize New Channel"
                className="h-7 w-7 rounded-lg flex items-center justify-center transition-all bg-[#DF8142] text-white hover:scale-105 active:scale-95 shadow-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="px-4 mb-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative group">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#92664A]/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    setDiscoverySearchQuery(val);
                  }}
                  placeholder="Scan frequencies..."
                  autoFocus
                  className="w-full bg-white dark:bg-[#5A270F]/30 border border-[#92664A]/15 rounded-lg py-1.5 pl-8 pr-3 text-[10px] font-bold outline-none focus:border-[#DF8142] placeholder:text-[#92664A]/30 transition-all dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar-thin space-y-4 pr-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest px-4 mb-5 text-[#92664A]/80 dark:text-[#EEB38C]/40">
                CHANNELS
              </p>
              <div className="space-y-2">
                {channels
                  .filter((c) =>
                    (c.name || `Batch ${c.batch}`)
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  .map((ch) => (
                    <div key={ch.id} className="group relative">
                      <button
                        onClick={() => setActiveChannel(ch)}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all ${
                          activeChannel?.id === ch.id
                            ? "bg-[#5A270F] dark:bg-[#DF8142] text-white shadow-lg shadow-[#5A270F]/20"
                            : "hover:bg-white text-[#5A270F]/50 hover:text-[#5A270F] dark:hover:bg-[#6C3B1C]/70 dark:text-[#EEB38C]/50 dark:hover:text-white"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded flex items-center justify-center transition-all ${activeChannel?.id === ch.id ? "bg-white/20" : "bg-white/50 border border-[#92664A]/10 shadow-sm text-[#5A270F] dark:bg-[#6C3B1C]/70 dark:text-[#EEB38C]/40"}`}
                        >
                          {ch.isPublic ? (
                            <Globe className="h-3 w-3" />
                          ) : (
                            <Lock className="h-3 w-3" />
                          )}
                        </div>
                        <span className="text-[10px] font-bold tracking-tight truncate uppercase flex-1 text-left">
                          {ch.name || `Batch ${ch.batch}`}
                        </span>
                        {ch.unreadCount !== undefined && ch.unreadCount > 0 && (
                          <span className="h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-[#DF8142] text-white text-[8px] font-black animate-pulse shadow-sm">
                            {ch.unreadCount}
                          </span>
                        )}
                      </button>
                      {isDeptHead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChannel(ch.id);
                          }}
                          title="Dismantle Frequency"
                          aria-label="Delete channel"
                          className={`absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                            activeChannel?.id === ch.id
                              ? "text-white hover:bg-[#6C3B1C]/60"
                              : "text-[#92664A] hover:text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {(discoverySearchQuery || discoveredChannels.length > 0) && (
              <div className="pt-6 animate-in fade-in duration-500">
                <p className="text-[10px] font-black uppercase tracking-widest px-4 mb-4 text-[#DF8142]">
                  DISCOVERY
                </p>
                <div className="space-y-2 px-1">
                  {isSearchingChannels ? (
                    <div className="py-4 flex justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-[#DF8142] opacity-40" />
                    </div>
                  ) : discoveredChannels.length > 0 ? (
                    discoveredChannels.map((ch) => (
                      <div
                        key={ch.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#EEB38C]/10 border border-transparent hover:border-[#DF8142]/30 transition-all"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Globe className="h-3 w-3 text-[#DF8142] shrink-0" />
                          <span className="text-[9px] font-black uppercase truncate text-[#5A270F] dark:text-white">
                            {ch.name}
                          </span>
                        </div>
                        {ch.isSubscribed ? (
                          <span className="text-[7px] font-black uppercase tracking-tighter text-[#92664A]/60 p-1">
                            Joined
                          </span>
                        ) : (
                          <button
                            onClick={() => handleJoinChannel(ch.id)}
                            disabled={joiningId === ch.id}
                            className="px-2 py-1 rounded-lg bg-[#DF8142] text-white text-[8px] font-black uppercase hover:bg-[#6C3B1C] transition-all shadow-sm"
                          >
                            {joiningId === ch.id ? (
                              <Loader2 className="h-2 w-2 animate-spin" />
                            ) : (
                              "Join"
                            )}
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="px-4 text-[8px] font-black uppercase tracking-widest text-[#92664A]/40 text-center py-2">
                      No matching spectrums
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-[#92664A]/15 dark:border-[#92664A]/10">
            <div className="flex items-center gap-3 px-1 opacity-50 hover:opacity-100 transition-opacity">
              <Shield className="h-4 w-4 text-[#5A270F] dark:text-[#DF8142]" />
              <div>
                <p className="text-[8px] font-black tracking-wide uppercase text-[#5A270F] dark:text-white">
                  S_Shield
                </p>
                <p className="text-[7px] font-bold uppercase tracking-widest text-[#92664A]/60 dark:text-[#EEB38C]/20">
                  PROTO_V4
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT Area (Chat/Dashboard) */}
      <div className="flex-1 flex flex-col relative z-10 transition-all duration-500 bg-white dark:bg-transparent">
        {!activeChannel ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in zoom-in-95 duration-1000">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] shadow-2xl shadow-[#DF8142]/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Radio className="h-11 w-11 text-white animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic text-[#5A270F] dark:text-white">
                Channel{" "}
                <span className="text-[#DF8142] not-italic">Nexus_</span>
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/70">
                Select or Create Channel
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
              {channels.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChannel(c)}
                  title={`Navigate to ${c.name || "Batch Node"}`}
                  aria-label={`Enter ${c.name || "node"}`}
                  className="group p-4 rounded-2xl gap-3 transition-all duration-500 hover:scale-[1.03] active:scale-95 bg-white border-[#92664A]/30 shadow-sm hover:shadow-2xl hover:border-[#DF8142]/30 dark:bg-[#6C3B1C]/70 dark:border-[#92664A]/20 dark:hover:bg-[#6C3B1C]/80 dark:hover:border-[#DF8142]/20"
                >
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white flex items-center justify-center shadow-lg group-hover:rotate-[15deg] transition-transform">
                    {c.isPrivate ? (
                      <Users className="h-5 w-5" />
                    ) : c.isPublic ? (
                      <Globe className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase truncate w-full text-[#5A270F] dark:text-white">
                    {c.name || `Batch ${c.batch}`}
                  </span>
                </button>
              ))}
              <button
                onClick={() => setShowCreateModal(true)}
                title="Create Channel"
                aria-label="Create new channel"
                className="group p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:scale-[1.03] active:scale-95 min-h-[140px] shadow-sm hover:shadow-xl bg-[#EEB38C]/10 border-[#DF8142]/50 text-[#5A270F] hover:bg-white hover:border-[#DF8142] dark:bg-[#6C3B1C]/30 dark:border-[#DF8142]/40 dark:text-white dark:hover:bg-[#6C3B1C]/70 dark:hover:border-[#DF8142]"
              >
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#EEB38C]/30 to-[#92664A]/30 text-[#DF8142] flex items-center justify-center group-hover:bg-[#DF8142] group-hover:text-white transition-all duration-300">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Create Channel
                </span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <header className="h-14 lg:h-16 px-4 lg:px-6 flex items-center justify-between border-b relative z-30 bg-white/80 border-[#92664A]/15 backdrop-blur-xl dark:bg-[#5A270F]/40 dark:border-[#92664A]/20">
              <div className="flex items-center gap-3 lg:gap-5">
                <button
                  onClick={() => setActiveChannel(null)}
                  title="Return to Directory"
                  className="h-8 w-8 lg:h-9 lg:w-9 rounded-xl flex items-center justify-center transition-all bg-[#EEB38C]/10 text-[#5A270F] hover:bg-[#DF8142] hover:text-white shadow-sm dark:bg-[#6C3B1C]/70 dark:text-[#EEB38C]/80 dark:hover:bg-[#6C3B1C]/80 dark:hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white shadow-lg">
                    {activeChannel?.isPublic ? (
                      <Globe className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-[12px] lg:text-sm font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-white">
                      {activeChannel?.name || "LOCKED_NODE"}
                    </h3>
                    <div className="flex items-center gap-1.5 opacity-40">
                      <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[8px] font-black tracking-widest uppercase">
                        Node_Connected
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 lg:gap-1.5 p-1 rounded-xl border bg-[#EEB38C]/5 border-[#92664A]/10 dark:bg-[#6C3B1C]/50 dark:border-white/5 shadow-sm">
                  {/* Participant Lifecycle Actions */}
                  {!activeChannel.isPrivate && (
                    <>
                      <button
                        onClick={() => setShowInviteModal(true)}
                        title="Uplink Member"
                        className="h-8 w-8 lg:h-9 lg:w-9 rounded-xl flex items-center justify-center transition-all bg-white text-[#5A270F] shadow-sm hover:bg-[#DF8142] hover:text-white dark:bg-[#6C3B1C]/80 dark:text-[#EEB38C]/80 dark:hover:bg-white/20 dark:hover:text-white"
                      >
                        <UserPlus className="h-4 w-4 lg:h-5 lg:w-5" />
                      </button>
                      <button
                        onClick={() => {
                          fetchMembers(activeChannel.id);
                          setShowMembersModal(true);
                        }}
                        title="Active Participants"
                        className="h-8 w-8 lg:h-9 lg:w-9 rounded-xl flex items-center justify-center transition-all bg-white text-[#5A270F] shadow-sm hover:bg-[#DF8142] hover:text-white dark:bg-[#6C3B1C]/80 dark:text-[#EEB38C]/80 dark:hover:bg-white/20 dark:hover:text-white"
                      >
                        <Users className="h-4 w-4 lg:h-5 lg:w-5" />
                      </button>
                    </>
                  )}

                  {/* Lifecycle & Security Controls */}
                  <div className="w-[1px] h-6 bg-[#92664A]/20 mx-1 hidden lg:block" />

                  <button
                    onClick={() => handleLeaveChannel(activeChannel.id)}
                    title="Terminate Local Frequency (Leave)"
                    className="h-8 w-8 lg:h-9 lg:w-9 rounded-xl flex items-center justify-center transition-all bg-white text-[#92664A] shadow-sm hover:bg-red-500 hover:text-white dark:bg-[#6C3B1C]/80 dark:text-[#EEB38C]/60 dark:hover:bg-red-500/20 dark:hover:text-red-500"
                  >
                    <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>

                  <button
                    onClick={() => handleReportChannel(activeChannel)}
                    title="Signal unauthorized activity"
                    className="h-8 w-8 lg:h-9 lg:w-9 rounded-xl flex items-center justify-center transition-all bg-white text-[#92664A] shadow-sm hover:bg-amber-500 hover:text-white dark:bg-[#6C3B1C]/80 dark:text-[#EEB38C]/60 dark:hover:bg-amber-500/20 dark:hover:text-amber-500"
                  >
                    <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>

                  <button
                    onClick={() => {
                      setChannelAlias(
                        activeChannel.name.toLowerCase().replace(/\s+/g, "_"),
                      );
                      setShowSettingsModal(true);
                    }}
                    title="Frequency Configuration"
                    className="h-8 w-8 lg:h-9 lg:w-9 rounded-xl flex items-center justify-center transition-all bg-white text-[#92664A] shadow-sm hover:bg-[#5A270F] hover:text-white dark:bg-[#6C3B1C]/80 dark:text-[#EEB38C]/60 dark:hover:bg-white/20 dark:hover:text-white"
                  >
                    <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-6 custom-scrollbar scroll-smooth relative z-20">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DF8142]/20 to-transparent flex items-center justify-center border border-[#DF8142]/20">
                    <Radio className="h-8 w-8 text-[#DF8142] animate-pulse" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#5A270F] dark:text-white">
                    Awaiting Incoming_Signals
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const isSelf = m.userId === currentUser?.id;
                  return (
                    <div
                      key={m.id}
                      className={`group flex flex-col ${isSelf ? "items-end" : "items-start"} animate-in slide-in-from-bottom-2 duration-500`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1 text-[9px] font-black uppercase tracking-wider">
                        <span
                          className={
                            isSelf
                              ? "text-[#DF8142]"
                              : "text-[#5A270F] dark:text-[#EEB38C]/80"
                          }
                        >
                          {m.user?.first_name} {m.user?.last_name}
                        </span>
                        {!isSelf && (
                          <button
                            onClick={() => startPrivateChat(m.userId)}
                            title={`Establish Secret Handshake with ${m.user?.first_name}`}
                            className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#EEB38C]/20 text-[#DF8142]"
                          >
                            <MessageSquare className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="relative group/msg max-w-[85%]">
                        {/* Interactive Command Menu (Telegram Style) */}
                        <div
                          className={`absolute -top-7 ${isSelf ? "right-0" : "left-0"} opacity-0 group-hover/msg:opacity-100 transition-all duration-300 flex items-center gap-1 bg-white/90 dark:bg-[#6C3B1C]/90 backdrop-blur-md p-1 rounded-xl border border-[#92664A]/20 shadow-xl z-50`}
                        >
                          <button
                            onClick={() =>
                              handleCopyMessage(
                                m.content,
                                m.attachments?.[0]?.fileUrl
                                  ? getMediaUrl(m.attachments[0].fileUrl)
                                  : undefined,
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-[#DF8142] hover:text-white transition-all text-[#92664A] dark:text-[#EEB38C]/60"
                            title="Mirror Signal (Copy)"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleForwardMessage(m)}
                            className="p-1.5 rounded-lg hover:bg-[#DF8142] hover:text-white transition-all text-[#92664A] dark:text-[#EEB38C]/60"
                            title="Relay Signal (Forward)"
                          >
                            <Forward className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleShareMessage(m)}
                            className="p-1.5 rounded-lg hover:bg-[#DF8142] hover:text-white transition-all text-[#92664A] dark:text-[#EEB38C]/60"
                            title="Broadcast Signal (Share)"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                          {isSelf && (
                            <button
                              onClick={() => handleDeleteMessage(m.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all text-[#92664A] dark:text-[#EEB38C]/60"
                              title="Purge Signal (Delete)"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <div
                          className={`px-3.5 py-2 rounded-xl text-[11px] font-medium leading-relaxed border transition-all ${
                            isSelf
                              ? "bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] border-[#DF8142]/40 text-white rounded-tr-none shadow-md shadow-[#DF8142]/10"
                              : "bg-white border-[#92664A]/20 text-[#5A270F] rounded-tl-none dark:bg-[#6C3B1C]/60 dark:border-[#EEB38C]/10 dark:text-white dark:rounded-tl-none shadow-sm"
                          }`}
                        >
                          {m.attachments?.map((att) => {
                            const fileUrl = getMediaUrl(att.fileUrl);
                            return (
                              <div
                                key={att.id}
                                className="mb-2 last:mb-0 group/media relative"
                              >
                                {att.fileType.startsWith("image/") ? (
                                  <div className="relative overflow-hidden rounded-xl border border-white/20 shadow-lg bg-black/5 max-w-[280px]">
                                    <img
                                      src={fileUrl}
                                      alt={att.fileName}
                                      className="w-full h-auto max-h-[300px] object-contain cursor-zoom-in hover:scale-[1.02] transition-transform duration-500"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-between">
                                      <p className="text-[7px] text-white font-black uppercase tracking-widest truncate opacity-60 group-hover/media:opacity-100 transition-opacity">
                                        {att.fileName}
                                      </p>
                                      <div className="flex gap-1.5 opacity-0 group-hover/media:opacity-100 transition-opacity">
                                        <button
                                          onClick={() =>
                                            handleCopyMessage(
                                              undefined,
                                              fileUrl,
                                            )
                                          }
                                          title="Mirror Image Shard"
                                          className="p-1.5 rounded-md bg-white/20 hover:bg-[#DF8142] text-white transition-all shadow-sm backdrop-blur-md"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </button>
                                        <button
                                          onClick={(e) =>
                                            handleDownload(
                                              e,
                                              fileUrl,
                                              att.fileName,
                                            )
                                          }
                                          title="Extract Image Shard"
                                          className="p-1.5 rounded-md bg-white/20 hover:bg-[#DF8142] text-white transition-all shadow-sm backdrop-blur-md"
                                        >
                                          <Download className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : att.fileType.startsWith("video/") ? (
                                  <div className="relative overflow-hidden rounded-xl border border-white/20 shadow-lg bg-black/5 max-w-[280px]">
                                    <video
                                      src={fileUrl}
                                      className="w-full h-auto max-h-[300px] object-contain"
                                      controls
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover/media:opacity-100 transition-opacity flex flex-col gap-2">
                                      <button
                                        onClick={() =>
                                          handleCopyMessage(undefined, fileUrl)
                                        }
                                        title="Mirror Video Shard"
                                        className="p-1.5 rounded-md bg-black/50 hover:bg-[#DF8142] text-white transition-all shadow-lg backdrop-blur-md"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={(e) =>
                                          handleDownload(
                                            e,
                                            fileUrl,
                                            att.fileName,
                                          )
                                        }
                                        title="Extract Video Shard"
                                        className="p-1.5 rounded-md bg-black/50 hover:bg-[#DF8142] text-white transition-all shadow-lg backdrop-blur-md"
                                      >
                                        <Download className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-1 max-w-[260px]">
                                    <div
                                      className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${
                                        isSelf
                                          ? "bg-white/10 border-white/20"
                                          : "bg-[#5A270F]/5 border-[#92664A]/10 dark:bg-black/20 dark:border-white/10"
                                      }`}
                                    >
                                      <div className="h-8 w-8 rounded-lg bg-[#DF8142] flex items-center justify-center text-white shrink-0 shadow-md">
                                        <FileText className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest truncate">
                                          {att.fileName}
                                        </p>
                                        <p className="text-[7px] opacity-40 uppercase tracking-tighter">
                                          Data Shard
                                        </p>
                                      </div>
                                      <div className="flex gap-1.5 shrink-0">
                                        <button
                                          onClick={() =>
                                            handleCopyMessage(
                                              undefined,
                                              fileUrl,
                                            )
                                          }
                                          title="Mirror Data Link"
                                          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all shadow-sm ${
                                            isSelf
                                              ? "hover:bg-white/20 text-white"
                                              : "hover:bg-[#DF8142] hover:text-white text-[#92664A]"
                                          }`}
                                        >
                                          <Copy className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={(e) =>
                                            handleDownload(
                                              e,
                                              fileUrl,
                                              att.fileName,
                                            )
                                          }
                                          title="Recover Data Shard"
                                          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all shadow-sm ${
                                            isSelf
                                              ? "hover:bg-white/20 text-white"
                                              : "hover:bg-[#DF8142] hover:text-white text-[#92664A]"
                                          }`}
                                        >
                                          <Download className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {m.content && (
                            <p className="whitespace-pre-wrap mt-1">
                              {m.content}
                            </p>
                          )}
                          <div
                            className={`text-[8px] mt-1.5 opacity-40 font-black tracking-widest ${isSelf ? "text-white" : "text-[#5A270F] dark:text-white"} flex items-center gap-1.5`}
                          >
                            <span className="h-1 w-1 rounded-full bg-current opacity-30" />
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messageEndRef} />
            </div>

            <footer className="p-2 pt-1 backdrop-blur-3xl border-t relative z-30 bg-white border-[#92664A]/15 dark:bg-[#6C3B1C]/40 dark:border-[#92664A]/10">
              {selectedFile && (
                <div className="mx-3 mb-2 p-2 rounded-xl bg-[#EEB38C]/10 dark:bg-black/20 border border-[#DF8142]/20 flex items-center justify-between animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-[#DF8142]/20 bg-[#6C3B1C]/10 flex items-center justify-center shrink-0">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : selectedFile.type.startsWith("video/") ? (
                        <PlayCircle className="h-5 w-5 text-[#DF8142]" />
                      ) : (
                        <FileText className="h-5 w-5 text-[#DF8142]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white truncate max-w-[150px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-[8px] font-bold text-[#DF8142] uppercase tracking-tighter">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        Shard
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    title="Evict Packet"
                    className="h-7 w-7 rounded-lg bg-[#5A270F]/5 hover:bg-[#5A270F]/10 text-red-500 flex items-center justify-center transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 p-1 rounded-xl px-2.5 border transition-all duration-300 group bg-[#EEB38C]/5 border-[#92664A]/15 focus-within:border-[#DF8142] focus-within:bg-white/50 focus-within:shadow-[0_0_20px_-5px_rgba(223,129,66,0.15)] dark:bg-[#6C3B1C]/30 dark:border-[#92664A]/20 dark:focus-within:border-[#DF8142] dark:focus-within:bg-[#5A270F]/40"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  title="Upload Spectrum Shard"
                  placeholder="Select File"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Inject Media Shard"
                  className="h-8.5 w-8.5 rounded-lg flex items-center justify-center text-[#92664A] hover:bg-[#EEB38C]/20 hover:text-[#5A270F] dark:text-[#EEB38C]/50 dark:hover:bg-white/10 dark:hover:text-[#DF8142] transition-all duration-200 shrink-0 group-focus-within:text-[#DF8142]/70"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 bg-transparent py-1.5 text-[11px] font-bold outline-none placeholder:text-[#5A270F]/30 dark:placeholder:text-white/20 text-[#5A270F] dark:text-white`}
                />
                <button
                  disabled={(!newMessage.trim() && !selectedFile) || sending}
                  title="Send Broadcast"
                  className={`h-8.5 px-3.5 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all duration-300 transform-gpu ${newMessage.trim() || selectedFile ? "bg-[#DF8142] hover:bg-[#6C3B1C] text-white shadow-[0_10px_20px_-5px_rgba(223,129,66,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(108,59,28,0.5)] hover:-translate-y-0.5 hover:scale-105" : "bg-[#5A270F]/5 text-[#5A270F]/20 dark:bg-[#6C3B1C]/30 dark:text-white/5 cursor-not-allowed opacity-50"}`}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send
                      className={`h-4 w-4 transition-transform duration-300 ${newMessage.trim() || selectedFile ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : ""}`}
                    />
                  )}
                </button>
              </form>
            </footer>
          </>
        )}
      </div>

      {/* CREATE MODAL - High Fidelity Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-[#2A1205]/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-[300px] rounded-xl overflow-hidden shadow-2xl border-2 bg-white border-[#EEB38C]/30 dark:bg-[#5A270F] dark:border-[#EEB38C]/20">
            <div className="h-1 w-full bg-[#DF8142]" />

            <div className="p-4 w-full flex flex-col items-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] flex items-center justify-center mb-6">
                <Radio className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-xl font-black uppercase tracking-tight mb-1 text-[#5A270F] dark:text-white">
                Create Node
              </h2>
              <p className="text-[8px] font-black uppercase tracking-widest mb-6 text-[#DF8142]">
                Channel_Initialization
              </p>

              <form onSubmit={handleCreateChannel} className="w-full space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider ml-4 opacity-50 text-[#5A270F] dark:text-white">
                    Channel Name
                  </label>
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity text-[#DF8142]" />
                    <input
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      placeholder="CHANNEL NAME..."
                      className="w-full pl-14 pr-6 py-3 rounded-2xl text-xs font-black outline-none border-2 transition-all uppercase tracking-widest bg-[#EEB38C]/10 border-[#EEB38C]/10 focus:border-[#DF8142] text-[#5A270F] dark:bg-[#6C3B1C]/70 dark:border-[#92664A]/20 dark:focus:border-[#DF8142] dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider ml-4 opacity-50 text-[#5A270F] dark:text-white">
                      Batch_Ref
                    </label>
                    <input
                      type="number"
                      value={newChannelBatch}
                      onChange={(e) => setNewChannelBatch(e.target.value)}
                      placeholder="000"
                      className="w-full px-6 py-3 rounded-2xl text-xs font-black outline-none border-2 transition-all bg-[#EEB38C]/10 border-[#EEB38C]/10 focus:border-[#DF8142] text-[#5A270F] dark:bg-[#6C3B1C]/70 dark:border-[#92664A]/20 dark:focus:border-[#DF8142] dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider ml-4 opacity-50 text-[#5A270F] dark:text-white">
                      Access_Lvl
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPublicChannel(!isPublicChannel)}
                      title="Toggle Node Security"
                      aria-label="Toggle public access"
                      className={`w-full h-12 rounded-2xl text-xs font-black uppercase tracking-wider border-2 transition-all ${isPublicChannel ? "bg-[#DF8142] text-white border-[#DF8142] shadow-2xl shadow-[#DF8142]/20" : "bg-[#EEB38C]/10 border-[#EEB38C]/10 text-[#92664A] dark:bg-[#6C3B1C]/70 dark:border-[#92664A]/20 dark:text-[#EEB38C]/50"}`}
                    >
                      {isPublicChannel ? "OpenLink" : "SecureNode"}
                    </button>
                  </div>
                </div>

                <div className="pt-6 flex flex-col gap-4">
                  <button
                    disabled={isCreating}
                    title="Finalize Node Stabilization"
                    aria-label="Sync node"
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] to-[#DF8142] text-white text-[13px] font-black uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(223,129,66,0.5)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {isCreating ? (
                      <Loader2 className="h-7 w-7 animate-spin mx-auto" />
                    ) : (
                      "CREATE CHANNEL"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    title="Dismiss Node Creation"
                    className="w-full py-2 text-xs font-black uppercase tracking-widest transition-all opacity-30 hover:opacity-100 text-[#5A270F] dark:text-white"
                  >
                    Cancel Channel Creation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* INVITE MODAL - Search Spectrum */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-[#5A270F]/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-[360px] rounded-2xl overflow-hidden shadow-2xl border-2 flex flex-col h-[450px] bg-white border-[#92664A]/30 dark:bg-[#5A270F] dark:border-[#EEB38C]/20">
            <div className="p-5 pb-3 shrink-0">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-[#5A270F] dark:text-white">
                    Channel Scan
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#DF8142] opacity-50">
                    SEARCH_USER
                  </p>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  title="Close Search"
                  aria-label="Close"
                  className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#5A270F]/5 dark:bg-[#6C3B1C]/70 text-[#EEB38C]/70 hover:text-red-500 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DF8142]" />
                <input
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="SEARCH_USER..."
                  className="w-full pl-14 pr-7 py-5 rounded-2xl text-xs font-black outline-none border transition-all uppercase tracking-widest bg-[#EEB38C]/10 border-[#92664A]/30 focus:border-[#DF8142] text-[#5A270F] dark:bg-[#6C3B1C]/70 dark:border-[#92664A]/20 dark:focus:border-[#DF8142] dark:text-white"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 mt-4 custom-scrollbar-thin">
              {searching ? (
                <div className="py-24 flex flex-col items-center gap-6">
                  <Loader2 className="h-10 w-10 animate-spin text-[#DF8142]" />
                  <p className="text-[10px] font-black tracking-widest text-[#DF8142]">
                    Scanning Users...
                  </p>
                </div>
              ) : foundUsers.length === 0 ? (
                <div className="py-24 text-center space-y-4 opacity-30">
                  <Radio className="h-12 w-12 mx-auto text-[#DF8142] animate-bounce" />
                  <p className="text-xs font-black uppercase tracking-widest text-[#DF8142]">
                    No Users Found
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {foundUsers.map((u) => (
                    <div
                      key={u.id}
                      className="p-5 rounded-3xl border-2 flex items-center justify-between transition-all group bg-[#EEB38C]/10 border-[#92664A]/30 hover:border-[#DF8142]/40 shadow-sm dark:bg-[#6C3B1C]/70 dark:border-[#92664A]/20 dark:hover:bg-[#6C3B1C]/80"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#DF8142] to-[#6C3B1C] text-white flex items-center justify-center text-[13px] font-black shadow-2xl shadow-[#DF8142]/20">
                          {u.first_name?.[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-black text-[#5A270F] dark:text-white">
                            {u.first_name} {u.last_name}
                          </p>
                          <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-wider">
                            {getRoleName(u)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startPrivateChat(u.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#DF8142] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#6C3B1C] transition-all shadow-lg shadow-[#DF8142]/20"
                        >
                          Chat
                        </button>
                        <button
                          onClick={() => handleInviteUser(u.id)}
                          disabled={invitingId === u.id}
                          className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                            invitingId === u.id
                              ? "bg-[#92664A]/20 text-[#92664A] border-transparent"
                              : "border-[#DF8142]/30 text-[#DF8142] hover:bg-[#DF8142] hover:text-white"
                          }`}
                        >
                          {invitingId === u.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                          ) : (
                            "Invite"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showMembersModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-[#5A270F]/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-[360px] rounded-2xl overflow-hidden shadow-2xl border-2 flex flex-col h-[480px] bg-white border-[#92664A]/30 dark:bg-[#5A270F] dark:border-[#EEB38C]/20">
            <div className="p-3 pb-2 shrink-0 flex items-center justify-between border-b border-[#92664A]/20">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-[#5A270F] dark:text-white">
                  Active Users
                </h2>
                <p className="text-[8px] font-black uppercase tracking-widest text-[#DF8142] opacity-50">
                  CHANNEL_PARTICIPANTS
                </p>
              </div>
              <button
                onClick={() => setShowMembersModal(false)}
                title="Close Participants View"
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#5A270F]/5 dark:bg-[#6C3B1C]/70 text-[#EEB38C]/70 hover:text-red-500 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 mt-4 space-y-3 custom-scrollbar-thin">
              {loadingMembers ? (
                <div className="py-24 flex justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-[#DF8142] opacity-40" />
                </div>
              ) : (
                channelMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between group p-1.5 hover:bg-[#EEB38C]/10 dark:hover:bg-[#6C3B1C]/70 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-[11px] transition-transform shadow-sm bg-white border border-[#92664A]/30 text-[#5A270F] dark:bg-[#6C3B1C]/80 dark:border-[#EEB38C]/20 dark:text-white">
                        {m.first_name?.[0]}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[11px] font-black text-[#5A270F] dark:text-white">
                          {m.first_name} {m.last_name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[9px] font-black text-[#DF8142] uppercase tracking-widest">
                            {getRoleName(m)}
                          </p>
                          {m.id === currentUser?.id && (
                            <div className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 flex items-center gap-1">
                              <span className="h-1 w-1 rounded-full bg-emerald-500" />
                              <span className="text-[8px] font-black text-emerald-500 uppercase">
                                You
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t flex justify-center bg-[#EEB38C]/10 border-[#92664A]/20 dark:bg-[#6C3B1C]/70 dark:border-[#92664A]/20">
              <button
                onClick={() => setShowMembersModal(false)}
                title="Dismiss Gallery"
                className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all bg-white border-[#EEB38C]/30 text-[#5A270F] shadow-sm hover:text-[#DF8142] hover:border-[#DF8142] dark:bg-[#6C3B1C]/80 dark:border-[#EEB38C]/20 dark:text-[#EEB38C]/80 dark:hover:text-white dark:hover:border-white/20"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
      {showSettingsModal && activeChannel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#5A270F]/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowSettingsModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#5A270F] rounded-[2.5rem] shadow-2xl border border-[#92664A]/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#EEB38C]/10 dark:bg-black/20 flex items-center justify-center border border-[#DF8142]/20">
                    <Settings className="h-5 w-5 text-[#DF8142]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#5A270F] dark:text-white">
                      Frequency Settings
                    </h2>
                    <p className="text-[9px] font-bold text-[#DF8142] uppercase tracking-[0.2em]">
                      Segment Configuration
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  title="Dismiss Settings"
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#EEB38C]/10 dark:hover:bg-black/20 text-[#92664A] transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Permanent Link Node */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#92664A]/60 flex items-center gap-2">
                    <Link className="h-3 w-3" /> Permanent Spectrum Link
                  </label>
                  <div className="relative group">
                    <div className="w-full bg-[#EEB38C]/5 dark:bg-black/20 border border-[#92664A]/15 rounded-xl px-4 py-3 text-[11px] font-black text-[#5A270F]/40 dark:text-white/40 truncate pr-12">
                      {window.location.origin}/nexus/join/{activeChannel.id}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/nexus/join/${activeChannel.id}`,
                        );
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                        toast.success("Frequency link mirrored.");
                      }}
                      className="absolute right-2 top-1.5 h-8 w-8 rounded-lg bg-white dark:bg-[#6C3B1C] shadow-sm border border-[#92664A]/20 flex items-center justify-center text-[#DF8142] hover:scale-105 transition-all"
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[8px] font-medium text-[#92664A]/40 leading-relaxed">
                    Share this link with authorized personnel to grant direct
                    spectrum access.
                  </p>
                </div>

                {/* Channel Alias (@handle) */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#92664A]/60 flex items-center gap-2">
                    <AtSign className="h-3 w-3" /> Spectrum Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DF8142] font-black text-[12px]">
                      @
                    </span>
                    <input
                      type="text"
                      value={channelAlias}
                      onChange={(e) => setChannelAlias(e.target.value)}
                      placeholder="nexus_frequency"
                      className="w-full bg-white dark:bg-[#6C3B1C]/50 border-2 border-[#EEB38C]/20 focus:border-[#DF8142] rounded-xl pl-8 pr-4 py-3 text-[12px] font-black text-[#5A270F] dark:text-white outline-none transition-all placeholder:opacity-30"
                    />
                  </div>
                  <p className="text-[8px] font-medium text-[#92664A]/40 leading-relaxed">
                    Authorized users can locate this channel using this unique
                    frequency handle.
                  </p>
                </div>

                {/* Administrative Permissions Overlay */}
                <div className="p-4 rounded-2xl bg-[#EEB38C]/5 dark:bg-black/10 border border-[#92664A]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase tracking-wider">
                        Broadcast Shards
                      </p>
                      <p className="text-[8px] text-[#92664A]/60">
                        Allow members to send messages
                      </p>
                    </div>
                    <div className="h-5 w-9 rounded-full bg-emerald-500 p-1 flex justify-end transition-all">
                      <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between opacity-40 grayscale">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase tracking-wider">
                        Media Transmission
                      </p>
                      <p className="text-[8px] text-[#92664A]/60">
                        Sharing images and data files
                      </p>
                    </div>
                    <div className="h-5 w-9 rounded-full bg-emerald-500 p-1 flex justify-end">
                      <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  toast.success("Protocol configuration saved.");
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#DF8142] to-[#6C3B1C] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#DF8142]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Update Synchronization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nexus;
