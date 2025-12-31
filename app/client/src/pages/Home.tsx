import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Download,
  Cpu,
  Trophy,
  Calendar,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { api } from "../lib/api";
import type { Resource, Blog } from "../models";
import ResourceCard from "../components/ui/ResourceCard";

const news = [
  {
    id: 1,
    title: "Pritzker Prize 2026 Nominees Announced",
    source: "ArchDaily",
    time: "2h ago",
  },
  {
    id: 2,
    title: "Global Summit on Sustainable Materials",
    source: "Architect Magazine",
    time: "5h ago",
  },
  {
    id: 3,
    title: "The Rise of Parametric Design in Social Housing",
    source: "Dezeen",
    time: "12h ago",
  },
];

const categories = [
  { name: "Structural", icon: "🏗️", count: 1240 },
  { name: "Sustainable", icon: "🌱", count: 890 },
  { name: "Urban Planning", icon: "🏙️", count: 650 },
  { name: "Interior Design", icon: "🪑", count: 520 },
];

interface Stats {
  totalResources: number;
  totalUsers: number;
  totalDownloads: number;
  facultyCount: number;
}

const Home = () => {
  const [topResources, setTopResources] = useState<Resource[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalResources: 0,
    totalUsers: 0,
    totalDownloads: 0,
    facultyCount: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, , statsRes, blogRes] = await Promise.all([
          api.get("/resources?sortBy=downloads&limit=4"),
          api.get("/resources?sortBy=recent&limit=3"),
          api.get("/common/stats"),
          api.get("/blogs?published=true&limit=2"),
        ]);

        const topData = topRes.data;
        const statsData = statsRes.data;
        const blogData = blogRes.data;

        if (Array.isArray(topData)) setTopResources(topData);
        else if (topData && topData.resources)
          setTopResources(topData.resources);

        if (statsData) setStats(statsData);
        if (Array.isArray(blogData)) setBlogs(blogData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-indigo-100 bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gray-950/20 z-10" />
          <img
            src="/assets/hero.png"
            alt="Hero Architectural"
            className="w-full h-full object-cover brightness-[0.6] scale-105 animate-slow-zoom"
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-950 via-gray-950/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.15),transparent_50%)] z-10" />
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] z-10 [background-image:linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] [background-size:60px_60px]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-20 w-full mt-10">
          <div className="max-w-5xl">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 mb-10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full animate-in fade-in slide-in-from-top-6 duration-1000 shadow-2xl group cursor-default">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="relative z-10">
                THE FUTURE OF ARCHITECTURAL KNOWLEDGE
              </span>
              <div className="ml-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-[6.5rem] lg:text-[7.5rem] font-black tracking-tighter text-white mb-10 leading-[0.85] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
              WHERE VISION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                MEETS STRUCTURE
              </span>{" "}
              <br />
              IN EXCELLENCE.
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-10 mb-16 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <p className="text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed font-medium border-l-2 border-indigo-500/50 pl-8">
                The premier repository for architectural research, design
                projects, and assignments. Elevate your academic journey with
                peer-reviewed resources.
              </p>

              <div className="hidden lg:flex items-center gap-6 p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden ring-2 ring-indigo-500/20"
                    >
                      <img
                        src={`https://i.pravatar.cc/150?u=${i + 10}`}
                        alt="Active User"
                      />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-gray-900 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                    +5k
                  </div>
                </div>
                <div>
                  <p className="text-sm font-black text-white leading-none mb-1">
                    Join the Elite
                  </p>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest">
                    Active Community
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="mb-14 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500"
            >
              <div className="relative max-w-3xl group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200" />

                <div className="relative flex items-center bg-white/95 backdrop-blur-2xl rounded-[2.2rem] overflow-hidden shadow-2xl ring-1 ring-white/20 transition-all group-focus-within:ring-indigo-500/50">
                  <div className="pl-8">
                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find blueprints, thesis papers, or models..."
                    className="w-full pl-6 pr-6 py-8 bg-transparent text-gray-900 placeholder:text-gray-400 text-lg font-bold focus:outline-none"
                  />
                  <div className="pr-3">
                    <button
                      type="submit"
                      className="whitespace-nowrap px-10 py-5 bg-indigo-600 hover:bg-slate-900 text-white text-sm font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all duration-500 active:scale-95 shadow-xl shadow-indigo-600/20 flex items-center gap-2 group/btn"
                    >
                      Search
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-4 sm:gap-8 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-700">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                Trending Tags:
              </span>
              {[
                "BIM Library",
                "Sustainable Homes",
                "Urban Design",
                "Structure Analysis",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/browse?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[11px] font-bold text-white/80 hover:text-white transition-all backdrop-blur-md"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1 backdrop-blur-md">
            <div className="w-1 h-2 bg-indigo-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-30 py-12 -mt-24 sm:-mt-32">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[3rem] p-4 sm:p-5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-white/50 ring-1 ring-slate-900/5 transition-all">
            <div className="bg-white rounded-[2.5rem] p-10 lg:p-14 grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center space-y-5 lg:px-6 pt-8 lg:pt-0">
                <div className="relative group/stat">
                  <div className="absolute -inset-4 bg-indigo-50 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                  <div className="relative p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[1.25rem] shadow-lg shadow-indigo-200">
                    <Layers className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <p className="text-5xl font-black tracking-tighter text-gray-900">
                      {stats.totalResources > 999
                        ? `${(stats.totalResources / 1000).toFixed(1)}k+`
                        : stats.totalResources}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                      High-End Resources
                    </p>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1 italic">
                      Verified Library
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center space-y-5 lg:px-6 pt-8 lg:pt-0">
                <div className="relative group/stat">
                  <div className="absolute -inset-4 bg-purple-50 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                  <div className="relative p-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[1.25rem] shadow-lg shadow-purple-200">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-5xl font-black tracking-tighter text-gray-900">
                    {stats.totalUsers > 999
                      ? `${(stats.totalUsers / 1000).toFixed(1)}k+`
                      : stats.totalUsers}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                      Global Architects
                    </p>
                    <span className="text-[9px] font-bold text-purple-500 uppercase tracking-widest mt-1 italic">
                      Growing Daily
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center space-y-5 lg:px-6 pt-8 lg:pt-0">
                <div className="relative group/stat">
                  <div className="absolute -inset-4 bg-blue-50 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                  <div className="relative p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[1.25rem] shadow-lg shadow-blue-200">
                    <Download className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-5xl font-black tracking-tighter text-gray-900">
                    {stats.totalDownloads > 999
                      ? `${(stats.totalDownloads / 1000).toFixed(1)}k+`
                      : stats.totalDownloads}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                      Total Downloads
                    </p>
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1 italic">
                      Asset Utilization
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center space-y-5 lg:px-6 pt-8 lg:pt-0">
                <div className="relative group/stat">
                  <div className="absolute -inset-4 bg-emerald-50 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                  <div className="relative p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[1.25rem] shadow-lg shadow-emerald-200">
                    <Cpu className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-5xl font-black tracking-tighter text-gray-900">
                    {stats.facultyCount}+
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                      Verified Faculty
                    </p>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1 italic">
                      Expert Guidance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Indicator Bar */}
            <div className="flex items-center justify-center gap-4 py-3 bg-slate-50 rounded-b-[2.5rem] border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Live Network Stats
                </span>
              </div>
              <span className="text-[10px] text-slate-300">|</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Last synchronized:{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Platform Sections */}
      <section className="py-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-24">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-4 block">
              Core Ecosystem
            </span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase">
              The Architecture <br />{" "}
              <span className="text-indigo-600">Standard.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Elite Projects */}
            <div className="group relative bg-white p-12 rounded-[3.5rem] border border-slate-100 transition-all hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:-translate-y-3 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg shadow-indigo-100">
                  <Trophy className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-4 uppercase">
                  Elite Projects
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium mb-10 text-lg">
                  Explore award-winning architectural designs and research
                  papers from top-tier students worldwide.
                </p>
                <div className="flex flex-col gap-4 mb-10 text-sm font-bold text-slate-400">
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />{" "}
                    Peer-Reviewed Designs
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />{" "}
                    Thesis Gold Standards
                  </span>
                </div>
                <Link
                  to="/browse?sort=top"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-600 hover:gap-4 transition-all"
                >
                  View Archive <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Course Assignments */}
            <div className="group relative bg-white p-12 rounded-[3.5rem] border border-slate-100 transition-all hover:shadow-[0_40px_80px_-20px_rgba(168,85,247,0.15)] hover:-translate-y-3 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg shadow-purple-100">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-4 uppercase">
                  Faculty Benchmarks
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium mb-10 text-lg">
                  Access structured coursework and verified professional
                  reference materials provided by senior faculty.
                </p>
                <div className="flex flex-col gap-4 mb-10 text-sm font-bold text-slate-400">
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />{" "}
                    Syllabus Alignment
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />{" "}
                    Studio Guidelines
                  </span>
                </div>
                <Link
                  to="/dashboard/assignments"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-purple-600 hover:gap-4 transition-all"
                >
                  Direct Access <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Verified Platform */}
            <div className="group relative bg-slate-900 p-12 rounded-[3.5rem] transition-all hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)] hover:-translate-y-3 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="h-32 w-32 text-indigo-500" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-10 group-hover:bg-indigo-600 transition-all shadow-lg">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white mb-4 uppercase">
                  Verified Trust
                </h3>
                <p className="text-slate-400 leading-relaxed font-medium mb-10 text-lg">
                  A high-security ecosystem ensuring intellectual property
                  protection and content authenticity for all users.
                </p>
                <div className="flex flex-col gap-4 mb-10 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />{" "}
                    End-to-End Encryption
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />{" "}
                    Copyright Protection
                  </span>
                </div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white hover:text-indigo-400 hover:gap-4 transition-all"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Resources */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-end justify-between mb-20">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2 block">
                Curation
              </span>
              <h2 className="text-5xl font-black tracking-tighter text-gray-900 uppercase">
                Top Rated
              </h2>
            </div>
            <Link
              to="/browse"
              className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors"
            >
              Browse All Resources
            </Link>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {topResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Insights & News */}
      <section className="py-32">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-24">
            {/* Blogs */}
            <div className="lg:w-2/3">
              <div className="mb-16">
                <h2 className="text-5xl font-black tracking-tighter text-gray-900 leading-none">
                  FACULTY <br />
                  <span className="text-indigo-600">RESEARCH.</span>
                </h2>
              </div>
              <div className="grid gap-12 sm:grid-cols-2">
                {blogs.map((blog) => (
                  <article key={blog.id} className="group cursor-pointer">
                    <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl relative">
                      <img
                        src={
                          blog.image_path
                            ? `${import.meta.env.VITE_API_URL}/${
                                blog.image_path
                              }`
                            : "/assets/blog-placeholder.png"
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={blog.title}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 line-clamp-2 text-sm font-medium">
                        {blog.content.slice(0, 100)}...
                      </p>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-950"
                      >
                        Read More <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* News Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white space-y-12">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">
                    Journal
                  </h3>
                  <Calendar className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="space-y-10">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer space-y-2"
                    >
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <span>{item.source}</span>
                        <span>{item.time}</span>
                      </div>
                      <h4 className="text-lg font-bold group-hover:text-indigo-400 transition-colors leading-tight">
                        {item.title}
                      </h4>
                    </div>
                  ))}
                </div>
                <button className="w-full py-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all">
                  View Full Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white/10 backdrop-blur-3xl rounded-[4rem] p-16 border border-white/20 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-white">
              <h2 className="text-5xl font-black tracking-tighter mb-6">
                UNBOX INNOVATION.
              </h2>
              <p className="text-xl text-indigo-100 font-medium">
                Get monthly digests of the best architectural thesis, BIM
                families, and technical articles.
              </p>
            </div>
            <div className="lg:w-1/2 w-full">
              {subscribed ? (
                <div className="bg-white text-indigo-600 p-8 rounded-[2rem] text-center font-black animate-bounce shadow-2xl">
                  SUBSCRIBED SUCCESSFULLY!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter architectural email"
                    required
                    className="w-full h-24 bg-white rounded-[2rem] pl-10 pr-40 text-lg font-bold text-gray-900 outline-none focus:ring-8 focus:ring-white/20 transition-all shadow-2xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-4 bottom-4 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Global CDN */}
      <section className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/browse?category=${cat.name}`}
                className="p-10 bg-slate-50 rounded-[2.5rem] hover:bg-indigo-50 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">
                  {cat.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900">{cat.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {cat.count} Artifacts
                </p>
              </Link>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-20 border-t border-slate-100 gap-8">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden"
                  >
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-500">
                Trusted by 5,000+ Students & Faculty
              </p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                ArchVault CDN: Hong Kong Region
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
