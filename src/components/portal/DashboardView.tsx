import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  PlusCircle,
  QrCode,
  Repeat,
  Send,
  ShieldAlert,
  Sparkles,
  Wallet,
  ArrowRight,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import { BankAccount } from '../../types/banking';

interface DashboardViewProps {
  onOpenAccount: () => void;
  onOpenStatement: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAccount, onOpenStatement }) => {
  const {
    user,
    accounts,
    transactions,
    goals,
    cards,
    setActivePortalTab,
    setSelectedAccountId,
    selectedAccountId,
    formatCurrency,
  } = useBanking();

  const [txSearch, setTxSearch] = useState('');

  // Calculate Net Worth / Total Liquid Assets
  const totalAssets = accounts
    .filter((a) => a.type !== 'credit')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.type === 'credit')
    .reduce((sum, a) => sum + a.balance, 0);

  const netLiquidity = totalAssets - totalLiabilities;

  const filteredTransactions = transactions.filter((tx) => {
    const matchesAccount = selectedAccountId === 'all' || tx.accountId === selectedAccountId;
    const matchesSearch =
      tx.merchant.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.description.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.category.toLowerCase().includes(txSearch.toLowerCase());
    return matchesAccount && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner: Greeting, Account Overview & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <span>{user.tier}</span>
            <span>·</span>
            <span className="text-slate-400">Account #··4821</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            All accounts in optimal standing. Direct deposit payroll cleared.
          </p>
        </div>

        {/* Global Net Liquidity Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-6 self-start md:self-auto">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Net Liquidity</p>
            <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {formatCurrency(netLiquidity)}
            </p>
          </div>
          <div className="border-l border-slate-800 pl-4 space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Liquid Assets:</span>
              <span className="text-emerald-400 font-mono font-semibold">{formatCurrency(totalAssets)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Credit Drawn:</span>
              <span className="text-slate-300 font-mono font-semibold">{formatCurrency(totalLiabilities)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setActivePortalTab('transfers')}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
            <Repeat className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white">Transfer Funds</p>
          <p className="text-[11px] text-slate-400">Internal & Wire</p>
        </button>

        <button
          onClick={() => setActivePortalTab('deposit')}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-105 transition-transform">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white">Deposit Check</p>
          <p className="text-[11px] text-slate-400">Mobile Capture</p>
        </button>

        <button
          onClick={() => setActivePortalTab('billpay')}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-105 transition-transform">
            <Send className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white">Bill Pay</p>
          <p className="text-[11px] text-slate-400">Utilities & Loans</p>
        </button>

        <button
          onClick={() => setActivePortalTab('cards')}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-105 transition-transform">
            <CreditCard className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white">Card Controls</p>
          <p className="text-[11px] text-slate-400">Freeze & Virtual</p>
        </button>

        <button
          onClick={onOpenStatement}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors group col-span-2 sm:col-span-1"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
            <Download className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white">Statements</p>
          <p className="text-[11px] text-slate-400">Official Monthly PDF</p>
        </button>
      </div>

      {/* Primary Account Balances Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Deposit & Lending Accounts</h2>
          <button
            onClick={onOpenAccount}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Open Additional Account</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((acc) => {
            const isSelected = selectedAccountId === acc.id;
            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAccountId(isSelected ? 'all' : acc.id)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/40 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold text-white tracking-tight">{acc.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">····{acc.accountNumber.slice(-4)}</p>
                  </div>
                  {acc.interestRate && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      {acc.interestRate}% APY
                    </span>
                  )}
                  {acc.type === 'credit' && (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      Due Nov 15
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">
                    {acc.type === 'credit' ? 'Current Balance Owed' : 'Available Balance'}
                  </p>
                  <p className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
                    {formatCurrency(acc.balance)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  {acc.type === 'credit' ? (
                    <>
                      <span>Limit: {formatCurrency(acc.creditLimit || 25000)}</span>
                      <span className="text-emerald-400 font-semibold">{formatCurrency((acc.creditLimit || 25000) - acc.balance)} Available</span>
                    </>
                  ) : acc.type === 'savings' ? (
                    <>
                      <span>Compounded Daily</span>
                      <span className="text-emerald-400 font-semibold">Yield Active</span>
                    </>
                  ) : (
                    <>
                      <span>Routing: 021000089</span>
                      <span className="text-slate-300">Direct Deposit Ready</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split: Recent Activity & Financial Health Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Transaction Ledger */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Recent Account Activity</h3>
              <p className="text-xs text-slate-400">
                {selectedAccountId === 'all'
                  ? 'Showing transactions across all accounts'
                  : `Filtered by ${accounts.find((a) => a.id === selectedAccountId)?.name}`}
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search merchant or category..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 w-44 sm:w-56"
                />
              </div>

              {selectedAccountId !== 'all' && (
                <button
                  onClick={() => setSelectedAccountId('all')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 border border-slate-800 transition-colors whitespace-nowrap"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Transactions List */}
          <div className="divide-y divide-slate-800/80">
            {filteredTransactions.slice(0, 8).map((tx, idx) => (
              <div
                key={`${tx.id}-${idx}`}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.amount > 0
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-300'
                    }`}
                  >
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{tx.merchant}</p>
                    <p className="text-[11px] text-slate-400 truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span>{tx.date}</span>
                      <span>·</span>
                      <span>{tx.category}</span>
                      <span>·</span>
                      <span className="text-slate-400">{tx.accountName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-xs sm:text-sm font-bold font-mono tabular-nums ${
                      tx.amount > 0 ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {tx.status === 'cleared' ? 'Cleared' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs">
            <span className="text-slate-400">
              Showing {Math.min(8, filteredTransactions.length)} of {filteredTransactions.length} items
            </span>
            <button
              onClick={() => setActivePortalTab('activity')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Savings Goals & Security Snapshot */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Savings Goals Widget */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Target Savings Goals</h3>
              <button
                onClick={() => setActivePortalTab('analytics')}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Manage
              </button>
            </div>

            <div className="space-y-4">
              {goals.map((g) => {
                const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                return (
                  <div key={g.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{g.name}</span>
                      <span className="font-mono text-emerald-400 tabular-nums">{percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: g.color }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>{formatCurrency(g.currentAmount)}</span>
                      <span>Target: {formatCurrency(g.targetAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Obsidian Card Quick Status */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Apex Obsidian Metal</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Cash Back Rewards Available</p>
              <p className="text-2xl font-bold text-white font-mono tabular-nums">$340.50</p>
              <p className="text-[11px] text-slate-400">34,050 points · Redeemable for statement credit</p>
            </div>

            <button
              onClick={() => setActivePortalTab('cards')}
              className="w-full py-2 px-3 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              Card Controls & Travel Notices
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
