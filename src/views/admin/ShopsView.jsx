import React, { useState, useEffect } from 'react';
import {
    Users, TrendingUp, DollarSign, Activity,
    Search, Filter, Download, Shield
} from 'lucide-react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, appId } from '../../firebase/config';

export default function ShopsView({ user }) {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalShops: 0,
        totalRevenue: 0, // Placeholder for now
        activeToday: 0,
        planDistribution: { Free: 0, Basic: 0, Pro: 0, Enterprise: 0 }
    });

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            setLoading(true);
            console.log('ShopsView: Fetching from path:', 'artifacts', appId, 'users');

            const usersRef = collection(db, 'artifacts', appId, 'users');
            const snapshot = await getDocs(usersRef);

            console.log('ShopsView: Found', snapshot.size, 'users');

            const shopList = [];
            const newStats = {
                totalShops: 0,
                totalRevenue: 0,
                activeToday: 0,
                planDistribution: { Free: 0, Basic: 0, Pro: 0, Enterprise: 0 }
            };

            for (const doc of snapshot.docs) {
                console.log('ShopsView: Processing user', doc.id);

                const settingsSnap = await getDocs(collection(db, 'artifacts', appId, 'users', doc.id, 'settings'));
                let config = { name: 'Unknown Shop', plan: 'Free' };

                settingsSnap.forEach(s => {
                    if (s.id === 'config') {
                        config = s.data();
                        console.log('ShopsView: Config for', doc.id, ':', config);
                    }
                });

                const shopData = {
                    id: doc.id,
                    email: doc.data().email || 'No Email',
                    ...config
                };

                shopList.push(shopData);

                // Update Stats
                newStats.totalShops++;
                if (newStats.planDistribution[config.plan] !== undefined) {
                    newStats.planDistribution[config.plan]++;
                } else {
                    newStats.planDistribution['Free'] = (newStats.planDistribution['Free'] || 0) + 1;
                }
            }

            console.log('ShopsView: Final shop list:', shopList);
            console.log('ShopsView: Final stats:', newStats);

            setShops(shopList);
            setStats(newStats);

        } catch (error) {
            console.error("ShopsView: Error fetching shops:", error);
            alert("Failed to load shop data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (shopId, currentStatus) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'activate' : 'suspend'} this shop?`)) return;

        try {
            const settingsRef = doc(db, 'artifacts', appId, 'users', shopId, 'settings', 'config');
            await setDoc(settingsRef, { suspended: !currentStatus }, { merge: true });
            alert(`Shop ${currentStatus ? 'activated' : 'suspended'} successfully`);
            fetchShops();
        } catch (error) {
            console.error("Error updating shop status:", error);
            alert("Failed to update shop status");
        }
    };

    const handleDelete = async (shopId) => {
        if (!confirm("Are you sure you want to DELETE this shop? This action cannot be undone easily.")) return;

        try {
            const settingsRef = doc(db, 'artifacts', appId, 'users', shopId, 'settings', 'config');
            await setDoc(settingsRef, { deleted: true }, { merge: true });
            alert("Shop marked as deleted");
            fetchShops();
        } catch (error) {
            console.error("Error deleting shop:", error);
            alert("Failed to delete shop");
        }
    };

    const handleViewDetails = (shop) => {
        alert(`Shop Details:\nName: ${shop.name}\nID: ${shop.id}\nEmail: ${shop.email}\nPlan: ${shop.plan}\nPhone: ${shop.phone || 'N/A'}\nAddress: ${shop.address || 'N/A'}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-stone-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading Platform Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-stone-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                        <Shield className="text-orange-600" />
                        Super Admin Dashboard
                    </h1>
                    <p className="text-stone-500">Platform Overview & Shop Management</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchShops}
                        className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                <StatCard
                    icon={<Users className="text-blue-500" />}
                    label="Total Shops"
                    value={stats.totalShops}
                    color="blue"
                />
                <StatCard
                    icon={<Activity className="text-green-500" />}
                    label="Active Plans"
                    value={stats.totalShops - stats.planDistribution.Free}
                    color="green"
                />
                <StatCard
                    icon={<TrendingUp className="text-purple-500" />}
                    label="Enterprise Users"
                    value={stats.planDistribution.Enterprise}
                    color="purple"
                />
                <StatCard
                    icon={<DollarSign className="text-orange-500" />}
                    label="Free Users"
                    value={stats.planDistribution.Free}
                    color="orange"
                />
            </div>

            {/* Shop List */}
            <div className="flex-1 overflow-auto px-6 pb-6">
                <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                        <h2 className="font-semibold text-stone-700">Registered Shops</h2>
                        <div className="flex gap-2">
                            {/* Search placeholder */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search shops..."
                                    className="pl-9 pr-4 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 text-stone-500 text-sm border-b border-stone-200">
                                <th className="p-4 font-medium">Shop Name</th>
                                <th className="p-4 font-medium">Owner ID</th>
                                <th className="p-4 font-medium">Current Plan</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {shops.map((shop) => (
                                <tr key={shop.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-stone-800">{shop.name}</div>
                                        <div className="text-xs text-stone-400">{shop.id}</div>
                                    </td>
                                    <td className="p-4 text-stone-600 font-mono text-xs">
                                        {shop.id}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${shop.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                                                shop.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                                                    shop.plan === 'Basic' ? 'bg-green-100 text-green-700' :
                                                        'bg-stone-100 text-stone-600'
                                            }
                    `}>
                                            {shop.plan}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1 text-sm ${shop.suspended ? 'text-red-600' : 'text-green-600'}`}>
                                            <div className={`w-2 h-2 rounded-full ${shop.suspended ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                            {shop.suspended ? 'Suspended' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleViewDetails(shop)}
                                                className="text-stone-400 hover:text-stone-600 p-1"
                                                title="View Details"
                                            >
                                                <Search size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleSuspend(shop.id, shop.suspended)}
                                                className={`${shop.suspended ? 'text-green-400 hover:text-green-600' : 'text-orange-400 hover:text-orange-600'} p-1`}
                                                title={shop.suspended ? "Activate" : "Suspend"}
                                            >
                                                <Activity size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(shop.id)}
                                                className="text-red-400 hover:text-red-600 p-1"
                                                title="Delete"
                                            >
                                                <Users size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-${color}-50`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-stone-500">{label}</p>
                <p className="text-2xl font-bold text-stone-800">{value}</p>
            </div>
        </div>
    );
}
