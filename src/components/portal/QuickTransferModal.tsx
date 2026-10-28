import React, { useState, useRef, useEffect } from 'react';
import { useBanking } from '../../context/BankingContext';
import { ALL_POSSIBLE_BANKS } from '../../data/externalBanks';
import { ExternalBank } from '../../types/banking';
import {
  X,
  Building2,
  Repeat,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface QuickTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'external' | 'internal';
}

export const QuickTransferModal: React.FC<QuickTransferModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'external',
}) => {
  const {
    accounts,
    executeTransfer,
    formatCurrency,
  } = useBanking();

  const [activeTab, setActiveTab] = useState<'external' | 'internal'>(initialTab);

  // Common State (Empty by default — no saved accounts or beneficiaries)
  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Internal Transfer State
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.id || accounts[0]?.id || '');

  // External Bank Search State (starts from 1st letter)
  const [bankQuery, setBankQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<ExternalBank | null>(null);
  const [routingNumber, setRoutingNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [wireRail, setWireRail] = useState<'wire_domestic' | 'fednow' | 'ach'>('wire_domestic');

  // Success / Receipt State
  const [transferReceipt, setTransferReceipt] = useState<{
    success: boolean;
    message: string;
    ref?: string;
    amount: number;
    destination: string;
    status: 'pending';
    rail?: string;
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

  if (!isOpen) return null;

  const selectedFromAcc = accounts.find((a) => a.id === fromAccountId);

  // Filter matching banks from letter 1
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

  const handleExternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid transfer amount.');
      return;
    }

    if (selectedFromAcc && numAmount > selectedFromAcc.availableBalance) {
      alert(`Insufficient funds. Available balance: ${formatCurrency(selectedFromAcc.availableBalance)}`);
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

    if (accountNumber !== confirmAccountNumber) {
      alert('Destination account numbers do not match.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = executeTransfer({
        fromAccountId,
        type: 'external',
        amount: numAmount,
        memo: memo.trim(),
        recipientName: beneficiaryName.trim(),
        externalBankName: bankQuery.trim(),
        externalRouting: routingNumber.trim(),
        externalAccount: accountNumber.trim(),
        speed: wireRail === 'ach' ? 'standard' : 'instant',
        wireType: wireRail,
      });

      setIsSubmitting(false);

      if (res.success) {
        setTransferReceipt({
          success: true,
          message: res.message,
          ref: res.transactionId,
          amount: numAmount,
          destination: `${bankQuery.trim()} (··${accountNumber.slice(-4)})`,
          status: 'pending',
          rail: wireRail === 'wire_domestic' ? 'Domestic FedWire' : wireRail === 'fednow' ? 'FedNow Instant' : 'Standard ACH',
        });
      }
    }, 600);
  };

  const handleInternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid transfer amount.');
      return;
    }

    if (fromAccountId === toAccountId) {
      alert('Source and destination accounts must be different.');
      return;
    }

    if (selectedFromAcc && numAmount > selectedFromAcc.availableBalance) {
      alert(`Insufficient funds. Available balance: ${formatCurrency(selectedFromAcc.availableBalance)}`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = executeTransfer({
        fromAccountId,
        toAccountId,
        type: 'internal',
        amount: numAmount,
        memo: memo.trim() || 'Internal Quick Transfer',
        speed: 'instant',
      });

      setIsSubmitting(false);

      if (res.success) {
        const toAcc = accounts.find((a) => a.id === toAccountId);
        setTransferReceipt({
          success: true,
          message: res.message,
          ref: res.transactionId,
          amount: numAmount,
          destination: toAcc?.name || 'Destination Account',
          status: 'pending',
          rail: 'Internal Account Transfer',
        });
      }
    }, 600);
  };

  const handleResetForm = () => {
    setTransferReceipt(null);
    setAmount('');
    setMemo('');
    setBeneficiaryName('');
    setAccountNumber('');
    setConfirmAccountNumber('');
    handleClearBank();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#004732] text-white flex items-center justify-center font-bold">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-none">
                Transfer Funds
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Send money via ACH, FedNow Instant, or Domestic FedWire.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('external');
                setTransferReceipt(null);
              }}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'external'
                  ? 'border-[#004732] text-[#004732]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Inter-Bank &amp; Wire
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('internal');
                setTransferReceipt(null);
              }}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'internal'
                  ? 'border-[#004732] text-[#004732]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Internal Account Transfer
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)] space-y-5">
          {transferReceipt ? (
            /* RECEIPT / PENDING CONFIRMATION */
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-[#004732] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Transfer Submitted</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Reference: <span className="font-mono font-bold text-slate-800">{transferReceipt.ref}</span>
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded p-4 text-xs text-left space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Amount Sent:</span>
                  <span className="font-bold text-[#004732] font-mono text-sm">{formatCurrency(transferReceipt.amount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-semibold text-slate-900">{transferReceipt.destination}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Settlement Rail:</span>
                  <span className="font-semibold text-slate-900">{transferReceipt.rail}</span>
                </div>
                <div className="flex justify-between py-1 items-center">
                  <span className="text-slate-500">Status:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1 border border-amber-200">
                    <Clock className="w-3 h-3" />
                    <span>Pending Bank Authorization</span>
                  </span>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
                >
                  Make Another Transfer
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#004732] hover:bg-[#003828] text-white text-xs font-semibold rounded-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : activeTab === 'external' ? (
            /* EXTERNAL & WIRE FORM */
            <form onSubmit={handleExternalSubmit} className="space-y-4">
              
              {/* 1. Source Account */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  1. From Account
                </label>
                <select
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:border-[#004732]"
                >
                  {accounts
                    .filter((a) => a.type !== 'credit')
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (··{acc.accountNumber.slice(-4)}) — Available: {formatCurrency(acc.availableBalance)}
                      </option>
                    ))}
                </select>
              </div>

              {/* 2. Destination Bank with Autocomplete from 1st Letter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative" ref={dropdownRef}>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    2. Receiving Bank Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type bank name (e.g. Chase, Wells, Citi)..."
                      value={bankQuery}
                      onChange={handleBankInputChange}
                      onFocus={() => {
                        if (bankQuery.trim().length >= 1) setIsDropdownOpen(true);
                      }}
                      required
                      autoComplete="off"
                      className="w-full pl-8 pr-7 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                    />
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    {bankQuery && (
                      <button
                        type="button"
                        onClick={handleClearBank}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown List */}
                  {isDropdownOpen && matchingBanks.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-slate-300 rounded-md shadow-lg divide-y divide-slate-100">
                      <div className="p-1.5 bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider sticky top-0">
                        Select Bank ({matchingBanks.length})
                      </div>
                      {matchingBanks.map((bank) => (
                        <div
                          key={bank.id}
                          onClick={() => handleSelectBank(bank)}
                          className="px-3 py-2 hover:bg-emerald-50 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {bank.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              ABA: <span className="font-semibold text-slate-800">{bank.routingNumber}</span> · {bank.cityState}
                            </p>
                          </div>
                          <span className="text-[9px] font-semibold text-[#004732] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                            {bank.shortCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedBank && (
                    <p className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified: {selectedBank.cityState}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    ABA Routing Number (9 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="e.g. 021000021"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>
              </div>

              {/* 3. Beneficiary & Account */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Beneficiary Name
                  </label>
                  <input
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    required
                    placeholder="Full legal name"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    placeholder="Account number"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirm Account
                  </label>
                  <input
                    type="text"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                    required
                    placeholder="Re-type account"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>
              </div>

              {/* 4. Rail */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Transfer Speed
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    onClick={() => setWireRail('wire_domestic')}
                    className={`p-2 rounded border cursor-pointer text-center transition-all ${
                      wireRail === 'wire_domestic'
                        ? 'bg-emerald-50/70 border-[#004732] ring-1 ring-[#004732]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">FedWire</p>
                    <p className="text-[10px] text-slate-500">Same-day wire</p>
                  </div>
                  <div
                    onClick={() => setWireRail('fednow')}
                    className={`p-2 rounded border cursor-pointer text-center transition-all ${
                      wireRail === 'fednow'
                        ? 'bg-emerald-50/70 border-[#004732] ring-1 ring-[#004732]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">FedNow</p>
                    <p className="text-[10px] text-slate-500">Instant rail</p>
                  </div>
                  <div
                    onClick={() => setWireRail('ach')}
                    className={`p-2 rounded border cursor-pointer text-center transition-all ${
                      wireRail === 'ach'
                        ? 'bg-emerald-50/70 border-[#004732] ring-1 ring-[#004732]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">Standard ACH</p>
                    <p className="text-[10px] text-slate-500">1-2 days</p>
                  </div>
                </div>
              </div>

              {/* 5. Amount & Memo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Amount ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-mono text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#004732]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Memo
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="e.g. Vendor payment"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#004732] hover:bg-[#003828] text-white text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Transfer...</span>
                  ) : (
                    <>
                      <span>Authorize &amp; Submit Transfer</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* INTERNAL ACCOUNT TRANSFER FORM */
            <form onSubmit={handleInternalSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  From Account
                </label>
                <select
                  value={fromAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                >
                  {accounts.filter((a) => a.type !== 'credit').map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (··{a.accountNumber.slice(-4)}) — Available: {formatCurrency(a.availableBalance)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  To Destination Account
                </label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (··{a.accountNumber.slice(-4)}) — Available: {formatCurrency(a.availableBalance)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Memo
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="e.g. Savings allocation"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#004732] hover:bg-[#003828] text-white text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Transfer...' : 'Submit Transfer'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
