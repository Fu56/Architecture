import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Blog as BlogType } from "../models";
import {
  Calendar,
  User,
  ArrowRight,
  Tag,
  Search,
  Sparkles,
  BookOpen,
  Clock,
  Zap,
  Filter,
} from "lucide-react";

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get("/blogs?published=true");
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError(
          "Network Error: Connectivity to the knowledge nexus was interrupted.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="bg-[#EFEDED] min-h-screen selection:bg-primary/20 selection:text-[#2A1205]">
      {/* Premium Header */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-[#5A270F]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(223,129,66,0.2),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(146,102,74,0.1),transparent_50%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/90/10 border border-primary/90/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <BookOpen className="h-3 w-3" /> Intellectual Repository
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-8 leading-none animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            INSIGHTS & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#DF8142]">
              ARCHITECTURAL NARRATIVES.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 text-lg sm:text-xl font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-400">
            Stay updated with the latest trends, research, and technical stories
            from our vibrant architectural community.
          </p>

          {/* Search Bar Nexus */}
          <div className="max-w-xl mx-auto relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#DF8142] to-[#92664A] rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-white border border-[#D9D9C2] rounded-2xl overflow-hidden shadow-sm group-focus-within:border-[#DF8142] transition-all">
              <Search className="ml-5 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search narratives, tags, or metadata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 h-16 text-[#5A270F] placeholder:text-gray-500 font-bold outline-none"
              />
              <div className="absolute right-4">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={`p-2 rounded-xl transition-all duration-300 relative group ${
                    filterOpen || sortOrder !== "newest"
                      ? "bg-[#DF8142] text-white shadow-lg shadow-[#DF8142]/30"
                      : "bg-[#EFEDED] text-[#5A270F] hover:bg-[#D9D9C2] hover:text-[#2A1205]"
                  }`}
                  aria-label="Filter blogs"
                >
                  <Filter className="h-4 w-4" />
                </button>

                {/* Filter Dropdown */}
                {filterOpen && (
                  <div className="absolute right-0 top-full mt-4 w-48 bg-white rounded-2xl shadow-xl border border-[#D9D9C2] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 space-y-1">
                      <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#92664A]">
                        Sort Order
                      </p>
                      <button
                        onClick={() => {
                          setSortOrder("newest");
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm font-bold rounded-xl transition-colors ${
                          sortOrder === "newest"
                            ? "bg-[#DF8142]/10 text-[#DF8142]"
                            : "text-[#5A270F] hover:bg-[#EFEDED]"
                        }`}
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("oldest");
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm font-bold rounded-xl transition-colors ${
                          sortOrder === "oldest"
                            ? "bg-[#DF8142]/10 text-[#DF8142]"
                            : "text-[#5A270F] hover:bg-[#EFEDED]"
                        }`}
                      >
                        Oldest First
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid Cluster */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 -mt-24 relative z-20 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white h-[500px] rounded-[3rem] animate-pulse border border-[#D9D9C2] shadow-xl shadow-slate-200/20"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-20 rounded-[3rem] border border-red-100 text-center max-w-4xl mx-auto shadow-2xl">
            <Zap className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-3xl font-black mb-4 tracking-tight leading-none">
              SYSTEM DISRUPTION
            </h3>
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-10 px-10 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-red-600/30"
            >
              Attempt Signal Restoration
            </button>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white rounded-[3rem] overflow-hidden border border-[#D9D9C2] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-[#DF8142]/10 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-700"
              >
                {/* Visual Header */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F5DC] shrink-0">
                  {blog.image_path ? (
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/${blog.image_path.replace(/\\/g, "/")}`}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#DF8142] to-[#92664A]">
                      <Tag className="h-16 w-16 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5A270F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 scale-90 group-hover:scale-100 transition-transform duration-500">
                    {blog.tags.slice(0, 1).map((tag) => (
                      <div
                        key={tag}
                        className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-[#DF8142] shadow-xl"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Matrix */}
                <div className="p-10 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Sparkles className="h-3.5 w-3.5 text-[#DF8142]" />{" "}
                    Community Log
                  </div>

                  <h2 className="text-2xl font-black text-[#5A270F] mb-6 group-hover:text-[#DF8142] transition-colors leading-[1.2] tracking-tight">
                    <Link to={`/blog/${blog.id}`} className="line-clamp-2">
                      {blog.title}
                    </Link>
                  </h2>

                  <p className="text-[#5A270F] font-medium leading-relaxed mb-8 line-clamp-3">
                    {blog.content.replace(/<[^>]*>?/gm, "").substring(0, 180)}
                    ...
                  </p>

                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[#EFEDED] flex items-center justify-center border border-[#D9D9C2] text-gray-500 group-hover:bg-[#DF8142] group-hover:text-white transition-all duration-300 shadow-sm">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none mb-1">
                          Architect
                        </p>
                        <p className="text-sm font-black text-[#6C3B1C] truncate leading-none">
                          {blog.author.firstName} {blog.author.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-black uppercase tracking-[0.15em]">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-[#DF8142] font-black uppercase tracking-widest">
                        <Clock className="h-3 w-3" />
                        {Math.ceil(blog.content.length / 1000)} min read
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-[#D9D9C2] shadow-xl shadow-slate-200/20 max-w-4xl mx-auto px-12">
            <div className="h-24 w-24 bg-[#EFEDED] text-[#EEB38C] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm border border-[#D9D9C2]">
              <Search className="h-12 w-12" />
            </div>
            <h3 className="text-3xl font-black text-[#2A1205] mb-4 tracking-tight">
              NO NARRATIVES DETECTED.
            </h3>
            <p className="text-gray-500 text-lg font-medium mb-10 max-w-md mx-auto">
              The knowledge nexus returned null for your current filter
              parameters. Try broadening your criteria.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-primary font-black text-[10px] uppercase tracking-[0.3em] hover:text-[#2A1205] transition-colors"
            >
              Reset Search Nexus
            </button>
          </div>
        )}
      </div>

      {/* CTA Layer */}
      <section className="py-24 bg-[#5A270F] text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">
            Got a story to tell?
          </h2>
          <p className="text-gray-500 text-lg font-medium mb-12">
            Share your architectural journey with the global community of design
            minds.
          </p>
          <Link
            to="/login"
            className="px-12 py-5 bg-white text-[#5A270F] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#DF8142] hover:text-white transition-all duration-500 shadow-2xl active:scale-95 flex items-center gap-3 mx-auto w-fit"
          >
            Create New Narrative <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Blog;
