import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  Lock,
  PlusCircle,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Unlock,
  Zap,
} from 'lucide-react';
import { PaymentCard } from '../../types/banking';

export const CardManagementView: React.FC = () => {
  const {
    cards,
    toggleCardFreeze,
    toggleTravelMode,
    updateCardLimit,
    generateVirtualCard,
    formatCurrency,
  } = useBanking();

  const [activeCardId, setActiveCardId] = useState<string>(cards[0]?.id || '');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const [pinInput, setPinInput] = useState<string>('');
  const [showPinPrompt, setShowPinPrompt] = useState<boolean>(false);

  // Virtual Card Generator Modal State
  const [showVirtualModal, setShowVirtualModal] = useState(false);
  const [virtualName, setVirtualName] = useState('Online Shopping Burner');
  const [virtualCap, setVirtualCap] = useState('300');

  const currentCard = cards.find((c) => c.id === activeCardId) || cards[0];

  const handleRevealToggle = () => {
    if (revealedCards[currentCard.id]) {
      setRevealedCards((prev) => ({ ...prev, [currentCard.id]: false }));
    } else {
      setShowPinPrompt(true);
      setPinInput('');
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate PIN verification (PIN is 4821 or 1702 or any 4 digit)
    if (pinInput.length === 4) {
      setRevealedCards((prev) => ({ ...prev, [currentCard.id]: true }));
      setShowPinPrompt(false);
    } else {
      alert('Please enter a valid 4-digit security PIN.');
    }
  };

  const handleCreateVirtualCard = (e: React.FormEvent) => {
    e.preventDefault();
    const created = generateVirtualCard(virtualName, parseFloat(virtualCap) || 500);
    setActiveCardId(created.id);
    setShowVirtualModal(false);
    setVirtualName('Cloud Subscriptions Shield');
    setVirtualCap('300');
  };

  const isCardRevealed = revealedCards[currentCard?.id];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Card Controls & Virtual Shield
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time lock, 3D card visualizer, international authorizations, and disposable virtual cards.
          </p>
        </div>

        <button
          onClick={() => setShowVirtualModal(true)}
          className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Issue Virtual Card</span>
        </button>
      </div>

      {/* Card Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => {
              setActiveCardId(card.id);
              setIsFlipped(false);
            }}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              card.id === currentCard.id
                ? 'bg-slate-900 border-emerald-500/80 text-white ring-1 ring-emerald-500/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{card.name}</span>
            <span className="ml-1.5 font-mono text-[11px] text-slate-500">··{card.last4}</span>
          </button>
        ))}
      </div>

      {/* Main 3D Card Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive 3D Card */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          <div className="w-full max-w-sm perspective-1000">
            <div
              className={`w-full aspect-[1.586] rounded-2xl p-6 shadow-2xl relative transition-transform duration-700 transform-style-3d cursor-pointer ${
                isFlipped ? 'rotate-y-180' : ''
              } ${
                currentCard.tier === 'Apex Obsidian Cash Visa Signature'
                  ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 text-white'
                  : currentCard.type === 'virtual'
                  ? 'bg-gradient-to-br from-purple-950 via-slate-950 to-slate-900 border border-purple-500/30 text-white'
                  : 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-emerald-500/30 text-white'
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                      Apex Bank Private
                    </span>
                    <p className="text-xs font-bold tracking-wide mt-0.5">{currentCard.tier}</p>
                  </div>
                  <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2L2 19h20L12 2zm0 4.5l6.5 11h-13L12 6.5z" />
                    </svg>
                  </div>
                </div>

                {/* EMV Chip & Contactless */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-8 rounded bg-amber-400/20 border border-amber-400/50 flex items-center justify-center">
                    <div className="w-7 h-5 border border-amber-400/70 rounded-sm" />
                  </div>
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  {currentCard.isFrozen && (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded uppercase">
                      LOCKED
                    </span>
                  )}
                </div>

                {/* Card Number */}
                <p className="font-mono text-lg sm:text-xl tracking-widest font-semibold">
                  {isCardRevealed
                    ? currentCard.cardNumber.replace(/(\d{4})/g, '$1 ').trim()
                    : `···· ···· ···· ${currentCard.last4}`}
                </p>

                {/* Card Footer */}
                <div className="flex justify-between items-end text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Cardholder</span>
                    <span className="font-bold tracking-wider">{currentCard.cardholderName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 uppercase block">Expires</span>
                    <span>{currentCard.expiryMonth}/{currentCard.expiryYear}</span>
                  </div>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden rotate-y-180">
                <div className="space-y-4">
                  {/* Magnetic Strip */}
                  <div className="-mx-6 -mt-1 h-10 bg-slate-950 border-y border-slate-800" />

                  {/* CVV & Signature Bar */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="h-8 flex-1 bg-slate-200/90 rounded px-2 flex items-center font-cursive text-slate-800 text-xs italic">
                      {currentCard.cardholderName}
                    </div>
                    <div className="h-8 w-14 bg-white rounded flex items-center justify-center font-mono font-bold text-slate-950 text-xs">
                      {isCardRevealed ? currentCard.cvv : '•••'}
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 space-y-1 font-mono">
                  <p>Authorized Signature · Not Transferable</p>
                  <p>24/7 Concierge & Fraud Hotline: 1-800-APEX-VIP</p>
                  <p>Member FDIC · Issued under license by Visa USA Inc.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip Card to View {isFlipped ? 'Front' : 'Back & CVV'}</span>
            </button>
            <span>·</span>
            <button
              onClick={handleRevealToggle}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              {isCardRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isCardRevealed ? 'Hide Numbers' : 'Reveal Full 16-Digits'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Physical & Security Controls */}
        <div className="lg:col-span-6 space-y-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Card Safety & Channel Governance</span>
          </h2>

          {/* Instant Freeze Toggle */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {currentCard.isFrozen ? (
                  <Lock className="w-4 h-4 text-rose-400" />
                ) : (
                  <Unlock className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-bold text-white">Instant Card Lock</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Instantly block all new transactions, online purchases, and ATM withdrawals.
              </p>
            </div>

            <button
              onClick={() => toggleCardFreeze(currentCard.id)}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentCard.isFrozen
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {currentCard.isFrozen ? 'Unlock' : 'Freeze'}
            </button>
          </div>

          {/* International Travel Toggle */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">International Travel Notice</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Authorize overseas point-of-sale terminals without false fraud declines.
              </p>
            </div>

            <button
              onClick={() => toggleTravelMode(currentCard.id)}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                currentCard.internationalTravelMode
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {currentCard.internationalTravelMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Daily Withdrawal Limit Slider */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">Daily Cash & Spend Ceiling</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold tabular-nums">
                {formatCurrency(currentCard.dailyWithdrawalLimit)}
              </span>
            </div>

            <input
              type="range"
              min="500"
              max="5000"
              step="250"
              value={currentCard.dailyWithdrawalLimit}
              onChange={(e) => updateCardLimit(currentCard.id, Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$500</span>
              <span>$2,500</span>
              <span>$5,000 / day</span>
            </div>
          </div>

          {/* Virtual Card Info */}
          {currentCard.type === 'virtual' && currentCard.virtualSpendingCap && (
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1">
              <span className="font-bold text-purple-300">Virtual Burner Protection</span>
              <p className="text-slate-300 text-[11px]">
                Capped at {formatCurrency(currentCard.virtualSpendingCap)}. If breached, subsequent checkout attempts auto-decline safely.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* PIN Prompt Modal */}
      {showPinPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4">
            <h3 className="text-base font-bold text-white">Security Verification Required</h3>
            <p className="text-xs text-slate-400">
              Enter your 4-digit card security PIN to decrypt card details (Default: 4821).
            </p>
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-2xl font-mono py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinPrompt(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-emerald-300"
                >
                  Confirm PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Virtual Card Creation Modal */}
      {showVirtualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">Generate Virtual Shield Card</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Protects your real card number during online checkout.
                </p>
              </div>
              <button
                onClick={() => setShowVirtualModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateVirtualCard} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Virtual Card Label</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Cloud Hosting, Netflix, One-Time Gear Purchase"
                  value={virtualName}
                  onChange={(e) => setVirtualName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Max Spend Ceiling ($)</label>
                <input
                  type="number"
                  min="25"
                  max="10000"
                  value={virtualCap}
                  onChange={(e) => setVirtualCap(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                Tokenized by Visa Secure. Can be destroyed or paused anytime with one click.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Issue Virtual Visa Shield
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
