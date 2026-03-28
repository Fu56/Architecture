import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Blog } from "../../models";
import {
  Calendar,
  User,
  ArrowLeft,
  Clock,
  Share2,
  Sparkles,
  Zap,
  BookMarked,
  Loader2,
  Copy,
  Check,
  Twitter,
  Linkedin,
  MessageCircle,
  X,
} from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Story Isolated: Signal lost or access denied by central nexus.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const shareUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: `Check out this architectural insight: ${blog.title}`,
          url: shareUrl,
        });
      } catch { /* user cancelled */ }
    } else {
      setShareOpen(true);
    }
  };

  const socials = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      href: `https://wa.me/?text=${encodeURIComponent(blog?.title + " " + shareUrl)}`,
    },
    {
      label: "X / Twitter",
      icon: Twitter,
      color: "bg-black hover:bg-neutral-800",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog?.title ?? "")}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600 hover:bg-blue-700",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0F0602] flex flex-col items-center justify-center py-20 px-4">
        <div className="h-16 w-16 bg-white dark:bg-[#1A0B02] rounded-2xl shadow-xl border border-[#EEB38C]/30 dark:border-[#5A270F]/50 flex items-center justify-center mb-6 shadow-[#DF8142]/10 animate-pulse">
          <BookMarked className="h-6 w-6 text-[#DF8142]" />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/60">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#DF8142]" />
          Deciphering Narrative...
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0F0602] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="h-16 w-16 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-red-500/10 border border-red-500/20">
          <Zap className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black text-[#5A270F] dark:text-white mb-6 tracking-tighter leading-none uppercase">
          {error || "Story Nexus Offline"}
        </h2>
        <Link
          to="/blog"
          className="px-6 py-3 bg-[#5A270F] dark:bg-[#2C1105] text-white dark:text-[#EEB38C] rounded-xl font-extrabold uppercase tracking-widest text-[10px] hover:bg-[#6C3B1C] dark:hover:bg-[#DF8142] dark:hover:text-white transition-all shadow-lg border border-transparent dark:border-[#DF8142]/30"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-[#FAF8F4] dark:bg-[#0F0602] min-h-screen selection:bg-[#DF8142]/20 selection:text-[#5A270F] dark:selection:text-white transition-colors duration-500 pb-20">
      {/* Header Framework */}
      <header className="px-6 pt-24 pb-8 max-w-4xl mx-auto flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/60 hover:text-[#DF8142] dark:hover:text-white mb-8 transition-colors group bg-white dark:bg-[#1A0B02] px-4 py-2 rounded-xl border border-[#EEB38C]/30 dark:border-[#5A270F]/50 shadow-sm"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        {/* Dynamic Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-[#EEB38C]/20 dark:bg-[#5A270F]/40 text-[#DF8142] dark:text-[#EEB38C] rounded-lg border border-[#DF8142]/20 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Narrative Title */}
        <h1 className="text-3xl md:text-5xl font-black text-[#5A270F] dark:text-white tracking-tight mb-8 leading-[1.1] max-w-3xl">
          {blog.title}
        </h1>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-6 w-full max-w-3xl border-y border-[#EEB38C]/30 dark:border-[#5A270F]/50">
          
          {/* Architect Identifier */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#6C3B1C] dark:bg-[#2C1105] flex items-center justify-center text-white dark:text-[#EEB38C] shadow-md border border-[#5A270F] dark:border-[#DF8142]/30">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/50 mb-0.5">
                Architect
              </p>
              <p className="text-xs font-black text-[#5A270F] dark:text-white leading-none">
                {blog.author.firstName} {blog.author.lastName}
              </p>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-[#EEB38C]/50 dark:bg-[#5A270F]/50" />

          {/* Temporal Data */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#DF8142]" />
              <div className="text-left">
                 <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/50 mb-0.5">Logged</p>
                 <p className="text-[10px] font-bold text-[#6C3B1C] dark:text-white/80 uppercase tracking-tight">
                    {new Date(blog.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                 </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[#DF8142]" />
              <div className="text-left">
                 <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/50 mb-0.5">Duration</p>
                 <p className="text-[10px] font-bold text-[#6C3B1C] dark:text-white/80 uppercase tracking-tight">
                    {Math.ceil(blog.content.length / 1000)} min read
                 </p>
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-[#EEB38C]/50 dark:bg-[#5A270F]/50" />

          {/* Share Control */}
          <div className="relative sm:ml-auto">
            <button
              type="button"
              onClick={handleNativeShare}
              title="Share this article"
              className="h-10 w-10 rounded-xl bg-white dark:bg-[#1A0B02] border border-[#EEB38C]/50 dark:border-[#DF8142]/20 flex items-center justify-center text-[#DF8142] hover:bg-[#DF8142] hover:text-white transition-colors shadow-sm active:scale-95 group"
            >
              <Share2 className="h-4 w-4 group-active:scale-90 transition-transform" />
            </button>

            {/* Share Panel */}
            {shareOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShareOpen(false)}
                />
                <div className="absolute right-0 top-full mt-3 z-50 w-72 bg-white dark:bg-[#1A0B02] rounded-2xl shadow-2xl border border-[#EEB38C]/30 dark:border-[#DF8142]/20 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                  {/* Panel Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#5A270F] dark:bg-[#1A0B04]">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-3.5 w-3.5 text-[#EEB38C]" />
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#EEB38C]">Share Narrative</p>
                    </div>
                    <button
                      title="Close share panel"
                      onClick={() => setShareOpen(false)}
                      className="h-6 w-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Copy Link */}
                    <button
                      onClick={handleCopyLink}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-300 group ${
                        copied
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-[#FAF8F4] dark:bg-white/5 border-[#EEB38C]/30 dark:border-white/10 text-[#5A270F] dark:text-[#EEB38C] hover:border-[#DF8142] hover:bg-[#EEB38C]/10 dark:hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-[#DF8142]" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                          {copied ? "Link Copied!" : "Copy Link"}
                        </span>
                      </div>
                      <div className="text-[8px] font-mono text-[#92664A] dark:text-white/30 truncate max-w-[80px]">
                        {window.location.hostname}
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-[#EEB38C]/20 dark:bg-white/5" />
                      <span className="text-[8px] font-black text-[#92664A] dark:text-white/30 uppercase tracking-widest">Or share on</span>
                      <div className="flex-1 h-px bg-[#EEB38C]/20 dark:bg-white/5" />
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      {socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-white transition-all active:scale-95 ${s.color}`}
                        >
                          <s.icon className="h-4 w-4" />
                          <span className="text-[7px] font-black uppercase tracking-widest">{s.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Primary Visual */}
      {blog.image_path && (
        <div className="max-w-4xl mx-auto px-6 mb-12 animate-in fade-in zoom-in-95 duration-700">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#1A0B02] ring-1 ring-[#EEB38C]/20 dark:ring-[#5A270F]/50 bg-[#0F0602]">
            <img
              src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/uploads/${blog.image_path.replace(/\\/g, "/").split("/").pop()}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white text-[8px] font-black uppercase tracking-widest shadow-xl">
              <Sparkles className="h-3 w-3 text-[#DF8142]" /> Verified Capture
            </div>
          </div>
        </div>
      )}

      {/* Semantic Text Content */}
      <div className="max-w-3xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div
          className="prose prose-sm md:prose-base max-w-none
          prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[#5A270F] dark:prose-headings:text-white
          prose-p:text-[#6C3B1C] dark:prose-p:text-[#EEB38C]/90 prose-p:leading-relaxed prose-p:font-medium
          prose-strong:text-[#5A270F] dark:prose-strong:text-white prose-strong:font-black
          prose-img:rounded-2xl prose-img:shadow-xl prose-img:border-4 prose-img:border-white dark:prose-img:border-[#1A0B02]
          prose-blockquote:border-l-4 prose-blockquote:border-[#DF8142] prose-blockquote:bg-[#EEB38C]/10 dark:prose-blockquote:bg-[#2C1105]/50 prose-blockquote:text-[#5A270F] dark:prose-blockquote:text-[#EEB38C] prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-bold prose-blockquote:shadow-sm"
        >
          {/* Prevent raw HTML from breaking standard formats (or selectively parse if it's markdown, depending on your setup. Given current codebase, mostly plain text formatting) */}
          <div className="whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Narrative Termination Point */}
        <div className="mt-20 pt-10 border-t border-[#EEB38C]/30 dark:border-[#5A270F]/50 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-[#DF8142]/10 dark:bg-[#DF8142]/5 border border-[#DF8142]/20 text-[#DF8142] flex items-center justify-center mb-4 shadow-sm">
            <BookMarked className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-black text-[#5A270F] dark:text-white mb-2 tracking-tight uppercase">
            End of Log.
          </h3>
          <p className="text-[11px] font-bold text-[#92664A] dark:text-[#EEB38C]/60 mb-8 max-w-xs mx-auto">
            Communication block concluded. Return to hub or explore other archives.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/blog"
              className="px-6 py-3 bg-[#5A270F] dark:bg-[#DF8142] text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#6C3B1C] dark:hover:bg-[#C56A2A] transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              Archive Feed <ArrowLeft className="h-3 w-3" />
            </Link>
            <Link
              to="/explore"
              className="px-6 py-3 bg-white dark:bg-[#1A0B02] border border-[#EEB38C]/50 dark:border-[#5A270F] text-[#5A270F] dark:text-[#EEB38C] rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#EEB38C]/10 dark:hover:bg-[#2C1105] transition-all active:scale-95 shadow-sm"
            >
              Explore Nexus
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetails;
