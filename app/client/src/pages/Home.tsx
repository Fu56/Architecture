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
  Globe,
  Clock,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
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
  { name: "Structural Systems", icon: "🏗️" },
  { name: "Sustainable Matrix", icon: "🌱" },
  { name: "Urban Morphologies", icon: "🏙️" },
  { name: "BIM Protocols", icon: "📂" },
  { name: "Parametric Logic", icon: "♾️" },
  { name: "Interior Narratives", icon: "🪑" },
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
      toast.success("Newsletter subscription activated.");
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-indigo-100 bg-white">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative min-h-[110vh] flex items-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/40 z-10" />
          <img
            src="/assets/hero.png"
            alt="Hero Architectural"
            className="w-full h-full object-cover brightness-[0.7] scale-105 animate-slow-zoom"
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(79,70,229,0.2),transparent_70%)] z-10" />
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] z-10 blueprint-grid-dark" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-20 w-full mt-10">
          <div className="max-w-6xl">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-4 px-6 py-3 mb-10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.5em] text-white bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full animate-in fade-in slide-in-from-top-12 duration-1000 shadow-2xl group cursor-default">
              <div className="relative flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse relative z-10" />
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
              </div>
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-indigo-200">
                ARCHVAULT: THE PRE-EMINENT ARCHIVE
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_infinite]" />
            </div>

            <h1 className="text-6xl sm:text-8xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter text-white mb-8 sm:mb-12 leading-[0.75] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 uppercase italic">
              ENGINEER <br />
              <span className="relative inline-block mt-2 not-italic">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-white drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
                  LEGACY.
                </span>
                <div className="absolute -bottom-4 left-0 w-full h-4 bg-indigo-600/40 blur-3xl -z-0" />
              </span>
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-12 mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <div className="max-w-xl space-y-6">
                <p className="text-xl sm:text-2xl text-white/80 leading-relaxed font-black tracking-tight border-l-4 border-indigo-500/80 pl-10">
                  Access award-winning thesis papers, verified BIM standards,
                  and architectural artifacts curated for the vanguard.
                </p>
                <div className="flex items-center gap-6 pl-11">
                  <span className="px-3 py-1 bg-white/10 text-[10px] text-white font-black tracking-widest uppercase rounded">
                    Issue 2024.1
                  </span>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">
                    Verified by 50+ Global Institutions
                  </p>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-8 p-8 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 duration-700">
                <div className="flex -space-x-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-full border-4 border-[#0a0a0b] bg-slate-900 overflow-hidden ring-1 ring-white/10"
                    >
                      <img
                        src={`https://i.pravatar.cc/150?u=${i + 100}`}
                        alt="Active Member"
                        className="grayscale hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-full border-4 border-[#0a0a0b] bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-600/40">
                    +12K
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-white leading-none tracking-tight uppercase">
                    Network Node Members
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      Live Pulse ACTIVE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="mb-20 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500"
            >
              <div className="relative max-w-4xl group">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-[3rem] blur-2xl opacity-20 group-focus-within:opacity-40 transition duration-1000 group-hover:duration-200" />

                <div className="relative flex flex-col sm:flex-row items-center bg-white/95 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/20 transition-all duration-700 group-focus-within:ring-indigo-500/50 group-focus-within:scale-[1.01]">
                  <div className="hidden sm:block pl-10">
                    <Search className="h-7 w-7 text-slate-300 group-focus-within:text-indigo-600 transition-all duration-500 group-focus-within:rotate-90" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter resource ID, authority, or artifact keyword..."
                    className="w-full pl-8 sm:pl-8 pr-6 py-8 sm:py-10 bg-transparent text-slate-950 placeholder:text-slate-400 text-lg sm:text-xl font-black focus:outline-none tracking-tight"
                  />
                  <div className="w-full sm:w-auto p-3 sm:pr-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto whitespace-nowrap px-10 sm:px-14 py-5 sm:py-7 bg-indigo-600 hover:bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.8rem] transition-all duration-700 active:scale-95 shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 group/btn overflow-hidden relative"
                    >
                      <span className="relative z-10">Initialize Search</span>
                      <ArrowRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-2 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-32 duration-1000 delay-700">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">
                EXPLORE INDEX /
              </span>
              {[
                "Parametric",
                "Thesis Gold",
                "BIM Families",
                "Urban Matrix",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/browse?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white hover:text-slate-950 border border-white/10 rounded-full text-[12px] font-black uppercase tracking-widest text-white/70 transition-all duration-500 backdrop-blur-md hover:scale-105 active:scale-95"
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

      {/* Stats Section - Strategic Precision */}
      <section className="relative z-30 py-12 -mt-32 sm:-mt-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[3.5rem] p-3 sm:p-5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white ring-1 ring-slate-950/5 overflow-hidden group">
            <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 py-8 sm:py-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-indigo-50 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-slate-950 rounded-2xl shadow-2xl group-hover/stat:bg-indigo-600 transition-colors duration-500">
                    <Layers className="h-8 w-8 text-white group-hover/stat:rotate-12 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-slate-950">
                    {stats.totalResources > 999
                      ? `${(stats.totalResources / 1000).toFixed(1)}k+`
                      : stats.totalResources}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                      MASTER RESOURCES
                    </p>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 italic">
                      Verified Library
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 pt-12 lg:pt-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-purple-50 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-slate-950 rounded-2xl shadow-2xl group-hover/stat:bg-purple-600 transition-colors duration-500">
                    <Users className="h-8 w-8 text-white group-hover/stat:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-slate-950">
                    {stats.totalUsers > 999
                      ? `${(stats.totalUsers / 1000).toFixed(1)}k+`
                      : stats.totalUsers}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                      GLOBAL VISIONARIES
                    </p>
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mt-1 italic">
                      Growing Community
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 pt-12 lg:pt-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-blue-50 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-slate-950 rounded-2xl shadow-2xl group-hover/stat:bg-blue-600 transition-colors duration-500">
                    <Download className="h-8 w-8 text-white group-hover/stat:translate-y-1 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-slate-950">
                    {stats.totalDownloads > 999
                      ? `${(stats.totalDownloads / 1000).toFixed(1)}k+`
                      : stats.totalDownloads}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                      STUDIO DEPLOYMENTS
                    </p>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 italic">
                      Asset Utilization
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 pt-12 lg:pt-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-emerald-50 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-slate-950 rounded-2xl shadow-2xl group-hover/stat:bg-emerald-600 transition-colors duration-500">
                    <Cpu className="h-8 w-8 text-white group-hover/stat:rotate-[-15deg] transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-slate-950">
                    {stats.facultyCount}+
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                      VERIFIED FACULTY
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1 italic">
                      Expert Guidance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Indicator Bar */}
            <div className="flex items-center justify-center gap-6 py-4 bg-slate-50/50 rounded-b-[2.5rem] border-t border-slate-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent translate-x-[-100%] animate-shimmer" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                  REAL-TIME NETWORK INDEX
                </span>
              </div>
              <span className="text-slate-200 relative z-10">|</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] relative z-10">
                LAST CLOUD SYNC:{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Platform Sections - Architectural Ecosystem */}
      <section className="py-48 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-32">
            <div className="inline-block p-1 mb-8 rounded-full bg-indigo-50 border border-indigo-100">
              <span className="px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 block">
                CORE ECOSYSTEM
              </span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-950 uppercase leading-[0.8]">
              THE ARCHITECTURAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 italic">
                STANDARD.
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {/* Elite Projects */}
            <div className="group relative bg-[#fafafa] p-12 rounded-[4rem] border border-slate-100 transition-all duration-700 hover:bg-white hover:shadow-[0_48px_100px_-24px_rgba(79,70,229,0.12)] hover:-translate-y-4 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-150">
                <Trophy className="h-48 w-48" />
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-500">
                  <Trophy className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-slate-950 mb-6 uppercase leading-none">
                  ELITE <br />
                  PROJECTS
                </h3>
                <p className="text-slate-500 leading-relaxed font-bold mb-12 text-lg">
                  Access award-winning thesis papers and research from the
                  world's leading architectural minds.
                </p>
                <div className="flex flex-col gap-5 mb-14">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Peer-Reviewed Standard
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Thesis Gold Benchmarks
                    </span>
                  </div>
                </div>
                <Link
                  to="/browse?sort=top"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 hover:gap-6 transition-all duration-500 group/link"
                >
                  VIEW FULL ARCHIVE{" "}
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Course Assignments */}
            <div className="group relative bg-[#fafafa] p-12 rounded-[4rem] border border-slate-100 transition-all duration-700 hover:bg-white hover:shadow-[0_48px_100px_-24px_rgba(168,85,247,0.12)] hover:-translate-y-4 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-150">
                <Briefcase className="h-48 w-48" />
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-purple-600 text-white rounded-[1.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-purple-600/30 group-hover:scale-110 transition-transform duration-500">
                  <Briefcase className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-slate-950 mb-6 uppercase leading-none">
                  FACULTY <br />
                  BENCHMARKS
                </h3>
                <p className="text-slate-500 leading-relaxed font-bold mb-12 text-lg">
                  Access structured coursework and verified professional
                  reference materials from senior faculty.
                </p>
                <div className="flex flex-col gap-5 mb-14">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Syllabus Alignment
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Studio Directives
                    </span>
                  </div>
                </div>
                <Link
                  to="/dashboard/assignments"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-purple-600 hover:gap-6 transition-all duration-500 group/link"
                >
                  DIRECT ACCESS{" "}
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Verified Platform */}
            <div className="group relative bg-slate-950 p-12 rounded-[4rem] transition-all duration-700 hover:shadow-[0_48px_100px_-24px_rgba(0,0,0,0.4)] hover:-translate-y-4 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.15),transparent_60%)]" />
              <div className="absolute inset-0 blueprint-grid-dark opacity-10" />

              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl text-white rounded-[1.5rem] flex items-center justify-center mb-12 border border-white/20 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-500">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-white mb-6 uppercase leading-none">
                  VERIFIED <br />
                  TRUST
                </h3>
                <p className="text-slate-400 leading-relaxed font-bold mb-12 text-lg">
                  A high-security ecosystem ensuring intellectual property
                  protection and content authenticity.
                </p>
                <div className="flex flex-col gap-5 mb-14">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,1)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                      IP Protection Protocol
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,1)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Zero-Trust Encryption
                    </span>
                  </div>
                </div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-indigo-400 hover:gap-6 transition-all duration-500 group/link"
                >
                  LEARN MORE{" "}
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Resources - Curated Gallery */}
      <section className="py-48 bg-slate-50 relative overflow-hidden">
        {/* Decorative architectural lines */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white -skew-x-12 translate-x-1/2 z-0" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 blur-[120px] rounded-full" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[2px] bg-indigo-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-600">
                  GLOBAL CURATION INDEX
                </span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-950 leading-[0.8] uppercase">
                SPOTLIGHT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 italic">
                  RESOURCES.
                </span>
              </h2>
              <p className="text-slate-500 mt-10 text-xl font-bold max-w-2xl leading-relaxed">
                The most downloaded and peer-reviewed architectural artifacts
                across the global network this week.
              </p>
            </div>

            <Link
              to="/browse"
              className="group relative flex items-center gap-6 px-12 py-7 bg-slate-950 hover:bg-indigo-600 text-white rounded-[2rem] transition-all duration-700 shadow-2xl active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.3em]">
                Explore Gallery
              </span>
              <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </div>

          {topResources.length > 0 ? (
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
              {topResources.map((resource) => (
                <div
                  key={resource.id}
                  className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
                >
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 bg-white/50 backdrop-blur-3xl rounded-[4rem] border border-dashed border-slate-200 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-8 animate-pulse">
                <Layers className="h-12 w-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-3 uppercase tracking-tight leading-none">
                SYNCHRONIZING DATA
              </h3>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                Fetching latest architectural benchmarks from the CDN...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Faculty Insights & Professional Journal */}
      <section className="py-48 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-32">
            {/* Blogs - Research Wing */}
            <div className="lg:w-2/3">
              <div className="mb-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-[2px] bg-slate-950" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-950">
                    RESEARCH & PERSPECTIVES
                  </span>
                </div>
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-950 leading-[0.75] uppercase italic">
                  FACULTY <br />
                  <span className="text-indigo-600 not-italic">INSIGHTS.</span>
                </h2>
              </div>

              <div className="grid gap-20 sm:grid-cols-2">
                {blogs.map((blog) => (
                  <article key={blog.id} className="group cursor-pointer">
                    <Link to={`/blog/${blog.id}`} className="block">
                      <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden mb-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:shadow-indigo-500/20 transition-all duration-1000">
                        <img
                          src={
                            blog.image_path
                              ? `${import.meta.env.VITE_API_URL}/${
                                  blog.image_path
                                }`
                              : "/assets/blog-placeholder.png"
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] grayscale group-hover:grayscale-0"
                          alt={blog.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                        <div className="absolute top-10 left-10">
                          <div className="px-5 py-2 glass-morphism rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
                              Issue 2024
                            </span>
                          </div>
                        </div>

                        <div className="absolute bottom-10 left-10 right-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                          <div className="w-full py-5 bg-white text-slate-950 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] text-center shadow-2xl">
                            Read Full Publication
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="space-y-6 px-4">
                      <div className="flex gap-3">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-5 py-2 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-black tracking-tight text-slate-950 group-hover:text-indigo-600 transition-colors leading-[1.1] uppercase">
                        {blog.title}
                      </h3>
                      <p className="text-slate-500 line-clamp-2 text-lg font-bold leading-relaxed">
                        {blog.content.slice(0, 150)}...
                      </p>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-slate-950 hover:text-indigo-600 border-b-2 border-slate-100 hover:border-indigo-600 pb-2 transition-all"
                      >
                        EXPLORE STORY <ArrowUpRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* News Sidebar - High End Professional Journal */}
            <div className="lg:w-1/3 pt-12">
              <div className="bg-[#0a0a0b] p-12 sm:p-16 rounded-[4.5rem] text-white space-y-20 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)] relative overflow-hidden group/journal">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover/journal:bg-indigo-600/20 transition-colors duration-1000" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600" />

                <div className="relative z-10 flex items-center justify-between pb-10 border-b border-white/10">
                  <div>
                    <h3 className="text-4xl font-black uppercase tracking-[-0.05em] mb-2 italic">
                      Journal
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">
                        Live Updates
                      </p>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/5 rounded-[1.2rem] border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-500">
                    <Calendar className="h-7 w-7 text-indigo-400 group-hover/journal:text-white" />
                  </div>
                </div>

                <div className="relative z-10 space-y-16 py-4">
                  {realNews.length > 0 ? (
                    realNews.map((item) => (
                      <div
                        key={item.id}
                        className="group/news cursor-pointer space-y-5"
                      >
                        <div className="flex items-center gap-5 text-[9px] font-black uppercase tracking-[0.3em]">
                          <span
                            className={`${
                              item.isEvent
                                ? "text-amber-400 border border-amber-400/30"
                                : "text-indigo-400 border border-indigo-400/30"
                            } px-4 py-1 rounded-full bg-white/5`}
                          >
                            {item.isEvent ? "EVENT" : "LIVE"}
                          </span>
                          <span className="text-white/30 truncate max-w-[120px]">
                            {item.source || "ARCHVAULT"}
                          </span>
                          <span className="text-white/10">/</span>
                          <span className="text-white/30">{item.time}</span>
                        </div>
                        <h4 className="text-2xl font-black group-hover/news:text-indigo-400 transition-colors leading-[1.2] tracking-tight uppercase">
                          {item.title}
                        </h4>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center space-y-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center border border-white/5">
                        <Cpu className="h-6 w-6 text-white/10" />
                      </div>
                      <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">
                        Awaiting Sync
                      </p>
                    </div>
                  )}
                </div>

                <button className="relative z-10 w-full py-7 bg-white text-slate-950 hover:bg-indigo-600 hover:text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-700 shadow-2xl active:scale-95">
                  INITIALIZE JOURNAL
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Geometric Glassmorphism */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950 z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_35%,rgba(79,70,229,0.2),transparent_50% )]" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[5rem] p-16 sm:p-24 border border-white/10 flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 text-white">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-10">
                <Sparkles className="h-4 w-4" /> MONTHLY PUBLICATION
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.8] uppercase">
                UNBOX <br />
                <span className="text-indigo-500 italic">INNOVATION.</span>
              </h2>
              <p className="text-2xl text-white/40 font-black tracking-tight leading-relaxed max-w-md italic border-l-2 border-indigo-500/50 pl-8">
                Curated digests of top-tier thesis, BIM families, and technical
                insights.
              </p>
            </div>

            <div className="lg:w-1/2 w-full">
              {subscribed ? (
                <div className="bg-emerald-500 text-white p-12 sm:p-16 rounded-[4rem] text-center font-black animate-in zoom-in-95 duration-700 shadow-[0_48px_96px_-24px_rgba(16,185,129,0.5)] flex flex-col items-center gap-6">
                  <ShieldCheck className="h-16 w-16" />
                  <span className="text-2xl sm:text-4xl uppercase tracking-tighter leading-none">
                    ACCESS GRANTED
                  </span>
                  <p className="text-[11px] text-white/70 font-black uppercase tracking-[0.4em]">
                    Welcome to the Inner Circle.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-8">
                  <div className="relative group flex flex-col sm:block">
                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-[3rem] blur-2xl opacity-10 group-focus-within:opacity-30 transition-all duration-1000" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER STUDIO EMAIL..."
                      required
                      className="relative w-full h-24 sm:h-32 bg-white/5 border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] pl-10 sm:pl-12 pr-10 sm:pr-48 text-lg sm:text-xl font-black text-white placeholder:text-white/10 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-700 shadow-2xl tracking-widest"
                    />
                    <button
                      type="submit"
                      className="mt-6 sm:mt-0 relative sm:absolute sm:right-5 sm:top-5 sm:bottom-5 px-12 sm:px-16 py-5 sm:py-0 bg-indigo-600 hover:bg-white hover:text-slate-950 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-700 shadow-2xl active:scale-95"
                    >
                      SUBSCRIBE
                    </button>
                  </div>
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] text-center px-12">
                    ENCRYPTED TRANSMISSION • ZERO SPAM PROTOCOL
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Global CDN Status */}
      <section className="py-48 bg-white relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-[0.02] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-32 items-start">
            {/* Categories Grid */}
            <div className="lg:w-1/2">
              <div className="mb-20">
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-6 block">
                  RESOURCE TAXONOMY
                </span>
                <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase leading-none">
                  ARCHITECTURAL <br />
                  <span className="italic">MODULES.</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {categories.map((cat, idx) => (
                  <Link
                    key={cat.name}
                    to={`/browse?category=${encodeURIComponent(cat.name)}`}
                    className="group relative h-48 rounded-[2.5rem] bg-[#fafafa] border border-slate-100 overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="p-8 relative z-10 flex flex-col h-full justify-between">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          SECTION {String(idx + 1).padStart(2, "0")}
                        </p>
                        <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                          {cat.name}
                        </h4>
                      </div>
                    </div>
                    <div className="absolute bottom-6 right-8 text-slate-100 group-hover:text-indigo-600/20 transition-colors">
                      <ArrowUpRight className="h-12 w-12" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Global CDN Status Tracker */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-slate-50 border border-slate-100 rounded-[4rem] p-12 sm:p-16 space-y-16 relative overflow-hidden group/cdn">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:rotate-[30deg]">
                  <Globe className="h-48 w-48" />
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 border border-slate-100">
                      <Globe className="h-10 w-10 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tight leading-none mb-2">
                        GLOBAL DELIVERY
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                          ALL NODES ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-slate-50 bg-slate-200 overflow-hidden"
                        >
                          <img
                            src={`https://i.pravatar.cc/100?u=${i + 50}`}
                            className="grayscale"
                            alt="Node"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      ACTIVE OPS
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 relative z-10">
                  <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:border-indigo-200 group-hover/cdn:-translate-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      LATENCY (AVG)
                    </p>
                    <p className="text-3xl font-black text-slate-950 tracking-tighter">
                      124
                      <span className="text-sm text-indigo-500 ml-1">MS</span>
                    </p>
                  </div>
                  <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:border-indigo-200 group-hover/cdn:-translate-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      UPTIME (YTD)
                    </p>
                    <p className="text-3xl font-black text-slate-950 tracking-tighter">
                      99.98
                      <span className="text-sm text-indigo-500 ml-1">%</span>
                    </p>
                  </div>
                </div>

                <div className="relative z-10 py-10 px-8 bg-slate-950 rounded-[2.5rem] flex items-center justify-between group-hover/cdn:bg-indigo-600 transition-colors duration-700 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250px_250px] animate-[shimmer_5s_infinite_linear]" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                      <Clock className="h-5 w-5 text-indigo-400 group-hover/cdn:text-white" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">
                        NEXT CACHE FLUSH
                      </p>
                      <p className="text-xs font-black text-white uppercase tracking-widest">
                        IN 14:02:59
                      </p>
                    </div>
                  </div>
                  <button className="px-8 py-3 bg-white/10 hover:bg-white hover:text-slate-950 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10 transition-all active:scale-95 relative z-10">
                    STATUS RELAY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
