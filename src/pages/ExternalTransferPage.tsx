import React, { useState, useRef, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { ALL_POSSIBLE_BANKS } from '../data/externalBanks';
import { ExternalBank } from '../types/banking';
import {
  Building2,
  CheckCircle2,
  Clock,
  Search,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  Lock,
  ChevronDown,
  X,
  AlertCircle,
} from 'lucide-react';

export const ExternalTransferPage: React.FC = () => {
  const { accounts, executeTransfer, formatCurrency, setActivePage } = useBanking();

  // Source Account
  const [fromAccount, setFromAccount] = useState<string>(accounts[0]?.id || '');
  const selectedFromAcc = accounts.find((a) => a.id === fromAccount);

  // Bank search & autocomplete (shows dropdown from the 1st letter typed)
  const [bankQuery, setBankQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<ExternalBank | null>(null);
  const [routingNumber, setRoutingNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Beneficiary details (Empty by default — no saved accounts or beneficiaries)
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [wireType, setWireType] = useState<'wire_domestic' | 'fednow' | 'ach'>('wire_domestic');
  const [memo, setMemo] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{
    success: boolean;
    message: string;
    ref?: string;
    amount: number;
    bankName: string;
    routing: string;
    accountMasked: string;
    status: string;
  } | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter banks across all possible banks from the first letter
  const searchTrimmed = bankQuery.trim().toLowerCase();
  const matchingBanks = searchTrimmed.length >= 1
    ? ALL_POSSIBLE_BANKS.filter((b) => {
        return (
          b.name.toLowerCase().includes(searchTrimmed) ||
          b.shortCode.toLowerCase().includes(searchTrimmed) ||
          b.routingNumber.includes(searchTrimmed) ||
          b.cityState.toLowerCase().includes(searchTrimmed)
        );
      })
    : [];

  const handleSelectBank = (bank: ExternalBank) => {
    setSelectedBank(bank);
    setBankQuery(bank.name);
    setRoutingNumber(bank.routingNumber);
    setIsDropdownOpen(false);
  };

  const handleBankInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBankQuery(val);
    setSelectedBank(null);
    setIsDropdownOpen(val.trim().length >= 1);
  };

  const handleClearBank = () => {
    setBankQuery('');
    setSelectedBank(null);
    setRoutingNumber('');
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid transfer amount.');
      return;
    }

    if (selectedFromAcc && numAmount > selectedFromAcc.availableBalance) {
      alert(`Insufficient funds. Your available balance is ${formatCurrency(selectedFromAcc.availableBalance)}.`);
      return;
    }

    if (!bankQuery.trim()) {
      alert('Please enter or select a receiving bank.');
      return;
    }

    if (!routingNumber.trim() || routingNumber.trim().length < 9) {
      alert('Please provide a valid 9-digit ABA routing number.');
      return;
    }

    if (accountNumber.trim() !== confirmAccountNumber.trim()) {
      alert('Destination account numbers do not match.');
      return;
    }

    if (!securityPin.trim()) {
      setPinError('Please enter your 4-digit Security PIN.');
      return;
    }

    if (securityPin.trim() !== '0502') {
      setPinError('Invalid Security PIN. Authorization denied (PIN: 0502).');
      return;
    }

    setPinError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = executeTransfer({
        fromAccountId: fromAccount,
        type: 'external',
        amount: numAmount,
        memo: memo.trim(),
        recipientName: beneficiaryName.trim(),
        externalBankName: bankQuery.trim(),
        externalRouting: routingNumber.trim(),
        externalAccount: accountNumber.trim(),
        speed: wireType === 'ach' ? 'standard' : 'instant',
        wireType,
        securityPin: securityPin.trim(),
      });

      setIsSubmitting(false);

      if (res.success) {
        setReceipt({
          success: true,
          message: res.message,
          ref: res.transactionId,
          amount: numAmount,
          bankName: bankQuery.trim(),
          routing: routingNumber.trim(),
          accountMasked: `••••${accountNumber.slice(-4)}`,
          status: 'Pending',
        });
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-8 px-4 sm:px-6">
      <div className="max-w-[1000px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#004732]">
              Money Movement
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
              Inter-Bank Transfer
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Transfer funds to any verified US financial institution or credit union via Standard ACH, FedNow Instant, or Domestic FedWire.
            </p>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-200 pt-2 text-xs font-semibold">
            <button
              type="button"
              className="pb-2.5 px-3 border-b-2 border-[#004732] text-[#004732] flex items-center gap-1.5"
            >
              <span>External &amp; Wire Transfer</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePage('my-account')}
              className="pb-2.5 px-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
            >
              <span>Internal Account Transfer</span>
            </button>
          </div>
        </div>

        {!receipt ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Source Account */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#004732] text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Select Source Account</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts
                  .filter((a) => a.type !== 'credit')
                  .map((acc) => {
                    const isSelected = fromAccount === acc.id;
                    return (
                      <div
                        key={acc.id}
                        onClick={() => setFromAccount(acc.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50/60 border-[#004732] ring-1 ring-[#004732]'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{acc.name}</p>
                            <p className="text-xs text-slate-500 font-mono">•••• {acc.accountNumber.slice(-4)}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#004732]">
                            {formatCurrency(acc.availableBalance)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Step 2: Destination Bank Selection with Instant Autocomplete */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#004732] text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Receiving Bank Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Bank Name with Dropdown from 1st Letter */}
                <div className="relative" ref={dropdownRef}>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Receiving Bank Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Start typing bank name (e.g. Chase, Wells, Citi, Bank of America)..."
                      value={bankQuery}
                      onChange={handleBankInputChange}
                      onFocus={() => {
                        if (bankQuery.trim().length >= 1) setIsDropdownOpen(true);
                      }}
                      required
                      autoComplete="off"
                      className="w-full pl-9 pr-8 py-2.5 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732] focus:ring-1 focus:ring-[#004732]"
                    />
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    {bankQuery && (
                      <button
                        type="button"
                        onClick={handleClearBank}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown List */}
                  {isDropdownOpen && matchingBanks.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-slate-300 rounded-md shadow-lg divide-y divide-slate-100">
                      <div className="p-2 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider sticky top-0 flex justify-between items-center">
                        <span>Matching Banks ({matchingBanks.length})</span>
                        <span className="text-[10px] lowercase font-normal text-slate-400">click to autofill routing</span>
                      </div>
                      {matchingBanks.map((bank) => (
                        <div
                          key={bank.id}
                          onClick={() => handleSelectBank(bank)}
                          className="px-3 py-2.5 hover:bg-emerald-50/70 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {bank.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              ABA Routing: <span className="font-semibold text-slate-800">{bank.routingNumber}</span> · {bank.cityState}
                            </p>
                          </div>
                          <span className="text-[10px] font-semibold text-[#004732] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                            {bank.shortCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {isDropdownOpen && matchingBanks.length === 0 && bankQuery.trim().length >= 1 && (
                    <div className="absolute z-30 left-0 right-0 mt-1 p-3 bg-white border border-slate-300 rounded-md shadow-lg text-xs text-slate-600">
                      <p className="font-semibold text-slate-800">Custom Bank: &ldquo;{bankQuery}&rdquo;</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Not in standard pre-fill list. You can proceed by manually entering the 9-digit ABA routing number below.
                      </p>
                    </div>
                  )}

                  {selectedBank && (
                    <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Institution: {selectedBank.cityState}
                    </p>
                  )}
                </div>

                {/* ABA Routing Number Field (Auto-filled or manual) */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    9-Digit ABA Routing Number
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="e.g. 021000021"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full px-3 py-2.5 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#004732] focus:ring-1 focus:ring-[#004732]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    FedWire &amp; FedACH electronic routing identifier
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Beneficiary Details */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#004732] text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Beneficiary &amp; Destination Account</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Beneficiary Name / Entity
                  </label>
                  <input
                    type="text"
                    placeholder="Full legal name or business"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Destination Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirm Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Re-type account number"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>
              </div>

              {/* Settlement Rail */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Settlement Rail &amp; Speed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setWireType('wire_domestic')}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      wireType === 'wire_domestic'
                        ? 'bg-emerald-50/70 border-[#004732] ring-1 ring-[#004732]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#004732]" />
                      <span className="text-xs font-bold text-slate-900">Domestic FedWire</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Same-day settlement · $0.00 fee</p>
                  </div>

                  <div
                    onClick={() => setWireType('fednow')}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      wireType === 'fednow'
                        ? 'bg-emerald-50/70 border-[#004732] ring-1 ring-[#004732]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#004732]" />
                      <span className="text-xs font-bold text-slate-900">FedNow Instant</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Real-time instant rail</p>
                  </div>

                  <div
                    onClick={() => setWireType('ach')}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      wireType === 'ach'
                        ? 'bg-emerald-50/70 border-[#004732] ring-1 ring-[#004732]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-900">Standard ACH</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">1-2 business days clearance</p>
                  </div>
                </div>
              </div>

              {/* Amount & Memo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Transfer Amount ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-mono font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded font-mono text-base font-bold text-slate-900 focus:outline-none focus:border-[#004732]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {[250, 500, 1000, 2500, 5000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setAmount(String(amt))}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-mono text-slate-700 transition-colors"
                      >
                        +${amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Transfer Memo / Reference Note
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="e.g. Invoice payment, personal transfer"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>
              </div>

            </div>

            {/* Step 5: Security Authorization PIN */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#004732] text-white flex items-center justify-center text-xs font-bold">5</span>
                  <span>Security Authorization PIN</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">4-digit code (0502)</span>
              </div>
              <div className="max-w-xs">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN (••••)"
                  value={securityPin}
                  onChange={(e) => {
                    setSecurityPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                    if (pinError) setPinError(null);
                  }}
                  required
                  className={`w-full px-3 py-2 border rounded font-mono text-base tracking-widest text-slate-900 focus:outline-none focus:border-[#004732] ${
                    pinError ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500' : 'border-slate-300'
                  }`}
                />
                {pinError && (
                  <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#004732] hover:bg-[#003828] active:bg-[#002B1F] text-white text-sm font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Transfer Request...</span>
              ) : (
                <>
                  <span>Submit Transfer for Authorization</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Confirmation Receipt */
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs max-w-xl mx-auto space-y-6 text-center animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-[#004732] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">Transfer Submitted</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your transfer request has been recorded and submitted for administrative approval.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs font-mono text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Destination Bank:</span>
                <span className="font-bold text-slate-900">{receipt.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">ABA Routing Number:</span>
                <span className="text-slate-900">{receipt.routing}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Account:</span>
                <span className="text-slate-900">{receipt.accountMasked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Amount:</span>
                <span className="text-[#004732] font-bold text-sm">
                  {formatCurrency(receipt.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Reference ID:</span>
                <span className="text-slate-800">{receipt.ref}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-sans">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {receipt.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setReceipt(null);
                  handleClearBank();
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
              >
                Send Another Transfer
              </button>
              <button
                onClick={() => setActivePage('my-account')}
                className="flex-1 py-2.5 bg-[#004732] hover:bg-[#003828] text-white text-xs font-semibold rounded-md transition-colors"
              >
                Return to My Account
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
