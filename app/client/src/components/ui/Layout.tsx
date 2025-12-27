import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, User, LogOut, ShieldCheck } from 'lucide-react';
import { isAuthenticated, clearToken, getUser } from '../../lib/auth';
import Footer from './Footer';

const Layout = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Browse', href: '/browse' },
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                                <BookOpen className="h-6 w-6 text-indigo-600" />
                                <span>Digital Library</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.href}
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors ${
                                            isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2">
                                {isAuthenticated() ? (
                                    <>
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                                                <ShieldCheck className="h-5 w-5" />
                                            </Link>
                                        )}
                                        <Link to="/dashboard" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                                            <User className="h-5 w-5" />
                                        </Link>
                                        <button onClick={handleLogout} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-600">
                                            <LogOut className="h-5 w-5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="ml-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                                >
                                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    {isMobileMenuOpen && (
                        <div className="md:hidden pb-4 space-y-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-3 py-2 rounded-md text-base font-medium ${
                                            isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                            <div className="pt-4 mt-4 border-t border-gray-200">
                                {isAuthenticated() ? (
                                    <div className="flex items-center justify-around">
                                         {user?.role === 'admin' && (
                                            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><ShieldCheck className="h-6 w-6" /></Link>
                                        )}
                                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><User className="h-6 w-6" /></Link>
                                        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-600"><LogOut className="h-6 w-6" /></button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-2 text-center text-base font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">Sign In</Link>
                                        <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-2 text-center text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Sign Up</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
