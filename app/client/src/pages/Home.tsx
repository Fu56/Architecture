import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Globe,
  Layers,
  BookOpen,
  Newspaper,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Download,
  Star,
  Clock,
  Sparkles,
  Mail,
  CheckCircle,
} from "lucide-react";
import { api } from "../lib/api";
import type { Resource } from "../models";
import ResourceCard from "../components/ui/ResourceCard";

const blogs = [
  {
    id: 1,
    title: "The Future of Sustainable Urbanism",
    author: "Prof. Sarah Johnson",
    date: "Dec 24, 2025",
    category: "Teaching Insight",
    image: "/assets/blog1.png",
    excerpt:
      "Exploring how integrated design can revolutionize our approach to city planning in the next decade.",
  },
  {
    id: 2,
    title: "Mastering the Thesis: A Guide for Students",
    author: "Dr. Robert Chen",
    date: "Dec 20, 2025",
    category: "Guidance",
    image: "/assets/blog2.png",
    excerpt:
      "Crucial tips on structuring your architectural thesis and effectively presenting your structural concepts.",
  },
];

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
  pendingResources: number;
}

const Home = () => {
  const [topResources, setTopResources] = useState<Resource[]>([]);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalResources: 0,
    totalUsers: 0,
    totalDownloads: 0,
    pendingResources: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch top resources
        const { data: topData } = await api.get(
          "/resources?sortBy=downloads&limit=4"
        );
        if (Array.isArray(topData.resources)) {
          setTopResources(topData.resources);
        }

        // Fetch recent resources
        const { data: recentData } = await api.get(
          "/resources?sortBy=recent&limit=3"
        );
        if (Array.isArray(recentData.resources)) {
          setRecentResources(recentData.resources);
        }

        // Fetch stats (if admin endpoint is accessible, otherwise use defaults)
        try {
          const { data: statsData } = await api.get("/admin/stats");
          setStats(statsData);
        } catch (err) {
          // Use default stats if not authorized
          console.log("Using default stats");
        }
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
      // TODO: Implement newsletter subscription
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-indigo-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero.png"
            alt="Hero Architectural"
            className="w-full h-full object-cover brightness-[0.6] scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/90 via-gray-900/40 to-transparent" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 mb-8 text-[11px] font-black uppercase tracking-[0.25em] text-white bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Digital Repository v4.0.1
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              BUILDING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 drop-shadow-2xl">
                THE FUTURE
              </span>{" "}
              <br />
              TOGETHER.
            </h1>

            <p className="text-xl text-white/70 mb-12 max-w-xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              Access the largest collection of architectural resources, research
              papers, and building information models (BIM) shared by experts.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="mb-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300"
            >
              <div className="relative max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for resources, topics, or authors..."
                  className="w-full pl-14 pr-6 py-5 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-5 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400">
              <Link
                to="/browse"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all duration-300 active:scale-95 flex items-center gap-2 group"
              >
                Explore Library
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-2xl transition-all duration-300 active:scale-95"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
            Scroll
          </span>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 py-16 -mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center lg:items-start group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 rounded-xl group-hover:scale-110 transition-transform">
                  <Layers className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="text-4xl font-black tracking-tighter text-gray-900">
                  {stats.totalResources > 0
                    ? `${Math.floor(stats.totalResources / 1000)}k+`
                    : "10k+"}
                </p>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Resources Shared
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-start group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-4xl font-black tracking-tighter text-gray-900">
                  {stats.totalUsers > 0
                    ? `${Math.floor(stats.totalUsers / 1000)}k+`
                    : "5k+"}
                </p>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Active Members
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-start group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-4xl font-black tracking-tighter text-gray-900">
                  {stats.totalDownloads > 0
                    ? `${Math.floor(stats.totalDownloads / 1000)}k+`
                    : "50k+"}
                </p>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Total Downloads
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-start group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
                  <Globe className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-4xl font-black tracking-tighter text-gray-900">
                  50+
                </p>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Expert Faculty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2 block">
              Browse by Category
            </span>
            <h2 className="text-4xl font-black tracking-tighter text-gray-900">
              EXPLORE TOPICS
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/browse?category=${encodeURIComponent(category.name)}`}
                className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.count} resources
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Uploads */}
      {recentResources.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2 block">
                  <Clock className="inline-block h-3 w-3 mr-2" />
                  Just Added
                </span>
                <h2 className="text-4xl font-black tracking-tighter text-gray-900">
                  RECENT UPLOADS
                </h2>
              </div>
              <Link
                to="/browse?sortBy=recent"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 transition-all"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {recentResources.map((resource) => (
                <Link
                  key={resource.id}
                  to={`/resources/${resource.id}`}
                  className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {resource.uploader?.first_name}{" "}
                        {resource.uploader?.last_name}
                      </p>
                    </div>
                    <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {resource.download_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      New
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Teachers Blog & News Section */}
      <section className="py-32 bg-gray-50/50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Blogs */}
            <div className="lg:w-2/3">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">
                    Curation
                  </span>
                  <h2 className="text-5xl font-black tracking-tighter text-gray-900 leading-none">
                    TEACHER'S <br />
                    <span className="text-indigo-600">INSIGHTS.</span>
                  </h2>
                </div>
                <Link
                  to="/blog"
                  className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] text-gray-900 transition-all active:scale-95"
                >
                  View Archive <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-10 sm:grid-cols-2">
                {blogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="group bg-white rounded-3xl border border-gray-100/50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2"
                  >
                    <div className="h-64 overflow-hidden relative">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-xl">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex-grow">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 mb-4 uppercase tracking-wider">
                        <span className="text-gray-900">{blog.author}</span>
                        <span className="opacity-30">•</span>
                        <span>{blog.date}</span>
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-gray-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 leading-relaxed text-sm mb-6 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <button className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-indigo-600 group/btn">
                        Read Article
                        <span className="w-8 h-px bg-indigo-100 transition-all group-hover/btn:w-12 group-hover/btn:bg-indigo-600" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Industry News */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-indigo-50 rounded-2xl">
                      <Newspaper className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                        Industry
                      </h2>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Global News Service
                      </p>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {news.map((item) => (
                      <div key={item.id} className="group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] px-2 py-0.5 bg-indigo-50 rounded-md">
                            {item.source}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {item.time}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors flex items-start gap-3">
                          {item.title}
                          <ArrowUpRight className="h-5 w-5 shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h4>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-12 py-5 border border-gray-100 text-[12px] font-black uppercase tracking-[0.2em] text-gray-900 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                    Access Newsfeed <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Design Slogan Card */}
                <div className="mt-10 bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="h-6 w-6 text-indigo-200" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">
                        Quote of the Day
                      </span>
                    </div>
                    <p className="text-2xl font-black leading-tight italic tracking-tight">
                      "Every great architect is necessarily a great poet."
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-px w-8 bg-indigo-400" />
                      <p className="text-[11px] font-black uppercase tracking-widest text-indigo-200">
                        Frank Lloyd Wright
                      </p>
                    </div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:16px_16px] opacity-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2 block animate-bounce">
                Top Rated
              </span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 leading-none">
                CURATED <br />
                RESOURCES.
              </h2>
              <p className="text-lg text-gray-500 mt-6 leading-relaxed">
                The most downloaded and peer-reviewed materials from
                architectural students and professors worldwide.
              </p>
            </div>
            <Link
              to="/browse"
              className="px-8 py-4 bg-gray-900 hover:bg-black text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-xl"
            >
              Explore All <ArrowRight className="inline-block ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {topResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>

        {/* Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-gray-50/50 -z-10 select-none pointer-events-none tracking-tighter">
          LIBRARY
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex p-3 bg-white rounded-2xl shadow-lg mb-6">
              <Mail className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4">
              STAY UPDATED
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get the latest resources, insights, and architectural trends
              delivered to your inbox.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-green-100 text-green-800 rounded-2xl">
                <CheckCircle className="h-5 w-5" />
                <span className="font-bold">Successfully subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-gray-900 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[size:32px_32px]" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex p-3 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 mb-10">
              <ShieldCheck className="h-8 w-8 text-indigo-500" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-[0.95]">
              JOIN THE <br />
              <span className="text-indigo-500">KNOWLEDGE</span> NETWORK.
            </h2>
            <p className="text-xl text-white/50 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
              Become part of a global academic ecosystem. Contribute your
              research, download high-quality assets, and elevate your
              architectural practice.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/upload"
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all active:scale-95"
              >
                Upload Resource
              </Link>
              <Link
                to="/register"
                className="px-10 py-5 bg-white text-gray-900 hover:bg-gray-100 text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-xl"
              >
                Create Account Free
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Accents */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </section>
    </div>
  );
};

export default Home;
