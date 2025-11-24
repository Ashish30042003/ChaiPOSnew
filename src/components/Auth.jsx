import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { Mail, Lock, User, Coffee, ArrowRight, Loader2 } from 'lucide-react';

const Auth = ({ themeColor = 'orange' }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/app');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/app');
        } catch (err) {
            console.error('Google login error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled. Please try again.');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup blocked. Please allow popups for this site.');
            } else {
                setError(err.message.replace('Firebase: ', '').replace('Error (auth/', '').replace(')', ''));
            }
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCred.user;

                // Initialize with 14-Day Enterprise Trial
                const trialExpiry = new Date();
                trialExpiry.setDate(trialExpiry.getDate() + 14);

                const { doc, setDoc } = await import('firebase/firestore');
                const { db, appId } = await import('../firebase/config');

                await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config'), {
                    plan: 'Enterprise',
                    isTrial: true,
                    planExpiresAt: trialExpiry.toISOString(),
                    name: 'My Chai Shop',
                    currency: '₹',
                    theme: 'orange'
                }, { merge: true });
            }
            navigate('/app');
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', '').replace('Error (auth/', '').replace(')', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess('Password reset email sent! Check your inbox.');
            setTimeout(() => {
                setShowForgotPassword(false);
                setSuccess('');
            }, 3000);
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', '').replace('Error (auth/', '').replace(')', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-${themeColor}-50 flex items-center justify-center p-4`}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-stone-100">
                {/* Header */}
                <div className={`bg-${themeColor}-600 p-8 text-center`}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Coffee className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Chai POS</h1>
                    <p className="text-white/80">
                        {showForgotPassword ? 'Reset your password' : 'Manage your chai business with ease'}
                    </p>
                </div>

                {/* Body */}
                <div className="p-8">
                    {showForgotPassword ? (
                        // Forgot Password Form
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                                    {success}
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
                                        className={`w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all`}
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-${themeColor}-200 transition-all flex items-center justify-center gap-2`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        Send Reset Link
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className={`text-${themeColor}-600 hover:text-${themeColor}-700 text-sm font-medium hover:underline`}
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Login/Signup Form
                        <div className="space-y-4">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 p-3 rounded-xl hover:bg-stone-50 transition-all font-medium text-stone-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                Continue with Google
                            </button>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-stone-200"></div>
                                <span className="flex-shrink-0 mx-4 text-stone-400 text-xs uppercase tracking-wider">Or continue with email</span>
                                <div className="flex-grow border-t border-stone-200"></div>
                            </div>

                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                                        {success}
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
                                            className={`w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all`}
                                            placeholder="name@example.com"
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
                                            className={`w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all`}
                                            placeholder="••••••••"
                                            minLength={6}
                                            autoComplete={isLogin ? "current-password" : "new-password"}
                                        />
                                    </div>
                                    {isLogin && (
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotPassword(true)}
                                                className={`text-xs text-${themeColor}-600 hover:text-${themeColor}-700 font-medium hover:underline`}
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-${themeColor}-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            {isLogin ? 'Sign In' : 'Create Account'}
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-6">
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className={`text-${themeColor}-600 hover:text-${themeColor}-700 text-sm font-medium hover:underline`}
                                >
                                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
