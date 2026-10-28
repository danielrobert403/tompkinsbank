import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  FileText,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
} from 'lucide-react';
import { Transaction } from '../../types/banking';

interface TransactionsViewProps {
  onOpenStatement: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onOpenStatement }) => {
  const { transactions, accounts, formatCurrency } = useBanking();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<'all' | 'credit' | 'debit'>('all');
  const [viewingTx, setViewingTx] = useState<Transaction | null>(null);
  const [disputeMessage, setDisputeMessage] = useState<string | null>(null);

  // Categories list
  const categories = [
    'all',
    'Income & Salary',
    'Groceries & Dining',
    'Shopping & Retail',
    'Housing & Utilities',
    'Health & Wellness',
    'Entertainment',
    'Travel & Transit',
    'Transfers',
    'Investments & Interest',
  ];

  // Filtering
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = selectedAccount === 'all' || tx.accountId === selectedAccount;
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
    const matchesType = selectedType === 'all' || tx.type === selectedType;

    return matchesSearch && matchesAccount && matchesCategory && matchesType;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Account', 'Merchant', 'Description', 'Category', 'Type', 'Amount', 'Status'];
    const rows = filtered.map((tx) => [
      tx.id,
      tx.date,
      `"${tx.accountName}"`,
      `"${tx.merchant.replace(/"/g, '""')}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${tx.category}"`,
      tx.type,
      tx.amount,
      tx.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `apex_bank_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDispute = () => {
    setDisputeMessage('Dispute ticket #DIS-89104 logged. Our 24/7 fraud specialists have placed a provisional credit hold.');
    setTimeout(() => {
      setDisputeMessage(null);
      setViewingTx(null);
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Transaction Activity & Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete transaction records, certified statements, and CSV exports.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={onOpenStatement}
            className="py-2.5 px-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Monthly Statement</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by merchant name, description, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="all">All Accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="all">All Transactions</option>
              <option value="credit">Deposits & Credits (+)</option>
              <option value="debit">Withdrawals & Expenses (-)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Found {filtered.length} matching entries</span>
          {(searchTerm || selectedAccount !== 'all' || selectedCategory !== 'all' || selectedType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedAccount('all');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              className="text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Merchant & Description</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((tx, idx) => (
                <tr
                  key={`${tx.id}-${idx}`}
                  onClick={() => setViewingTx(tx)}
                  className="hover:bg-slate-900/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{tx.date}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-white font-sans text-xs">{tx.merchant}</p>
                    <p className="text-[11px] text-slate-400 font-sans truncate max-w-xs">{tx.description}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{tx.accountName}</td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{tx.category}</td>
                  <td
                    className={`py-3 px-4 text-right font-bold text-sm tabular-nums whitespace-nowrap ${
                      tx.amount > 0 ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No transactions match your search filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Drawer / Modal */}
      {viewingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100">
            <button
              onClick={() => {
                setViewingTx(null);
                setDisputeMessage(null);
              }}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-800 mb-4">
              <span className="text-xs uppercase font-semibold text-slate-400">Electronic Record</span>
              <h2 className="text-xl font-bold text-white mt-1">{viewingTx.merchant}</h2>
              <p
                className={`text-2xl font-bold font-mono tabular-nums mt-2 ${
                  viewingTx.amount > 0 ? 'text-emerald-400' : 'text-slate-200'
                }`}
              >
                {viewingTx.amount > 0 ? `+${formatCurrency(viewingTx.amount)}` : formatCurrency(viewingTx.amount)}
              </p>
            </div>

            {disputeMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs mb-4">
                {disputeMessage}
              </div>
            )}

            <div className="space-y-2 text-xs font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="text-white">{viewingTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account:</span>
                <span className="text-white">{viewingTx.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-white">{viewingTx.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-emerald-400">{viewingTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-300 uppercase font-semibold">{viewingTx.status}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDispute}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-colors"
              >
                Dispute Charge
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white text-xs font-semibold transition-colors"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
