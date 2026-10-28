import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { Download, Printer, ShieldCheck, X } from 'lucide-react';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatementModal: React.FC<StatementModalProps> = ({ isOpen, onClose }) => {
  const { user, accounts, transactions, formatCurrency } = useBanking();

  if (!isOpen) return null;

  const checkingAcc = accounts.find((a) => a.type === 'checking') || accounts[0];
  const statementPeriod = 'October 01, 2026 – October 31, 2026';

  const checkingTransactions = transactions.filter(
    (tx) => tx.accountId === checkingAcc.id
  );

  const totalCredits = checkingTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDebits = checkingTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const startingBalance = checkingAcc.balance - totalCredits + totalDebits;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-xl p-6 sm:p-10 my-8 text-slate-800 font-sans print:border-none print:shadow-none print:p-0">
        
        {/* Actions bar (hidden in print) */}
        <div className="flex justify-between items-center pb-6 border-b border-slate-200 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#004732]">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Bank Statement · Member FDIC</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="py-1.5 px-3 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Bank Statement Document */}
        <div className="space-y-6">
          
          {/* Statement Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#004732] rounded-sm flex flex-col items-center justify-center text-white p-1">
                <span className="text-[9px] font-black tracking-tighter uppercase leading-none">APEX</span>
                <span className="text-[7px] font-bold tracking-widest uppercase mt-0.5">BANK</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Apex Bank, N.A.</h1>
                <p className="text-[11px] text-slate-500">Member FDIC · Equal Housing Lender · ABA Routing #021000089</p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <p className="text-slate-500">Statement Period:</p>
              <p className="text-slate-900 font-semibold">{statementPeriod}</p>
            </div>
          </div>

          {/* Account & Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-4 rounded border border-slate-200">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-sans font-bold">Account Holder</p>
              <p className="text-slate-900 font-bold text-sm font-sans">{user.name}</p>
              <p className="text-slate-600 font-sans">500 Howard Street, Suite 1400</p>
              <p className="text-slate-600 font-sans">San Francisco, CA 94105</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Account Type:</span>
                <span className="text-slate-900 font-semibold font-sans">{checkingAcc.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Account Number:</span>
                <span className="text-[#004732] font-bold">••••{checkingAcc.accountNumber.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Annual Percentage Yield (APY):</span>
                <span className="text-slate-900">{checkingAcc.interestRate || '0.25'}%</span>
              </div>
            </div>
          </div>

          {/* Balance Activity Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <p className="text-slate-500 text-[10px] uppercase font-sans">Starting Balance</p>
              <p className="text-sm font-bold text-slate-800 mt-1 tabular-nums">{formatCurrency(startingBalance)}</p>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <p className="text-slate-500 text-[10px] uppercase font-sans">Total Deposits (+)</p>
              <p className="text-sm font-bold text-emerald-600 mt-1 tabular-nums">+{formatCurrency(totalCredits)}</p>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <p className="text-slate-500 text-[10px] uppercase font-sans">Total Withdrawals (-)</p>
              <p className="text-sm font-bold text-slate-800 mt-1 tabular-nums">-{formatCurrency(totalDebits)}</p>
            </div>
            <div className="p-3 rounded bg-blue-50 border border-blue-200">
              <p className="text-slate-500 text-[10px] uppercase font-sans">Ending Balance</p>
              <p className="text-sm font-bold text-[#004732] mt-1 tabular-nums">{formatCurrency(checkingAcc.balance)}</p>
            </div>
          </div>

          {/* Itemized Transaction Ledger */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Itemized Checking Transactions
            </h2>

            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {checkingTransactions.map((tx, idx) => (
                    <tr key={`${tx.id}-${idx}`} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-500">{tx.date}</td>
                      <td className="py-2 px-3 font-medium text-slate-900 font-sans">{tx.merchant} - {tx.description}</td>
                      <td className="py-2 px-3 text-slate-500 font-sans">{tx.category}</td>
                      <td
                        className={`py-2 px-3 text-right font-bold tabular-nums ${
                          tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal FDIC statement footer */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed font-sans">
            <p>
              IN CASE OF ERRORS OR QUESTIONS ABOUT YOUR ELECTRONIC TRANSFERS: Telephone us at 1-800-APEX-VIP or write us at Apex Bank, Customer Service Dispute Department, PO Box 84210, San Francisco, CA. All deposits are insured up to $250,000 by the Federal Deposit Insurance Corporation (FDIC).
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
