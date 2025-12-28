import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Download,
  BookOpen,
  Users,
  Newspaper,
  ArrowUpRight,
} from "lucide-react";
import { api } from "../lib/api";
import type { Resource } from "../models";

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
];

const Home = () => {
  const [topResources, setTopResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchTopResources = async () => {
      try {
        const { data } = await api.get("/resources?sortBy=downloads&limit=4");
        if (Array.isArray(data.resources)) {
          setTopResources(data.resources);
        }
      } catch (err) {
        console.error("Failed to fetch top resources:", err);
      }
    };
    fetchTopResources();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero.png"
            alt="Hero Architectural"
            className="w-full h-full object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 rounded-full">
              Digital Excellence in Architecture
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Architecture is a visual art, and the buildings{" "}
              <span className="text-indigo-400 italic">
                speak for themselves.
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
              Access the largest collection of architectural resources, research
              papers, and design files shared by the academic community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/browse"
                className="btn-primary flex items-center justify-center gap-2 group"
              >
                Explore The Library
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="btn-secondary bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 flex items-center justify-center"
              >
                Join our Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold font-display text-gray-900">
                10k+
              </p>
              <p className="text-gray-500 text-sm">Resources Shared</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-display text-gray-900">
                5k+
              </p>
              <p className="text-gray-500 text-sm">Active Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-display text-gray-900">
                200+
              </p>
              <p className="text-gray-500 text-sm">Design Guides</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-display text-gray-900">
                50+
              </p>
              <p className="text-gray-500 text-sm">Expert Faculty</p>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Blog & News Section */}
      <section className="py-24 hero-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Blogs */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Teacher's Insights
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Latest articles and academic guidance from our faculty.
                  </p>
                </div>
                <Link
                  to="/blog"
                  className="hidden sm:flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                {blogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="premium-card overflow-hidden flex flex-col group"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-indigo-600 text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <span className="font-medium text-gray-900">
                          {blog.author}
                        </span>
                        <span>•</span>
                        <span>{blog.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Industry News */}
            <div className="lg:w-1/3">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <Newspaper className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Industry News
                  </h2>
                </div>
                <div className="space-y-6">
                  {news.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                          {item.source}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.time}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                        {item.title}
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <hr className="mt-6 border-gray-50" />
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  More News
                </button>
              </div>

              {/* Design Slogan Card */}
              <div className="mt-8 bg-indigo-600 p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <BookOpen className="h-10 w-10 mb-4 opacity-50" />
                  <p className="text-xl font-medium leading-relaxed italic">
                    "Every great architect is necessarily a great poet. He must
                    be a great original interpreter of his time."
                  </p>
                  <p className="mt-4 text-sm font-bold text-indigo-200">
                    — Frank Lloyd Wright
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-white/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                Featured Resources
              </h2>
              <p className="text-lg text-gray-500 mt-2">
                The most downloaded and peer-reviewed materials.
              </p>
            </div>
            <Link to="/browse" className="btn-secondary hidden sm:block">
              Browse All
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {topResources.map((resource) => (
              <div
                key={resource.id}
                className="premium-card p-6 flex flex-col group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase py-1 px-2.5 bg-gray-100 text-gray-600 rounded-lg">
                    {resource.fileType}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-xs font-bold">Featured</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {resource.author}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Download className="h-4 w-4" />
                    {resource.downloadCount}
                  </div>
                  <Link
                    to={`/resources/${resource.id}`}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    View <ArrowRight className="inline h-3.5 w-3.5 ml-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600 skew-x-12 translate-x-1/2 opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to contribute?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of students and faculty members in building the
            ultimate digital repository for architectural knowledge.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/upload" className="btn-primary px-8">
              Upload Resource
            </Link>
            <Link
              to="/register"
              className="btn-secondary bg-transparent border-gray-700 text-white hover:bg-white/5 px-8"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
