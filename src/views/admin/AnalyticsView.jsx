import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db, appId } from '../../firebase/config';

export default function AnalyticsView() {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month'); // week, month, year
    const [data, setData] = useState({
        revenue: [],
        users: [],
        topPlans: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        // Simulate fetching analytics data
        // In a real app, this would aggregate data from a 'transactions' or 'analytics' collection

        // Mock data for demonstration
        setTimeout(() => {
            const mockRevenue = [
                { label: 'Jan', value: 12000 },
                { label: 'Feb', value: 15000 },
                { label: 'Mar', value: 18000 },
                { label: 'Apr', value: 22000 },
                { label: 'May', value: 25000 },
                { label: 'Jun', value: 28000 },
            ];

            const mockUsers = [
                { label: 'Jan', value: 50 },
                { label: 'Feb', value: 65 },
                { label: 'Mar', value: 80 },
                { label: 'Apr', value: 95 },
                { label: 'May', value: 120 },
                { label: 'Jun', value: 150 },
            ];

            setData({
                revenue: mockRevenue,
                users: mockUsers,
                topPlans: [
                    { name: 'Pro', count: 45, color: 'bg-orange-500' },
                    { name: 'Basic', count: 30, color: 'bg-blue-500' },
                    { name: 'Enterprise', count: 15, color: 'bg-purple-500' },
                    { name: 'Free', count: 60, color: 'bg-stone-400' },
                ]
            });
            setLoading(false);
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-stone-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading Analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-stone-50 min-h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                        <BarChart3 className="text-orange-600" />
                        Platform Analytics
                    </h1>
                    <p className="text-stone-500">Revenue and growth insights</p>
                </div>
                <div className="flex bg-white rounded-lg border border-stone-200 p-1">
                    {['week', 'month', 'year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${timeRange === range
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'text-stone-600 hover:bg-stone-50'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard
                    title="Total Revenue"
                    value="₹1,20,000"
                    change="+12%"
                    icon={<DollarSign className="text-green-600" />}
                    trend="up"
                />
                <MetricCard
                    title="New Shops"
                    value="24"
                    change="+5%"
                    icon={<Users className="text-blue-600" />}
                    trend="up"
                />
                <MetricCard
                    title="Active Subscriptions"
                    value="85"
                    change="+8%"
                    icon={<TrendingUp className="text-purple-600" />}
                    trend="up"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <h3 className="text-lg font-bold text-stone-800 mb-6">Revenue Growth</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {data.revenue.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                <div className="w-full bg-orange-100 rounded-t-lg relative h-full flex items-end overflow-hidden group-hover:bg-orange-200 transition-colors">
                                    <div
                                        className="w-full bg-orange-500 rounded-t-lg transition-all duration-1000"
                                        style={{ height: `${(item.value / 30000) * 100}%` }}
                                    ></div>
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        ₹{item.value.toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-xs text-stone-500 font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <h3 className="text-lg font-bold text-stone-800 mb-6">User Acquisition</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {data.users.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                <div className="w-full bg-blue-100 rounded-t-lg relative h-full flex items-end overflow-hidden group-hover:bg-blue-200 transition-colors">
                                    <div
                                        className="w-full bg-blue-500 rounded-t-lg transition-all duration-1000"
                                        style={{ height: `${(item.value / 200) * 100}%` }}
                                    ></div>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {item.value} Users
                                    </div>
                                </div>
                                <span className="text-xs text-stone-500 font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Plan Distribution */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="text-lg font-bold text-stone-800 mb-6">Subscription Distribution</h3>
                <div className="space-y-4">
                    {data.topPlans.map((plan) => (
                        <div key={plan.name}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-stone-700">{plan.name}</span>
                                <span className="text-stone-500">{plan.count} users</span>
                            </div>
                            <div className="w-full bg-stone-100 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full ${plan.color}`}
                                    style={{ width: `${(plan.count / 150) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, change, icon, trend }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-stone-50 rounded-lg">
                    {icon}
                </div>
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {change}
                </span>
            </div>
            <h3 className="text-stone-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-stone-800">{value}</p>
        </div>
    );
}
