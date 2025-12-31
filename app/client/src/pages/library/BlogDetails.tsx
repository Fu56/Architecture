import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Blog } from "../../models";
import { Loader2, Calendar, User, ArrowLeft, Tag, Clock } from "lucide-react";

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
        setError("Story not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          {error || "Story not found"}
        </h2>
        <Link to="/blog" className="text-indigo-600 font-bold hover:underline">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen">
      {/* Article Header */}
      <header className="relative pt-20 pb-12 overflow-hidden border-b border-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 mb-10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Insights
          </Link>

          <div className="flex flex-wrap gap-3 mb-8">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-10 leading-[1.1]">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-none mb-1">
                  {blog.author.firstName} {blog.author.lastName}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {blog.author.role?.name || "Architectural Contributor"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 ml-auto">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-sm mb-1 uppercase tracking-tight">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  {new Date(blog.created_at).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })}
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  <Clock className="h-3 w-3" />
                  {Math.ceil(blog.content.length / 1000)} min read
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {blog.image_path && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl py-12">
          <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl">
            <img
              src={`${import.meta.env.VITE_API_URL}/${blog.image_path.replace(
                /\\/g,
                "/"
              )}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-[3rem]" />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-4xl py-16">
        <div
          className="prose prose-slate prose-lg lg:prose-xl prose-indigo max-w-none 
          prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
          prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-medium
          prose-strong:text-slate-900 prose-strong:font-black
          prose-img:rounded-[2rem] prose-img:shadow-xl prose-img:border prose-img:border-slate-100
          prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-bold prose-blockquote:text-indigo-900"
        >
          {/* Using dangerouslySetInnerHTML assuming content might have some basic formatting/markdown converted on server or just treat as plain text with line breaks */}
          <div className="whitespace-pre-wrap">{blog.content}</div>
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-3xl bg-slate-50 text-slate-300 flex items-center justify-center mb-6">
            <Tag className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">
            End of Story
          </h3>
          <p className="text-slate-400 font-medium mb-10">
            Hope you found this architectural insight valuable.
          </p>
          <Link
            to="/blog"
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black tracking-tight hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20"
          >
            Browse More Stories
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogDetails;
