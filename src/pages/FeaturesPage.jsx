import React from 'react';
import LandingNav from '../components/LandingNav';
import LandingFooter from '../components/LandingFooter';
import {
    WifiOff, ChefHat, MessageCircle, BarChart3, Users,
    Smartphone, Printer, Shield, Zap, Coffee, Layers, Globe
} from 'lucide-react';

export default function FeaturesPage() {
    const features = [
        {
            id: 'pos',
            icon: <Smartphone className="w-8 h-8 text-orange-600" />,
            title: "Mobile-First POS",
            description: "Take orders directly from your phone or tablet. No expensive hardware required.",
            details: [
                "Works on any device (Android, iOS, Desktop)",
                "Intuitive touch interface",
                "Fast order processing",
                "Digital receipts"
            ]
        },
        {
            id: 'offline',
            icon: <WifiOff className="w-8 h-8 text-blue-600" />,
            title: "Offline Mode",
            description: "Never stop selling, even when the internet goes down. Data syncs automatically.",
            details: [
                "Continue taking orders offline",
                "Local data storage",
                "Auto-sync when online",
                "No data loss guarantee"
            ]
        },
        {
            id: 'kds',
            icon: <ChefHat className="w-8 h-8 text-green-600" />,
            title: "Kitchen Display System",
            description: "Streamline your kitchen operations with a dedicated display for chefs.",
            details: [
                "Real-time order updates",
                "Color-coded status (Pending, Preparing, Ready)",
                "Item-level tracking",
                "Reduce paper waste"
            ]
        },
        {
            id: 'whatsapp',
            icon: <MessageCircle className="w-8 h-8 text-green-500" />,
            title: "WhatsApp Integration",
            description: "Engage customers where they are. Send receipts and offers via WhatsApp.",
            details: [
                "Digital receipts via WhatsApp",
                "Automated order updates",
                "Marketing campaigns",
                "Customer feedback collection"
            ]
        },
        {
            id: 'analytics',
            icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
            title: "Advanced Analytics",
            description: "Make data-driven decisions with comprehensive sales reports and insights.",
            details: [
                "Sales trends & forecasting",
                "Best-selling items",
                "Peak hour analysis",
                "Staff performance tracking"
            ]
        },
        {
            id: 'inventory',
            icon: <Layers className="w-8 h-8 text-red-600" />,
            title: "Inventory Management",
            description: "Track stock levels in real-time and get low-stock alerts.",
            details: [
                "Ingredient-level tracking",
                "Low stock notifications",
                "Wastage tracking",
                "Supplier management"
            ]
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <LandingNav />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
                        Powerful Features for <br />
                        <span className="text-orange-600">Modern Chai Shops</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Everything you need to run your tea shop efficiently, from order taking to inventory management.
                    </p>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.id} id={feature.id} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {feature.description}
                                </p>
                                <ul className="space-y-3">
                                    {feature.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Choose Chai Corner POS?</h2>
                        <p className="text-slate-400">See how we compare to traditional POS systems.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="p-4 text-lg">Feature</th>
                                    <th className="p-4 text-lg text-orange-500 font-bold">Chai Corner POS</th>
                                    <th className="p-4 text-lg text-slate-400">Traditional POS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                <tr>
                                    <td className="p-4 font-medium">Setup Cost</td>
                                    <td className="p-4 text-green-400 font-bold">₹0 (Use your own device)</td>
                                    <td className="p-4 text-slate-400">₹50,000+ (Hardware)</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium">Offline Mode</td>
                                    <td className="p-4 text-green-400 font-bold">Yes, seamless sync</td>
                                    <td className="p-4 text-slate-400">Often requires internet</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium">Updates</td>
                                    <td className="p-4 text-green-400 font-bold">Free & Automatic</td>
                                    <td className="p-4 text-slate-400">Paid & Manual</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium">WhatsApp Receipts</td>
                                    <td className="p-4 text-green-400 font-bold">Built-in</td>
                                    <td className="p-4 text-slate-400">Not available</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium">Access</td>
                                    <td className="p-4 text-green-400 font-bold">Anywhere (Cloud)</td>
                                    <td className="p-4 text-slate-400">On-premise only</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
