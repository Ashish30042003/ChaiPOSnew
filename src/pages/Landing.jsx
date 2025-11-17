import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowRight, Check, WifiOff, ChefHat, MessageCircle, PlayCircle, Heart } from 'lucide-react';

export default function Landing() {
  const CheckIcon = ({ className }) => <Check className={className} size={16} />;
  const ArrowRightIcon = ({ className }) => <ArrowRight className={className} size={20} />;
  const CoffeeIcon = ({ className }) => <Coffee className={className} size={24} />;

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans overflow-x-hidden">
        
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-600 text-white p-1.5 rounded-lg">
                            <CoffeeIcon className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Chai Corner POS</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-orange-600 transition-colors">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/app" className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-orange-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>

        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8 animate-bounce">
                    <span className="w-2 h-2 bg-orange-600 rounded-full"></span> Now with WhatsApp Receipts
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                    Manage your <br />
                    <span className="gradient-text">Chai Business</span> like a Pro.
                </h1>
                <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    An offline-first POS designed for modern tea shops. Manage inventory, kitchen orders, and loyal customers—all from your browser.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/app" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2">
                        Start for Free <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                    <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        <PlayCircle className="w-5 h-5" /> Watch Demo
                    </button>
                </div>
                {/* Mockup Placeholder */}
                <div className="mt-20 relative mx-auto max-w-5xl">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-600 rounded-2xl blur opacity-30"></div>
                    <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                        <img src="https://placehold.co/1200x500/f3f4f6/374151?text=CHAI+CORNER+POS+DASHBOARD" alt="App Screenshot" className="w-full h-auto opacity-90"/>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900">Everything you need to run a Chai Shop</h2>
                    <p className="mt-4 text-slate-500">From the first cup of the day to the final inventory count.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                             <WifiOff className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Offline First</h3>
                        <p className="text-slate-600 leading-relaxed">Internet down? No problem. Keep taking orders and printing receipts. Data syncs automatically when you're back online.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                             <ChefHat className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Kitchen Display System</h3>
                        <p className="text-slate-600 leading-relaxed">Send orders directly to the kitchen tablet. Chefs can mark items as Preparing and Ready with a single tap.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                             <MessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">WhatsApp Integration</h3>
                        <p className="text-slate-600 leading-relaxed">Save paper and build loyalty. Send digital receipts and discount coupons directly to your customer's WhatsApp.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="pricing" className="py-24 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-slate-400">Choose the plan that fits your growth.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col">
                        <div className="mb-6"><h3 className="text-xl font-bold text-white">Free</h3><p className="text-sm text-slate-400 mt-1">Perfect for getting started</p></div>
                        <div className="mb-6"><span className="text-4xl font-bold">₹0</span><span className="text-slate-400">/forever</span></div>
                        <Link to="/app" className="w-full block text-center bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold transition-colors mb-8">Start Now</Link>
                        <ul className="space-y-3 text-sm text-slate-300 flex-1">
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-green-400" /> Basic POS</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-green-400" /> Receipt Printing</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-green-400" /> 7-Day History</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-green-400" /> Offline Mode</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-green-400" /> 5 MB Storage</li>
                        </ul>
                    </div>

                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col relative overflow-hidden">
                        <div className="mb-6"><h3 className="text-xl font-bold text-white">Basic</h3><p className="text-sm text-slate-400 mt-1">For growing businesses</p></div>
                        <div className="mb-6"><span className="text-4xl font-bold">₹299</span><span className="text-slate-400">/month</span></div>
                        <Link to="/app" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors mb-8">Choose Basic</Link>
                        <ul className="space-y-3 text-sm text-slate-300 flex-1">
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-blue-400" /> <strong>Everything in Free</strong></li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-blue-400" /> Cloud Sync</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-blue-400" /> Customer Mgmt</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-blue-400" /> Advanced Reports</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-blue-400" /> 100 MB Storage</li>
                        </ul>
                    </div>

                    <div className="bg-orange-600 rounded-2xl p-6 border border-orange-500 transform md:-translate-y-4 shadow-2xl flex flex-col relative">
                        <div className="absolute top-0 right-0 bg-yellow-400 text-orange-900 text-xs font-bold px-3 py-1 rounded-bl-lg uppercase">Most Popular</div>
                        <div className="mb-6"><h3 className="text-xl font-bold text-white">Pro</h3><p className="text-sm text-orange-100 mt-1">For established restaurants</p></div>
                        <div className="mb-6"><span className="text-4xl font-bold">₹999</span><span className="text-orange-100">/month</span></div>
                        <Link to="/app" className="w-full block text-center bg-white text-orange-600 hover:bg-orange-50 py-3 rounded-lg font-bold transition-colors mb-8">Go Pro</Link>
                        <ul className="space-y-3 text-sm text-white flex-1">
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-white" /> <strong>Everything in Basic</strong></li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-white" /> Multi-Location (up to 5)</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-white" /> Staff Management</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-white" /> Inventory Tracking</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-white" /> Analytics Dashboard</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-white" /> API Access</li>
                        </ul>
                    </div>

                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col">
                        <div className="mb-6"><h3 className="text-xl font-bold text-white">Premium</h3><p className="text-sm text-slate-400 mt-1">Enterprise-grade solution</p></div>
                        <div className="mb-6"><span className="text-4xl font-bold">₹2999</span><span className="text-slate-400">/month</span></div>
                        <Link to="/app" className="w-full block text-center border border-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-bold transition-colors mb-8">Contact Sales</Link>
                        <ul className="space-y-3 text-sm text-slate-300 flex-1">
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-purple-400" /> <strong>Everything in Pro</strong></li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-purple-400" /> Unlimited Locations</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-purple-400" /> Loyalty Program</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-purple-4D00" /> WhatsApp Integration</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-purple-400" /> Kitchen Display System</li>
                            <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-purple-400" /> White Label Option</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-24 bg-orange-50">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to upgrade your tea shop?</h2>
                <p className="text-xl text-slate-600 mb-10">Join 5,000+ tea shop owners who trust Chai Corner POS to manage their daily sales.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/app" className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 transition-all">
                        Create Free Account
                    </Link>
                    <button className="bg-white text-orange-600 border border-orange-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all">
                        Talk to Expert
                    </button>
                </div>
            </div>
        </section>

        <footer className="bg-white border-t border-slate-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                             <CoffeeIcon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg text-slate-900">Chai Corner POS</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        &copy; 2024 Chai Corner Systems. Made with <Heart className="w-3 h-3 inline text-red-500" /> in India.
                    </div>
                </div>
            </div>
        </footer>

        {/* Inline CSS for the gradient text */}
        <style jsx="true">{`
            .gradient-text {
                background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        `}</style>
    </div>
  );
}