import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { Check, CheckCircle2, ShieldCheck, X, ArrowRight, CreditCard, Wallet, Sparkles } from 'lucide-react';
import { AccountType } from '../../types/banking';

interface OpenAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenAccountModal: React.FC<OpenAccountModalProps> = ({ isOpen, onClose }) => {
  const { openNewAccount, setIsLoggedIn, setActivePortalTab, formatCurrency } = useBanking();

  const [step, setStep] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<AccountType>('checking');
  const [accountName, setAccountName] = useState('Apex Premier Checking');
  const [fullName, setFullName] = useState('Sarah M. Vance');
  const [email, setEmail] = useState('sarah.vance@apexpremier.com');
  const [phone, setPhone] = useState('(415) 890-4421');
  const [initialDeposit, setInitialDeposit] = useState<number>(1500);
  const [ssnMasked, setSsnMasked] = useState('***-**-4821');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [newAccountNumber, setNewAccountNumber] = useState('');

  if (!isOpen) return null;

  const handleProductSelect = (type: AccountType, name: string) => {
    setSelectedProduct(type);
    setAccountName(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedAcct = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
      setNewAccountNumber(generatedAcct);
      openNewAccount(selectedProduct, accountName, initialDeposit);
      setIsSubmitting(false);
      setIsComplete(true);
    }, 900);
  };

  const handleFinishAndEnter = () => {
    setIsLoggedIn(true);
    setActivePortalTab('overview');
    onClose();
    setIsComplete(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isComplete ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Account Onboarding</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Open Your Apex Account in Minutes
              </h2>
              <div className="flex items-center gap-2 mt-4">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-emerald-400' : 'bg-slate-800'}`} />
              </div>
            </div>

            {/* Step 1: Select Product */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">Choose the primary account to initiate today:</p>

                <div className="space-y-3">
                  <div
                    onClick={() => handleProductSelect('checking', 'Apex Premier Checking')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedProduct === 'checking'
                        ? 'bg-slate-900 border-emerald-500/80 ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Apex Premier Checking</p>
                          <p className="text-xs text-slate-400">$0 monthly fee · Unlimited domestic ATM rebates</p>
                        </div>
                      </div>
                      {selectedProduct === 'checking' && <Check className="w-5 h-5 text-emerald-400" />}
                    </div>
                  </div>

                  <div
                    onClick={() => handleProductSelect('savings', 'Apex High-Yield Reserve')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedProduct === 'savings'
                        ? 'bg-slate-900 border-emerald-500/80 ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Apex High-Yield Reserve</p>
                          <p className="text-xs text-slate-400">4.85% APY · Daily compounding interest</p>
                        </div>
                      </div>
                      {selectedProduct === 'savings' && <Check className="w-5 h-5 text-emerald-400" />}
                    </div>
                  </div>

                  <div
                    onClick={() => handleProductSelect('credit', 'Apex Obsidian Cash Visa Signature')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedProduct === 'credit'
                        ? 'bg-slate-900 border-emerald-500/80 ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Apex Obsidian Cash Visa Signature</p>
                          <p className="text-xs text-slate-400">2% flat cash back everywhere · No annual fee</p>
                        </div>
                      </div>
                      {selectedProduct === 'credit' && <Check className="w-5 h-5 text-emerald-400" />}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="py-2.5 px-5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <span>Continue to Identity</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Profile */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">Verify your primary personal profile information:</p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-emerald-400 focus:outline-none text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-emerald-400 focus:outline-none text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Primary Mobile Phone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-emerald-400 focus:outline-none text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Social Security Number / Tax ID (Simulated)</label>
                    <input
                      type="text"
                      value={ssnMasked}
                      onChange={(e) => setSsnMasked(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-emerald-400 focus:outline-none text-white text-sm font-mono"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Protected by 256-bit bank-grade encryption. No hard credit pull.
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="py-2 px-4 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="py-2.5 px-5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <span>Proceed to Funding</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Funding */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-slate-400">Select initial funding amount to activate your account:</p>

                <div className="grid grid-cols-4 gap-2">
                  {[250, 1000, 2500, 5000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setInitialDeposit(amt)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        initialDeposit === amt
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      ${amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs text-slate-400 block mb-1">Custom Opening Deposit ($)</label>
                  <input
                    type="number"
                    min="25"
                    max="100000"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-emerald-400 focus:outline-none text-white text-base font-mono"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Selected Tier:</span>
                    <strong className="text-white">{accountName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Initial Deposit:</span>
                    <strong className="text-emerald-400 font-mono">{formatCurrency(initialDeposit)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Maintenance:</span>
                    <strong className="text-slate-200">$0.00</strong>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-2 px-4 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-6 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Establishing Account...</span>
                    ) : (
                      <>
                        <span>Approve & Open Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Completion State */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Welcome to Apex Bank
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Your new account has been officially established and funded. Member FDIC insured.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2 max-w-md mx-auto text-left font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Holder:</span>
                <span className="text-white font-sans font-semibold">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Number:</span>
                <span className="text-emerald-400 font-bold">{newAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Routing Number:</span>
                <span className="text-white">021000089</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Initial Balance:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(initialDeposit)}</span>
              </div>
            </div>

            <button
              onClick={handleFinishAndEnter}
              className="w-full py-3 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Access Digital Banking Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
