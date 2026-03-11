import { useState, useEffect, useCallback } from "react";
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
  Loader2,
  FileText,
  Clock,
  ArrowLeft,
  Hexagon,
} from "lucide-react";
import { api } from "../lib/api";
import { useTheme } from "../context/useTheme";
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

interface Stats {
  totalResources: number;
  totalUsers: number;
  totalDownloads: number;
  facultyCount: number;
}

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
  const [liveResults, setLiveResults] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fetchHomeData = useCallback(async () => {
    try {
      const [topRes, , statsRes, blogRes, newsRes] = await Promise.all([
        api.get("/resources?sortBy=downloads&limit=4"),
        api.get("/resources?sortBy=recent&limit=3"),
        api.get("/common/stats"),
        api.get("/blogs?published=true&limit=4"),
        api.get("/common/news"),
      ]);

      const topData = topRes.data;
      const statsData = statsRes.data;
      const blogData = blogRes.data;
      const newsData = newsRes.data;

      if (Array.isArray(topData)) setTopResources(topData);
      else if (topData && topData.resources) setTopResources(topData.resources);

      if (statsData) setStats(statsData);
      if (Array.isArray(blogData)) setBlogs(blogData);
      if (Array.isArray(newsData)) setRealNews(newsData.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) {
        await fetchHomeData();
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [fetchHomeData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".search-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const { data } = await api.get(
            `/resources?search=${encodeURIComponent(searchQuery)}&limit=5`,
          );
          setLiveResults(Array.isArray(data) ? data : []);
          setShowDropdown(true);
        } catch (err) {
          console.error("Home live search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setLiveResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20 bg-white dark:bg-background transition-colors duration-500">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#5A270F]/40 z-10" />
          <img
            src="/assets/hero.png"
            alt="Hero Architectural"
            className="w-full h-full object-cover brightness-[0.7] scale-105 animate-slow-zoom"
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#5A270F] via-[#6C3B1C]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(223,129,66,0.15),transparent_70%)] z-10" />
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] z-10 blueprint-grid-dark" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-20 w-full mt-6">
          <div className="max-w-5xl">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-4 px-4 py-2 mb-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-white dark:text-[#EEB38C] bg-white/5 dark:bg-card/5 backdrop-blur-3xl border border-white/10 rounded-full animate-in fade-in slide-in-from-top-12 duration-1000 shadow-2xl group cursor-default">
              <div className="relative flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#DF8142] animate-pulse relative z-10" />
                <div className="absolute inset-0 bg-[#DF8142]/90 blur-xl opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
              </div>
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-[#EEB38C] dark:from-[#EEB38C] dark:to-white">
                ARCHVAULT: THE PRE-EMINENT ARCHIVE
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#DF8142] animate-[pulse_2s_infinite]" />
            </div>

            <h1 className="text-3xl sm:text-6xl md:text-[5.5rem] lg:text-[7.2rem] font-black tracking-tighter text-white mb-6 sm:mb-8 leading-[0.8] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 uppercase italic">
              ENGINEER <br />
              <span className="relative inline-block mt-2 not-italic">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-white drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
                  LEGACY.
                </span>
                <div className="absolute -bottom-4 left-0 w-full h-4 bg-[#DF8142]/40 blur-3xl -z-0" />
              </span>
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <div className="max-w-xl space-y-6">
                <p className="text-lg sm:text-xl text-white/80 leading-relaxed font-black tracking-tight border-l-4 border-[#DF8142]/80 pl-8">
                  Access award-winning thesis papers, verified BIM standards,
                  and architectural artifacts curated for the vanguard.
                </p>
                <div className="flex items-center gap-6 pl-11">
                  <span className="px-3 py-1 bg-white/10 dark:bg-card/10 text-[10px] text-white font-black tracking-widest uppercase rounded">
                    Issue 2024.1
                  </span>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">
                    Verified by 50+ Global Institutions
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="mb-12 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500 relative"
            >
              <div className="relative max-w-4xl group search-container">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#DF8142] via-[#5A270F] to-[#DF8142] rounded-[3rem] blur-2xl opacity-20 group-focus-within:opacity-40 transition duration-1000 group-hover:duration-200" />

                <div className="relative flex flex-col sm:flex-row items-center bg-white/95 dark:bg-[#1A0B04]/90 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/20 dark:ring-white/10 transition-all duration-700 group-focus-within:ring-[#DF8142]/50 group-focus-within:scale-[1.01]">
                  <div className="hidden sm:block pl-10">
                    {searchQuery.length > 0 ? (
                      <button
                        type="button"
                        title="Clear Search"
                        aria-label="Clear Search"
                        onClick={() => {
                          setSearchQuery("");
                          setShowDropdown(false);
                        }}
                        className="p-1 hover:bg-[#DF8142]/10 rounded-full transition-colors group/back"
                      >
                        <ArrowLeft className="h-7 w-7 text-[#DF8142] group-hover/back:-translate-x-1 transition-transform" />
                      </button>
                    ) : isSearching ? (
                      <Loader2 className="h-7 w-7 text-[#DF8142] animate-spin" />
                    ) : (
                      <Search className="h-7 w-7 text-gray-400 dark:text-white/30 group-focus-within:text-[#DF8142] transition-all duration-500 group-focus-within:rotate-90" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() =>
                      searchQuery.length > 1 && setShowDropdown(true)
                    }
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter resource ID, authority, or artifact keyword..."
                    className="w-full pl-8 sm:pl-8 pr-6 py-6 sm:py-8 bg-transparent text-[#2A1205] dark:text-white placeholder:text-gray-500 dark:text-white/40 text-base sm:text-lg font-black focus:outline-none tracking-tight"
                  />
                  <div className="w-full sm:w-auto p-2 sm:pr-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto whitespace-nowrap px-8 sm:px-10 py-4 sm:py-5 bg-[#DF8142] hover:bg-[#5A270F] text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] transition-all duration-700 active:scale-95 shadow-2xl shadow-[#DF8142]/20 flex items-center justify-center gap-3 group/btn overflow-hidden relative"
                    >
                      <span className="relative z-10">Initialize Search</span>
                      <ArrowRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-2 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#DF8142]/90 to-[#5A270F] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>

                {/* Live Search Results Dropdown */}
                 {showDropdown && (liveResults.length > 0 || isSearching) && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-[#1A0B04]/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 dark:border-[#DF8142]/20 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-5 bg-gradient-to-r from-[#5A270F] to-[#6C3B1C] border-b border-[#DF8142]/20">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C] flex items-center gap-3">
                        <Sparkles className="h-3 w-3 animate-pulse" /> Intelligence Matrix Matches
                      </p>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto py-4 scrollbar-none">
                      {liveResults.length > 0
                        ? liveResults.map((resource) => (
                            <button
                              key={resource.id}
                              type="button"
                              onClick={() =>
                                navigate(`/resources/${resource.id}`)
                              }
                              className="w-full px-8 py-5 hover:bg-[#EFEDED] dark:bg-background dark:hover:bg-white/5 dark:bg-card/5 transition-colors flex items-center gap-6 group text-left border-b border-slate-50 dark:border-white/5 last:border-0"
                            >
                              <div className="h-14 w-14 bg-[#5A270F] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:bg-[#DF8142] transition-colors overflow-hidden">
                                {resource.fileType.includes("pdf") ? (
                                  <FileText className="h-6 w-6" />
                                ) : (
                                  <div className="text-sm font-black uppercase tracking-tighter">
                                    {resource.fileType
                                      .split("/")[1]
                                      ?.slice(0, 3)}
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <h4 className="text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] group-hover:text-[#DF8142] transition-colors line-clamp-1 uppercase tracking-tight">
                                  {resource.title}
                                </h4>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40 flex items-center gap-1.5">
                                    <Users className="h-3 w-3" />{" "}
                                    {resource.author}
                                  </span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40 flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" />{" "}
                                    {new Date(
                                      resource.uploadedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <ArrowUpRight className="h-5 w-5 text-[#92664A] dark:text-[#EEB38C]/40 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
                            </button>
                          ))
                        : !isSearching && (
                            <div className="px-8 py-10 text-center">
                              <p className="text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] transition-colors">
                                No matches found in the design matrix.
                              </p>
                            </div>
                          )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="w-full py-5 bg-[#EFEDED] dark:bg-white/10 hover:bg-[#D9D9C2] dark:hover:bg-white/20 transition-colors text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] border-t border-[#D9D9C2] dark:border-white/10 transition-colors"
                    >
                      View All Spectral matches
                    </button>
                  </div>
                )}
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-32 duration-1000 delay-700">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50 dark:text-[#EEB38C]/30 italic">
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
                  className="px-6 py-2.5 bg-white/5 dark:bg-card/5 hover:bg-white dark:bg-card hover:text-[#2A1205] border border-white/10 rounded-full text-[12px] font-black uppercase tracking-widest text-white/70 transition-all duration-500 backdrop-blur-md hover:scale-105 active:scale-95"
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
            <div className="w-1 h-2 bg-primary/80 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section - Strategic Precision */}
      <section className="relative z-30 py-8 -mt-24 sm:-mt-32 transition-colors duration-500">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white/80 dark:bg-card/80 backdrop-blur-3xl rounded-[3.5rem] p-3 sm:p-5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white dark:border-white/5 ring-1 ring-[#2A1205]/5 overflow-hidden group transition-all duration-500">
            <div className="bg-white dark:bg-card rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-slate-100 dark:divide-white/5 transition-colors duration-500">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center space-y-4 lg:px-6 py-6 sm:py-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-[#DF8142]/10 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-[#5A270F] rounded-2xl shadow-2xl group-hover/stat:bg-[#DF8142] transition-colors duration-500">
                    <Layers className="h-8 w-8 text-white group-hover/stat:rotate-12 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-5xl font-black tracking-tighter text-[#5A270F] dark:text-[#EEB38C] transition-colors duration-500">
                    {stats.totalResources > 999
                      ? `${(stats.totalResources / 1000).toFixed(1)}k+`
                      : stats.totalResources}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#5A270F]/50 dark:text-foreground/40 transition-colors">
                      MASTER RESOURCES
                    </p>
                    <span className="text-[10px] font-bold text-[#DF8142] dark:text-[#EEB38C] uppercase tracking-widest mt-1 italic transition-colors">
                      Verified Library
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 pt-12 lg:pt-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-[#92664A]/5 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-[#5A270F] rounded-2xl shadow-2xl group-hover/stat:bg-[#6C3B1C] transition-colors duration-500">
                    <Users className="h-8 w-8 text-white group-hover/stat:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-[#5A270F] dark:text-[#EEB38C] transition-colors duration-500">
                    {stats.totalUsers > 999
                      ? `${(stats.totalUsers / 1000).toFixed(1)}k+`
                      : stats.totalUsers}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#5A270F]/50 dark:text-foreground/40 transition-colors">
                      GLOBAL VISIONARIES
                    </p>
                    <span className="text-[10px] font-bold text-[#6C3B1C] dark:text-[#EEB38C]/80/80 dark:text-[#EEB38C]/80 uppercase tracking-widest mt-1 italic transition-colors">
                      Growing Community
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 pt-12 lg:pt-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-[#DF8142]/10 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-[#5A270F] rounded-2xl shadow-2xl group-hover/stat:bg-[#DF8142] transition-colors duration-500">
                    <Download className="h-8 w-8 text-white group-hover/stat:translate-y-1 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-[#5A270F] dark:text-[#EEB38C]">
                    {stats.totalDownloads > 999
                      ? `${(stats.totalDownloads / 1000).toFixed(1)}k+`
                      : stats.totalDownloads}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#5A270F]/50 dark:text-white/40">
                      STUDIO DEPLOYMENTS
                    </p>
                    <span className="text-[10px] font-bold text-[#DF8142] dark:text-[#EEB38C] uppercase tracking-widest mt-1 italic transition-colors">
                      Asset Utilization
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 pt-12 lg:pt-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-[#92664A]/5 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-[#5A270F] rounded-2xl shadow-2xl group-hover/stat:bg-[#92664A] transition-colors duration-500">
                    <Cpu className="h-8 w-8 text-white group-hover/stat:rotate-[-15deg] transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-[#5A270F] dark:text-[#EEB38C] transition-colors duration-500">
                    {stats.facultyCount}+
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#5A270F]/50 dark:text-white/40">
                      VERIFIED FACULTY
                    </p>
                    <span className="text-[10px] font-bold text-[#92664A] dark:text-[#EEB38C]/60 uppercase tracking-widest mt-1 italic transition-colors">
                      Expert Guidance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Indicator Bar */}
            <div className="flex items-center justify-center gap-6 py-4 bg-[#EFEDED] dark:bg-white/5 rounded-b-[2.5rem] border-t border-[#D9D9C2] dark:border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 dark:via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-[#DF8142] animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(223,129,66,0.3)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]">
                  REAL-TIME NETWORK INDEX
                </span>
              </div>
              <span className="text-gray-300 dark:text-[#EEB38C]/20 relative z-10">|</span>
              <span className="text-[9px] font-bold text-[#5A270F]/40 dark:text-white/40 uppercase tracking-[0.4em] relative z-10">
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
      <section className="py-44 bg-white dark:bg-background relative overflow-hidden transition-colors duration-500">
        {/* Architectural Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none architectural-ecosystem-grid" />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-32">
            <div className={`inline-flex items-center gap-3 px-6 py-2 ${isDark ? "bg-white/5" : "bg-[#DF8142]/10"} border border-[#DF8142]/20 rounded-full text-[10px] font-black uppercase tracking-[0.6em] text-[#DF8142] mb-12 shadow-sm`}>
              <Hexagon className="h-4 w-4" /> CORE ECOSYSTEM
            </div>
            <h2 className={`text-6xl md:text-8xl font-black tracking-tighter ${isDark ? "text-white" : "text-[#1A0B04]"} uppercase leading-[0.8] font-space-grotesk`}>
              THE ARCHITECTURAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] to-[#DF8142] italic">
                STANDARD.
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 items-stretch">
            {/* Elite Projects */}
            <div className="group relative bg-white dark:bg-card p-12 rounded-[4rem] border border-[#BCAF9C]/30 dark:border-white/10 shadow-[0_20px_50px_-20px_rgba(90,39,15,0.05)] hover:shadow-[0_50px_100px_-25px_rgba(223,129,66,0.15)] transition-all duration-700 hover:-translate-y-3 overflow-hidden flex flex-col">
              {/* Technical Scan Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-[#DF8142]/20 rounded-tr-[4rem] group-hover:w-24 group-hover:h-24 transition-all duration-500" />
              
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
                <Trophy className="h-64 w-64 text-[#5A270F]" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-[#DF8142] text-white rounded-2xl flex items-center justify-center mb-12 shadow-2xl shadow-[#DF8142]/30 group-hover:rotate-[360deg] transition-transform duration-1000">
                  <Trophy className="h-8 w-8" />
                </div>
                
                <div className="mb-10">
                   <p className="text-[10px] font-black text-[#DF8142] uppercase tracking-[0.4em] mb-4">
                     01 // EXCELLENCE INDEX
                   </p>
                   <h3 className={`text-4xl font-black ${isDark ? "text-white" : "text-[#1A0B04]"} uppercase tracking-tighter font-space-grotesk leading-[0.85]`}>
                     ELITE <br /> PROJECTS
                   </h3>
                </div>

                <p className={`${isDark ? "text-white/60" : "text-[#1A0B04]/70"} leading-relaxed font-bold mb-12 text-base pl-6 border-l-2 border-[#DF8142]/30`}>
                  Access award-winning thesis papers and research from the world's leading architectural minds.
                </p>

                <div className="mt-auto pt-10 border-t border-[#BCAF9C]/20">
                  <Link
                    to="/browse?sort=top"
                    className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-[#DF8142] group/link"
                  >
                    VIEW FULL ARCHIVE <ArrowRight className="h-4 w-4 group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Course Assignments */}
            <div className="group relative bg-[#FAF8F4] dark:bg-card p-12 rounded-[4rem] border-2 border-white dark:border-white/5 shadow-[0_20px_50px_-20px_rgba(90,39,15,0.05)] hover:shadow-[0_50px_100px_-25px_rgba(26,11,4,0.1)] transition-all duration-700 hover:-translate-y-3 overflow-hidden flex flex-col">
               <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-[#1A0B04]/10 rounded-tl-[4rem] group-hover:w-24 group-hover:h-24 transition-all duration-500" />
               
               <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:-rotate-12 group-hover:scale-110 pointer-events-none">
                <Briefcase className="h-64 w-64 text-[#5A270F]" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-[#1A0B04] text-white rounded-2xl flex items-center justify-center mb-12 shadow-2xl shadow-black/30 group-hover:rotate-[360deg] transition-transform duration-1000">
                  <Briefcase className="h-8 w-8 text-[#EEB38C]" />
                </div>
                
                <div className="mb-10">
                   <p className="text-[10px] font-black text-[#1A0B04]/40 dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] mb-4">
                     02 // KNOWLEDGE BASE
                   </p>
                   <h3 className={`text-4xl font-black ${isDark ? "text-white" : "text-[#1A0B04]"} uppercase tracking-tighter font-space-grotesk leading-[0.85]`}>
                     FACULTY <br /> BENCHMARKS
                   </h3>
                </div>

                <p className={`${isDark ? "text-white/60" : "text-[#1A0B04]/70"} leading-relaxed font-bold mb-12 text-base pl-6 border-l-2 border-[#1A0B04]/20`}>
                  Access structured coursework and verified professional reference materials from senior faculty.
                </p>

                <div className="mt-auto pt-10 border-t border-[#BCAF9C]/20">
                  <Link
                    to="/dashboard/assignments"
                    className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-[#1A0B04] dark:text-[#EEB38C] group/link"
                  >
                    DIRECT ACCESS <ArrowRight className="h-4 w-4 group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Verified Trust (Featured Card) */}
            <div className="group relative bg-[#1A0B04] p-12 rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(26,11,4,0.5)] transition-all duration-700 hover:-translate-y-3 overflow-hidden flex flex-col border border-white/5">
              {/* Technical Accents */}
              <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[#DF8142]/40 rounded-br-[4rem] group-hover:w-36 group-hover:h-36 transition-all duration-500" />
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/30 blur-[100px] group-hover:bg-[#DF8142]/40 transition-all duration-1000" />
              <div className="absolute inset-0 blueprint-grid-dark opacity-10 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-[#DF8142] text-white rounded-2xl flex items-center justify-center mb-12 shadow-2xl shadow-[#DF8142]/40 group-hover:rotate-[360deg] transition-transform duration-1000">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                
                <div className="mb-10">
                   <p className="text-[10px] font-black text-[#EEB38C] uppercase tracking-[0.4em] mb-4">
                     03 // SECURITY PROTOCOL
                   </p>
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter font-space-grotesk leading-[0.85]">
                     VERIFIED <br /> TRUST
                   </h3>
                </div>

                <p className="text-white/80 leading-relaxed font-bold mb-12 text-base pl-6 border-l-2 border-[#DF8142]">
                  A high-security ecosystem ensuring intellectual property protection and content authenticity for architectural giants.
                </p>

                <div className="mt-auto pt-10 border-t border-white/10">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white group/link"
                  >
                    LEARN MORE <ArrowRight className="h-4 w-4 group-hover/link:translate-x-2 transition-transform text-[#DF8142]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Resources - Curated Gallery */}
      <section className="py-44 bg-white dark:bg-background relative transition-colors duration-500">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-28 gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className={`px-5 py-2 ${isDark ? "bg-white/5" : "bg-white shadow-sm shadow-[#5A270F]/5"} border border-[#BCAF9C]/30 dark:border-white/10 rounded-full`}>
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#DF8142]">
                    GLOBAL CURATION INDEX
                  </span>
                </div>
              </div>
              <h2 className={`text-6xl md:text-8xl font-black tracking-tighter ${isDark ? "text-white" : "text-[#1A0B04]"} leading-[0.8] uppercase font-space-grotesk`}>
                SPOTLIGHT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] to-[#DF8142] italic">
                  RESOURCES.
                </span>
              </h2>
              <div className="mt-10 pl-8 border-l-4 border-[#DF8142]">
                <p className={`text-xl ${isDark ? "text-white/40" : "text-[#1A0B04]/70"} font-bold max-w-2xl leading-relaxed font-space-grotesk`}>
                  The most downloaded and peer-reviewed architectural artifacts across the global network this week.
                </p>
              </div>
            </div>

            <Link
              to="/browse"
              className="group relative flex items-center gap-6 px-10 py-6 bg-[#1A0B04] hover:bg-[#DF8142] text-white rounded-[2rem] transition-all duration-700 shadow-[0_20px_40px_-10px_rgba(26,11,4,0.3)] hover:shadow-[#DF8142]/30 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.4em]">
                Explore Gallery
              </span>
              <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </div>

          {topResources.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="py-40 bg-white dark:bg-card/30 backdrop-blur-3xl rounded-[4rem] border border-2 border-dashed border-[#BCAF9C]/30 dark:border-white/10 flex flex-col items-center text-center transition-all duration-500 shadow-2xl">
              <div className="w-28 h-28 bg-[#1A0B04] rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-10 animate-pulse border-4 border-[#DF8142]/20">
                <Layers className="h-12 w-12 text-[#DF8142]" />
              </div>
              <h3 className={`text-3xl font-black ${isDark ? "text-white" : "text-[#1A0B04]"} mb-4 uppercase tracking-tighter leading-none font-space-grotesk`}>
                SYNCHRONIZING DATA
              </h3>
              <p className={`text-[10px] ${isDark ? "text-white/30" : "text-[#1A0B04]/40"} font-black uppercase tracking-[0.6em]`}>
                Fetching latest architectural benchmarks...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Faculty Insights & Professional Journal */}
      <section className="py-32 bg-white dark:bg-background overflow-hidden transition-colors duration-500">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Blogs - Research Wing */}
            <div className="lg:w-2/3">
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-[2px] bg-[#5A270F] dark:bg-[#EEB38C]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#5A270F] dark:text-[#EEB38C]">
                    RESEARCH & PERSPECTIVES
                  </span>
                </div>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-[#5A270F] dark:text-foreground leading-[0.75] uppercase italic">
                  FACULTY <br />
                  <span className="text-[#DF8142] not-italic">INSIGHTS.</span>
                </h2>
              </div>

              <div className="grid gap-12 sm:grid-cols-2">
                {blogs.map((blog) => (
                  <article key={blog.id} className="group cursor-pointer">
                    <Link to={`/blog/${blog.id}`} className="block">
                      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-[0_40px_80px_-20px_rgba(90,39,15,0.15)] dark:shadow-black/40 group-hover:shadow-[#DF8142]/20 transition-all duration-1000">
                        <img
                          src={
                            blog.image_path
                              ? `${import.meta.env.VITE_API_URL}/${
                                  blog.image_path.replace(/\\/g, "/")
                                }`
                              : "/assets/blog-placeholder.png"
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] grayscale group-hover:grayscale-0"
                          alt={blog.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2A1205] via-[#2A1205]/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                        <div className="absolute top-10 left-10">
                          <div className="px-5 py-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/20">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white dark:text-[#EEB38C]">
                              Issue 2024
                            </span>
                          </div>
                        </div>

                        <div className="absolute bottom-10 left-10 right-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                          <div className="w-full py-5 bg-white dark:bg-primary text-[#5A270F] dark:text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] text-center shadow-2xl transition-colors duration-300">
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
                            className="text-[9px] font-black uppercase tracking-[0.3em] text-[#DF8142] bg-[#DF8142]/10 dark:bg-[#DF8142]/20 px-5 py-2 rounded-full border border-[#DF8142]/10 dark:border-[#DF8142]/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-[#5A270F] dark:text-foreground group-hover:text-[#DF8142] transition-colors leading-[1.1] uppercase">
                        {blog.title}
                      </h3>
                      <p className="text-[#6C3B1C] dark:text-foreground/60 line-clamp-2 text-base font-bold leading-relaxed opacity-80 transition-colors">
                        {blog.content.slice(0, 150)}...
                      </p>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C] hover:text-[#DF8142] border-b-2 border-[#D9D9C2] dark:border-white/10 hover:border-[#DF8142] pb-2 transition-all"
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
              <div className="bg-white dark:bg-[#1A0B04] p-8 sm:p-12 rounded-[3.5rem] text-[#5A270F] dark:text-white space-y-12 shadow-xl shadow-[#92664A]/5 dark:shadow-none relative overflow-hidden group/journal border border-[#D9D9C2] dark:border-white/10 transition-all duration-500">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DF8142]/10 blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover/journal:bg-[#DF8142]/20 transition-colors duration-1000" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#DF8142] to-[#5A270F]" />

                <div className="relative z-10 flex items-center justify-between pb-10 border-b border-[#D9D9C2] dark:border-white/10">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-[-0.05em] mb-2 italic text-[#5A270F] dark:text-white">
                      Journal
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#DF8142] animate-pulse" />
                      <p className="text-[10px] font-bold text-[#5A270F]/40 dark:text-white/40 uppercase tracking-[0.4em]">
                        Live Updates
                      </p>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-[#EFEDED] dark:bg-white/5 rounded-[1.2rem] border border-[#D9D9C2] dark:border-white/10 flex items-center justify-center hover:bg-[#DF8142] hover:border-[#DF8142]/90 transition-all duration-500">
                    <Calendar className="h-7 w-7 text-[#DF8142] group-hover/journal:text-white" />
                  </div>
                </div>

                <div className="relative z-10 space-y-10 py-4">
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
                                ? "text-[#DF8142] border border-[#DF8142]/30 bg-[#DF8142]/10"
                                : "text-[#5A270F] dark:text-[#EEB38C] border border-[#5A270F]/10 dark:border-white/5 bg-[#5A270F]/5 dark:bg-[#EEB38C]/10"
                            } px-4 py-1 rounded-full`}
                          >
                            {item.isEvent ? "EVENT" : "LIVE"}
                          </span>
                          <span className="text-[#5A270F]/60 dark:text-white/30 truncate max-w-[120px]">
                            {item.source || "ARCHVAULT"}
                          </span>
                          <span className="text-gray-300 dark:text-white/10">/</span>
                          <span className="text-[#5A270F]/60 dark:text-white/30">{item.time}</span>
                        </div>
                        <h4 className="text-2xl font-black text-[#5A270F] dark:text-white group-hover/news:text-[#DF8142] dark:group-hover/news:text-[#EEB38C] transition-colors leading-[1.2] tracking-tight uppercase">
                          {item.title}
                        </h4>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center space-y-6">
                      <div className="w-12 h-12 bg-[#EFEDED] dark:bg-white/5 rounded-2xl mx-auto flex items-center justify-center border border-[#D9D9C2] dark:border-white/10">
                        <Cpu className="h-6 w-6 text-[#5A270F]/20 dark:text-[#EEB38C]/20" />
                      </div>
                      <p className="text-[#5A270F]/40 dark:text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">
                        Awaiting Sync
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-44 bg-white dark:bg-background transition-colors duration-500 relative overflow-hidden">
        {/* Studio Ambient Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FAF8F4] dark:bg-white/5 -skew-x-12 translate-x-1/4 z-0 transition-colors duration-500" />
        
        {/* Soft Atmosphere Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DF8142]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#5A270F]/5 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Technical Corner Markings */}
        <div className="absolute top-20 left-20 w-8 h-8 border-l border-t border-[#BCAF9C]/30 pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-8 h-8 border-r border-b border-[#BCAF9C]/30 pointer-events-none" />
        
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#DF8142]/20 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            {/* Visual Narrative */}
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-8 bg-gradient-to-br from-[#DF8142]/10 to-transparent rounded-[4.5rem] blur-3xl scale-95 group-hover:scale-105 transition-all duration-1000" />
              <div className="relative rounded-[4rem] overflow-hidden border-2 border-[#BCAF9C]/20 dark:border-white/10 shadow-[0_50px_100px_-20px_rgba(90,39,15,0.15)] group-hover:shadow-[#DF8142]/30 transition-all duration-700">
                <img
                  src="/assets/collaborators.png"
                  className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-[2.5s] scale-105 group-hover:scale-100"
                  alt="Architecture and Software Engineering Collaboration"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B04] via-[#1A0B04]/10 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-1000" />

                {/* Glassmorphism Floating Badge */}
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="bg-[#1A0B04]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
                    <div className="flex items-center gap-5 mb-4">
                      <div className="flex -space-x-3">
                        <div className="h-10 w-10 rounded-full border-2 border-[#1A0B04] bg-[#DF8142] flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                          ARCH
                        </div>
                        <div className="h-10 w-10 rounded-full border-2 border-[#1A0B04] bg-white flex items-center justify-center text-[10px] font-black text-[#1A0B04] shadow-lg">
                          SOFT
                        </div>
                      </div>
                      <div className="h-4 w-[1px] bg-white/20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C]">
                        SYNC_V1.0
                      </span>
                    </div>
                    <p className="text-white/90 text-sm font-bold leading-relaxed">
                      "Bridging the physical and digital domains through interdisciplinary research and engineering."
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Decorative Elements */}
              <div className="absolute -top-16 -right-16 h-64 w-64 border-[1px] border-[#DF8142]/10 rounded-full animate-[spin_30s_linear_infinite] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 border-[2px] border-[#5A270F]/5 rounded-[3rem] rotate-12 pointer-events-none" />
            </div>

            {/* Strategic Information */}
            <div className="lg:w-1/2 flex flex-col items-start">
              <div className="mb-16">
                <div className={`inline-flex items-center gap-3 px-6 py-2 ${isDark ? "bg-white/5" : "bg-[#DF8142]/10"} border border-[#DF8142]/20 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-[#DF8142] mb-10 shadow-sm backdrop-blur-sm`}>
                  <Sparkles className="h-4 w-4" /> THE COLLABORATION
                </div>
                <h2 className={`text-5xl md:text-7xl font-black tracking-tighter ${isDark ? "text-[#EEB38C]" : "text-[#1A0B04]"} uppercase leading-[0.8] mb-12 font-space-grotesk`}>
                  FUSION OF <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] to-[#DF8142] italic">
                    DISCIPLINES.
                  </span>
                </h2>
                <div className="pl-8 border-l-4 border-[#DF8142]">
                  <p className={`text-xl ${isDark ? "text-white/80" : "text-[#1A0B04]"} font-bold leading-relaxed max-w-xl`}>
                    ARCHVAULT is the signature product of a high-performance synergy between the 
                    <span className="text-[#DF8142]"> Department of Architecture</span> and the 
                    <span className="text-[#DF8142]"> Software Engineering Department</span>.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 w-full mb-16">
                <div className="group relative p-10 bg-white dark:bg-card rounded-[3rem] border border-[#BCAF9C]/30 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(90,39,15,0.05)] hover:shadow-[#DF8142]/10 transition-all duration-700 hover:-translate-y-2 flex flex-col">
                  <div className="h-14 w-14 bg-[#DF8142] text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 mb-8">
                    <Users className="h-7 w-7" />
                  </div>
                  <h4 className={`text-xl font-black ${isDark ? "text-[#EEB38C]" : "text-[#1A0B04]"} uppercase tracking-tight mb-4 font-space-grotesk`}>
                    ARCH_CORE
                  </h4>
                  <p className={`${isDark ? "text-white/40" : "text-[#1A0B04]/70"} text-sm font-bold leading-relaxed`}>
                    Defining library taxonomy, BIM standards, and the spatial creative vision for our global index.
                  </p>
                </div>

                <div className="group relative p-10 bg-white dark:bg-card rounded-[3rem] border border-[#BCAF9C]/30 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(90,39,15,0.05)] hover:shadow-[#5A270F]/10 transition-all duration-700 hover:-translate-y-2 flex flex-col">
                  <div className="h-14 w-14 bg-[#1A0B04] text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 mb-8">
                    <Cpu className="h-7 w-7 font-bold text-[#EEB38C]" />
                  </div>
                  <h4 className={`text-xl font-black ${isDark ? "text-[#EEB38C]" : "text-[#1A0B04]"} uppercase tracking-tight mb-4 font-space-grotesk`}>
                    SOFT_LOGIC
                  </h4>
                  <p className={`${isDark ? "text-white/40" : "text-[#1A0B04]/70"} text-sm font-bold leading-relaxed`}>
                    Engineering high-speed CDN clusters, zero-trust encryption layers, and the fluid UX matrix.
                  </p>
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
