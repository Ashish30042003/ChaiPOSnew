import React from 'react';
import LandingNav from '../components/LandingNav';
import LandingFooter from '../components/LandingFooter';
import FAQ from '../components/FAQ';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function ContactPage() {
    const faqs = [
        {
            question: "How fast is your support?",
            answer: "We typically respond within 2 hours during business hours (9 AM - 9 PM IST)."
        },
        {
            question: "Do you offer on-site setup?",
            answer: "Yes, for Enterprise plans in select cities, we offer on-site setup and training."
        },
        {
            question: "Can I request a custom feature?",
            answer: "Absolutely! We love feedback. You can submit feature requests directly from the app."
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <LandingNav />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you.
                    </p>
                </div>
            </section>

            <section className="py-20 -mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Contact Info */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg h-full">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Information</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Email Us</h3>
                                        <p className="text-slate-600">support@chaicorner.com</p>
                                        <p className="text-slate-600">sales@chaicorner.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Call Us</h3>
                                        <p className="text-slate-600">+91 98765 43210</p>
                                        <p className="text-sm text-slate-500">Mon-Sat, 9am to 9pm IST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg text-green-600">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">WhatsApp Support</h3>
                                        <p className="text-slate-600">+91 98765 43210</p>
                                        <p className="text-sm text-slate-500">Fastest response time</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Visit Us</h3>
                                        <p className="text-slate-600">
                                            123, Tech Park, Sector 5<br />
                                            Bangalore, Karnataka 560001
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                        <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" placeholder="Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                    <textarea rows="4" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" placeholder="How can we help you?"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-orange-200">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Common Questions</h2>
                    </div>
                    <FAQ items={faqs} />
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
