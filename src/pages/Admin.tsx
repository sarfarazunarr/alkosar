import { useState, useEffect, useRef } from 'react';
import { addCertificate, fetchAllCertificates, deleteCertificate, type Certificate } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Lock, Loader2, QrCode, X, RefreshCcw, Trash2, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';

const Admin = () => {
    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Environment variables
    const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

    const [form, setForm] = useState({
        certificateNo: 'CIT',
        studentName: '',
        fatherName: '',
        duration: '6 Months',
        completionDate: '',
        status: 'Completed'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // List & QR Code States
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [listLoading, setListLoading] = useState(false);
    const [showQRCode, setShowQRCode] = useState<string | null>(null); // Holds cert ID
    const qrRef = useRef<HTMLDivElement>(null);

    // Initial fetch if auth is true (development or re-auth)
    useEffect(() => {
        if (auth) {
            loadCertificates();
        }
    }, [auth]);

    const loadCertificates = async () => {
        setListLoading(true);
        const data = await fetchAllCertificates();
        setCertificates(data);
        setListLoading(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Use environment variables or defaults
        const validUser = ADMIN_USERNAME;
        const validPass = ADMIN_PASSWORD;

        if (username === validUser && password === validPass) {
            setAuth(true);
        } else {
            alert('Incorrect username or password');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const result = await addCertificate(form);
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                setShowQRCode(form.certificateNo); // Open QR Modal
                loadCertificates(); // Refresh list
                setForm({
                    certificateNo: '',
                    studentName: '',
                    fatherName: '',
                    duration: '',
                    completionDate: '',
                    status: 'Completed'
                });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (certNo: string) => {
        if (!confirm(`Are you sure you want to delete certificate #${certNo}?`)) return;

        setListLoading(true);
        try {
            const result = await deleteCertificate(certNo);
            if (result.success) {
                setMessage({ type: 'success', text: "Certificate deleted successfully" });
                loadCertificates();
            } else {
                alert("Failed to delete: " + result.message);
            }
        } catch (e) {
            alert("Error deleting certificate");
        } finally {
            setListLoading(false);
        }
    };

    const downloadQRCode = async () => {
        if (qrRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toPng(qrRef.current, { cacheBust: true, backgroundColor: 'white' });
            const link = document.createElement('a');
            link.download = `certificate-${showQRCode}-qr.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Could not download QR code', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (!auth) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleLogin}
                    className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 w-full max-w-sm"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-full">
                            <Lock className="w-6 h-6 text-gray-500" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-6">Admin Access</h2>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition-colors">
                        Login
                    </button>
                </motion.form>
            </div>
        );
    }

    const currentUrl = window.location.origin;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Certificate Form */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden sticky top-24"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <PlusCircle className="text-blue-500" />
                                New Certificate
                            </h2>
                        </div>

                        <div className="p-6">
                            {message && (
                                <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input required name="certificateNo" placeholder="Certificate No" value={form.certificateNo} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                                <input required name="studentName" placeholder="Student Name" value={form.studentName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                                <input required name="fatherName" placeholder="Father's Name" value={form.fatherName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="Completed">Completed</option>
                                        <option value="In Progress">In Progress</option>
                                    </select>
                                </div>
                                <input required type="date" name="completionDate" value={form.completionDate} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" />

                                <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-3 font-semibold transition-all hover:scale-[1.01] flex justify-center items-center gap-2">
                                    {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} />}
                                    Add Certificate
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Certificate List */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <QrCode className="text-purple-500" />
                                Existing Certificates
                            </h2>
                            <button onClick={loadCertificates} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                <RefreshCcw size={18} className={listLoading ? "animate-spin" : ""} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-500 font-medium">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Father Name</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                    {certificates.length === 0 && !listLoading && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-400">No certificates found.</td>
                                        </tr>
                                    )}
                                    {certificates.map((cert) => (
                                        <tr key={cert.certificateNo} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="p-4 font-mono">{cert.certificateNo}</td>
                                            <td className="p-4 font-medium">{cert.studentName}</td>
                                            <td className="p-4 text-gray-500">{cert.fatherName}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${cert.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                    {cert.status}
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-2">
                                                <button
                                                    onClick={() => setShowQRCode(cert.certificateNo)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                    title="View QR"
                                                >
                                                    <QrCode size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cert.certificateNo)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQRCode && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full relative"
                        >
                            <button
                                onClick={() => setShowQRCode(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2">Certificate QR Code</h3>
                                <p className="text-gray-500 mb-6">Scan to verify Certificate #{showQRCode}</p>

                                <div ref={qrRef} className="bg-white p-6 rounded-xl border border-gray-200 inline-block mb-6">
                                    <QRCode
                                        value={`${currentUrl}/certificate/${showQRCode}`}
                                        size={200}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="break-all text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                        {`${currentUrl}/certificate/${showQRCode}`}
                                    </div>
                                    <button
                                        onClick={downloadQRCode}
                                        className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                                    >
                                        <Download size={18} />
                                        Download QR Image
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
