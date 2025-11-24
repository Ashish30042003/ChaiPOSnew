import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { isSuperAdmin } from './utils/superAdmin';
import AdminAuth from './components/AdminAuth';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import ShopsView from './views/admin/ShopsView';

export default function AdminApp() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);

            // Redirect non-admin users
            if (currentUser && !isSuperAdmin(currentUser)) {
                auth.signOut();
                navigate('/admin/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    if (authLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stone-500">Loading admin portal...</p>
                </div>
            </div>
        );
    }

    if (!user || !isSuperAdmin(user)) {
        return (
            <Routes>
                <Route path="/login" element={<AdminAuth />} />
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </Routes>
        );
    }

    return (
        <AdminLayout user={user}>
            <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/shops" element={<ShopsView user={user} />} />
                <Route path="/analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics (Coming Soon)</h1></div>} />
                <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings (Coming Soon)</h1></div>} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
        </AdminLayout>
    );
}
