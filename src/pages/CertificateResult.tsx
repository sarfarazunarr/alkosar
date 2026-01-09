import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCertificate, type Certificate } from '../lib/api';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft, Loader2, Award } from 'lucide-react';

const CertificateResult = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            if (!id) return;
            setLoading(true);
            setError(false);
            try {
                const result = await fetchCertificate(id);
                if (result) {
                    setData(result);
                } else {
                    setError(true);
                }
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-red-50 dark:bg-red-900/10 p-8 rounded-full mb-6"
                >
                    <XCircle className="w-16 h-16 text-red-500" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Certificate Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                    We couldn't find a certificate with ID <span className="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">{id}</span>. Please check the number and try again.
                </p>
                <Link to="/certificate/verify" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link to="/certificate/verify" className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Verification
            </Link>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 relative"
            >
                {/* Decorative Header */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>

                <div className="relative p-8 md:p-12">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-50 dark:bg-zinc-800 rounded-xl">
                                <Award className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Provisional</h2>
                                <h1 className="text-2xl font-bold font-display">Certificate of Completion</h1>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-900/30">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-semibold">Verified</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 uppercase tracking-wide">Student Name</p>
                            <p className="text-2xl font-medium">{data.studentName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 uppercase tracking-wide">Father's Name</p>
                            <p className="text-xl">{data.fatherName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 uppercase tracking-wide">Course Duration</p>
                            <p className="text-xl">{data.duration}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 uppercase tracking-wide">Date of Completion</p>
                            <p className="text-xl">
                                {new Date(data.completionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 uppercase tracking-wide">Certificate No</p>
                            <p className="text-xl font-mono">{data.certificateNo}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 uppercase tracking-wide">Status</p>
                            <p className="text-xl capitalize">{data.status}</p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-sm text-gray-500">
                            <p>Alkosar Institution of Computer</p>
                            <p>Information Technology</p>
                        </div>
                        <div className="sm:text-right">
                            {/* Placeholder for Signature or QR */}
                            <div className="inline-block border-2 border-dashed border-gray-300 dark:border-zinc-700 px-4 py-2 rounded text-xs text-gray-400">
                                Digital Signature Verification
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CertificateResult;
