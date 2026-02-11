
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle, UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
    const { register: authRegister } = useContext(AuthContext); // avoid name conflict
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch("password");

    const onSubmit = async (data) => {
        setLoading(true);
        const success = await authRegister(data.email, data.password);
        setLoading(false);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <Navbar />

            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] pt-16">
                <div className="max-w-md w-full glass-morphism rounded-2xl shadow-xl p-8 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
                    {/* Decorative blur elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob animation-delay-4000"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">Join QuickLink</h2>
                        <p className="text-gray-500 text-sm">Start creating branded short links today</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="name@example.com"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                                    })}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Minimum 8 characters"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 8, message: 'Password must be at least 8 characters' }
                                    })}
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    placeholder="Re-enter password"
                                    {...register('confirmPassword', {
                                        validate: value => value === password || "Passwords do not match"
                                    })}
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex justify-center items-center py-3 shadow-lg hover:shadow-blue-500/30 transition-all font-semibold tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>Create Account <UserPlus className="ml-2 h-4 w-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
