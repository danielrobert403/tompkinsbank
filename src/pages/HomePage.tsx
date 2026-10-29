import React from 'react';
import { useBanking } from '../context/BankingContext';
import { TompkinsLogo } from '../components/TompkinsLogo';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Lock,
  Smartphone,
  DollarSign,
  ArrowRight,
  CreditCard,
  Building2,
  TrendingUp,
} from 'lucide-react';

interface HomePageProps {
  onOpenCreateAccount: () => void;
  onOpenLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenCreateAccount, onOpenLogin }) => {
  const { setActivePage, isLoggedIn, accounts, formatCurrency, transactions } = useBanking();
  const chkAcc = accounts.find((a) => a.type === 'checking') || accounts[0];
  const savAcc = accounts.find((a) => a.type === 'savings') || accounts[1];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      
      {/* =========================================================================
          HERO BANNER (Clean TompkinsBank.com Experience - Video Removed)
          ========================================================================= */}
      <section className="relative bg-[#004732] text-white overflow-hidden">
        {/* Background photo & forest canopy overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{ backgroundImage: `url('/assets/aistudio/image_360d8650.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#003B26] via-[#004732]/95 to-[#004732]/90" />

        <div className="max-w-[1360px] mx-auto px-6 sm:px-12 py-16 sm:py-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs border border-white/15">
              <span>Established 1836 · Celebrating 190 Years of Trust</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              With trust in your bank, <br className="hidden sm:inline" />
              <span className="text-[#E5A952]">amazing things happen.</span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-50/90 max-w-xl font-normal leading-relaxed">
              That's why after 190 years of earning your trust, we are Tompkins Bank &amp; Trust. Experience deep community roots paired with award-winning digital and personal banking.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setActivePage('my-account');
                  } else {
                    onOpenLogin();
                  }
                }}
                className="px-8 py-3.5 bg-[#C5832B] hover:bg-[#B37424] text-white font-bold text-sm rounded-md shadow-lg transition-all duration-150 tracking-wider uppercase hover:shadow-xl hover:scale-[1.02]"
              >
                {isLoggedIn ? 'Go to My Account' : 'Sign in to Banking'}
              </button>

              <button
                onClick={onOpenCreateAccount}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-md transition-colors flex items-center gap-2 border border-white/20 backdrop-blur-xs"
              >
                <span>Open an Account Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/15 max-w-lg text-xs text-emerald-100">
              <div>
                <p className="font-bold text-white text-base">1836</p>
                <p className="text-[11px] opacity-80">Founded in New York</p>
              </div>
              <div>
                <p className="font-bold text-white text-base">Member FDIC</p>
                <p className="text-[11px] opacity-80">Insured up to $250k</p>
              </div>
              <div>
                <p className="font-bold text-white text-base">24/7 Access</p>
                <p className="text-[11px] opacity-80">Digital &amp; Mobile Banking</p>
              </div>
            </div>
          </div>

          {/* Right Hero Digital Banking Showcase (Clean, high-fidelity card instead of video) */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/40 text-slate-800">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <TompkinsLogo size="sm" textColor="text-[#004732]" showSubtitle={true} />
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure 256-Bit</span>
                </span>
              </div>

              {/* Digital Banking Gateway or Logged In Summary */}
              {isLoggedIn ? (
                <div className="space-y-3 mb-5">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#003B26] to-[#004732] text-white shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-emerald-200">{chkAcc ? chkAcc.name : 'Tompkins Direct Checking'}</p>
                        <p className="text-xs text-white/70 font-mono">··{chkAcc ? chkAcc.accountNumber.slice(-4) : '634-2'}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded">
                        Available
                      </span>
                    </div>
                    <p className="text-2xl font-bold mt-2 tabular-nums">
                      {chkAcc ? formatCurrency(chkAcc.availableBalance) : '$462,840.50'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{savAcc ? savAcc.name : 'High-Yield Reserve Savings'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">··{savAcc ? savAcc.accountNumber.slice(-4) : '634-3'}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {savAcc ? formatCurrency(savAcc.availableBalance) : '$148,500.00'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-5">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#003B26] to-[#004732] text-white shadow-md">
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-400/20 flex items-center justify-center border border-emerald-400/30">
                        <Lock className="w-4 h-4 text-emerald-300" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold tracking-tight text-white">Digital Banking Gateway</h3>
                        <p className="text-[11px] text-emerald-200/80">Authorized Client Access Only</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/85 leading-relaxed">
                      Sign in to manage your Checking, High-Yield Savings, wire transfers, and account settings with enterprise 256-bit encryption.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#004732] shrink-0" />
                    <span className="font-medium">Protected by FDIC insurance &amp; multi-factor verification</span>
                  </div>
                </div>
              )}

              {/* Digital Highlights */}
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                  <span>Instant Mobile Check Deposit &amp; Bill Pay</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                  <span>Biometric Sign-in with Touch ID &amp; Face ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                  <span>External &amp; Wire Transfers to Any US Bank</span>
                </div>
              </div>

              <div className="pt-5">
                <button
                  onClick={() => {
                    if (isLoggedIn) setActivePage('my-account');
                    else onOpenLogin();
                  }}
                  className="w-full py-3.5 bg-[#004732] hover:bg-[#00573E] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoggedIn ? 'Launch My Account Portal' : 'Sign In to Digital Banking'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          "WE'RE HERE FOR YOU" SERVICES CAROUSEL
          ========================================================================= */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 max-w-[1360px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            We're here for you.
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Explore our services to help with all your personal and business banking needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Personal Loans */}
          <div className="p-6 rounded-2xl border border-slate-200 hover:border-[#004732] hover:shadow-lg transition-all duration-200 flex flex-col justify-between group bg-[#FAFCFB]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#004732] flex items-center justify-center mb-4 group-hover:bg-[#004732] group-hover:text-white transition-colors">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004732] transition-colors">
                Personal Loans
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Apply for a personal loan now with flexible terms, competitive rates, and fast local decisions.
              </p>
            </div>
            <button
              onClick={onOpenCreateAccount}
              className="mt-6 text-xs font-bold text-[#004732] hover:underline flex items-center gap-1"
            >
              <span>Apply now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Business Loans */}
          <div className="p-6 rounded-2xl border border-slate-200 hover:border-[#004732] hover:shadow-lg transition-all duration-200 flex flex-col justify-between group bg-[#FAFCFB]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#004732] flex items-center justify-center mb-4 group-hover:bg-[#004732] group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004732] transition-colors">
                Business Loans &amp; Lines
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Empowering regional enterprises across NY &amp; PA with lines of credit, equipment financing, and commercial real estate.
              </p>
            </div>
            <button
              onClick={() => setActivePage('business')}
              className="mt-6 text-xs font-bold text-[#004732] hover:underline flex items-center gap-1"
            >
              <span>Explore business</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Checking Accounts */}
          <div className="p-6 rounded-2xl border border-slate-200 hover:border-[#004732] hover:shadow-lg transition-all duration-200 flex flex-col justify-between group bg-[#FAFCFB]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#004732] flex items-center justify-center mb-4 group-hover:bg-[#004732] group-hover:text-white transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004732] transition-colors">
                Direct Checking
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Free contactless debit card, digital banking, and $10 monthly fee waived when you meet qualifying direct deposit.
              </p>
            </div>
            <button
              onClick={() => setActivePage('banking')}
              className="mt-6 text-xs font-bold text-[#004732] hover:underline flex items-center gap-1"
            >
              <span>Compare accounts</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4: Digital Banking */}
          <div className="p-6 rounded-2xl border border-slate-200 hover:border-[#004732] hover:shadow-lg transition-all duration-200 flex flex-col justify-between group bg-[#FAFCFB]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#004732] flex items-center justify-center mb-4 group-hover:bg-[#004732] group-hover:text-white transition-colors">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004732] transition-colors">
                Digital &amp; Mobile Banking
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Mobile check deposit, Touch ID/Face ID login, quick internal/external transfers, and electronic statements.
              </p>
            </div>
            <button
              onClick={() => {
                if (isLoggedIn) setActivePage('my-account');
                else onOpenLogin();
              }}
              className="mt-6 text-xs font-bold text-[#004732] hover:underline flex items-center gap-1"
            >
              <span>Launch portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          "BANK ON YOUR SCHEDULE" DIGITAL FEATURE BANNER
          ========================================================================= */}
      <section className="bg-[#F0F5F2] py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#004732]">
              Modern Digital Convenience
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Bank on your schedule.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
              Discover the convenience of Tompkins Bank &amp; Trust digital banking. Customize your account dashboard, set email and text alerts, view account history, and move money between accounts with ease.
            </p>

            <ul className="space-y-3 pt-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                <span>Mobile Check Deposit — snap and deposit paper checks in seconds</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                <span>Biometric Authentication — secure Touch ID &amp; Face ID on mobile</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                <span>External &amp; Wire Transfers — link accounts at other financial institutions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                <span>Online Bill Pay &amp; e-Statements — paperless, automatic payments</span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={() => {
                  if (isLoggedIn) setActivePage('my-account');
                  else onOpenLogin();
                }}
                className="px-7 py-3 bg-[#004732] hover:bg-[#00573E] text-white font-bold text-xs uppercase tracking-wider rounded-md shadow transition-colors"
              >
                GET STARTED
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative max-w-sm w-full bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <TompkinsLogo size="sm" textColor="text-[#004732]" />
                <span className="text-[10px] font-bold bg-emerald-100 text-[#004732] px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-[#004732]" />
                  <span>iOS &amp; Android App</span>
                </span>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#003B26] to-[#004732] text-white shadow-sm mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white tracking-tight">Tompkins Mobile Suite</p>
                    <p className="text-[11px] text-emerald-200">Enterprise Encrypted Banking</p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl text-xs space-y-2.5 text-slate-700 border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                  <span className="font-medium">Mobile Check Deposit with Camera OCR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                  <span className="font-medium">Instant Card Lock / Unlock &amp; Travel Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                  <span className="font-medium">Direct Domestic FedWire &amp; Inter-Bank Rails</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004732] shrink-0" />
                  <span className="font-medium">Real-Time WhatsApp &amp; Text Alerts</span>
                </div>
              </div>

              <p className="text-[11px] text-center text-slate-400 mt-4 font-medium">
                Rated 4.8/5 on App Store &amp; Google Play
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          MORTGAGES & HOME ROOTS SECTION
          ========================================================================= */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 max-w-[1360px] mx-auto">
        <div className="rounded-3xl bg-[#F8FAF9] border border-slate-200 p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Looking to put down roots or make a move?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The right home starts with a mortgage that fits your life and your budget. Tompkins provides local decision making and responsive mortgage specialists.
            </p>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-900 mb-2">With Tompkins, you get:</p>
              <p>✓ Easy online application process</p>
              <p>✓ Local decision making from application to closing</p>
              <p>✓ Fast pre-qualification within 24 hours</p>
              <p>✓ Fixed rate, adjustable, FHA, and VA mortgage options</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActivePage('customer-service')}
                className="px-6 py-3 bg-[#7A1D2E] hover:bg-[#681827] text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors shadow-sm cursor-pointer"
              >
                View Mortgage Options
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80"
                alt="Tompkins Home Lending"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CUSTOMER CARE QUICK CONTACT TILES
          ========================================================================= */}
      <section className="bg-[#003B26] text-white py-14 px-6 sm:px-12">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div
            onClick={() => setActivePage('customer-service')}
            className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-4 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-[#25D366]">Customer Care · WhatsApp Only</p>
              <p className="text-lg font-bold">+1 (607) 273-2265</p>
              <p className="text-[11px] text-white/70">24/7 Encrypted WhatsApp Concierge Desk</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-emerald-300">Send a Message</p>
              <p className="text-base font-bold">Contact us online</p>
              <p className="text-[11px] text-white/70">Secure customer support desk</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-emerald-300">Branches &amp; ATMs</p>
              <p className="text-base font-bold">New York &amp; Pennsylvania</p>
              <p className="text-[11px] text-white/70">Find nearest banking center</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
