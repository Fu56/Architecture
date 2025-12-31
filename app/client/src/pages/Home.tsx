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

interface NewsItem {
  id: number;
  title: string;
  source: string;
  isEvent: boolean;
  eventDate: string | null;
  createdAt: string;
  time: string;
}

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
  const [realNews, setRealNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, , statsRes, blogRes, newsRes] = await Promise.all([
          api.get("/resources?sortBy=downloads&limit=4"),
          api.get("/resources?sortBy=recent&limit=3"),
          api.get("/common/stats"),
          api.get("/blogs?published=true&limit=2"),
          api.get("/common/news"),
        ]);

        const topData = topRes.data;
        const statsData = statsRes.data;
        const blogData = blogRes.data;
        const newsData = newsRes.data;

        if (Array.isArray(topData)) setTopResources(topData);
        else if (topData && topData.resources)
          setTopResources(topData.resources);

        if (statsData) setStats(statsData);
        if (Array.isArray(blogData)) setBlogs(blogData);
        if (Array.isArray(newsData)) setRealNews(newsData.slice(0, 3));
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

            <h1 className="text-5xl sm:text-7xl md:text-[6.5rem] lg:text-[7.5rem] font-black tracking-tighter text-white mb-8 sm:mb-10 leading-[0.85] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
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

                <div className="relative flex flex-col sm:flex-row items-center bg-white/95 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.2rem] overflow-hidden shadow-2xl ring-1 ring-white/20 transition-all group-focus-within:ring-indigo-500/50">
                  <div className="hidden sm:block pl-8">
                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find blueprints, thesis..."
                    className="w-full pl-6 sm:pl-6 pr-6 py-6 sm:py-8 bg-transparent text-gray-900 placeholder:text-gray-400 text-base sm:text-lg font-bold focus:outline-none"
                  />
                  <div className="w-full sm:w-auto p-2 sm:pr-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto whitespace-nowrap px-6 sm:px-10 py-4 sm:py-5 bg-indigo-600 hover:bg-slate-900 text-white text-xs sm:text-sm font-black uppercase tracking-[0.2em] rounded-[1.2rem] sm:rounded-[1.5rem] transition-all duration-500 active:scale-95 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group/btn"
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
          <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3rem] p-3 sm:p-5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-white/50 ring-1 ring-slate-900/5 transition-all">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 lg:p-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center space-y-4 lg:px-6 py-6 sm:py-0">
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
      <section className="py-40 bg-white relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/2 z-0" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-[1px] bg-indigo-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-600">
                  Global Curation
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none uppercase">
                SPOTLIGHT <br />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  RESOURCES.
                </span>
              </h2>
              <p className="text-slate-500 mt-8 text-lg font-medium max-w-xl">
                The most downloaded and peer-reviewed architectural artifacts
                across the global network this week.
              </p>
            </div>

            <Link
              to="/browse"
              className="group flex items-center gap-4 px-10 py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-95"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Explore Gallery
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {topResources.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {topResources.map((resource) => (
                <div
                  key={resource.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                >
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 bg-slate-50 rounded-[3.5rem] border border-dashed border-slate-200 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                <Layers className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Synchronizing Data
              </h3>
              <p className="text-slate-400 font-medium">
                Fetching the latest architectural benchmarks from the CDN...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Faculty Insights & News */}
      <section className="py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-24">
            {/* Blogs */}
            <div className="lg:w-2/3">
              <div className="mb-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-[1px] bg-slate-900" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900">
                    Research & Perspectives
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                  FACULTY <br />
                  <span className="text-indigo-600">INSIGHTS.</span>
                </h2>
              </div>

              <div className="grid gap-16 sm:grid-cols-2">
                {blogs.map((blog) => (
                  <article key={blog.id} className="group">
                    <Link to={`/blog/${blog.id}`} className="block">
                      <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden mb-10 shadow-2xl group-hover:shadow-indigo-500/10 transition-all duration-700">
                        <img
                          src={
                            blog.image_path
                              ? `${import.meta.env.VITE_API_URL}/${
                                  blog.image_path
                                }`
                              : "/assets/blog-placeholder.png"
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          alt={blog.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white text-xs font-black uppercase tracking-widest text-center">
                            Read Publication
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="space-y-5">
                      <div className="flex gap-4">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                        {blog.title}
                      </h3>
                      <p className="text-slate-500 line-clamp-2 text-base font-medium leading-relaxed">
                        {blog.content.slice(0, 120)}...
                      </p>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-indigo-600 transition-all"
                      >
                        Explore Story <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* News Sidebar - High End Journal Style */}
            <div className="lg:w-1/3">
              <div className="bg-slate-950 p-12 rounded-[4rem] text-white space-y-16 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex items-center justify-between pb-8 border-b border-white/10">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-1">
                      Journal
                    </h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
                      Issue No. 42
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <Calendar className="h-6 w-6 text-indigo-400" />
                  </div>
                </div>

                <div className="relative z-10 space-y-12 min-h-[300px]">
                  {realNews.length > 0 ? (
                    realNews.map((item) => (
                      <div
                        key={item.id}
                        className="group/news cursor-pointer space-y-4"
                      >
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                          <span
                            className={`${
                              item.isEvent
                                ? "text-amber-400 bg-amber-400/10"
                                : "text-indigo-400 bg-indigo-400/10"
                            } px-2 py-0.5 rounded`}
                          >
                            {item.isEvent ? "Event" : "Live"}
                          </span>
                          <span className="text-white/30">
                            {item.source || "ArchVault Admin"}
                          </span>
                          <span className="text-white/10">•</span>
                          <span className="text-white/30">{item.time}</span>
                        </div>
                        <h4 className="text-xl font-bold group-hover/news:text-indigo-400 transition-colors leading-snug">
                          {item.title}
                        </h4>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center space-y-4">
                      <p className="text-white/20 font-bold uppercase tracking-widest text-xs">
                        Awaiting Updates
                      </p>
                      <div className="w-8 h-[1px] bg-white/10 mx-auto" />
                    </div>
                  )}
                </div>

                <button className="relative z-10 w-full py-6 bg-white text-slate-950 hover:bg-indigo-600 hover:text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-xl shadow-white/5">
                  View Full Journal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Geometric Glassmorphism */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950 z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_35%,rgba(79,70,229,0.2),transparent_50%)]" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[5rem] p-16 sm:p-24 border border-white/10 flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 text-white">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-8">
                <Sparkles className="h-3 w-3" /> Monthly Publication
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.9]">
                UNBOX <br />{" "}
                <span className="text-indigo-400">INNOVATION.</span>
              </h2>
              <p className="text-xl text-white/50 font-medium leading-relaxed max-w-md">
                Get monthly curated digests of top-tier thesis, BIM families,
                and technical insights directly to your studio.
              </p>
            </div>

            <div className="lg:w-1/2 w-full">
              {subscribed ? (
                <div className="bg-emerald-500 text-white p-10 sm:p-12 rounded-[2.5rem] sm:rounded-[3rem] text-center font-black animate-in zoom-in-95 duration-500 shadow-2xl flex flex-col items-center gap-4">
                  <ShieldCheck className="h-12 w-12" />
                  <span className="text-xl sm:text-2xl uppercase tracking-tighter leading-none">
                    Subscription Active
                  </span>
                  <p className="text-[10px] sm:text-xs text-white/80 font-bold uppercase tracking-widest mt-2">
                    Welcome to the inner circle.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-6">
                  <div className="relative group flex flex-col sm:block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter studio email..."
                      required
                      className="relative w-full h-20 sm:h-24 bg-white/5 border border-white/10 rounded-[1.8rem] sm:rounded-[2.2rem] pl-8 sm:pl-10 pr-10 sm:pr-40 text-base sm:text-lg font-bold text-white placeholder:text-white/20 outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-2xl"
                    />
                    <button
                      type="submit"
                      className="mt-4 sm:mt-0 relative sm:absolute sm:right-4 sm:top-4 sm:bottom-4 px-10 sm:px-12 py-4 sm:py-0 bg-indigo-600 hover:bg-white hover:text-slate-950 text-white font-black uppercase tracking-widest rounded-[1.5rem] sm:rounded-[1.8rem] transition-all duration-500 shadow-lg active:scale-95"
                    >
                      Join Now
                    </button>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] text-center px-4 sm:px-10">
                    Secure & Encrypted • Zero Spam Guarantee • Unsubscribe
                    Anytime
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Global CDN */}
      <section className="py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/browse?category=${cat.name}`}
                className="relative p-12 bg-slate-50 rounded-[3.5rem] hover:bg-slate-900 transition-all duration-500 group overflow-hidden border border-slate-100"
              >
                <div className="relative z-10">
                  <div className="text-5xl mb-6 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">
                    {cat.icon}
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 group-hover:text-white transition-colors tracking-tight uppercase">
                    {cat.name}
                  </h4>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white/40">
                      {cat.count} Artifacts
                    </p>
                    <ArrowRight className="h-4 w-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                  </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all" />
              </Link>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-24 border-t border-slate-100 gap-12">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-full border-[6px] border-white bg-slate-100 overflow-hidden shadow-lg"
                  >
                    <img
                      src={`https://i.pravatar.cc/150?u=${i + 20}`}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">
                  5,000+ AND GROWING.
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                  Verified Students & Faculty Globally
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 px-8 py-4 bg-slate-950 rounded-full border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                  ARCHVAULT CDN
                </span>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                  Active Region: Hong Kong High-Speed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
