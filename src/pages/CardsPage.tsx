import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  CreditCard,
  Check,
  Sparkles,
  Shield,
  ArrowRight,
  Lock,
  Unlock,
  Globe,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  User,
  DollarSign,
  MapPin,
  Briefcase,
  ChevronRight,
  Award,
  Clock,
  HelpCircle,
  FileText
} from 'lucide-react';
import { TompkinsLogo } from '../components/TompkinsLogo';

interface CardProduct {
  id: string;
  name: string;
  badge: string;
  category: 'all' | 'cash' | 'no-fee' | 'business';
  cashback: string;
  annualFee: string;
  welcomeBonus: string;
  introApr: string;
  regularApr: string;
  recommendedCredit: string;
  accentColor: string;
  cardNetwork: 'Visa Signature' | 'Mastercard World' | 'Visa Business';
  defaultLimit: number;
}

export const CardsPage: React.FC<{ onOpenCreateAccount: () => void }> = ({ onOpenCreateAccount }) => {
  const {
    user,
    cards,
    toggleCardFreeze,
    toggleTravelMode,
    updateCardLimit,
    issueNewCreditCard,
    formatCurrency,
    setActivePage,
  } = useBanking();

  const [activeTab, setActiveTab] = useState<'catalog' | 'my-cards'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cash' | 'no-fee' | 'business'>('all');
  
  // Application Modal State
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [selectedCardForApp, setSelectedCardForApp] = useState<CardProduct | null>(null);
  const [applicationStep, setApplicationStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationCompleted, setApplicationCompleted] = useState(false);
  const [issuedCardInfo, setIssuedCardInfo] = useState<{ name: string; number: string; limit: number; exp: string } | null>(null);
  const [showSsn, setShowSsn] = useState(false);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: user.name.split(' ')[0] || 'Paulina',
    middleInitial: 'V',
    lastName: user.name.split(' ')[1] || 'Villarreal',
    dob: '1993-03-14',
    ssn: '6110', // Last 4 digits shown, full simulated
    email: user.email || 'paulina.villarreal@tompkinsbank.com',
    phone: user.phone || '(607) 273-3210',
    citizenship: 'US Citizen',
    address: user.address || '118 E Seneca Street, Apt 4B',
    aptUnit: 'Apt 4B',
    city: 'Ithaca',
    state: 'NY',
    zipCode: '14850',
    housingStatus: 'Owns with Mortgage',
    monthlyHousingPayment: '1,450',
    yearsAtAddress: '4',
    employmentStatus: 'Employed Full-Time',
    employerName: 'Tompkins Regional Solutions LLC',
    jobTitle: user.occupation || 'Lead Solutions Architect',
    annualIncome: '135000',
    additionalIncome: '12000',
    incomeSource: 'Salary / Professional Services',
    cardNameOnCard: user.name.toUpperCase() || 'PAULINA VILLARREAL',
    linkOverdraft: true,
    paperlessConsent: true,
    agreedToTerms: false,
  });

  const cardsList: CardProduct[] = [
    {
      id: 'tompkins-blue-cash',
      name: 'Tompkins Blue Cash Preferred® Card',
      badge: 'Popular for Everyday Cash Back',
      category: 'cash',
      cashback: '6% Cash Back on US Supermarkets (up to $6k/yr), 3% on US Transit & Gas',
      annualFee: '$0 intro annual fee for the 1st year, then $95',
      welcomeBonus: 'Earn a $250 statement credit after spending $3,000 in first 6 months',
      introApr: '0% intro APR on purchases for 12 months',
      regularApr: '19.24% - 29.99% Variable APR',
      recommendedCredit: 'Good to Excellent (690 - 850)',
      accentColor: 'from-[#004732] via-[#085a40] to-[#01281d]',
      cardNetwork: 'Visa Signature',
      defaultLimit: 12500,
    },
    {
      id: 'tompkins-platinum',
      name: 'The Tompkins Platinum Visa Signature® Card',
      badge: 'Premier Rewards & Dining Prestige',
      category: 'cash',
      cashback: '5X Points on Select Dining & Entertainment, 2X on All Everyday Purchases',
      annualFee: '$695 Annual Fee',
      welcomeBonus: 'Earn 80,000 Tompkins Rewards® Points after $8,000 in first 6 months',
      introApr: 'Competitive Prime-based Variable APR with Flex Pay Over Time',
      regularApr: '21.24% - 28.24% Variable APR',
      recommendedCredit: 'Excellent (720 - 850)',
      accentColor: 'from-slate-700 via-slate-800 to-slate-950',
      cardNetwork: 'Visa Signature',
      defaultLimit: 25000,
    },
    {
      id: 'tompkins-everyday',
      name: 'Tompkins Everyday® Cash Card',
      badge: 'No Annual Fee Everyday Value',
      category: 'no-fee',
      cashback: '3% Cash Back on Online Retail Purchases, 3% on US Supermarkets & 1.5% on other purchases',
      annualFee: '$0 Annual Fee',
      welcomeBonus: 'Earn a $200 bonus statement credit after spending $2,000 in first 6 months',
      introApr: '0% intro APR on purchases for 15 months',
      regularApr: '18.24% - 28.49% Variable APR',
      recommendedCredit: 'Good (670 - 850)',
      accentColor: 'from-teal-800 via-emerald-800 to-teal-950',
      cardNetwork: 'Visa Signature',
      defaultLimit: 8500,
    },
    {
      id: 'tompkins-business-cash',
      name: 'Tompkins Business Cash Rewards® Card',
      badge: 'Smart Cash Flow for Business Growth',
      category: 'business',
      cashback: '5% Cash Back on Office Supplies, Wireless & Telecom (up to $25k/yr), 2% on Gas & Dining',
      annualFee: '$0 Annual Fee',
      welcomeBonus: 'Earn $500 cash back statement credit after spending $5,000 in first 3 months',
      introApr: '0% intro APR on purchases for 12 months',
      regularApr: 'Prime + 11.99% Variable APR',
      recommendedCredit: 'Good to Excellent (680 - 850)',
      accentColor: 'from-[#0d2a4a] via-[#123864] to-[#07192d]',
      cardNetwork: 'Visa Business',
      defaultLimit: 20000,
    },
  ];

  const filteredCards = cardsList.filter(
    (c) => selectedCategory === 'all' || c.category === selectedCategory
  );

  const startApplication = (card: CardProduct) => {
    setSelectedCardForApp(card);
    setApplicationStep(1);
    setApplicationCompleted(false);
    setIsSubmitting(false);
    setIsApplicationOpen(true);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (applicationStep === 4) {
      // Begin submission & underwriting simulation
      setApplicationStep(5);
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setApplicationCompleted(true);
        if (selectedCardForApp) {
          // Determine approved limit based on income
          const enteredIncome = parseFloat(formData.annualIncome) || 100000;
          const calculatedLimit = Math.min(
            Math.max(Math.round((enteredIncome * 0.12) / 500) * 500, selectedCardForApp.defaultLimit),
            35000
          );
          
          const newCard = issueNewCreditCard(selectedCardForApp.name, calculatedLimit);
          setIssuedCardInfo({
            name: newCard.name,
            number: newCard.cardNumber,
            limit: calculatedLimit,
            exp: `${newCard.expiryMonth}/${newCard.expiryYear}`,
          });
        }
      }, 2200);
    } else {
      setApplicationStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const closeApplication = () => {
    setIsApplicationOpen(false);
    setSelectedCardForApp(null);
    setApplicationStep(1);
    setApplicationCompleted(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-8 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto space-y-6">
        
        {/* Top Header & Page Navigation */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <TompkinsLogo size="sm" showSubtitle={false} />
              <span className="text-xs font-semibold text-slate-400">|</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#004732]">
                Credit &amp; Debit Card Solutions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Find the Tompkins Card That&apos;s Right for You
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Explore award-winning consumer and business cards from Tompkins Bank &amp; Trust. Benefit from competitive rewards, zero liability protection, and instant digital account integration.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={() => setActiveTab('my-cards')}
              className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'my-cards'
                  ? 'bg-[#004732] text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>My Active Cards ({cards.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'catalog'
                  ? 'bg-[#004732] text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Apply for a Card</span>
            </button>
          </div>
        </div>

        {/* ======================= TAB 1: CATALOG / APPLY ======================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === 'all'
                    ? 'bg-[#004732] text-white border-[#004732]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                All Cards
              </button>
              <button
                onClick={() => setSelectedCategory('cash')}
                className={`px-4 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === 'cash'
                    ? 'bg-[#004732] text-white border-[#004732]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Cash Back Rewards
              </button>
              <button
                onClick={() => setSelectedCategory('no-fee')}
                className={`px-4 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === 'no-fee'
                    ? 'bg-[#004732] text-white border-[#004732]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                No Annual Fee
              </button>
              <button
                onClick={() => setSelectedCategory('business')}
                className={`px-4 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === 'business'
                    ? 'bg-[#004732] text-white border-[#004732]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Business Credit Cards
              </button>
            </div>

            {/* Cards List */}
            <div className="space-y-6">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-slate-300 transition-colors"
                >
                  
                  {/* Authentic Tompkins Card Thumbnail Art */}
                  <div className="lg:col-span-4 flex justify-center">
                    <div
                      className={`w-72 h-44 rounded-xl p-5 bg-gradient-to-br ${card.accentColor} text-white shadow-lg flex flex-col justify-between relative overflow-hidden select-none border border-white/10`}
                    >
                      {/* Subtle Watermark Oak Motif */}
                      <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
                        <TompkinsLogo size="xl" textColor="text-white" leafColor="#ffffff" />
                      </div>

                      {/* Card Header with Tompkins Logo */}
                      <div className="flex justify-between items-start z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-sm tracking-wider uppercase">
                            TOMPKINS
                          </span>
                          <span className="text-[10px] text-amber-400 font-bold">●</span>
                          <span className="text-[9px] tracking-widest text-slate-200 uppercase font-medium">
                            Bank &amp; Trust
                          </span>
                        </div>
                        <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-white/15 text-slate-100">
                          {card.cardNetwork}
                        </span>
                      </div>

                      {/* EMV Chip & Contactless */}
                      <div className="flex items-center gap-3 z-10 my-1">
                        <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-300/60 shadow-inner flex items-center justify-center">
                          <div className="w-7 h-5 border border-amber-800/30 rounded-xs" />
                        </div>
                        {/* Contactless Waves */}
                        <svg className="w-5 h-5 text-slate-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M2.818 9.322a14.5 14.5 0 0118.364 0" />
                        </svg>
                      </div>

                      {/* Card Details & Number */}
                      <div className="z-10">
                        <div className="text-xs font-mono tracking-widest text-slate-200 mb-1">
                          •••• •••• •••• 4821
                        </div>
                        <div className="flex justify-between items-end text-[10px] text-slate-300">
                          <span className="font-medium tracking-wider uppercase">MIKE REYNOLDS</span>
                          <span className="font-mono">EXP 11/29</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Details & Rewards Specs */}
                  <div className="lg:col-span-5 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#004732] bg-[#004732]/10 px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {card.badge}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Credit: {card.recommendedCredit}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{card.name}</h3>
                    
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Rewards:</strong> {card.cashback}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Welcome Bonus:</strong> {card.welcomeBonus}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Annual Fee:</strong> {card.annualFee}</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-slate-500 text-xs">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span><strong>Intro APR:</strong> {card.introApr} ({card.regularApr})</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:col-span-3 flex flex-col gap-3 justify-center">
                    <button
                      onClick={() => startApplication(card)}
                      className="w-full py-2.5 px-4 bg-[#004732] hover:bg-[#003827] text-white text-sm font-semibold rounded-sm text-center transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startApplication(card)}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-sm text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Check Pre-Approval</span>
                    </button>
                    <span className="text-[11px] text-center text-slate-400">
                      Applying does not affect your credit score until submitted
                    </span>
                  </div>

                </div>
              ))}
            </div>

            {/* Bottom Tompkins Guarantee & FAQ Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-[#004732] shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero Liability Protection</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    You won&apos;t be held responsible for unauthorized charges with 24/7 fraud monitoring from Tompkins Bank &amp; Trust.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Automatic Cashback Deposit</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Directly deposit your earned cash rewards into your Tompkins Checking or High-Yield Savings account monthly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="w-6 h-6 text-[#004732] shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Local Decision Making</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Our credit underwriting and servicing are handled locally in New York and Pennsylvania by your community bank team.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================= TAB 2: MY ACTIVE TOMPKINS CARDS ======================= */}
        {activeTab === 'my-cards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Manage Your Tompkins Cards</h2>
                <p className="text-xs text-slate-500">
                  Control security locks, travel notifications, and spending thresholds in real time.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('catalog')}
                className="text-xs font-semibold text-[#004732] hover:underline flex items-center gap-1"
              >
                <span>+ Request another Tompkins card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((c) => (
                <div
                  key={c.id}
                  className={`bg-white rounded-lg border transition-all p-5 flex flex-col justify-between ${
                    c.isFrozen ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Card Thumbnail Art */}
                    <div
                      className={`w-full h-44 rounded-xl p-5 text-white shadow-md flex flex-col justify-between relative overflow-hidden select-none mb-4 ${
                        c.type === 'debit'
                          ? 'bg-gradient-to-br from-[#004732] via-[#043325] to-[#012017]'
                          : c.type === 'virtual'
                          ? 'bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900'
                          : 'bg-gradient-to-br from-slate-800 via-slate-900 to-black'
                      }`}
                    >
                      <div className="flex justify-between items-start z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-xs tracking-wider uppercase">
                            TOMPKINS
                          </span>
                          <span className="text-[9px] tracking-widest text-slate-300 uppercase">
                            {c.type === 'debit' ? 'DEBIT' : c.type === 'virtual' ? 'VIRTUAL' : 'CREDIT'}
                          </span>
                        </div>
                        {c.isFrozen ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600/90 text-white flex items-center gap-1">
                            <Lock className="w-3 h-3" /> FROZEN
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/80 text-white flex items-center gap-1">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 z-10 my-1">
                        <div className="w-9 h-6 rounded bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-300/60" />
                        <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M2.818 9.322a14.5 14.5 0 0118.364 0" />
                        </svg>
                      </div>

                      <div className="z-10">
                        <div className="text-sm font-mono tracking-wider text-slate-100 flex items-center justify-between">
                          <span>
                            {revealedCardId === c.id
                              ? `${c.cardNumber.slice(0, 4)} ${c.cardNumber.slice(4, 8)} ${c.cardNumber.slice(8, 12)} ${c.cardNumber.slice(12, 16)}`
                              : `•••• •••• •••• ${c.last4}`}
                          </span>
                          <button
                            onClick={() => setRevealedCardId(revealedCardId === c.id ? null : c.id)}
                            className="p-1 hover:bg-white/20 rounded transition-colors text-slate-300"
                            title={revealedCardId === c.id ? 'Hide card number' : 'Show card number'}
                          >
                            {revealedCardId === c.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="flex justify-between items-end text-[10px] text-slate-300 mt-1">
                          <span className="uppercase font-medium tracking-wide">{c.cardholderName}</span>
                          <span className="font-mono">EXP {c.expiryMonth}/{c.expiryYear}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                        <span className="text-[10px] font-mono text-slate-500">CVV: {revealedCardId === c.id ? c.cvv : '•••'}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Daily Spending Limit: <strong className="text-slate-800">{formatCurrency(c.dailyWithdrawalLimit)}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Quick Controls */}
                  <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => toggleCardFreeze(c.id)}
                      className={`py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        c.isFrozen
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                      }`}
                    >
                      {c.isFrozen ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unfreeze</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Freeze Card</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleTravelMode(c.id)}
                      className={`py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        c.internationalTravelMode
                          ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{c.internationalTravelMode ? 'Global Active' : 'Global Use'}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* REALISTIC TOMPKINS CREDIT CARD APPLICATION MODAL WITH UNDERWRITING DETAILS */}
      {/* ========================================================================= */}
      {isApplicationOpen && selectedCardForApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden transition-all my-8 animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#004732] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TompkinsLogo size="sm" textColor="text-white" leafColor="#C5832B" />
                <div className="border-l border-white/20 pl-3">
                  <span className="text-[10px] tracking-wider text-amber-300 font-semibold uppercase block">
                    Online Card Application
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedCardForApp.name}
                  </h3>
                </div>
              </div>

              {!isSubmitting && (
                <button
                  onClick={closeApplication}
                  className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Stepper Header (Only when not submitting or completed) */}
            {!isSubmitting && !applicationCompleted && (
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                      applicationStep === 1 ? 'bg-[#004732] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    1
                  </span>
                  <span className={applicationStep === 1 ? 'font-bold text-[#004732]' : 'text-slate-500'}>
                    Overview
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                      applicationStep === 2 ? 'bg-[#004732] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    2
                  </span>
                  <span className={applicationStep === 2 ? 'font-bold text-[#004732]' : 'text-slate-500'}>
                    Personal
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                      applicationStep === 3 ? 'bg-[#004732] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    3
                  </span>
                  <span className={applicationStep === 3 ? 'font-bold text-[#004732]' : 'text-slate-500'}>
                    Financial
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                      applicationStep === 4 ? 'bg-[#004732] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    4
                  </span>
                  <span className={applicationStep === 4 ? 'font-bold text-[#004732]' : 'text-slate-500'}>
                    Review &amp; Terms
                  </span>
                </div>
              </div>
            )}

            {/* Modal Content Body */}
            <div className="p-6">
              
              {/* STEP 1: Overview & Pricing Disclosures */}
              {applicationStep === 1 && !isSubmitting && !applicationCompleted && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div
                      className={`w-48 h-28 rounded-lg p-3 bg-gradient-to-br ${selectedCardForApp.accentColor} text-white shadow-sm flex flex-col justify-between shrink-0`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-serif font-bold uppercase">TOMPKINS</span>
                        <span>{selectedCardForApp.cardNetwork}</span>
                      </div>
                      <div className="w-6 h-4 bg-amber-400 rounded-xs" />
                      <span className="text-[10px] font-mono tracking-wider">•••• •••• •••• 4821</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#004732] uppercase tracking-wider">
                        {selectedCardForApp.badge}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{selectedCardForApp.name}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {selectedCardForApp.cashback}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Box Required for Credit Applications */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 border-b border-slate-200">
                      Interest Rates and Interest Charges (Schumer Box Disclosures)
                    </div>
                    <div className="p-4 space-y-3 bg-white">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Introductory APR:</span>
                        <span className="text-emerald-700 font-bold">{selectedCardForApp.introApr}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Regular Purchase APR:</span>
                        <span className="text-slate-800">{selectedCardForApp.regularApr}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Annual Membership Fee:</span>
                        <span className="text-slate-800 font-semibold">{selectedCardForApp.annualFee}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Intro Welcome Bonus:</span>
                        <span className="text-slate-800">{selectedCardForApp.welcomeBonus}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="font-semibold text-slate-700">Foreign Transaction Fee:</span>
                        <span className="text-slate-800">None (0%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Pre-filled with your verified Tompkins profile details
                    </span>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-[#004732] hover:bg-[#003827] text-white text-sm font-semibold rounded-sm transition-colors flex items-center gap-2"
                    >
                      <span>Continue Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Personal Information */}
              {applicationStep === 2 && !isSubmitting && !applicationCompleted && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-bold text-slate-900">Personal &amp; Contact Details</h4>
                    <p className="text-xs text-slate-500">
                      Required by federal law under USA PATRIOT Act customer identification program.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">M.I.</label>
                      <input
                        type="text"
                        maxLength={1}
                        value={formData.middleInitial}
                        onChange={(e) => handleInputChange('middleInitial', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-700">Social Security / ITIN *</label>
                        <button
                          type="button"
                          onClick={() => setShowSsn(!showSsn)}
                          className="text-[10px] text-[#004732] hover:underline"
                        >
                          {showSsn ? 'Mask SSN' : 'Show SSN'}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showSsn ? 'text' : 'password'}
                          value={showSsn ? `***-**-${formData.ssn}` : `••••••${formData.ssn}`}
                          onChange={(e) => handleInputChange('ssn', e.target.value.replace(/\D/g, '').slice(-4))}
                          className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Residential Details */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Residential Street Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none mb-3"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">State</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">ZIP Code</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <button
                      onClick={() => setApplicationStep(1)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-[#004732] hover:bg-[#003827] text-white text-sm font-semibold rounded transition-colors flex items-center gap-2"
                    >
                      <span>Next: Financial Info</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Financial & Employment Information */}
              {applicationStep === 3 && !isSubmitting && !applicationCompleted && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-bold text-slate-900">Employment &amp; Financial Information</h4>
                    <p className="text-xs text-slate-500">
                      Used by Tompkins underwriting to calculate your maximum approved credit limit.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Employment Status *</label>
                      <select
                        value={formData.employmentStatus}
                        onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none bg-white"
                      >
                        <option>Employed Full-Time</option>
                        <option>Self-Employed / Business Owner</option>
                        <option>Retired</option>
                        <option>Employed Part-Time</option>
                        <option>Student / Fellow</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Employer / Company Name *</label>
                      <input
                        type="text"
                        value={formData.employerName}
                        onChange={(e) => handleInputChange('employerName', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Job Title / Role *</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Housing Status *</label>
                      <select
                        value={formData.housingStatus}
                        onChange={(e) => handleInputChange('housingStatus', e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none bg-white"
                      >
                        <option>Owns with Mortgage</option>
                        <option>Owns Home Free &amp; Clear</option>
                        <option>Renting Apartment / Home</option>
                        <option>Other / Family</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Total Gross Annual Income ($) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-xs">$</span>
                        <input
                          type="number"
                          value={formData.annualIncome}
                          onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                          className="w-full text-xs pl-7 p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none font-semibold text-slate-900"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Include salary, bonuses, self-employment earnings.
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Monthly Housing / Rent Payment ($) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-xs">$</span>
                        <input
                          type="text"
                          value={formData.monthlyHousingPayment}
                          onChange={(e) => handleInputChange('monthlyHousingPayment', e.target.value)}
                          className="w-full text-xs pl-7 p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none font-semibold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <button
                      onClick={() => setApplicationStep(2)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-[#004732] hover:bg-[#003827] text-white text-sm font-semibold rounded transition-colors flex items-center gap-2"
                    >
                      <span>Next: Terms &amp; Consent</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Legal Terms */}
              {applicationStep === 4 && !isSubmitting && !applicationCompleted && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-bold text-slate-900">Card Setup &amp; Certification</h4>
                    <p className="text-xs text-slate-500">
                      Configure your embossed card name and certify application disclosures.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Preferred Name Embossed on Card
                    </label>
                    <input
                      type="text"
                      value={formData.cardNameOnCard}
                      onChange={(e) => handleInputChange('cardNameOnCard', e.target.value.toUpperCase())}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-[#004732] focus:outline-none font-mono uppercase tracking-wider font-semibold"
                    />
                  </div>

                  <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.linkOverdraft}
                        onChange={(e) => handleInputChange('linkOverdraft', e.target.checked)}
                        className="mt-0.5 rounded text-[#004732] focus:ring-[#004732]"
                      />
                      <span className="text-slate-700">
                        <strong>Link to Tompkins Checking (#6110634-2)</strong> for seamless autopay and optional overdraft line of defense.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.paperlessConsent}
                        onChange={(e) => handleInputChange('paperlessConsent', e.target.checked)}
                        className="mt-0.5 rounded text-[#004732] focus:ring-[#004732]"
                      />
                      <span className="text-slate-700">
                        <strong>Enroll in Paperless E-Statements</strong> and mobile SMS fraud alerts for instant notice of transactions.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer border-t border-slate-200 pt-2.5">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                        className="mt-0.5 rounded text-[#004732] focus:ring-[#004732]"
                      />
                      <span className="text-slate-800 font-medium">
                        I certify that all information provided is true and accurate. I authorize Tompkins Bank &amp; Trust to review my credit profile in accordance with the Fair Credit Reporting Act to establish this account. *
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setApplicationStep(3)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      disabled={!formData.agreedToTerms}
                      onClick={handleNextStep}
                      className={`px-6 py-2.5 text-white text-sm font-semibold rounded transition-colors flex items-center gap-2 ${
                        formData.agreedToTerms
                          ? 'bg-[#004732] hover:bg-[#003827]'
                          : 'bg-slate-300 cursor-not-allowed text-slate-500'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Submit &amp; Get Decision</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: UNDERWRITING SIMULATION ANIMATION */}
              {isSubmitting && (
                <div className="py-12 px-4 text-center space-y-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-[#004732] rounded-full animate-spin" />
                    <TompkinsLogo size="sm" showSubtitle={false} className="absolute inset-0 m-auto flex justify-center opacity-80" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900">
                      Processing Your Credit Application...
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Running Tompkins automated underwriting rules, verifying identity credentials, and assigning your revolving credit limit.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto bg-slate-50 rounded-lg p-3.5 text-xs text-left space-y-2 border border-slate-200">
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Identity &amp; SSN verification successful</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tompkins customer relationship discount applied</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#004732] font-semibold animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-[#004732]" />
                      <span>Issuing digital card credentials...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: INSTANT APPROVAL & DIGITAL ISSUANCE */}
              {applicationCompleted && issuedCardInfo && (
                <div className="py-4 space-y-6 text-center">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#004732]">
                      Application Approved!
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">
                      Congratulations, {formData.firstName}!
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Your new <strong>{issuedCardInfo.name}</strong> has been approved and issued to your Tompkins online banking portfolio.
                    </p>
                  </div>

                  {/* Newly Approved Card Showcase */}
                  <div className="max-w-xs mx-auto">
                    <div
                      className={`w-full h-44 rounded-xl p-5 bg-gradient-to-br ${selectedCardForApp.accentColor} text-white shadow-xl flex flex-col justify-between text-left relative overflow-hidden`}
                    >
                      <div className="flex justify-between items-start z-10">
                        <span className="font-serif font-bold text-sm tracking-wider uppercase">TOMPKINS</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20">
                          {selectedCardForApp.cardNetwork}
                        </span>
                      </div>
                      
                      <div className="w-9 h-6 bg-amber-400 rounded-xs shadow-inner" />

                      <div className="z-10">
                        <div className="text-xs font-mono tracking-widest text-slate-100 mb-1">
                          {issuedCardInfo.number.slice(0, 4)} •••• •••• {issuedCardInfo.number.slice(-4)}
                        </div>
                        <div className="flex justify-between items-end text-[10px] text-slate-300">
                          <span className="font-semibold uppercase tracking-wider">{formData.cardNameOnCard}</span>
                          <span className="font-mono">EXP {issuedCardInfo.exp}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Approved Limit Breakdown */}
                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Approved Credit Limit</span>
                      <strong className="text-lg font-bold text-slate-900">
                        {formatCurrency(issuedCardInfo.limit)}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Introductory Rate</span>
                      <strong className="text-sm font-bold text-emerald-700">
                        0.00% APR
                      </strong>
                      <span className="text-[9px] text-slate-400 block">First 12 billing cycles</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        closeApplication();
                        setActiveTab('my-cards');
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#004732] hover:bg-[#003827] text-white text-sm font-semibold rounded transition-colors shadow-xs"
                    >
                      View in My Active Cards
                    </button>
                    <button
                      onClick={() => {
                        closeApplication();
                        setActivePage('account');
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-50 transition-colors"
                    >
                      Go to My Account Dashboard
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
