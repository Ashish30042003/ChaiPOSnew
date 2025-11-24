import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { isSuperAdmin } from '../utils/superAdmin';
import { Mail, Lock, Shield, Coffee, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminAuth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            if (isSuperAdmin(result.user)) {
                navigate('/admin/dashboard');
            } else {
                await auth.signOut();
                setError('Access denied. You are not authorized to access the admin portal.');
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError(err.message.replace('Firebase: ', '').replace('Error (auth/', '').replace(')', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);

            if (isSuperAdmin(result.user)) {
                navigate('/admin/dashboard');
            } else {
                await auth.signOut();
                setError('Access denied. You are not authorized to access the admin portal.');
            }
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', '').replace('Error (auth/', '').replace(')', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Shield className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-white/80">Platform Management Access</p>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                            <strong>Restricted Access:</strong> Only authorized super admins can access this portal.
                        </p>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-stone-200 p-3 rounded-xl hover:bg-stone-50 transition-all font-medium text-stone-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-stone-200"></div>
                        <span className="flex-shrink-0 mx-4 text-stone-400 text-xs uppercase tracking-wider">Or with email</span>
                        <div className="flex-grow border-t border-stone-200"></div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="admin@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    minLength={6}
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    Access Admin Portal
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-stone-500 hover:text-stone-700">
                            ← Back to POS Application
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
