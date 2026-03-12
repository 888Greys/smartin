import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
                <div className="mb-12 border-b border-slate-200 pb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Terms & Conditions</h1>
                    <p className="text-slate-500 font-medium">Last updated: March 11, 2026</p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Welcome to SmartInvest. By accessing our platform and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            These terms govern your use of the application, investments made through the platform, and the relationship between you and SmartInvest.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Eligibility</h2>
                        <ul className="list-disc pl-6 text-slate-600 leading-relaxed space-y-2">
                            <li>You must be at least 18 years of age to use our services.</li>
                            <li>You must be a resident of Kenya with a valid Safaricom M-Pesa registered number.</li>
                            <li>You must provide accurate and complete information during the registration process.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Investment & Returns</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            SmartInvest offers fixed daily returns based on the amount deposited. The returns displayed on the platform are estimates based on historical data and current market conditions.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            While we strive to provide consistent returns, all investments carry a degree of risk. By using this platform, you acknowledge that you are investing at your own risk.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Deposits and Withdrawals</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            All deposits and withdrawals are processed exclusively through Safaricom M-Pesa. Standard transaction limits and fees imposed by Safaricom may apply. SmartInvest aims to process withdrawals instantly, but delays may occur due to network issues or routine security checks.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Account Security</h2>
                        <p className="text-slate-600 leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account credentials (including your phone number, password, and OTPs). SmartInvest will not be liable for any losses resulting from unauthorized access to your account if you have shared your credentials.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Information</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions or concerns regarding these Terms and Conditions, please reach out to us at <a href="mailto:legal@smartinvest.co.ke" className="text-blue-600 hover:underline">legal@smartinvest.co.ke</a>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
