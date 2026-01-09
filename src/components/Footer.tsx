const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 font-display text-gray-900 dark:text-white">Alkosar Institute</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Empowering the next generation of tech leaders through quality education and innovation.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h4>
                        <p className="text-gray-600 dark:text-gray-400">Alkosar School Hala New</p>
                        <p className="text-gray-600 dark:text-gray-400">Phone: 03193010043</p>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 text-center">
                    <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Alkosar Institution of Computer Information Technology. All rights reserved.</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Developed By <a href="https://sarfarazunarr.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">Sarfaraz Unar</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
