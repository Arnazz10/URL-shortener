
import { Menu, X, Link, User, ArrowRight } from 'lucide-react';
import { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 glass-morphism border-b bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <RouterLink to="/" className="flex items-center space-x-2 w-auto">
                        <div className="p-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg shadow-lg">
                            <Link className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">QuickLink</span>
                    </RouterLink>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <RouterLink to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</RouterLink>
                        <RouterLink to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Pricing</RouterLink>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <RouterLink to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</RouterLink>
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                    </button>
                                    {/* Dropdown would go here - simplified for now */}
                                    <button onClick={handleLogout} className="text-sm text-red-500 ml-4 font-medium hover:text-red-600 transition-colors">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <RouterLink to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Login</RouterLink>
                                <RouterLink to="/signup" className="btn-primary flex items-center shadow-blue-200">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </RouterLink>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 p-2">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-morphism border-b mobile-menu-animate">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <RouterLink to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Features</RouterLink>
                        {user ? (
                            <>
                                <RouterLink to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Dashboard</RouterLink>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Log out</button>
                            </>
                        ) : (
                            <>
                                <RouterLink to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Login</RouterLink>
                                <RouterLink to="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white shadow-md mx-3 text-center mt-4">Sign up for free</RouterLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
