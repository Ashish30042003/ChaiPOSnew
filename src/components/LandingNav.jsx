import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Menu, X, ArrowRight } from 'lucide-react';

export default function LandingNav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-orange-600 text-white p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Coffee size={24} />
                        </div>
                        <span className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                            Chai Corner POS
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-orange-600 ${isActive(link.path) ? 'text-orange-600' : 'text-slate-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">
                            Log In
                        </Link>
                        <Link
                            to="/app"
                            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 flex items-center gap-2 group"
                        >
                            Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-slate-600 hover:text-orange-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-base font-medium py-2 px-4 rounded-lg ${isActive(link.path) ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-px bg-slate-100 my-2"></div>
                    <Link
                        to="/login"
                        className="text-center py-2 text-slate-600 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Log In
                    </Link>
                    <Link
                        to="/app"
                        className="bg-orange-600 text-white py-3 rounded-lg font-bold text-center shadow-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Get Started Free
                    </Link>
                </div>
            )}
        </nav>
    );
}
