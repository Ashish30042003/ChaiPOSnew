import React from 'react';
import { Link } from 'react-router-dom';
import LandingNav from '../components/LandingNav';
import LandingFooter from '../components/LandingFooter';
import { Coffee, ArrowRight, Check, WifiOff, ChefHat, MessageCircle, PlayCircle, Star, Shield, Zap } from 'lucide-react';

export default function Landing() {
    const CheckIcon = ({ className }) => <Check className={className} size={16} />;
    const ArrowRightIcon = ({ className }) => <ArrowRight className={className} size={20} />;

    return (
        <div className="bg-slate-50 text-slate-900 min-h-screen font-sans overflow-x-hidden">
            <LandingNav />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/50 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8 animate-bounce shadow-sm">
                        <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span> Now with WhatsApp Receipts
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        Manage your <br />
                        <span className="gradient-text">Chai Business</span> like a Pro.
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        An offline-first POS designed for modern tea shops. Manage inventory, kitchen orders, and loyal customers—all from your browser.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/app" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
                            Start for Free <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:border-slate-300">
                            <PlayCircle className="w-5 h-5" /> Watch Demo
                        </button>
                    </div>

                    {/* Mockup Placeholder */}
                    <div className="mt-20 relative mx-auto max-w-5xl group perspective-1000">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
                            <img src="https://placehold.co/1200x600/f3f4f6/374151?text=CHAI+CORNER+POS+DASHBOARD" alt="App Screenshot" className="w-full h-auto opacity-90" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-10 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by 5,000+ Chai Shops across India</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos */}
                        <div className="text-xl font-bold text-slate-600">TeaPost</div>
                        <div className="text-xl font-bold text-slate-600">ChaiSuttaBar</div>
                        <div className="text-xl font-bold text-slate-600">MBA ChaiWala</div>
                        <div className="text-xl font-bold text-slate-600">Chaayos</div>
                        <div className="text-xl font-bold text-slate-600">ChaiPoint</div>
                    </div>
                </div>
            </section>

            {/* Features Preview */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Everything you need to run a Chai Shop</h2>
                        <p className="mt-4 text-slate-500 text-lg">From the first cup of the day to the final inventory count.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <WifiOff className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Offline First</h3>
                            <p className="text-slate-600 leading-relaxed">Internet down? No problem. Keep taking orders and printing receipts. Data syncs automatically when you're back online.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ChefHat className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Kitchen Display System</h3>
                            <p className="text-slate-600 leading-relaxed">Send orders directly to the kitchen tablet. Chefs can mark items as Preparing and Ready with a single tap.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">WhatsApp Integration</h3>
                            <p className="text-slate-600 leading-relaxed">Save paper and build loyalty. Send digital receipts and discount coupons directly to your customer's WhatsApp.</p>
                        </div>
                    </div>
                    <div className="mt-12 text-center">
                        <Link to="/features" className="text-orange-600 font-bold hover:text-orange-700 inline-flex items-center gap-2 group">
                            View all features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Loved by Chai Walas</h2>
                        <p className="mt-4 text-slate-500">Don't just take our word for it.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    <Star className="fill-current" size={16} />
                                    <Star className="fill-current" size={16} />
                                    <Star className="fill-current" size={16} />
                                    <Star className="fill-current" size={16} />
                                    <Star className="fill-current" size={16} />
                                </div>
                                <p className="text-slate-700 mb-6 italic">"This software changed my life. I used to spend hours calculating sales manually. Now it's all automatic!"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                    <div>
                                        <div className="font-bold text-slate-900">Rajesh Kumar</div>
                                        <div className="text-xs text-slate-500">Owner, Chai Point</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full filter blur-[128px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full filter blur-[128px] opacity-20"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-slate-400">Start for free, upgrade as you grow.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col">
                            <div className="mb-4"><h3 className="text-xl font-bold text-white">Free</h3></div>
                            <div className="mb-6"><span className="text-4xl font-bold">₹0</span><span className="text-slate-400">/forever</span></div>
                            <ul className="space-y-4 text-sm text-slate-300 flex-1 mb-8">
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-green-400" /> Basic POS</li>
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-green-400" /> Offline Mode</li>
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-green-400" /> 7-Day History</li>
                            </ul>
                            <Link to="/app" className="w-full block text-center bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold transition-colors">Start Now</Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-orange-600 rounded-2xl p-8 border border-orange-500 transform md:-translate-y-4 shadow-2xl flex flex-col relative">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-orange-900 text-xs font-bold px-3 py-1 rounded-bl-lg uppercase">Most Popular</div>
                            <div className="mb-4"><h3 className="text-xl font-bold text-white">Pro</h3></div>
                            <div className="mb-6"><span className="text-4xl font-bold">₹999</span><span className="text-orange-100">/month</span></div>
                            <ul className="space-y-4 text-sm text-white flex-1 mb-8">
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-white" /> Everything in Free</li>
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-white" /> Multi-Location</li>
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-white" /> Inventory Tracking</li>
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-white" /> Analytics Dashboard</li>
                            </ul>
                            <Link to="/app" className="w-full block text-center bg-white text-orange-600 hover:bg-orange-50 py-3 rounded-lg font-bold transition-colors">Go Pro</Link>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col">
                            <div className="mb-4"><h3 className="text-xl font-bold text-white">Enterprise</h3></div>
                            <div className="mb-6"><span className="text-4xl font-bold">₹2999</span><span className="text-slate-400">/month</span></div>
                            <ul className="space-y-4 text-sm text-slate-300 flex-1 mb-8">
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-purple-400" /> Everything in Pro</li>
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-purple-400" /> WhatsApp Integration</li>
                                <li className="flex gap-3"><CheckIcon className="w-5 h-5 text-purple-400" /> Loyalty Program</li>
                            </ul>
                            <Link to="/contact" className="w-full block text-center border border-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-bold transition-colors">Contact Sales</Link>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/pricing" className="text-slate-400 hover:text-white inline-flex items-center gap-2 transition-colors">
                            Compare all features <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-orange-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to upgrade your tea shop?</h2>
                    <p className="text-xl text-slate-600 mb-10">Join thousands of shop owners who trust Chai Corner POS to manage their daily sales.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/app" className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 transition-all hover:-translate-y-1">
                            Create Free Account
                        </Link>
                        <Link to="/contact" className="bg-white text-orange-600 border border-orange-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all hover:-translate-y-1">
                            Talk to Expert
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />

            {/* Inline CSS for the gradient text */}
            <style jsx="true">{`
            .gradient-text {
                background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .perspective-1000 {
                perspective: 1000px;
            }
        `}</style>
        </div>
    );
}