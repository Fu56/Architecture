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
  Clock,
  Zap,
  Filter,
} from "lucide-react";
import { isAuthenticated, currentRole } from "../lib/auth";

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
    <div className="bg-[#FAF8F4] dark:bg-background min-h-screen selection:bg-[#DF8142]/20 selection:text-[#5A270F]">
      {/* Premium Header */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-[#5A270F]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(223,129,66,0.2),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(146,102,74,0.1),transparent_50%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
          {/* <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/90/10 border border-primary/90/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <BookOpen className="h-3 w-3" /> Intellectual Repository
          </div> */}
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-8 leading-none animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            INSIGHTS & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#DF8142]">
              ARCHITECTURAL NARRATIVES.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 dark:text-white/40 text-lg sm:text-xl font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-400">
            Stay updated with the latest trends, research, and technical stories
            from our vibrant architectural community.
          </p>

          {/* Search Bar Nexus */}
          <div className="max-w-md mx-auto relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#DF8142]/40 to-[#92664A]/40 rounded-xl blur opacity-20 group-focus-within:opacity-60 transition duration-500" />
            <div className="relative flex items-center bg-[#FAF8F4] dark:bg-[#100704] border border-[#EEB38C]/50 dark:border-[#DF8142]/40 rounded-xl overflow-hidden shadow-lg group-focus-within:border-[#DF8142] transition-all focus-within:ring-4 focus-within:ring-[#DF8142]/10">
              <Search className="ml-4 h-4 w-4 text-[#92664A] dark:text-[#EEB38C]/50 transition-colors group-focus-within:text-[#DF8142]" />
              <input
                type="text"
                placeholder="Scan architectural narratives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-12 h-12 bg-transparent text-sm text-[#5A270F] dark:text-white placeholder:text-[#92664A]/60 dark:placeholder:text-[#EEB38C]/40 font-bold outline-none"
              />
              <div className="absolute right-2">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={`p-1.5 rounded-lg transition-all duration-300 relative group ${
                    filterOpen || sortOrder !== "newest"
                      ? "bg-[#DF8142] text-white shadow-md shadow-[#DF8142]/30"
                      : "bg-[#EEB38C]/20 dark:bg-[#5A270F]/50 text-[#92664A] dark:text-[#EEB38C] hover:bg-[#EEB38C]/40 hover:text-[#5A270F] dark:hover:bg-[#DF8142] dark:hover:text-white"
                  }`}
                  aria-label="Filter blogs"
                >
                  <Filter className="h-4 w-4" />
                </button>

                {/* Filter Dropdown */}
                {filterOpen && (
                  <div className="absolute right-0 top-full mt-3 w-40 bg-white dark:bg-[#1A0B02] rounded-xl shadow-xl border border-[#EEB38C]/50 dark:border-[#5A270F]/50 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1.5 space-y-0.5">
                      <p className="px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/50">
                        Sort Order
                      </p>
                      <button
                        onClick={() => {
                          setSortOrder("newest");
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${
                          sortOrder === "newest"
                            ? "bg-[#DF8142]/10 text-[#DF8142]"
                            : "text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#EEB38C]/20 dark:hover:bg-[#5A270F]/50"
                        }`}
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("oldest");
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${
                          sortOrder === "oldest"
                            ? "bg-[#DF8142]/10 text-[#DF8142]"
                            : "text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#EEB38C]/20 dark:hover:bg-[#5A270F]/50"
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
                className="bg-white dark:bg-card h-[500px] rounded-[3rem] animate-pulse border border-[#92664A]/20 dark:border-white/10 shadow-xl shadow-slate-200/20"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white dark:bg-[#1A0B02] rounded-2xl overflow-hidden border border-[#EEB38C]/30 dark:border-[#5A270F]/50 shadow-lg shadow-[#5A270F]/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-[#DF8142]/10 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full relative"
              >
                {/* Visual Header */}
                <div className="relative aspect-video overflow-hidden bg-[#FAF8F4] dark:bg-[#0F0602] shrink-0">
                  {blog.image_path ? (
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL.replace("/api", "")
                      }/${blog.image_path.replace(/\\/g, "/")}`}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#DF8142]/20 to-[#92664A]/20 dark:from-[#5A270F] dark:to-[#1A0B02]">
                      <Tag className="h-10 w-10 text-[#5A270F]/20 dark:text-[#EEB38C]/20" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
                    {blog.tags.map((tag) => (
                      <div
                        key={tag}
                        className="px-2 py-1 bg-[#FAF8F4]/90 dark:bg-[#1A0B02]/90 backdrop-blur-md rounded-md text-[8px] font-black uppercase tracking-widest text-[#DF8142] dark:text-[#EEB38C] shadow-sm border border-white/20 dark:border-[#DF8142]/20"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                  
                  {blog.published && (
                     <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500/90 backdrop-blur-md rounded-md text-[8px] font-black uppercase tracking-widest text-white shadow-sm border border-emerald-400">
                        Published
                     </div>
                  )}
                </div>

                {/* Content Matrix */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/60">
                      <Sparkles className="h-3 w-3 text-[#DF8142]" />{" "}
                      Narrative
                    </div>
                    <div className="flex items-center gap-1.5 text-[8px] text-[#DF8142] font-black uppercase tracking-widest bg-[#DF8142]/10 dark:bg-[#DF8142]/5 px-2 py-1 rounded">
                      <Clock className="h-2.5 w-2.5" />
                      {Math.max(1, Math.ceil(blog.content.length / 1000))} min
                    </div>
                  </div>

                  <h2 className="text-sm font-black text-[#5A270F] dark:text-[#EEB38C] mb-2 group-hover:text-[#DF8142] transition-colors leading-[1.3] tracking-tight">
                    <Link to={`/blog/${blog.id}`} className="line-clamp-2">
                      {blog.title}
                    </Link>
                  </h2>

                  <p className="text-[11px] text-[#6C3B1C] dark:text-white/60 font-medium leading-relaxed mb-6 line-clamp-3">
                    {blog.content.replace(/<[^>]*>?/gm, "")}
                  </p>

                  {/* Footer Meta */}
                  <div className="pt-4 mt-auto border-t border-[#EEB38C]/30 dark:border-[#5A270F]/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#DF8142]/10 dark:bg-[#6C3B1C]/30 flex items-center justify-center border border-[#DF8142]/20 dark:border-[#DF8142]/10 text-[#DF8142] shadow-sm">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40 leading-none mb-1">
                          Author
                        </p>
                        <p className="text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C] truncate leading-none">
                          {blog.author.firstName} {blog.author.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] text-[#92664A] dark:text-[#EEB38C]/60 font-black uppercase tracking-[0.1em]">
                      <Calendar className="h-3 w-3" />
                      {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-card rounded-[3rem] border border-[#92664A]/20 dark:border-white/10 shadow-xl shadow-[#5A270F]/5 max-w-4xl mx-auto px-12">
            <div className="h-24 w-24 bg-[#EEB38C]/10 dark:bg-background text-[#EEB38C] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm border border-[#92664A]/20 dark:border-white/10">
              <Search className="h-12 w-12" />
            </div>
            <h3 className="text-3xl font-black text-[#2A1205] mb-4 tracking-tight">
              NO NARRATIVES DETECTED.
            </h3>
            <p className="text-gray-500 dark:text-white/40 text-lg font-medium mb-10 max-w-md mx-auto">
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
          <p className="text-gray-500 dark:text-white/40 text-lg font-medium mb-12">
            Share your architectural journey with the global community of design
            minds.
          </p>
          <Link
            to={(() => {
              if (!isAuthenticated()) return "/login";
              const role = currentRole();

              if (
                role === "Admin" ||
                role === "SuperAdmin" ||
                role === "admin" ||
                role === "DepartmentHead"
              ) {
                return "/admin/blog/new";
              }
              if (role === "Faculty") {
                return "/dashboard/blog/new";
              }
              return "/login";
            })()}
            className="px-12 py-5 bg-white dark:bg-card text-[#5A270F] dark:text-[#EEB38C] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#DF8142] hover:text-white transition-all duration-500 shadow-2xl active:scale-95 flex items-center gap-3 mx-auto w-fit"
          >
            Create New Narrative <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Blog;
