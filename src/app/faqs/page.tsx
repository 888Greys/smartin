import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FAQsPage() {
    const faqs = [
        {
            q: "How does SmartInvest work?",
            a: "SmartInvest is a platform that allows you to invest your funds and earn daily returns. Once you deposit via M-Pesa, your funds are active and begin generating a fixed percentage return every day."
        },
        {
            q: "What is the minimum deposit amount?",
            a: "You can start investing with as little as Ksh 500. There are various investment tiers depending on your financial goals."
        },
        {
            q: "How can I withdraw my earnings?",
            a: "Withdrawals are processed instantly to your registered M-Pesa number. You can request a withdrawal at any time from your dashboard."
        },
        {
            q: "Is my investment secure?",
            a: "We prioritize the security of your funds. Our platform uses enterprise-grade encryption and partners with regulated payment processors like Safaricom M-Pesa to ensure all transactions are safe."
        },
        {
            q: "Are there any hidden fees?",
            a: "No. We are fully transparent. SmartInvest does not charge deposit or withdrawal fees. Standard M-Pesa transaction rates may apply as determined by Safaricom."
        }
    ];

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
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-lg text-slate-600">Everything you need to know about the product and how it works.</p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{faq.q}</h3>
                            <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-blue-50 rounded-2xl p-8 border border-blue-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h2>
                    <p className="text-slate-600 mb-6">Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.</p>
                    <Link href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-sm shadow-blue-600/20 active:scale-[0.98]">
                        Contact Support
                    </Link>
                </div>
            </main>
        </div>
    );
}
