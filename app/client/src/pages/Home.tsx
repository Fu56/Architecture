import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Download } from 'lucide-react';
import { api } from '../lib/api';
import { Resource } from '../models';

const Home = () => {
    const [topResources, setTopResources] = useState<Resource[]>([]);

    useEffect(() => {
        const fetchTopResources = async () => {
            try {
                // Assuming an endpoint to get top-rated or most downloaded resources
                const { data } = await api.get('/resources?sortBy=downloads&limit=3');
                if (Array.isArray(data.resources)) {
                    setTopResources(data.resources);
                }
            } catch (err) {
                console.error('Failed to fetch top resources:', err);
            }
        };
        fetchTopResources();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-24 md:py-32">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900">
                            The Hub for Architectural Excellence
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
                            Discover, share, and download high-quality academic resources, from design files to research papers.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <Link
                                to="/browse"
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                            >
                                Explore Resources
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200"
                            >
                                Join Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Resources Section */}
            {topResources.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-gray-900">Featured Resources</h2>
                            <p className="mt-2 text-lg text-gray-600">Handpicked and highly-rated by our community.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {topResources.map((resource) => (
                                <div key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold uppercase px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">{resource.fileType}</span>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="h-4 w-4" />
                                                {/* Placeholder for rating */}
                                                <span className="text-sm font-medium text-gray-600">4.5</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 truncate">{resource.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">by {resource.author}</p>
                                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Download className="h-4 w-4" />
                                                <span>{resource.downloadCount} Downloads</span>
                                            </div>
                                            <Link to={`/resources/${resource.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About/Blog Preview Section could go here */}
        </>
    );
};

export default Home;
