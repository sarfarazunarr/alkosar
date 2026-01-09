import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Verification = () => {
    const [certId, setCertId] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (certId.trim()) {
            navigate(`/certificate/${certId.trim()}`);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                    <div className="p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <img src="/logo.jpeg" alt="Alkosar Logo" className="h-20 w-20 rounded-full object-cover shadow-lg border-4 border-white dark:border-zinc-800" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2 font-display">Verify Certificate</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">Enter the unique certificate ID to verify authenticity.</p>

                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={certId}
                                onChange={(e) => setCertId(e.target.value)}
                                placeholder="Certificate ID (e.g., 01)"
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />

                            <button
                                type="submit"
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                            >
                                Verify Now
                            </button>
                        </form>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-950 px-8 py-4 text-center">
                        <p className="text-xs text-gray-500">
                            By verifying, you access the public academic records of Alkosar Institution students.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Verification;
