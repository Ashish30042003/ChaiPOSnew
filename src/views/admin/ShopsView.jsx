import React, { useState, useEffect } from 'react';
import {
    Users, TrendingUp, DollarSign, Activity,
    Search, Filter, Download, Shield, MoreVertical, Ban, Trash2, CheckCircle, Store
} from 'lucide-react';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
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
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedShopForUpgrade, setSelectedShopForUpgrade] = useState(null);
    const [upgradeDetails, setUpgradeDetails] = useState({
        plan: 'Enterprise',
        durationDays: 30
    });

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        setLoading(true);
        try {
            console.log("Fetching shops...");
            const usersRef = collection(db, 'artifacts', appId, 'users');
            const snapshot = await getDocs(usersRef);

            const shopsData = await Promise.all(snapshot.docs.map(async (userDoc) => {
                const userData = userDoc.data();
                // Fetch settings/config for plan details
                const settingsRef = doc(db, 'artifacts', appId, 'users', userDoc.id, 'settings', 'config');
                const settingsSnap = await getDoc(settingsRef);
                const settings = settingsSnap.exists() ? settingsSnap.data() : {};

                return {
                    id: userDoc.id,
                    email: userData.email,
                    displayName: userData.displayName,
                    createdAt: userData.createdAt,
                    lastActive: userData.lastActive,
                    plan: settings.plan || 'Free',
                    planExpiresAt: settings.planExpiresAt,
                    suspended: settings.suspended || false,
                    deleted: settings.deleted || false
                };
            }));

            // Calculate stats
            const newStats = {
                totalShops: shopsData.length,
                totalRevenue: 0,
                activeToday: 0,
                planDistribution: { Free: 0, Basic: 0, Pro: 0, Enterprise: 0 }
            };

            shopsData.forEach(shop => {
                if (newStats.planDistribution[shop.plan] !== undefined) {
                    newStats.planDistribution[shop.plan]++;
                } else {
                    newStats.planDistribution['Free'] = (newStats.planDistribution['Free'] || 0) + 1;
                }
            });

            console.log("Shops fetched:", shopsData);
            setShops(shopsData.filter(s => !s.deleted));
            setStats(newStats);
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (shopId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unsuspend' : 'suspend'} this shop?`)) return;
        try {
            await setDoc(doc(db, 'artifacts', appId, 'users', shopId, 'settings', 'config'), {
                suspended: !currentStatus
            }, { merge: true });
            fetchShops();
        } catch (error) {
            console.error("Error updating suspension:", error);
            alert("Failed to update status");
        }
    };

    const handleDelete = async (shopId) => {
        if (!window.confirm("Are you sure you want to DELETE this shop? This cannot be undone easily.")) return;
        try {
            await setDoc(doc(db, 'artifacts', appId, 'users', shopId, 'settings', 'config'), {
                deleted: true
            }, { merge: true });
            setShops(shops.filter(s => s.id !== shopId));
        } catch (error) {
            console.error("Error deleting shop:", error);
            alert("Failed to delete shop");
        }
    };

    const openUpgradeModal = (shop) => {
        setSelectedShopForUpgrade(shop);
        setUpgradeDetails({ plan: shop.plan === 'Free' ? 'Enterprise' : shop.plan, durationDays: 30 });
        setShowUpgradeModal(true);
    };

    const handleManualUpgrade = async (e) => {
        e.preventDefault();
        if (!selectedShopForUpgrade) return;

        try {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + parseInt(upgradeDetails.durationDays));

            await setDoc(doc(db, 'artifacts', appId, 'users', selectedShopForUpgrade.id, 'settings', 'config'), {
                plan: upgradeDetails.plan,
                planExpiresAt: expiryDate.toISOString(),
                isTrial: false
            }, { merge: true });

            alert(`Successfully upgraded ${selectedShopForUpgrade.displayName} to ${upgradeDetails.plan}!`);
            setShowUpgradeModal(false);
            fetchShops();
        } catch (error) {
            console.error("Error upgrading shop:", error);
            alert("Failed to upgrade shop.");
        }
    };

    if (loading) return <div className="p-8 text-center text-stone-500">Loading shops...</div>;

    return (
        <div className="p-8 bg-stone-50 min-h-full">
            <h1 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <Store className="text-orange-600" />
                Shop Management
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-bold">
                            <th className="p-4">Shop Name</th>
                            <th className="p-4">Owner Email</th>
                            <th className="p-4">Plan</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-stone-100">
                        {shops.map(shop => (
                            <tr key={shop.id} className="hover:bg-stone-50 transition-colors">
                                <td className="p-4 font-medium text-stone-800">{shop.displayName || 'Unknown'}</td>
                                <td className="p-4 text-stone-600">{shop.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${shop.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                                            shop.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                                                'bg-stone-100 text-stone-600'
                                        }`}>
                                        {shop.plan}
                                    </span>
                                    {shop.planExpiresAt && (
                                        <div className="text-[10px] text-stone-400 mt-1">
                                            Exp: {new Date(shop.planExpiresAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4">
                                    {shop.suspended ? (
                                        <span className="text-red-600 font-bold flex items-center gap-1"><Ban size={12} /> Suspended</span>
                                    ) : (
                                        <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={12} /> Active</span>
                                    )}
                                </td>
                                <td className="p-4 text-stone-500">{new Date(shop.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => openUpgradeModal(shop)}
                                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                                        title="Upgrade / Manage Plan"
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleSuspend(shop.id, shop.suspended)}
                                        className={`${shop.suspended ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'} p-1.5 rounded transition-colors`}
                                        title={shop.suspended ? "Unsuspend" : "Suspend"}
                                    >
                                        <Ban size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(shop.id)}
                                        className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                                        title="Delete Shop"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Upgrade Modal */}
            {showUpgradeModal && selectedShopForUpgrade && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-stone-100">
                            <h2 className="text-xl font-bold text-stone-800">Manage Plan: {selectedShopForUpgrade.displayName}</h2>
                        </div>
                        <form onSubmit={handleManualUpgrade} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Select Plan</label>
                                <select
                                    className="w-full border border-stone-300 rounded-lg px-3 py-2"
                                    value={upgradeDetails.plan}
                                    onChange={e => setUpgradeDetails({ ...upgradeDetails, plan: e.target.value })}
                                    required
                                >
                                    <option value="Free">Free</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Pro">Pro</option>
                                    <option value="Enterprise">Enterprise</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Duration (Days)</label>
                                <input
                                    type="number"
                                    className="w-full border border-stone-300 rounded-lg px-3 py-2"
                                    value={upgradeDetails.durationDays}
                                    onChange={e => setUpgradeDetails({ ...upgradeDetails, durationDays: e.target.value })}
                                    required
                                    min="1"
                                />
                                <p className="text-xs text-stone-500 mt-1">
                                    New Expiry: {(() => {
                                        const d = new Date();
                                        d.setDate(d.getDate() + parseInt(upgradeDetails.durationDays || 0));
                                        return d.toLocaleDateString();
                                    })()}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="flex-1 px-4 py-2 bg-stone-100 text-stone-600 font-bold rounded-lg hover:bg-stone-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                >
                                    Update Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
