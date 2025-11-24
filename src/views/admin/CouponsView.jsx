import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Calendar, Tag } from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, appId } from '../../firebase/config';

export default function CouponsView() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'percentage', // percentage | flat
        value: '',
        validUntil: '',
        maxUses: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'artifacts', appId, 'coupons'));
            const couponsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCoupons(couponsList);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        if (!newCoupon.code || !newCoupon.value) return;

        try {
            const couponId = newCoupon.code.toUpperCase();
            const couponData = {
                code: couponId,
                discountType: newCoupon.discountType,
                value: parseFloat(newCoupon.value),
                validUntil: newCoupon.validUntil ? new Date(newCoupon.validUntil).toISOString() : null,
                maxUses: newCoupon.maxUses ? parseInt(newCoupon.maxUses) : null,
                usedCount: 0,
                createdAt: new Date().toISOString()
            };

            await setDoc(doc(db, 'artifacts', appId, 'coupons', couponId), couponData);

            setCoupons([...coupons, couponData]);
            setShowCreateModal(false);
            setNewCoupon({ code: '', discountType: 'percentage', value: '', validUntil: '', maxUses: '' });
            alert('Coupon created successfully!');
        } catch (error) {
            console.error("Error creating coupon:", error);
            alert("Failed to create coupon.");
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        if (!window.confirm(`Are you sure you want to delete coupon ${couponId}?`)) return;
        try {
            await deleteDoc(doc(db, 'artifacts', appId, 'coupons', couponId));
            setCoupons(coupons.filter(c => c.code !== couponId));
        } catch (error) {
            console.error("Error deleting coupon:", error);
            alert("Failed to delete coupon.");
        }
    };

    if (loading) return <div className="p-8 text-center text-stone-500">Loading coupons...</div>;

    return (
        <div className="p-8 bg-stone-50 min-h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                        <Ticket className="text-orange-600" />
                        Coupon Management
                    </h1>
                    <p className="text-stone-500">Create and manage discount codes</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Create Coupon
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <div key={coupon.code} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-orange-100 text-orange-800 font-mono font-bold px-3 py-1 rounded text-lg tracking-wider border border-orange-200">
                                {coupon.code}
                            </div>
                            <button
                                onClick={() => handleDeleteCoupon(coupon.code)}
                                className="text-stone-400 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-stone-600">
                            <div className="flex items-center gap-2">
                                <Tag size={16} className="text-stone-400" />
                                <span className="font-medium">
                                    {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                </span>
                            </div>
                            {coupon.validUntil && (
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-stone-400" />
                                    <span>Expires: {new Date(coupon.validUntil).toLocaleDateString()}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Ticket size={16} className="text-stone-400" />
                                <span>Used: {coupon.usedCount} {coupon.maxUses ? `/ ${coupon.maxUses}` : ''}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {coupons.length === 0 && (
                <div className="text-center py-12 text-stone-400 bg-white rounded-xl border border-dashed border-stone-300">
                    <Ticket size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No coupons created yet.</p>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-stone-100">
                            <h2 className="text-xl font-bold text-stone-800">Create New Coupon</h2>
                        </div>
                        <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Coupon Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-stone-300 rounded-lg px-3 py-2 uppercase font-mono"
                                    placeholder="e.g. SUMMER50"
                                    value={newCoupon.code}
                                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
                                    <select
                                        className="w-full border border-stone-300 rounded-lg px-3 py-2"
                                        value={newCoupon.discountType}
                                        onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="flat">Flat Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Value</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border border-stone-300 rounded-lg px-3 py-2"
                                        placeholder="e.g. 20"
                                        value={newCoupon.value}
                                        onChange={e => setNewCoupon({ ...newCoupon, value: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Valid Until (Optional)</label>
                                <input
                                    type="date"
                                    className="w-full border border-stone-300 rounded-lg px-3 py-2"
                                    value={newCoupon.validUntil}
                                    onChange={e => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Max Uses (Optional)</label>
                                <input
                                    type="number"
                                    className="w-full border border-stone-300 rounded-lg px-3 py-2"
                                    placeholder="e.g. 100"
                                    value={newCoupon.maxUses}
                                    onChange={e => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 bg-stone-100 text-stone-600 font-bold rounded-lg hover:bg-stone-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
                                >
                                    Create Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
