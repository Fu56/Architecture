const Blog = () => {
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        News & Updates
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Stay up-to-date with the latest news, articles, and resources from our community.
                    </p>
                </div>
                <div className="mt-16 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
                    {/* Blog posts will be mapped here */}
                    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                        <div className="flex-shrink-0">
                            {/* Blog post image */}
                        </div>
                        <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-indigo-600">
                                    <a href="#" className="hover:underline">Article</a>
                                </p>
                                <a href="#" className="block mt-2">
                                    <p className="text-xl font-semibold text-gray-900">Blog Post Title</p>
                                    <p className="mt-3 text-base text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                </a>
                            </div>
                            <div className="mt-6 flex items-center">
                                {/* Author info */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
