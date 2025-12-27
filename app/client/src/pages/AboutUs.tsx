const AboutUs = () => {
    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        About Our Digital Library
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Our mission is to provide a centralized platform for architectural students and faculty to share and access a wealth of knowledge and resources.
                    </p>
                </div>
                <div className="mt-16 max-w-5xl mx-auto">
                    {/* More content about the library's history, team, etc. can be added here */}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
