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
  Box,
  ChevronDown,
} from "lucide-react";
import { api } from "../lib/api";
import type { Resource, Blog } from "../models";
import ResourceCard from "../components/ui/ResourceCard";
import { useTheme } from "../context/useTheme";

interface NewsItem {
  id: number;
  title: string;
  source: string;
  isEvent: boolean;
  eventDate: string | null;
  createdAt: string;
  participants?: string[];
  time: string;
}

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
  const [liveResults, setLiveResults] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

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

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/browse");
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen selection:bg-[#DF8142]/20 transition-colors duration-700 ${isLight ? "bg-[#FCFBF8]" : "bg-[#0C0603]"}`}
    >
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 z-0 select-none">
          {/* Main Cinematic Image */}
          <img
            src="/assets/hero_v2.png"
            alt="Premium Architectural Nexus"
            className="w-full h-full object-cover brightness-[1.05] contrast-[1.05] animate-slow-zoom transition-all duration-1000"
          />

          {/* Master Gradient Overlays - Subtle and elegant */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#5A270F] via-transparent to-[#DF8142]/10 z-10 opacity-60" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FCFBF8] dark:from-[#0C0603] to-transparent z-20 pointer-events-none" />

          {/* Soft Atmospheric Glows - CALIBRATED */}
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#DF8142]/15 blur-[180px] rounded-full -translate-y-1/4 translate-x-1/4 z-10 pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#6C3B1C]/25 blur-[120px] rounded-full translate-y-1/4 -translate-x-1/4 z-10 pointer-events-none" />

          {/* Refined Architectural Overlay Grid */}
          <div className="absolute inset-0 opacity-[0.08] z-10 blueprint-grid-dark pointer-events-none" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-40 w-full mt-6">
          <div className="max-w-5xl">
            {/* Hero space refined */}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white mb-6 sm:mb-8 leading-[0.85] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 uppercase italic">
              REPOSITORY <br />
              <span className="relative inline-block mt-1 not-italic">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                  MATRIX.
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#DF8142]/40 blur-2xl -z-0" />
              </span>
            </h1>

            <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 mb-10">
              <Link
                to="/browse"
                className="group relative px-6 py-3 bg-[#DF8142] hover:bg-[#EEB38C] text-white hover:text-[#5A270F] text-[8px] font-black uppercase tracking-[0.4em] rounded-md transition-all duration-500 shadow-xl hover:shadow-[#EEB38C]/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-2.5">
                  ACCESS_REPOSITORY{" "}
                  <Box className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
              <Link
                to="/about"
                className="group px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-[#DF8142]/40 rounded-md text-[8px] font-black uppercase tracking-[0.4em] transition-all duration-500 backdrop-blur-3xl shadow-lg active:scale-95"
              >
                <span className="flex items-center gap-2.5">
                  CORE_MISSION{" "}
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </Link>
            </div>

            <form
              onSubmit={handleSearch}
              className="mb-12 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500 relative"
            >
              <div className="relative max-w-4xl group search-container">
                {/* Advanced Glow Ring */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#5A270F] rounded-[2.6rem] blur-2xl opacity-0 group-focus-within:opacity-30 group-hover:opacity-10 transition duration-1000 animate-gradient-xy" />

                <div className="relative flex flex-col sm:flex-row items-center bg-white/5 dark:bg-[#1A0B04]/20 backdrop-blur-[40px] rounded-[2rem] overflow-hidden border border-white/10 dark:border-[#DF8142]/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 group-focus-within:border-[#DF8142] group-focus-within:bg-white/10 dark:group-focus-within:bg-[#1A0B04]/40 group-hover:border-white/20">
                  <div className="hidden sm:block pl-8">
                    {searchQuery.length > 0 ? (
                      <button
                        type="button"
                        title="Clear Search"
                        aria-label="Clear Search"
                        onClick={() => {
                          setSearchQuery("");
                          setShowDropdown(false);
                        }}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors group/back"
                      >
                        <ArrowLeft className="h-5 w-5 text-[#DF8142] group-hover/back:-translate-x-1 transition-transform" />
                      </button>
                    ) : isSearching ? (
                      <Loader2 className="h-5 w-5 text-[#DF8142] animate-spin" />
                    ) : (
                      <Search className="h-5 w-5 text-[#EEB38C]/40 group-focus-within:text-[#DF8142] transition-all duration-700 group-focus-within:scale-110" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() =>
                      searchQuery.length > 1 && setShowDropdown(true)
                    }
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blueprints, credentials, or faculty nodes..."
                    className="w-full pl-6 sm:pl-6 pr-6 py-4 sm:py-5 bg-transparent text-white placeholder:text-white/30 text-xs sm:text-base font-black focus:outline-none tracking-tight font-space-grotesk"
                  />
                  <div className="w-full sm:w-auto p-2 sm:pr-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-[#DF8142] to-[#EEB38C] hover:from-[#EEB38C] hover:to-white hover:text-[#5A270F] text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] transition-all duration-700 active:scale-95 shadow-xl flex items-center justify-center gap-3 group/btn overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10 tracking-[0.4em]">
                        Search
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-500" />
                    </button>
                  </div>
                </div>

                {/* Live Search Results Dropdown */}
                {showDropdown && (liveResults.length > 0 || isSearching) && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-[#1A0B04]/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 dark:border-[#DF8142]/20 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-5 bg-gradient-to-r from-[#5A270F] to-[#6C3B1C] border-b border-[#DF8142]/20">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C] flex items-center gap-3">
                        <Sparkles className="h-3 w-3 animate-pulse" />{" "}
                        Intelligence Repository Matches
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

            {/* Explore Index removed for a cleaner, high-density UI focus */}
          </div>
        </div>

        {/* Scroll Matrix Node - Refined UI */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 cursor-pointer flex flex-col items-center group gap-3"
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight * 0.8,
              behavior: "smooth",
            })
          }
        >
          <div className="relative h-12 w-[1px] bg-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#DF8142] to-transparent animate-[scroll-matrix_2s_infinite]" />
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:border-[#DF8142]/40 transition-all duration-500">
            <ChevronDown className="h-3 w-3 text-[#EEB38C]/40 group-hover:text-[#DF8142] transition-transform duration-500 group-hover:translate-y-0.5" />
          </div>
        </div>
      </section>

      {/* Stats Section - Strategic Precision */}
      <section className="relative z-30 py-8 -mt-24 sm:-mt-28">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-gradient-to-br from-[#DF8142] via-[#6C3B1C] to-[#5A270F] rounded-[2.5rem] p-1.5 shadow-[0_50px_100px_-20px_rgba(90,39,15,0.4)] overflow-hidden group transition-all duration-700">
            <div className="bg-[#110703] rounded-[2rem] p-6 lg:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-[#DF8142]/20 transition-colors duration-500 relative">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center space-y-3 py-6 lg:py-4 lg:px-4 group/stat relative z-10">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#DF8142]/20 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0 blur-lg" />
                  <div className="relative p-4 bg-[#5A270F] border border-[#DF8142]/20 rounded-xl shadow-lg group-hover/stat:bg-[#DF8142] group-hover/stat:border-[#EEB38C] transition-all duration-500">
                    <Layers className="h-5 w-5 text-[#EEB38C] group-hover/stat:text-[#110703]" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xl font-black tracking-tighter text-white transition-colors duration-500 font-space-grotesk">
                    {stats.totalResources > 999
                      ? `${(stats.totalResources / 1000).toFixed(1)}k+`
                      : stats.totalResources}
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#EEB38C]/60 transition-colors">
                      MASTER_RESOURCES
                    </p>
                    <span className="text-[7.5px] font-bold text-[#DF8142] uppercase tracking-widest mt-0.5 italic transition-colors">
                      VERIFIED_DEPOSITS
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center space-y-3 py-6 lg:py-4 lg:px-4 group/stat relative z-10">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#6C3B1C]/20 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0 blur-lg" />
                  <div className="relative p-4 bg-[#5A270F] border border-[#DF8142]/20 rounded-xl shadow-lg group-hover/stat:bg-[#6C3B1C] transition-all duration-500">
                    <Users className="h-5 w-5 text-[#EEB38C] group-hover/stat:text-white" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xl font-black tracking-tighter text-white transition-colors duration-500 font-space-grotesk">
                    {stats.totalUsers > 999
                      ? `${(stats.totalUsers / 1000).toFixed(1)}k+`
                      : stats.totalUsers}
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#EEB38C]/60 transition-colors">
                      GLOBAL_NODES
                    </p>
                    <span className="text-[7.5px] font-bold text-[#DF8142] uppercase tracking-widest mt-0.5 italic transition-colors">
                      ACTIVE_ENTITIES
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center space-y-3 py-6 lg:py-4 lg:px-4 group/stat relative z-10">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#DF8142]/20 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0 blur-lg" />
                  <div className="relative p-4 bg-[#5A270F] border border-[#DF8142]/20 rounded-xl shadow-lg group-hover/stat:bg-[#DF8142] transition-all duration-500">
                    <Download className="h-5 w-5 text-[#EEB38C] group-hover/stat:text-[#110703]" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xl font-black tracking-tighter text-white font-space-grotesk">
                    {stats.totalDownloads > 999
                      ? `${(stats.totalDownloads / 1000).toFixed(1)}k+`
                      : stats.totalDownloads}
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#EEB38C]/60 transition-colors">
                      PULL_SEQUENCES
                    </p>
                    <span className="text-[7.5px] font-bold text-[#DF8142] uppercase tracking-widest mt-0.5 italic transition-colors">
                      ASSET_DESTRUCTION
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center space-y-3 py-6 lg:py-4 lg:px-4 group/stat relative z-10">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#92664A]/20 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0 blur-lg" />
                  <div className="relative p-4 bg-[#5A270F] border border-[#DF8142]/20 rounded-xl shadow-lg group-hover/stat:bg-[#92664A] transition-all duration-500">
                    <Cpu className="h-5 w-5 text-[#EEB38C] group-hover/stat:text-white" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xl font-black tracking-tighter text-white transition-colors duration-500 font-space-grotesk">
                    {stats.facultyCount}+
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#EEB38C]/60 transition-colors">
                      VERIFIED_FACULTY
                    </p>
                    <span className="text-[7.5px] font-bold text-[#DF8142] uppercase tracking-widest mt-0.5 italic transition-colors">
                      AUTHORITY_LAYERS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Platform Sections - Architectural Ecosystem */}
      <section className="py-32 bg-[#FAF8F4] dark:bg-[#5A270F] relative overflow-hidden transition-colors duration-500 border-b border-[#EEB38C]/30 dark:border-[#DF8142]/20">
        <div className="absolute inset-0 blueprint-grid-dark opacity-10 dark:opacity-[0.03] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-white/80 dark:bg-[#2C1105] rounded text-[7.5px] font-black uppercase tracking-[0.5em] text-[#DF8142] dark:text-[#EEB38C] mb-6 shadow-sm border border-[#EEB38C]/50 dark:border-[#DF8142]/20">
              <Box className="h-2.5 w-2.5 text-[#DF8142]" />{" "}
              MASTER_REPOSITORY_BRANCHES
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#5A270F] dark:text-white uppercase leading-[0.85] font-space-grotesk">
              THE REPOSITORY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] dark:via-[#EEB38C] to-[#DF8142] italic">
                STRUCTURE.
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Elite Projects */}
            <div className="group relative bg-[#FDFCFB] dark:bg-[#6C3B1C] p-10 rounded-[2.5rem] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 hover:border-[#DF8142] transition-all duration-700 hover:-translate-y-2 overflow-hidden flex flex-col shadow-xl">
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-[#FAF8F4] dark:bg-[#5A270F] text-[#DF8142] dark:text-[#EEB38C] border border-[#EEB38C]/50 dark:border-[#DF8142]/20 rounded-lg flex items-center justify-center mb-8 shadow-sm dark:shadow-xl group-hover:bg-[#DF8142] group-hover:text-white dark:group-hover:text-[#110703] transition-all duration-500">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="mb-8">
                  <p className="text-[7.5px] font-black text-[#92664A] dark:text-[#DF8142] uppercase tracking-[0.6em] mb-4 opacity-90">
                    01 // EXCELLENCE_REGISTRY
                  </p>
                  <h3 className="text-3xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter font-space-grotesk leading-[0.9]">
                    ELITE <br /> PROJECTS.
                  </h3>
                </div>
                <p className="text-[#92664A] dark:text-[#EEB38C]/80 leading-relaxed font-bold mb-10 text-[13px] pl-6 border-l-2 border-[#DF8142]">
                  Curated selection of award-winning thesis papers and global
                  architectural standards.
                </p>
                <div className="mt-auto pt-8 border-t border-[#EEB38C]/30 dark:border-[#DF8142]/20">
                  <Link
                    to="/browse?sort=top"
                    className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-[#DF8142] dark:text-[#EEB38C] hover:text-[#5A270F] dark:hover:text-white transition-colors"
                  >
                    ACCESS_RESOURCES <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Course Assignments */}
            <div className="group relative bg-[#FDFCFB] dark:bg-[#6C3B1C] p-8 rounded-[2rem] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 hover:border-[#DF8142] dark:hover:border-[#EEB38C] transition-all duration-700 hover:-translate-y-1 overflow-hidden flex flex-col shadow-lg">
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 bg-[#FAF8F4] dark:bg-[#5A270F] border border-[#EEB38C]/50 dark:border-[#DF8142]/20 text-[#DF8142] dark:text-[#EEB38C] rounded-md flex items-center justify-center mb-6 shadow-sm dark:shadow-lg group-hover:bg-[#DF8142] dark:group-hover:bg-[#EEB38C] group-hover:text-white dark:group-hover:text-[#5A270F] transition-all duration-500">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="mb-6">
                  <p className="text-[7px] font-black text-[#92664A] dark:text-[#DF8142] uppercase tracking-[0.5em] mb-3 opacity-90">
                    02 // KNOWLEDGE_BASE
                  </p>
                  <h3 className="text-2xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter font-space-grotesk leading-[0.9]">
                    FACULTY <br /> BENCHMARKS.
                  </h3>
                </div>
                <p className="text-[#92664A] dark:text-[#EEB38C]/80 leading-relaxed font-bold mb-8 text-[11px] pl-4 border-l-2 border-[#DF8142]">
                  Verified course protocols and academic reference materials
                  from senior faculty.
                </p>
                <div className="mt-auto pt-6 border-t border-[#EEB38C]/30 dark:border-[#DF8142]/20">
                  <Link
                    to="/dashboard/assignments"
                    className="inline-flex items-center gap-2.5 text-[8px] font-black uppercase tracking-[0.4em] text-[#DF8142] dark:text-[#EEB38C] hover:text-[#5A270F] dark:hover:text-white transition-colors"
                  >
                    DEPLOY_ACCESS <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Verified Trust */}
            <div className="group relative bg-gradient-to-br from-[#DF8142] to-[#92664A] dark:from-[#92664A] dark:to-[#5A270F] p-8 rounded-[2rem] shadow-xl dark:shadow-2xl transition-all duration-700 hover:-translate-y-1 overflow-hidden flex flex-col border border-[#EEB38C]/40 dark:border-[#DF8142]/40">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 dark:bg-[#DF8142]/20 blur-[80px]" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 bg-white/20 dark:bg-[#5A270F] text-white dark:text-[#EEB38C] rounded-md flex items-center justify-center mb-6 shadow-sm dark:shadow-lg border border-white/30 dark:border-[#DF8142]/30">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="mb-6">
                  <p className="text-[7px] font-black text-white/80 dark:text-[#5A270F] uppercase tracking-[0.5em] mb-3 opacity-90">
                    03 // SECURITY_TRUST
                  </p>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-space-grotesk leading-[0.9]">
                    VERIFIED <br /> REPOSITORY.
                  </h3>
                </div>
                <p className="text-white/90 leading-relaxed font-bold mb-8 text-[11px] pl-4 border-l-2 border-[#FAF8F4] dark:border-[#5A270F]">
                  High-security ecosystem for intellectual property protection
                  and content authenticity.
                </p>
                <div className="mt-auto pt-6 border-t border-white/20 dark:border-[#5A270F]/40">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2.5 text-[8px] font-black uppercase tracking-[0.4em] text-white hover:text-[#5A270F] dark:hover:text-white transition-colors"
                  >
                    EXAMINE_TRUST <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Resources - Curated Gallery */}
      <section className="py-24 bg-[#EEB38C]/10 dark:bg-[#6C3B1C] relative transition-colors duration-500 border-b border-[#EEB38C]/40 dark:border-[#DF8142]/20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#5A270F] dark:text-white leading-[0.85] uppercase font-space-grotesk">
                SPOTLIGHT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] dark:via-[#EEB38C] to-[#DF8142] italic">
                  RESOURCES.
                </span>
              </h2>
            </div>

            <Link
              to="/browse"
              className="group px-6 py-3 bg-[#5A270F] border border-[#DF8142]/30 hover:bg-[#DF8142] text-white dark:text-[#EEB38C] hover:text-white dark:hover:text-[#5A270F] rounded-md transition-all duration-500 shadow-xl flex items-center gap-3 active:scale-95"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                BROWSE_RESOURCES
              </span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {topResources.map((resource) => (
              <div
                key={resource.id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700"
              >
                <ResourceCard resource={resource} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Insights & Professional Journal */}
      <section className="py-32 bg-[#FDFCFB] dark:bg-[#92664A] transition-colors duration-500 border-b border-[#EEB38C]/40 dark:border-[#5A270F]/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Blogs - Research Wing */}
            <div className="lg:w-2/3">
              <div className="mb-12">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#5A270F] dark:text-white leading-[0.85] uppercase italic font-space-grotesk">
                    FACULTY <br />
                    <span className="text-[#DF8142] dark:text-[#5A270F] not-italic drop-shadow-sm">INSIGHTS_</span>
                  </h2>
              </div>

              <div className="grid gap-12 sm:grid-cols-2">
                {blogs.map((blog) => (
                  <article key={blog.id} className="group cursor-default">
                    <Link
                      to={`/blog/${blog.id}`}
                      className="block relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6 shadow-[0_20px_40px_-10px_rgba(90,39,15,0.6)] border border-[#DF8142]/40"
                    >
                      <img
                        src={
                          blog.image_path
                            ? `${import.meta.env.VITE_API_URL.replace("/api", "")}/uploads/${blog.image_path.replace(/\\/g, "/").split("/").pop()}`
                            : "/assets/blog-placeholder.png"
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] grayscale group-hover:grayscale-0"
                        alt={blog.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#6C3B1C] dark:from-[#5A270F] via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <span className="text-[6px] font-black uppercase tracking-[0.5em] mb-2 block text-[#EEB38C]">
                          RESEARCH_NODE
                        </span>
                        <h3 className="text-lg font-black uppercase tracking-tight leading-tight group-hover:text-[#EEB38C] dark:group-hover:text-[#DF8142] transition-colors">
                          {blog.title}
                        </h3>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            {/* News Sidebar - High End Professional Journal */}
            <div className="lg:w-1/3 pt-10">
              <div className="bg-[#FAF8F4] dark:bg-[#5A270F] box-border p-10 rounded-[2.5rem] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-lg dark:shadow-[0_30px_60px_-15px_rgba(90,39,15,0.5)] relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#5A270F]" />

                <div className="flex items-center justify-between pb-8 border-b border-[#EEB38C]/40 dark:border-[#DF8142]/20 mb-8">
                  <div>
                    <Link
                      to="/news"
                      className="group inline-flex items-center gap-2 hover:gap-3 transition-all duration-300"
                    >
                      <h3 className="text-lg font-black uppercase tracking-[-0.05em] text-[#5A270F] dark:text-white italic group-hover:text-[#DF8142] dark:group-hover:text-[#DF8142] transition-colors duration-300">
                        REPOSITORY_NEWS &amp; EVENTS.
                      </h3>
                      <ArrowRight className="h-4 w-4 text-[#DF8142] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </div>
                  <div className="h-10 w-10 bg-white/50 dark:bg-[#6C3B1C] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 text-[#DF8142] dark:text-[#EEB38C] rounded-lg flex items-center justify-center shadow-sm dark:shadow-none">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-8">
                  {realNews.length > 0 ? (
                    realNews.map((item) => (
                      <div
                        key={item.id}
                        className="group/news cursor-pointer space-y-3"
                      >
                        <div className="flex items-center gap-4 text-[7px] font-black uppercase tracking-[0.4em]">
                          <span
                            className={`px-3 py-0.5 rounded-full ${item.isEvent ? "bg-[#DF8142] text-white dark:text-[#110703]" : "bg-[#EEB38C]/20 dark:bg-[#6C3B1C] text-[#92664A] dark:text-[#EEB38C]"}`}
                          >
                            {item.isEvent ? "EVENT" : "LIVE_REQ"}
                          </span>
                          <span className="text-[#92664A]/70 dark:text-[#EEB38C]/50">{item.time}</span>
                        </div>
                        <h4 className="text-lg font-black text-[#5A270F] dark:text-white group-hover/news:text-[#DF8142] transition-colors uppercase leading-tight">
                          {item.title}
                        </h4>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center space-y-6">
                      <div className="w-12 h-12 bg-white dark:bg-[#6C3B1C] rounded-2xl mx-auto flex items-center justify-center border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-sm dark:shadow-none">
                        <Cpu className="h-6 w-6 text-[#92664A]/40 dark:text-[#EEB38C]/40" />
                      </div>
                      <p className="text-[#92664A]/60 dark:text-[#EEB38C]/40 font-black uppercase tracking-[0.4em] text-[10px]">
                        Awaiting News or Events
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content Area - Overhauled Background */}
      <div className="relative overflow-hidden bg-[#FAF8F4] dark:bg-[#5A270F] transition-colors duration-500">
        <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] blueprint-grid-dark pointer-events-none" />

        {/* Dynamic Nodes Background */}
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#DF8142]/20 dark:bg-[#DF8142]/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-[60%] right-[-10%] w-[40%] h-[40%] bg-[#EEB38C]/20 dark:bg-[#EEB38C]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Top Intelligence Nexus Section */}
        <section className="py-24 sm:py-32 relative z-10 transition-colors duration-500 overflow-hidden">
          {/* Soft Atmosphere Glows */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FDFCFB]/50 dark:bg-[#6C3B1C] -skew-x-12 translate-x-1/4 z-0 transition-colors duration-500" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DF8142]/20 dark:bg-[#DF8142]/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              {/* Visual Narrative */}
              <div className="lg:w-1/2 relative group">
                <div className="relative rounded-[2.5rem] overflow-hidden border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-2xl transition-all duration-700">
                  <img
                    src="/assets/collaborators.png"
                    className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-[2.5s]"
                    alt="Architecture and Software Engineering Collaboration"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5A270F] via-transparent to-transparent opacity-70" />

                  {/* Glassmorphism Floating Badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-[#0C0603]/80 backdrop-blur-xl p-5 rounded-[1.2rem] border border-white/10 shadow-2xl">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex -space-x-2">
                          <div className="h-8 w-8 rounded-full bg-[#DF8142] flex items-center justify-center text-[7px] font-black text-white shadow-lg">
                            ARCH
                          </div>
                          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[7px] font-black text-[#5A270F] shadow-lg">
                            SOFT
                          </div>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#EEB38C]">
                          NETWORK_SYNC_v1
                        </span>
                      </div>
                      <p className="text-white/80 text-[11px] font-bold leading-relaxed">
                        "Bridging physical and digital domains through
                        interdisciplinary engineering."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Information */}
              <div className="lg:w-1/2 flex flex-col items-start">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/50 dark:bg-[#6C3B1C] border border-[#EEB38C]/40 dark:border-[#DF8142]/30 rounded-md text-[8px] font-black uppercase tracking-[0.5em] text-[#DF8142] dark:text-[#EEB38C] mb-8 shadow-sm dark:shadow-xl">
                    <Sparkles className="h-3 w-3 text-[#DF8142]" />{" "}
                    THE_COLLABORATION
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#5A270F] dark:text-white uppercase leading-[0.85] mb-8 font-space-grotesk">
                    FUSION OF <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] dark:via-[#EEB38C] to-[#DF8142] italic">
                      DISCIPLINES.
                    </span>
                  </h2>
                  <div className="pl-6 border-l-2 border-[#DF8142]">
                    <p className="text-lg text-[#92664A] dark:text-white/90 font-bold leading-relaxed max-w-xl">
                      ARCHVAULT is the product of high-performance synergy
                      between the
                      <span className="text-[#DF8142]"> Architecture</span> and
                      <span className="text-[#DF8142]">
                        {" "}
                        Software Engineering
                      </span>{" "}
                      departments.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 w-full">
                  <div className="group relative p-8 bg-[#FDFCFB] dark:bg-[#6C3B1C] rounded-[2rem] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 transition-all duration-500 flex flex-col hover:border-[#DF8142] shadow-lg xl:shadow-[0_20px_40px_-10px_rgba(90,39,15,0.4)]">
                    <div className="h-10 w-10 bg-[#FAF8F4] dark:bg-[#5A270F] text-[#DF8142] dark:text-[#EEB38C] rounded-lg flex items-center justify-center mb-6 shadow-sm dark:shadow-xl border border-[#EEB38C]/40 dark:border-[#DF8142]/20">
                      <Users className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-black text-[#5A270F] dark:text-white uppercase tracking-tight mb-2">
                      ARCH_CORE
                    </h4>
                    <p className="text-[#92664A] dark:text-[#EEB38C]/70 text-[11px] font-bold leading-tight">
                      Defining taxonomy, BIM standards, and creative vision for
                      our global index.
                    </p>
                  </div>

                  <div className="group relative p-8 bg-[#FDFCFB] dark:bg-[#6C3B1C] rounded-[2rem] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 transition-all duration-500 flex flex-col hover:border-[#DF8142] shadow-lg xl:shadow-[0_20px_40px_-10px_rgba(90,39,15,0.4)]">
                    <div className="h-10 w-10 bg-[#FAF8F4] dark:bg-[#5A270F] text-[#DF8142] dark:text-[#EEB38C] rounded-lg flex items-center justify-center mb-6 shadow-sm dark:shadow-xl border border-[#EEB38C]/40 dark:border-[#DF8142]/20">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-black text-[#5A270F] dark:text-white uppercase tracking-tight mb-2">
                      SOFT_ENGINE
                    </h4>
                    <p className="text-[#92664A] dark:text-[#EEB38C]/70 text-[11px] font-bold leading-tight">
                      Engineering CDN clusters, zero-trust layers, and the fluid
                      UX matrix.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
