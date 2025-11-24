import React from 'react';
import { TrendingUp, Package, ShoppingCart, AlertTriangle, Plus, Settings, Users, BarChart3 } from 'lucide-react';
import Button from '../components/Button';

const DashboardView = ({
    storeSettings = { name: 'Your Shop', currency: '₹' },
    salesHistory = [],
    menu = [],
    activeOrders = [],
    currentPlan = 'Free',
    setActiveTab = () => { },
    setSettingsTab = () => { },
    themeColor = 'orange'
}) => {
    // Calculate today's sales
    const today = new Date().toDateString();
    const todaySales = (salesHistory || [])
        .filter(s => new Date(s.date).toDateString() === today)
        .reduce((sum, s) => sum + s.total, 0);

    // Calculate today's order count
    const todayOrders = (salesHistory || []).filter(s => new Date(s.date).toDateString() === today).length;

    // Find low stock items (stock < 5)
    const lowStockItems = (menu || []).filter(item => item.stock < 5);

    // Get recent orders (last 5)
    const recentOrders = (salesHistory || []).slice(0, 5);

    return (
        <div className="p-4 space-y-4 max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-stone-800">Welcome, {storeSettings.name}!</h1>
                <p className="text-sm text-stone-500">Here's what's happening with your shop today</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-stone-500 uppercase font-bold">Today's Sales</p>
                            <p className="text-2xl font-bold text-green-600">{storeSettings.currency}{todaySales}</p>
                            <p className="text-xs text-stone-400">{todayOrders} orders</p>
                        </div>
                        <div className={`p-3 rounded-full bg-green-100`}>
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-stone-500 uppercase font-bold">Active Orders</p>
                            <p className="text-2xl font-bold text-orange-600">{activeOrders.length}</p>
                            <p className="text-xs text-stone-400">Pending/Preparing</p>
                        </div>
                        <div className={`p-3 rounded-full bg-orange-100`}>
                            <ShoppingCart className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-stone-500 uppercase font-bold">Low Stock</p>
                            <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
                            <p className="text-xs text-stone-400">Items need restock</p>
                        </div>
                        <div className={`p-3 rounded-full bg-red-100`}>
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-lg font-bold text-stone-800 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => {
                            setActiveTab('settings');
                            setSettingsTab('menu');
                        }}
                        className="p-4 bg-stone-50 hover:bg-stone-100 rounded-lg flex flex-col items-center gap-2 transition-colors"
                    >
                        <Plus size={24} className="text-stone-600" />
                        <span className="text-sm font-medium text-stone-700">Add Item</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('settings');
                            setSettingsTab('menu');
                        }}
                        className="p-4 bg-stone-50 hover:bg-stone-100 rounded-lg flex flex-col items-center gap-2 transition-colors"
                    >
                        <Package size={24} className="text-stone-600" />
                        <span className="text-sm font-medium text-stone-700">Manage Menu</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('customers')}
                        className="p-4 bg-stone-50 hover:bg-stone-100 rounded-lg flex flex-col items-center gap-2 transition-colors"
                    >
                        <Users size={24} className="text-stone-600" />
                        <span className="text-sm font-medium text-stone-700">Customers</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('settings');
                            setSettingsTab('subscription');
                        }}
                        className="p-4 bg-stone-50 hover:bg-stone-100 rounded-lg flex flex-col items-center gap-2 transition-colors"
                    >
                        <Settings size={24} className="text-stone-600" />
                        <span className="text-sm font-medium text-stone-700">Settings</span>
                    </button>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-lg font-bold text-stone-800 mb-3">Recent Orders</h2>
                {recentOrders.length > 0 ? (
                    <div className="space-y-2">
                        {recentOrders.map(order => (
                            <div key={order.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-stone-800">Order #{order.id.slice(-4)}</p>
                                    <p className="text-xs text-stone-500">{new Date(order.date).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-stone-800">{storeSettings.currency}{order.total}</p>
                                    <p className={`text-xs ${order.status === 'served' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-stone-400 py-8">No orders yet today</p>
                )}
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 shadow-sm text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm opacity-90">Current Plan</p>
                        <p className="text-2xl font-bold">{currentPlan}</p>
                    </div>
                    <button
                        onClick={() => {
                            setActiveTab('settings');
                            setSettingsTab('subscription');
                        }}
                        className="px-4 py-2 bg-white text-orange-600 rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors"
                    >
                        Upgrade Plan
                    </button>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        Low Stock Alert
                    </h3>
                    <div className="space-y-1">
                        {lowStockItems.map(item => (
                            <p key={item.id} className="text-sm text-red-700">
                                {item.name} - Only {item.stock} left
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardView;
