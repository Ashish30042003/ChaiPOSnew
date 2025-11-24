import React from 'react';
import LandingNav from '../components/LandingNav';
import LandingFooter from '../components/LandingFooter';
import { Coffee, Heart, Users, Globe, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <LandingNav />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
                        Brewing Success for <br />
                        <span className="text-orange-600">Chai Entrepreneurs</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        We're on a mission to digitize India's favorite beverage industry, one cup at a time.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-orange-100 rounded-2xl transform -rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Chai Shop"
                                className="relative rounded-2xl shadow-xl w-full h-auto"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    It started with a simple observation: while the world was moving towards digital payments and automated systems, our favorite local chai shops were still struggling with pen and paper.
                                </p>
                                <p>
                                    We realized that technology shouldn't be complicated or expensive. It should be as simple and comforting as a hot cup of masala chai.
                                </p>
                                <p>
                                    Chai Corner POS was born from this vision - to build a tool that empowers tea shop owners to manage their business efficiently, without losing the personal touch that makes them special.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-orange-500 mb-2">5,000+</div>
                            <div className="text-slate-400">Shops Empowered</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-500 mb-2">1M+</div>
                            <div className="text-slate-400">Daily Orders</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-500 mb-2">₹50Cr+</div>
                            <div className="text-slate-400">Transactions Processed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-500 mb-2">99.9%</div>
                            <div className="text-slate-400">Uptime</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
                        <p className="text-slate-500">What drives us every day.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Customer First</h3>
                            <p className="text-slate-600">We build what you need, not what we think is cool. Your feedback shapes our product.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Simplicity</h3>
                            <p className="text-slate-600">Technology should be invisible. We design for speed and ease of use.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Community</h3>
                            <p className="text-slate-600">We're building a community of successful entrepreneurs who support each other.</p>
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
