import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Digital Library</h3>
                        <p className="text-gray-400 text-sm">
                            A repository of architectural knowledge and resources.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-300 mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                            <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                            <li><Link to="/browse" className="text-gray-400 hover:text-white">Browse Resources</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-300 mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-300 mb-4">Connect</h3>
                        {/* Social media links can go here */}
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Digital Library. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
