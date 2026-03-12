import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
                        <ArrowLeft size={18} />
                        <span>Back to Home</span>
                    </Link>
                    <span className="font-bold text-lg text-slate-900 tracking-tight">SMARTINVEST</span>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Contact Us</h1>
                    <p className="text-lg text-slate-600">We&apos;re here to help. Get in touch with our support team.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-full">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Email Support</h3>
                                <p className="text-slate-600 text-sm mb-2">Our team typically responds within 24 hours.</p>
                                <a href="mailto:support@smartinvest.co.ke" className="text-blue-600 font-medium hover:underline">
                                    support@smartinvest.co.ke
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Phone Support</h3>
                                <p className="text-slate-600 text-sm mb-2">Available Mon-Fri, 9am - 5pm EAT.</p>
                                <a href="tel:+254700000000" className="text-blue-600 font-medium hover:underline">
                                    +254 700 000 000
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                            <div className="bg-violet-50 text-violet-600 p-3 rounded-full">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Office Location</h3>
                                <p className="text-slate-600 text-sm">
                                    Nairobi, Kenya<br />
                                    Westlands Business District
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Send a Message</h2>
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-400 font-medium text-slate-800" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-400 font-medium text-slate-800" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-400 font-medium text-slate-800 resize-none" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md shadow-blue-600/20 active:scale-[0.98]">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
