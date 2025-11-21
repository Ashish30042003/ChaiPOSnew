import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ShoppingCart, BarChart3, Users, Zap, Shield, Check, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const features = [
        {
            icon: <ShoppingCart className="w-6 h-6" />,
            title: "Smart POS System",
            description: "Lightning-fast checkout with real-time inventory tracking"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Analytics Dashboard",
            description: "Track sales, peak hours, and top-selling items"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Customer Loyalty",
            description: "Built-in loyalty points system to reward regulars"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Kitchen Display",
            description: "Real-time order tracking for kitchen staff"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure & Reliable",
            description: "Cloud-based with automatic backups"
        },
        {
            icon: <Coffee className="w-6 h-6" />,
            title: "Multi-Location",
            description: "Manage multiple branches from one account"
        }
    ];

    const plans = [
        {
            name: "Free",
            price: "₹0",
            period: "forever",
            features: ["Basic POS", "Up to 50 items", "1 Location", "Email Support"],
            cta: "Get Started",
            popular: false
        },
        {
            name: "Basic",
            price: "₹499",
            period: "per month",
            features: ["Everything in Free", "Unlimited Items", "Customer Loyalty", "Priority Support"],
            cta: "Start Free Trial",
            popular: false
        },
        {
            name: "Pro",
            price: "₹999",
            period: "per month",
            features: ["Everything in Basic", "Kitchen Display", "Analytics Dashboard", "3 Locations", "WhatsApp Integration"],
            cta: "Start Free Trial",
            popular: true
        },
        {
            name: "Enterprise",
            price: "₹1,999",
            period: "per month",
            features: ["Everything in Pro", "Unlimited Locations", "Custom Branding", "Dedicated Support", "API Access"],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Coffee className="w-8 h-8 text-orange-600" />
                            <span className="text-2xl font-bold text-orange-600">Chai Corner POS</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-stone-600 hover:text-orange-600 font-medium">
                                Sign In
                            </Link>
                            <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-orange-200 transition-all">
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-6">
                        Modern POS for Your
                        <span className="text-orange-600"> Chai Business</span>
                    </h1>
                    <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
                        Streamline your tea shop operations with our cloud-based POS system.
                        Manage inventory, track sales, and delight customers - all in one place.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-200 transition-all flex items-center gap-2">
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#pricing" className="bg-white hover:bg-stone-50 text-orange-600 px-8 py-4 rounded-xl font-bold text-lg border-2 border-orange-600 transition-all">
                            View Pricing
                        </a>
                    </div>
                </div>

                {/* Hero Image Placeholder */}
                <div className="mt-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 border border-orange-200 shadow-2xl">
                    <div className="aspect-video bg-white rounded-xl flex items-center justify-center">
                        <Coffee className="w-32 h-32 text-orange-300" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-stone-900 mb-4">Everything You Need</h2>
                        <p className="text-xl text-stone-600">Powerful features to run your chai business efficiently</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-orange-50 p-6 rounded-xl border border-orange-100 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 bg-orange-600 text-white rounded-lg flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">{feature.title}</h3>
                                <p className="text-stone-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-gradient-to-b from-white to-orange-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-stone-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-stone-600">Choose the plan that fits your business</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan, index) => (
                            <div key={index} className={`bg-white rounded-2xl p-8 border-2 ${plan.popular ? 'border-orange-600 shadow-2xl scale-105' : 'border-stone-200'} relative`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-orange-600">{plan.price}</span>
                                    <span className="text-stone-600">/{plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-stone-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/login" className={`block text-center py-3 rounded-lg font-bold transition-all ${plan.popular ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-100 hover:bg-orange-200 text-orange-600'}`}>
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-stone-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Coffee className="w-8 h-8 text-orange-600" />
                                <span className="text-xl font-bold">Chai Corner POS</span>
                            </div>
                            <p className="text-stone-400">Modern POS system for tea shops and cafes</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-stone-400">
                                <li><a href="#" className="hover:text-orange-600">Features</a></li>
                                <li><a href="#pricing" className="hover:text-orange-600">Pricing</a></li>
                                <li><a href="#" className="hover:text-orange-600">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-stone-400">
                                <li><a href="#" className="hover:text-orange-600">About</a></li>
                                <li><a href="#" className="hover:text-orange-600">Blog</a></li>
                                <li><a href="#" className="hover:text-orange-600">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-stone-400">
                                <li><a href="#" className="hover:text-orange-600">Privacy</a></li>
                                <li><a href="#" className="hover:text-orange-600">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-400">
                        <p>© 2025 Chai Corner POS. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
