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
        setError(
          "Story Isolated: Signal lost or access denied by central nexus."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEDED] flex flex-col items-center justify-center py-40">
        <div className="h-20 w-20 bg-white rounded-3xl shadow-xl border border-[#D9D9C2] flex items-center justify-center mb-8 animate-pulse">
          <BookMarked className="h-10 w-10 text-primary/80" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary/90 animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary/90 animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary/90 animate-bounce" />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          Deciphering Narrative
        </p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="h-24 w-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-xl shadow-red-500/10">
          <Zap className="h-10 w-10" />
        </div>
        <h2 className="text-4xl font-black text-[#5A270F] mb-6 tracking-tighter leading-none uppercase">
          {error || "Story Nexus Offline"}
        </h2>
        <Link
          to="/blog"
          className="px-10 py-4 bg-[#2A1205] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-2xl"
        >
          Return to Archive Nexus
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen selection:bg-primary/20 selection:text-[#2A1205]">
      {/* Immersive Article Header */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-[#EFEDED] border-b border-[#D9D9C2]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.05),transparent_50%)]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col items-center text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-primary mb-12 transition-all group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Archive Nexus
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-white text-primary rounded-xl border border-primary/20 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#2A1205] tracking-tighter mb-12 leading-[0.9] max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-10 py-10 w-full max-w-4xl border-t border-[#D9D9C2]">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#2A1205] flex items-center justify-center text-white shadow-xl shadow-[#2A1205]/20 group hover:bg-primary transition-colors duration-500">
                <User className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">
                  Architectural Node
                </p>
                <p className="text-lg font-black text-[#5A270F] leading-none">
                  {blog.author.firstName} {blog.author.lastName}
                </p>
              </div>
            </div>

            <div className="hidden sm:block h-10 w-px bg-slate-200" />

            <div className="flex items-center gap-12">
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  Transmission Date
                </p>
                <div className="flex items-center gap-2 text-[#5A270F] font-black text-sm uppercase tracking-tight">
                  <Calendar className="h-3.5 w-3.5 text-primary/90" />
                  {new Date(blog.created_at).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })}
                </div>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  Operation Length
                </p>
                <div className="flex items-center gap-2 text-[#5A270F] font-black text-sm uppercase tracking-tight">
                  <Clock className="h-3.5 w-3.5 text-primary/90" />
                  {Math.ceil(blog.content.length / 1000)} min scan
                </div>
              </div>
            </div>

            <button className="h-14 w-14 rounded-2xl bg-white border border-[#D9D9C2] flex items-center justify-center text-gray-500 hover:bg-[#2A1205] hover:text-white hover:border-[#2A1205] transition-all shadow-sm active:scale-95 ml-auto">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Featured Visual Cluster */}
      {blog.image_path && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
          <div className="relative aspect-[21/9] rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-100 animate-in zoom-in-95 duration-1000">
            <img
              src={`${import.meta.env.VITE_API_URL}/${blog.image_path.replace(
                /\\/g,
                "/"
              )}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A1205]/20 to-transparent" />

            <div className="absolute bottom-10 left-10 flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-3xl rounded-2xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
              <Sparkles className="h-4 w-4" /> Captured Reality
            </div>
          </div>
        </div>
      )}

      {/* Article Semantic Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-20">
        <div
          className="prose prose-slate lg:prose-xl prose-indigo max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-[#2A1205]
          prose-p:text-[#5A270F]/80 prose-p:leading-[1.9] prose-p:font-medium
          prose-strong:text-[#2A1205] prose-strong:font-black
          prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:border-8 prose-img:border-white prose-img:ring-1 prose-img:ring-slate-100
          prose-blockquote:border-l-0 prose-blockquote:bg-[#2A1205] prose-blockquote:text-white prose-blockquote:p-12 prose-blockquote:rounded-[3rem] prose-blockquote:not-italic prose-blockquote:font-black prose-blockquote:tracking-tight prose-blockquote:text-3xl prose-blockquote:shadow-2xl prose-blockquote:shadow-[#2A1205]/20"
        >
          <div className="whitespace-pre-wrap leading-relaxed">
            {blog.content}
          </div>
        </div>

        {/* Narrative Termination Point */}
        <div className="mt-32 pt-16 border-t border-[#D9D9C2] flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-[2rem] bg-primary text-white flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <BookMarked className="h-10 w-10" />
          </div>
          <h3 className="text-3xl font-black text-[#2A1205] mb-4 tracking-tighter uppercase">
            Narrative Terminated.
          </h3>
          <p className="text-gray-500 font-medium text-lg mb-12 max-w-sm mx-auto">
            Communication end. Securely disconnect or navigate back to the
            collective intelligence nexus.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              to="/blog"
              className="px-12 py-6 bg-[#2A1205] text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-[#2A1205]/20 active:scale-95 flex items-center gap-3"
            >
              Back to Archive <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              to="/explore"
              className="px-12 py-6 bg-white border border-[#D9D9C2] text-[#5A270F] rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-[#EFEDED] transition-all active:scale-95"
            >
              Explore Matrix
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetails;
