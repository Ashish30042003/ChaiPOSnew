import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingNav from '../components/LandingNav';
import LandingFooter from '../components/LandingFooter';
import FAQ from '../components/FAQ';
import { Check, X, HelpCircle } from 'lucide-react';

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: "Free",
            price: 0,
            description: "Perfect for new tea stalls just getting started.",
            features: [
                "Basic POS",
                "Receipt Printing",
                "7-Day Sales History",
                "Offline Mode",
                "5 MB Storage",
                "Single User"
            ],
            notIncluded: [
                "Cloud Sync",
                "Inventory Management",
                "WhatsApp Receipts",
                "Analytics"
            ],
            cta: "Start for Free",
            ctaLink: "/app",
            highlight: false
        },
        {
            name: "Basic",
            price: isAnnual ? 249 : 299,
            description: "For growing shops needing data backup.",
            features: [
                "Everything in Free",
                "Cloud Sync & Backup",
                "Customer Management",
                "Advanced Reports",
                "100 MB Storage",
                "Email Support"
            ],
            notIncluded: [
                "Multi-Location",
                "Staff Management",
                "WhatsApp Receipts",
                "Kitchen Display"
            ],
            cta: "Choose Basic",
            ctaLink: "/app",
            highlight: false
        },
        {
            name: "Pro",
            price: isAnnual ? 899 : 999,
            description: "For established restaurants and cafes.",
            features: [
                "Everything in Basic",
                "Multi-Location (up to 5)",
                "Staff Management",
                "Inventory Tracking",
                "Analytics Dashboard",
                "Priority Support"
            ],
            notIncluded: [
                "WhatsApp Integration",
                "Loyalty Program",
                "White Labeling"
            ],
            cta: "Go Pro",
            ctaLink: "/app",
            highlight: true
        },
        {
            name: "Enterprise",
            price: isAnnual ? 2499 : 2999,
            description: "Complete solution for chains and franchises.",
            features: [
                "Everything in Pro",
                "Unlimited Locations",
                "Loyalty Program",
                "WhatsApp Integration",
                "Kitchen Display System",
                "White Label Option",
                "Dedicated Account Manager"
            ],
            notIncluded: [],
            cta: "Contact Sales",
            ctaLink: "/contact",
            highlight: false
        }
    ];

    const faqs = [
        {
            question: "Can I switch plans later?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
        },
        {
            question: "Is there a free trial for paid plans?",
            answer: "We offer a 14-day free trial for Pro and Enterprise plans so you can experience all features risk-free."
        },
        {
            question: "Do I need to buy hardware?",
            answer: "No! Chai Corner POS works on any device with a web browser - your existing phone, tablet, or laptop works perfectly."
        },
        {
            question: "What happens to my data if I stop paying?",
            answer: "We keep your data safe for 90 days after cancellation. You can export your data at any time."
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <LandingNav />

            {/* Header */}
            <section className="pt-32 pb-20 bg-slate-900 text-white text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Choose the plan that fits your growth. No hidden fees.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-14 h-8 bg-orange-600 rounded-full p-1 transition-colors relative"
                        >
                            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-6' : ''}`}></div>
                        </button>
                        <span className={`text-sm font-bold ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
                            Annual <span className="text-green-400 text-xs ml-1">(Save 20%)</span>
                        </span>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 -mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`
                  rounded-2xl p-6 flex flex-col relative
                  ${plan.highlight
                                        ? 'bg-white border-2 border-orange-500 shadow-2xl transform md:-translate-y-4 z-10'
                                        : 'bg-white border border-slate-200 shadow-lg'
                                    }
                `}
                            >
                                {plan.highlight && (
                                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1 h-10">{plan.description}</p>
                                </div>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-slate-900">₹{plan.price}</span>
                                    <span className="text-slate-500">/mo</span>
                                    {isAnnual && plan.price > 0 && (
                                        <div className="text-xs text-green-600 font-bold mt-1">Billed annually</div>
                                    )}
                                </div>

                                <Link
                                    to={plan.ctaLink}
                                    className={`
                    w-full block text-center py-3 rounded-lg font-bold transition-colors mb-8
                    ${plan.highlight
                                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                        }
                  `}
                                >
                                    {plan.cta}
                                </Link>

                                <div className="space-y-4 flex-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features</p>
                                    <ul className="space-y-3 text-sm">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex gap-2 text-slate-700">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                        {plan.notIncluded.map((feature, idx) => (
                                            <li key={idx} className="flex gap-2 text-slate-400">
                                                <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-slate-500">Have questions? We're here to help.</p>
                    </div>
                    <FAQ items={faqs} />
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
