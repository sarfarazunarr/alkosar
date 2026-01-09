import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, BookOpen } from 'lucide-react';

const Home = () => {
    return (
        <div className="relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 dark:opacity-10 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[500px] -right-[500px] w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-blue-500 to-purple-500 blur-3xl opacity-30"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[500px] -left-[500px] w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 blur-3xl opacity-30"
                />
            </div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-display">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Alkosar Institution
                            </span>
                            <br />
                            of Computer Info Tech
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                            Excellence in technological education. Verify your achievements and certificates with our secure digital platform.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/certificate/verify">
                                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2">
                                    <CheckCircle size={20} />
                                    Verify Certificate
                                </button>
                            </Link>
                            <a href="#courses">
                                <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-blue-500 text-gray-900 dark:text-gray-100 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
                                    <BookOpen size={20} />
                                    Explore Courses
                                </button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Award className="w-8 h-8 text-blue-500" />, title: "Certified Excellence", desc: "Recognized certifications that validate your skills globally." },
                            { icon: <BookOpen className="w-8 h-8 text-purple-500" />, title: "Modern Curriculum", desc: "Up-to-date coursework designed for current industry demands." },
                            { icon: <CheckCircle className="w-8 h-8 text-cyan-500" />, title: "Instant Verification", desc: "Real-time verification system for employers and institutions." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="mb-4 p-3 bg-gray-100 dark:bg-zinc-900 rounded-xl inline-block">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
