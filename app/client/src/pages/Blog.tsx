import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Blog as BlogType } from "../models";
import { Loader2, Calendar, User, ArrowRight, Tag } from "lucide-react";

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get("/blogs?published=true");
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50/50 skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-20 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Insights & <span className="text-indigo-600">Architectural</span>{" "}
              Narratives
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              Stay updated with the latest trends, research, and stories from
              our vibrant architectural community.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-16">
        {error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center max-w-2xl mx-auto">
            <p className="font-bold text-lg mb-2">Oops! Something went wrong</p>
            <p>{error}</p>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  {blog.image_path ? (
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/${blog.image_path.replace(/\\/g, "/")}`}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Tag className="h-12 w-12 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-indigo-50 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                    <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h2>

                  <p className="text-slate-600 line-clamp-3 mb-8 flex-grow">
                    {blog.content.replace(/<[^>]*>?/gm, "").substring(0, 160)}
                    ...
                  </p>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {blog.author.firstName} {blog.author.lastName}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <Calendar className="h-3 w-3" />
                          {new Date(blog.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${blog.id}`}
                      className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 -mr-2"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm max-w-3xl mx-auto px-8">
            <div className="h-20 w-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Tag className="h-10 w-10" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">
              No stories told yet.
            </h3>
            <p className="text-slate-500 text-lg mb-8">
              Check back soon for inspiring articles and community highlights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
