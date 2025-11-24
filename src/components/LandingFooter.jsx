import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Heart, Twitter, Instagram, Linkedin, Facebook, Mail } from 'lucide-react';

export default function LandingFooter() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-orange-600 text-white p-2 rounded-xl">
                                <Coffee size={24} />
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">Chai Corner POS</span>
                        </div>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            The all-in-one POS solution designed specifically for modern tea shops and cafes. Manage orders, inventory, and customers with ease.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-colors"><Twitter size={18} /></a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-colors"><Linkedin size={18} /></a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-colors"><Facebook size={18} /></a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><Link to="/features" className="hover:text-orange-500 transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
                            <li><Link to="/app" className="hover:text-orange-500 transition-colors">Live Demo</Link></li>
                            <li><Link to="/features#kds" className="hover:text-orange-500 transition-colors">Kitchen Display</Link></li>
                            <li><Link to="/features#whatsapp" className="hover:text-orange-500 transition-colors">WhatsApp Receipts</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Stay Updated</h3>
                        <p className="text-slate-400 mb-4">Get the latest updates and tea shop management tips.</p>
                        <form className="flex flex-col gap-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} Chai Corner Systems. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}
