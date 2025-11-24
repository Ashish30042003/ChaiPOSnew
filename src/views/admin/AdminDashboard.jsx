import React, { useState, useEffect } from 'react';
import {
    Users, TrendingUp, DollarSign, Activity,
    ShoppingBag, Crown, Zap
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, appId } from '../../firebase/config';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalShops: 0,
        activeShops: 0,
        totalRevenue: 0,
        planDistribution: { Free: 0, Basic: 0, Pro: 0, Enterprise: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const usersRef = collection(db, 'artifacts', appId, 'users');
            const snapshot = await getDocs(usersRef);

            const newStats = {
                totalShops: 0,
                activeShops: 0,
                totalRevenue: 0,
                planDistribution: { Free: 0, Basic: 0, Pro: 0, Enterprise: 0 }
            };

            for (const doc of snapshot.docs) {
                const settingsSnap = await getDocs(collection(db, 'artifacts', appId, 'users', doc.id, 'settings'));
                let config = { plan: 'Free' };

                settingsSnap.forEach(s => {
                    if (s.id === 'config') config = s.data();
                });

                newStats.totalShops++;
                if (config.plan !== 'Free') newStats.activeShops++;
                if (newStats.planDistribution[config.plan] !== undefined) {
                    newStats.planDistribution[config.plan]++;
                }
            }

            setStats(newStats);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stone-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-stone-800">Platform Overview</h1>
                <p className="text-stone-500 mt-1">Monitor your entire POS platform at a glance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<Users className="text-blue-600" size={28} />}
                    label="Total Shops"
                    value={stats.totalShops}
                    bgColor="bg-blue-50"
                />
                <StatCard
                    icon={<Activity className="text-green-600" size={28} />}
                    label="Active Subscriptions"
                    value={stats.activeShops}
                    bgColor="bg-green-50"
                />
                <StatCard
                    icon={<Crown className="text-purple-600" size={28} />}
                    label="Enterprise Users"
                    value={stats.planDistribution.Enterprise}
                    bgColor="bg-purple-50"
                />
                <StatCard
                    icon={<Zap className="text-orange-600" size={28} />}
                    label="Free Users"
                    value={stats.planDistribution.Free}
                    bgColor="bg-orange-50"
                />
            </div>

            {/* Plan Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-stone-800 mb-4">Plan Distribution</h2>
                    <div className="space-y-4">
                        <PlanBar label="Free" count={stats.planDistribution.Free} total={stats.totalShops} color="bg-stone-400" />
                        <PlanBar label="Basic" count={stats.planDistribution.Basic} total={stats.totalShops} color="bg-green-500" />
                        <PlanBar label="Pro" count={stats.planDistribution.Pro} total={stats.totalShops} color="bg-blue-500" />
                        <PlanBar label="Enterprise" count={stats.planDistribution.Enterprise} total={stats.totalShops} color="bg-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-stone-800 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <QuickActionButton
                            icon={<Users size={18} />}
                            label="View All Shops"
                            href="/admin/shops"
                        />
                        <QuickActionButton
                            icon={<TrendingUp size={18} />}
                            label="Analytics Dashboard"
                            href="/admin/analytics"
                        />
                        <QuickActionButton
                            icon={<ShoppingBag size={18} />}
                            label="Platform Settings"
                            href="/admin/settings"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, bgColor }) {
    return (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-stone-500 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-stone-800">{value}</p>
                </div>
                <div className={`${bgColor} p-4 rounded-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function PlanBar({ label, count, total, color }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-stone-700">{label}</span>
                <span className="text-stone-500">{count} shops ({percentage.toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
                <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

function QuickActionButton({ icon, label, href }) {
    return (
        <a
            href={href}
            className="flex items-center gap-3 px-4 py-3 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors group"
        >
            <div className="text-orange-600 group-hover:text-orange-700">
                {icon}
            </div>
            <span className="font-medium text-stone-700 group-hover:text-stone-900">{label}</span>
        </a>
    );
}
