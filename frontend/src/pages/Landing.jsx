
import { ArrowRight, Link as LinkIcon, Smartphone, Lock, Clock, Zap, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function Landing() {
    const [shortUrl, setShortUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState('');

    const handleQuickShorten = async (e) => {
        e.preventDefault();
        if (!url) return toast.error('Please enter a URL');
        setLoading(true);
        // Simulate API call for demo - in prod, call API
        setTimeout(() => {
            setShortUrl('https://qlnk.io/demo123');
            setLoading(false);
            toast.success('Link shortened!');
        }, 1000);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50 -z-10"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-8 animate-fade-in-up">
                        <span className="text-xs font-semibold uppercase tracking-wide mr-2">New</span>
                        <span className="text-sm font-medium">Advanced Analytics Dashboard is live!</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-100">
                        Shorten Your URLs <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">in Seconds</span>
                    </h1>

                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
                        Create short, memorable links with detailed analytics. Perfect for marketing campaigns, social media, and more.
                    </p>

                    <div className="max-w-2xl mx-auto mb-12 glass-morphism p-3 rounded-2xl shadow-xl animate-fade-in-up animation-delay-300">
                        {shortUrl ? (
                            <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-green-100">
                                <span className="text-gray-700 font-medium px-4">{shortUrl}</span>
                                <button onClick={copyToClipboard} className="btn-primary py-2 px-6 text-sm">
                                    Copy
                                </button>
                                <button onClick={() => setShortUrl('')} className="ml-2 text-gray-400 hover:text-gray-600">
                                    Change
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleQuickShorten} className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="url"
                                    placeholder="Paste your long URL here..."
                                    className="flex-1 px-6 py-4 rounded-xl border-none bg-white focus:ring-2 focus:ring-blue-500 text-lg shadow-inner"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary py-4 px-8 text-lg shadow-lg hover:shadow-blue-500/40 flex items-center justify-center whitespace-nowrap"
                                >
                                    {loading ? 'Shortening...' : 'Shorten Now'} <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="flex justify-center space-x-8 text-sm text-gray-500 animate-fade-in-up animation-delay-400">
                        <div className="flex items-center"><span className="text-blue-500 mr-2">✓</span> No credit card required</div>
                        <div className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Free plan available</div>
                        <div className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Analytics included</div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need in a link shortener
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="h-6 w-6 text-yellow-500" />}
                            title="Lightning Fast"
                            desc="Instant link generation with our optimized infrastructure."
                        />
                        <FeatureCard
                            icon={<BarChart className="h-6 w-6 text-blue-500" />}
                            title="Detailed Analytics"
                            desc="Track clicks, geographic data, and device types in real-time."
                        />
                        <FeatureCard
                            icon={<Lock className="h-6 w-6 text-green-500" />}
                            title="Secure Links"
                            desc="Protect your links with passwords for sensitive content."
                        />
                        <FeatureCard
                            icon={<Smartphone className="h-6 w-6 text-purple-500" />}
                            title="QR Codes"
                            desc="Auto-generated QR codes for every shortened link."
                        />
                        <FeatureCard
                            icon={<Clock className="h-6 w-6 text-red-500" />}
                            title="Link Expiration"
                            desc="Set expiration dates for temporary marketing campaigns."
                        />
                        <FeatureCard
                            icon={<LinkIcon className="h-6 w-6 text-indigo-500" />}
                            title="Custom Alias"
                            desc="Create branded links that stand out and build trust."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full mix-blend-overlay filter blur-3xl"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
                    <p className="text-xl text-blue-100 mb-10">Join thousands of users creating better links today. It's free to get started.</p>
                    <Link to="/signup" className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-gray-50 hover:scale-105 transition-all inline-flex items-center">
                        Sign Up for Free <ArrowRight className="ml-2" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="p-1.5 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg">
                                <LinkIcon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-white text-lg">QuickLink</span>
                        </div>
                        <p className="text-sm text-gray-400">Making the web shorter, one link at a time.</p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    &copy; 2026 QuickLink Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-200">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{desc}</p>
        </div>
    )
}
