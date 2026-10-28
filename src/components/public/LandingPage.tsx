import React, { useState } from 'react';
import { RatesCalculator } from './RatesCalculator';
import {
  ShieldCheck,
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  Smartphone,
  ChevronDown,
  Building,
  Zap,
  Globe,
  Wallet,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAccount: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAccount, onOpenLogin }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Is my money protected by FDIC insurance at Apex Bank?',
      a: 'Yes. All deposits held at Apex Bank are insured up to $250,000 per depositor for each account ownership category through our Member FDIC charter. For high-net-worth clients, our Apex Insured Cash Sweep provides up to $5,000,000 in extended FDIC protection.',
    },
    {
      q: 'How does Apex offer a 4.85% APY when traditional banks offer 0.01%?',
      a: 'Unlike legacy physical institutions burdened with sprawling branch real estate and outdated mainframe infrastructure, Apex operates a high-efficiency digital-first banking architecture and passes those operational savings directly back to account holders in the form of premier yields.',
    },
    {
      q: 'Are there any hidden monthly service charges or minimum balance penalties?',
      a: 'None. Apex Premier Checking and Apex High-Yield Reserve carry $0.00 monthly maintenance fees and $0.00 minimum balance requirements. We believe your hard-earned money should stay yours.',
    },
    {
      q: 'How quickly do funds clear when using Mobile Check Deposit or Transfers?',
      a: 'Remote mobile check deposits up to $5,000 clear instantly for verified private clients. Wire transfers and Apex Pay P2P transfers settle in seconds over the FedNow and RTP network rails.',
    },
    {
      q: 'What is the Apex Obsidian Cash Visa Signature card?',
      a: 'The Obsidian card is our premier brushed metal credit card featuring an unconditional 2% cash back on all eligible everyday purchases, $0 annual fee, luxury concierge, and built-in virtual card tokenization for complete digital checkout protection.',
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background ambient mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FDIC Insured Charter · 4.85% APY High-Yield</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                Digital banking engineered for high-performance capital.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience fee-free checking, high-yield reserve accounts compounding daily, instant FedNow wire transfers, and the precision Obsidian metal card.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onOpenAccount}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Open An Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={onOpenLogin}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Access Demo Banking Vault</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>$0 Monthly Maintenance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Member FDIC Insured</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Instant Approval</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Card & Live Balance Visualizer */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                
                {/* Visual Glassmorphic Obsidian Card Preview */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">Apex Obsidian Card</p>
                      <p className="text-sm font-bold text-white tracking-wide">Visa Signature® Metal</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2L2 19h20L12 2zm0 4.5l6.5 11h-13L12 6.5z" />
                      </svg>
                    </div>
                  </div>

                  {/* Card Chip & Contactless */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-7 rounded bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                      <div className="w-6 h-4 border border-amber-400/60 rounded-sm" />
                    </div>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>

                  <p className="font-mono text-lg text-slate-200 tracking-widest mb-4">
                    4128 ···· ···· 4821
                  </p>

                  <div className="flex justify-between items-end text-xs font-mono">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Cardholder</p>
                      <p className="text-white font-semibold">SARAH M. VANCE</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase">Expires</p>
                      <p className="text-slate-300">09/29</p>
                    </div>
                  </div>
                </div>

                {/* Floating Activity Confirmation Badge */}
                <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      +$
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">4.85% APY Compounded</p>
                      <p className="text-[11px] text-slate-400">Monthly Interest Credited</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                    +$211.45
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4-Column KPI Trust Strip */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">FDIC Coverage</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">$250,000</p>
              <p className="text-[11px] text-slate-400">Full federal insurance backing</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">High-Yield APY</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">4.85%</p>
              <p className="text-[11px] text-slate-400">Over 10x national average</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Monthly Service Fee</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">$0.00</p>
              <p className="text-[11px] text-slate-400">No minimum balances ever</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Transfer Velocity</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">Instant</p>
              <p className="text-[11px] text-slate-400">FedNow & RTP instant wires</p>
            </div>
          </div>
        </div>
      </section>

      {/* Account Tier Grid */}
      <section id="accounts-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
            Tailored Financial Products
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
            Complete account architecture for every financial need.
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Engineered with zero hidden fees and enterprise security from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Premier Checking */}
          <div className="p-7 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Apex Premier Checking</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                The everyday account for smart spending. Includes worldwide ATM fee rebates and real-time fraud monitoring.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>$0 Monthly maintenance fee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited domestic ATM fee reimbursements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant mobile check deposit up to $50,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Contactless Platinum Debit Card included</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAccount}
              className="mt-8 w-full py-2.5 px-4 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white uppercase tracking-wider transition-colors"
            >
              Open Checking
            </button>
          </div>

          {/* Card 2: High Yield Savings (Featured) */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/50 shadow-xl shadow-emerald-950/20 relative flex flex-col justify-between">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider rounded-full">
              4.85% APY
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">High-Yield Reserve</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Accelerate your liquid reserves. Compounded daily and credited monthly with zero lock-in restrictions.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>4.85% APY</strong> effective rate on all balances</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No minimum deposit to earn maximum yield</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited electronic internal transfers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>FDIC insured up to $250,000 guarantee</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAccount}
              className="mt-8 w-full py-2.5 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Open High-Yield Reserve
            </button>
          </div>

          {/* Card 3: Obsidian Metal Credit */}
          <div className="p-7 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Apex Obsidian Cash Visa</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Precision-milled heavy metal card crafted for simplicity: unlimited 2% cash back flat on every purchase.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>2% Unlimited Cash Back</strong> on all categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>$0 Annual Fee and $0 Foreign Transaction Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant digital virtual cards with custom caps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Exclusive Visa Signature luxury travel benefits</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAccount}
              className="mt-8 w-full py-2.5 px-4 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white uppercase tracking-wider transition-colors"
            >
              Apply for Obsidian
            </button>
          </div>

        </div>
      </section>

      {/* Interactive Yield Calculator */}
      <RatesCalculator onOpenAccount={onOpenAccount} />

      {/* Security Shield & Technology Section */}
      <section id="security-guarantee" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Institutional Grade Protection
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Security that works around the clock so you don&apos;t have to.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every connection to Apex Bank is secured with hardware-level biometric validation, real-time threat telemetry, and an ironclad Zero Liability guarantee against unauthorized transactions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">256-Bit AES Encryption</h3>
                <p className="text-xs text-slate-400">End-to-end cryptographic vaults safeguarding data and transactions.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Zero Fraud Liability</h3>
                <p className="text-xs text-slate-400">You are 100% protected against verified fraudulent charges or stolen cards.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Card Lock & Virtual Cards</h3>
                <p className="text-xs text-slate-400">Freeze or generate burner digital cards with custom limits in one tap.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <Building className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Member FDIC Protection</h3>
                <p className="text-xs text-slate-400">Deposits backed by the full faith of the United States Government.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Security Activity Live Stream</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>2FA Hardware Authentication</span>
                </div>
                <span className="text-emerald-400 font-semibold">Active & Enforced</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Real-Time Fraud Prober</span>
                </div>
                <span className="text-slate-400">0 Alerts Today</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>FedNow Wire Settlement</span>
                </div>
                <span className="text-slate-400">Sub-Second Verified</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              Routing Number: <strong className="text-white font-mono">021000089</strong> · Federal Reserve Direct Access Bank
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="support-faq" className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Clear & Transparent
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to experience modern digital banking?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Open an Apex Premier Checking or High-Yield Reserve account in less than 3 minutes.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenAccount}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20"
              >
                Open an Account
              </button>
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-colors"
              >
                Sign In to Vault
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
