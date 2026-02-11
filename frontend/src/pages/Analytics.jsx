
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api, analyticsService } from '../services/api';
import Navbar from '../components/Navbar';
import AnalyticsChart from '../components/AnalyticsChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, ExternalLink, Calendar, Copy, Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Analytics() {
    const { linkId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [linkId]);

    const fetchAnalytics = async () => {
        try {
            const response = await analyticsService.get(linkId);
            setData(response.data);
        } catch (error) {
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (data?.shortUrl) {
            navigator.clipboard.writeText(data.shortUrl);
            toast.success('Short URL copied!');
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><LoadingSpinner /></div>;
    if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Analytics not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-8 animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
                        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
                    </Link>
                    <div className="flex gap-3">
                        <button className="btn-secondary flex items-center shadow-sm hover:shadow-md">
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </button>
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-full transition-colors hidden sm:block">
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Overview Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>

                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 truncate max-w-xl" title={data.originalUrl}>
                                {data.originalUrl}
                            </h1>
                            <a href={data.originalUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <ExternalLink className="h-5 w-5" />
                            </a>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <span className="font-mono text-blue-600 font-medium">{data.shortUrl}</span>
                                <button onClick={copyToClipboard} className="text-gray-400 hover:text-blue-600 transition-colors" title="Copy">
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Created {format(new Date(data.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${data.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {data.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    <div className="lg:border-l lg:pl-8 border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Clicks</span>
                        <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse-slow">
                            {data.totalClicks}
                        </span>
                        <span className="text-xs text-green-600 font-medium mt-2 bg-green-50 px-2 py-0.5 rounded-full flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> Live Tracking
                        </span>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Clicks Over Time */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-96 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                            Clicks Over Time
                        </h3>
                        <div className="flex-1 w-full relative">
                            <AnalyticsChart data={data.clicksByDate} type="line" />
                        </div>
                    </div>

                    {/* Device Distribution */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-96 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-1 h-6 bg-purple-500 rounded-full mr-3"></span>
                            Device Distribution
                        </h3>
                        <div className="flex-1 w-full relative flex items-center justify-center">
                            <AnalyticsChart data={data.deviceDistribution} type="pie" />
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Last 10 Clicks</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-medium text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Time</th>
                                    <th className="px-6 py-4 font-semibold">IP Address</th>
                                    <th className="px-6 py-4 font-semibold">Location</th>
                                    <th className="px-6 py-4 font-semibold">Device</th>
                                    <th className="px-6 py-4 font-semibold">Browser</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.recentClicks?.length > 0 ? (
                                    data.recentClicks.map((click, i) => (
                                        <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {format(new Date(click.clickedAt), 'MMM d, p')}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{click.ipAddress || 'Hidden'}</td>
                                            <td className="px-6 py-4">{click.country || 'Unknown'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${click.deviceType === 'MOBILE' ? 'bg-purple-100 text-purple-800' :
                                                        click.deviceType === 'DESKTOP' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {click.deviceType || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{click.browser || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                                            No clicks recorded yet. Share your link to see data!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
