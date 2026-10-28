import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  Calendar,
  CheckCircle2,
  PlusCircle,
  Send,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
} from 'lucide-react';
import { Payee } from '../../types/banking';

export const BillPayView: React.FC = () => {
  const { payees, accounts, payBill, addPayee, formatCurrency } = useBanking();

  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const [payAmount, setPayAmount] = useState<string>('');
  const [payFromAccount, setPayFromAccount] = useState<string>(accounts[0]?.id || '');
  const [isPaying, setIsPaying] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Add Payee State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAccount, setNewPayeeAccount] = useState('');
  const [newPayeeCategory, setNewPayeeCategory] = useState('Utilities');
  const [newPayeeTypicalAmount, setNewPayeeTypicalAmount] = useState('120');

  const handleOpenPay = (payee: Payee) => {
    setSelectedPayee(payee);
    setPayAmount(String(payee.typicalAmount));
    setFeedback(null);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayee) return;

    const numAmount = parseFloat(payAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    setIsPaying(true);
    setFeedback(null);

    setTimeout(() => {
      const result = payBill(selectedPayee.id, payFromAccount, numAmount);
      setIsPaying(false);
      setFeedback(result);
      if (result.success) {
        setTimeout(() => setSelectedPayee(null), 1200);
      }
    }, 700);
  };

  const handleCreatePayee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayeeName.trim()) return;

    addPayee(
      newPayeeName.trim(),
      newPayeeAccount.trim(),
      newPayeeCategory,
      parseFloat(newPayeeTypicalAmount) || 100
    );

    setShowAddModal(false);
    setNewPayeeName('');
    setNewPayeeAccount('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Bill Pay & Scheduled Disbursals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage utility billers, mortgages, telecom, and automated merchant remittances.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Add New Payee</span>
        </button>
      </div>

      {/* Payee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payees.map((payee) => (
          <div
            key={payee.id}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{payee.name}</h3>
                    <p className="text-[11px] text-slate-400">{payee.category} · Acct {payee.accountNumberMasked}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    payee.status === 'paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {payee.status === 'paid' ? 'Paid This Cycle' : 'Due ' + payee.dueDate}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Standard Amount:</span>
                <span className="text-white font-bold tabular-nums">
                  {formatCurrency(payee.typicalAmount)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 flex gap-2">
              <button
                onClick={() => handleOpenPay(payee)}
                className="w-full py-2 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Pay Bill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pay Bill Drawer Modal */}
      {selectedPayee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Electronic Remittance
                </span>
                <h2 className="text-xl font-bold text-white">Pay {selectedPayee.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Account: {selectedPayee.accountNumberMasked}</p>
              </div>
              <button
                onClick={() => setSelectedPayee(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800"
              >
                Cancel
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs mb-4 flex items-center gap-2 ${
                  feedback.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleExecutePayment} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pay From Account</label>
                <select
                  value={payFromAccount}
                  onChange={(e) => setPayFromAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
                >
                  {accounts
                    .filter((a) => a.type !== 'credit')
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} — Available: {formatCurrency(acc.availableBalance)}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Payment Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-slate-400 font-mono text-base">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1.00"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-base font-bold font-mono text-white focus:outline-none focus:border-emerald-400 tabular-nums"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Guaranteed Delivery Date:</span>
                  <strong className="text-white">Same-Day Electronic Clearance</strong>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <strong className="text-emerald-400">$0.00</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPaying}
                className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isPaying ? 'Transmitting Payment...' : 'Authorize & Send Bill Payment'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Add Payee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Add New Payee</h2>
                <p className="text-xs text-slate-400 mt-0.5">Link a new utility or commercial billing account.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreatePayee} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Company / Payee Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pacific Electric or State Farm"
                  value={newPayeeName}
                  onChange={(e) => setNewPayeeName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Account Number with Payee</label>
                <input
                  type="text"
                  placeholder="e.g. 892019401"
                  value={newPayeeAccount}
                  onChange={(e) => setNewPayeeAccount(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={newPayeeCategory}
                    onChange={(e) => setNewPayeeCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Electricity & Gas">Electricity & Gas</option>
                    <option value="Telecom & Fiber">Telecom & Fiber</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Mortgage & Rent">Mortgage & Rent</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Standard Amount ($)</label>
                  <input
                    type="number"
                    value={newPayeeTypicalAmount}
                    onChange={(e) => setNewPayeeTypicalAmount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors mt-2"
              >
                Save Payee
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
