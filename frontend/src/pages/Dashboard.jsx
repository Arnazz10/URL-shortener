
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LinkForm from '../components/LinkForm';
import QRCodeModal from '../components/QRCodeModal';
import { Plus, Link as LinkIcon, Edit2, Trash2, QrCode, ArrowRight, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { linkService } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);
    const [editingLink, setEditingLink] = useState(null);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const { data } = await linkService.getAll();
            setLinks(data);
        } catch (error) {
            toast.error('Failed to load links');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            await linkService.create(data);
            toast.success('Link created successfully!');
            fetchLinks();
            setModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create link');
        }
    };

    const handleUpdate = async (data) => {
        try {
            await linkService.update(editingLink.id, data);
            toast.success('Link updated successfully!');
            fetchLinks();
            setModalOpen(false);
            setEditingLink(null);
        } catch (error) {
            toast.error('Failed to update link');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;
        try {
            await linkService.delete(id);
            toast.success('Link deleted');
            setLinks(links.filter(l => l.id !== id));
        } catch (error) {
            toast.error('Failed to delete link');
        }
    };

    const openQr = (link) => {
        setSelectedLink(link);
        setQrModalOpen(true);
    };

    const openEdit = (link) => {
        setEditingLink(link);
        setModalOpen(true);
    };

    const copyToClipboard = (shortUrl) => {
        navigator.clipboard.writeText(shortUrl);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500 mt-1">Welcome back, {user?.email}</p>
                    </div>
                    <button
                        onClick={() => { setEditingLink(null); setModalOpen(true); }}
                        className="btn-primary flex items-center justify-center shadow-lg hover:shadow-blue-500/40 transition-all font-semibold"
                    >
                        <Plus className="h-5 w-5 mr-2" /> Create New Link
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-100">
                    <StatCard title="Total Links" value={links.length} color="blue" />
                    <StatCard title="Total Clicks" value={links.reduce((acc, curr) => acc + (curr.clicks || 0), 0)} color="purple" />
                    <StatCard title="Active Links" value={links.filter(l => l.isActive).length} color="green" />
                </div>

                {/* Links List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-200">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h2 className="text-lg font-semibold text-gray-800">Your Links</h2>
                        <span className="text-sm text-gray-500">{links.length} links found</span>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading your links...</div>
                    ) : links.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                <LinkIcon className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No links created yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm">Create your first shortened link to start tracking analytics and sharing with ease.</p>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="btn-primary px-6 py-2 shadow-md"
                            >
                                Create your first link
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {links.map((link) => (
                                <div key={link.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-blue-600 truncate cursor-pointer hover:underline" onClick={() => copyToClipboard(link.shortUrl)}>
                                                    {link.shortUrl}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${link.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {link.isActive ? 'Active' : 'Archived'}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mb-2 truncate max-w-md">
                                                <ArrowRight className="h-3 w-3 mr-1 text-gray-400" />
                                                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 truncate block">
                                                    {link.originalUrl}
                                                </a>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-400 gap-4 mt-2">
                                                <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                                                {link.expiresAt && <span className="text-orange-400">Expires: {new Date(link.expiresAt).toLocaleDateString()}</span>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 md:gap-8 self-start md:self-center w-full md:w-auto justify-between md:justify-end">
                                            <Link to={`/analytics/${link.id}`} className="flex flex-col items-center group/stat cursor-pointer">
                                                <span className="text-2xl font-bold text-gray-900 group-hover/stat:text-blue-600 transition-colors">{link.clicks || 0}</span>
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Clicks</span>
                                            </Link>

                                            <div className="flex items-center gap-2">
                                                <button onClick={() => copyToClipboard(link.shortUrl)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Copy">
                                                    <ExternalLink className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => openQr(link)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="QR Code">
                                                    <QrCode className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => openEdit(link)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(link.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
                    <LinkForm
                        onSubmit={editingLink ? handleUpdate : handleCreate}
                        initialData={editingLink}
                        isEdit={!!editingLink}
                        onClose={() => setModalOpen(false)}
                    />
                </div>
            )}

            <QRCodeModal
                isOpen={qrModalOpen}
                onClose={() => setQrModalOpen(false)}
                qrCodeBase64={selectedLink?.qrCodeBase64}
                shortUrl={selectedLink?.shortUrl}
            />
        </div>
    );
}

function StatCard({ title, value, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100",
        green: "text-green-600 bg-green-50 border-green-100",
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
                <BarChart className="h-6 w-6" /> {/* Generic icon for simplified demo */}
            </div>
        </div>
    )
}
