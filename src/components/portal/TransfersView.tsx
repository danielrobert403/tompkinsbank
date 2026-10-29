import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Repeat,
  Send,
  ShieldCheck,
  Building,
  User,
  Zap,
  Lock,
} from 'lucide-react';
import { TransferRequest } from '../../types/banking';

export const TransfersView: React.FC = () => {
  const { accounts, executeTransfer, formatCurrency } = useBanking();

  const [transferType, setTransferType] = useState<'internal' | 'external' | 'p2p'>('internal');
  const [fromAccount, setFromAccount] = useState<string>(accounts[0]?.id || '');
  const [toAccount, setToAccount] = useState<string>(accounts[1]?.id || '');
  const [amount, setAmount] = useState<string>('500.00');
  const [memo, setMemo] = useState<string>('');
  const [securityPin, setSecurityPin] = useState<string>('');
  const [speed, setSpeed] = useState<'instant' | 'standard'>('instant');

  // External Wire State
  const [recipientName, setRecipientName] = useState<string>('');
  const [externalRouting, setExternalRouting] = useState<string>('021000089');
  const [externalAccount, setExternalAccount] = useState<string>('');

  // P2P State
  const [p2pHandle, setP2pHandle] = useState<string>('');
  const [recentContacts] = useState([
    { name: 'Alex Rivera', handle: 'alex.rivera@email.com', avatar: 'AR' },
    { name: 'Emily Chen', handle: '(415) 555-8910', avatar: 'EC' },
    { name: 'Marcus Brody', handle: 'mbrody@designlab.co', avatar: 'MB' },
    { name: 'Beacon Property Management', handle: 'rent@beaconpm.com', avatar: 'BP' },
  ]);

  const [feedback, setFeedback] = useState<{ success: boolean; message: string; ref?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFromAccount = accounts.find((a) => a.id === fromAccount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setFeedback({ success: false, message: 'Please enter a valid transfer amount.' });
      return;
    }

    if (transferType === 'internal' && fromAccount === toAccount) {
      setFeedback({ success: false, message: 'Source and destination accounts must be different.' });
      return;
    }

    if (transferType === 'external' && (!recipientName.trim() || !externalAccount.trim())) {
      setFeedback({ success: false, message: 'Please provide recipient name and account number.' });
      return;
    }

    if (transferType === 'p2p' && !p2pHandle.trim()) {
      setFeedback({ success: false, message: 'Please provide recipient email or phone number.' });
      return;
    }

    if (!securityPin.trim()) {
      setFeedback({ success: false, message: 'Please enter your 4-digit Security PIN.' });
      return;
    }

    if (securityPin.trim() !== '0502') {
      setFeedback({ success: false, message: 'Invalid Security PIN. Authorization denied (PIN: 0502).' });
      return;
    }

    setIsProcessing(true);
    setFeedback(null);

    setTimeout(() => {
      const payload: TransferRequest = {
        fromAccountId: fromAccount,
        toAccountId: transferType === 'internal' ? toAccount : undefined,
        type: transferType,
        amount: numAmount,
        memo: memo.trim(),
        recipientName: transferType === 'external' ? recipientName : undefined,
        recipientHandle: transferType === 'p2p' ? p2pHandle : undefined,
        externalRouting: transferType === 'external' ? externalRouting : undefined,
        externalAccount: transferType === 'external' ? externalAccount : undefined,
        speed,
        securityPin: securityPin.trim(),
      };

      const result = executeTransfer(payload);
      setIsProcessing(false);
      setFeedback({
        success: result.success,
        message: result.message,
        ref: result.transactionId,
      });

      if (result.success) {
        setAmount('');
        setMemo('');
      }
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Money Movement & Transfers
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Instant internal transfers, FedNow domestic wire networks, and Apex Pay P2P.
        </p>
      </div>

      {/* Rail Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => {
            setTransferType('internal');
            setFeedback(null);
          }}
          className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            transferType === 'internal'
              ? 'bg-slate-950 text-white shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Repeat className="w-4 h-4 text-emerald-400" />
          <span>Internal Accounts</span>
        </button>

        <button
          onClick={() => {
            setTransferType('external');
            setFeedback(null);
          }}
          className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            transferType === 'external'
              ? 'bg-slate-950 text-white shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4 text-blue-400" />
          <span>Wire & External ACH</span>
        </button>

        <button
          onClick={() => {
            setTransferType('p2p');
            setFeedback(null);
          }}
          className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            transferType === 'p2p'
              ? 'bg-slate-950 text-white shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4 text-purple-400" />
          <span>Apex Pay (P2P)</span>
        </button>
      </div>

      {/* Success / Error Notification Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in ${
            feedback.success
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <p className="font-semibold">{feedback.message}</p>
            {feedback.ref && (
              <p className="text-[11px] font-mono mt-1 opacity-80">Reference Conf #{feedback.ref}</p>
            )}
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* Source Account */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            From Account
          </label>
          <select
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
          >
            {accounts
              .filter((a) => a.type !== 'credit')
              .map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (··{acc.accountNumber.slice(-4)}) — Available: {formatCurrency(acc.availableBalance)}
                </option>
              ))}
          </select>
          {selectedFromAccount && (
            <p className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Current Available Balance:</span>
              <strong className="text-emerald-400 font-mono">{formatCurrency(selectedFromAccount.availableBalance)}</strong>
            </p>
          )}
        </div>

        {/* Rail Specific Destination Controls */}
        {transferType === 'internal' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              To Account
            </label>
            <select
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (··{acc.accountNumber.slice(-4)})
                  {acc.type === 'credit'
                    ? ` — Pay Balance: ${formatCurrency(acc.balance)}`
                    : ` — Current: ${formatCurrency(acc.balance)}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {transferType === 'external' && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Recipient Legal Name / Institution</label>
              <input
                type="text"
                placeholder="e.g. Acme Corporation or Robert Davis"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">9-Digit Routing (ABA) Number</label>
                <input
                  type="text"
                  maxLength={9}
                  placeholder="021000089"
                  value={externalRouting}
                  onChange={(e) => setExternalRouting(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">External Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9812741920"
                  value={externalAccount}
                  onChange={(e) => setExternalAccount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Wire Velocity */}
            <div className="pt-2">
              <label className="text-xs text-slate-400 block mb-2">Settlement Speed</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSpeed('instant')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    speed === 'instant'
                      ? 'bg-slate-900 border-emerald-500/80 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>FedNow Instant Wire</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Settles in &lt;10 seconds · $0 fee</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSpeed('standard')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    speed === 'standard'
                      ? 'bg-slate-900 border-emerald-500/80 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Standard ACH</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">1-2 business days · $0 fee</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {transferType === 'p2p' && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Recipient Email, Mobile Phone, or Apex Handle
              </label>
              <input
                type="text"
                placeholder="e.g. emily.chen@email.com or (415) 555-8910"
                value={p2pHandle}
                onChange={(e) => setP2pHandle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Quick Contacts */}
            <div>
              <p className="text-xs text-slate-400 mb-2">Recent Trusted Contacts:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {recentContacts.map((contact) => (
                  <button
                    type="button"
                    key={contact.handle}
                    onClick={() => {
                      setP2pHandle(contact.handle);
                      setRecipientName(contact.name);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2.5 ${
                      p2pHandle === contact.handle
                        ? 'bg-slate-900 border-emerald-500/80'
                        : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {contact.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{contact.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{contact.handle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transfer Amount Input */}
        <div className="pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 font-mono text-xl">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xl font-bold font-mono text-white focus:outline-none focus:border-emerald-400 tabular-nums"
            />
          </div>

          <div className="flex gap-2 mt-2">
            {[100, 500, 1000, 2500].map((quickAmt) => (
              <button
                type="button"
                key={quickAmt}
                onClick={() => setAmount(String(quickAmt))}
                className="py-1 px-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
              >
                +${quickAmt}
              </button>
            ))}
          </div>
        </div>

        {/* Memo / Description */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Transfer Memo / Note (Optional)</label>
          <input
            type="text"
            placeholder="e.g. November Rent, Project Reimbursement, Reserve Allocation"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Security Authorization PIN */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security Authorization PIN</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">4-digit code </span>
          </div>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            placeholder="Enter 4-digit PIN (••••)"
            value={securityPin}
            onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono tracking-widest text-white focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Fee & Security Summary */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Apex Zero-Fee Transfer Guarantee</span>
          </div>
          <span className="font-mono text-white font-semibold">Fee: $0.00</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Securing Transfer Settlement...</span>
          ) : (
            <>
              <span>Authorize & Send Transfer</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
