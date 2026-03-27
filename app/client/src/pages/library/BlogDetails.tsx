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
} from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <button type="button" onClick={() => navigator.clipboard.writeText(window.location.href)} title="Copy Signal Link" className="h-10 w-10 sm:ml-auto rounded-xl bg-white dark:bg-[#1A0B02] border border-[#EEB38C]/50 dark:border-[#DF8142]/20 flex items-center justify-center text-[#DF8142] hover:bg-[#DF8142] hover:text-white transition-colors shadow-sm active:scale-95 group">
            <Share2 className="h-4 w-4 group-active:scale-90 transition-transform" />
          </button>
        </div>
      </header>

      {/* Primary Visual */}
      {blog.image_path && (
        <div className="max-w-4xl mx-auto px-6 mb-12 animate-in fade-in zoom-in-95 duration-700">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#1A0B02] ring-1 ring-[#EEB38C]/20 dark:ring-[#5A270F]/50 bg-[#0F0602]">
            <img
              src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${blog.image_path.replace(
                /\\/g,
                "/"
              )}`}
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
