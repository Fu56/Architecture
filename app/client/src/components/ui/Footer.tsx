import { Link } from "react-router-dom";
import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Digital<span className="text-indigo-400">Library</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering the next generation of architects with a comprehensive
              digital repository of academic resources, shared insights, and
              global industry news.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white text-lg mb-6">
              Quick Exploration
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/browse"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Browse All Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Share Your Project
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Faculty Insights
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-indigo-400 transition-colors"
                >
                  About the Library
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-lg mb-6">Resources</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/browse?category=design"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Design Files (RFA/SKP)
                </Link>
              </li>
              <li>
                <Link
                  to="/browse?category=research"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Thesis & Research
                </Link>
              </li>
              <li>
                <Link
                  to="/browse?category=manuals"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Software Manuals
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Report an Issue
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span>
                  Architecture Faculty, University Campus, Building A1
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span>library@architecture.edu</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Digital Architecture Library. All
            rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              to="/privacy"
              className="hover:text-indigo-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-indigo-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
