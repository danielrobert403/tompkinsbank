import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
  PlusCircle,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { transactions, goals, accounts, contributeToGoal, formatCurrency } = useBanking();

  // State for Goal Contribution Modal
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>('500');
  const [fromAccount, setFromAccount] = useState<string>(accounts[0]?.id || '');
  const [isContributing, setIsContributing] = useState(false);

  // Compute Cash Flow
  const totalInflow = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOutflow = transactions
    .filter((tx) => tx.amount < 0 && tx.category !== 'Transfers')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const netSavings = totalInflow - totalOutflow;
  const savingsRate = totalInflow > 0 ? Math.round((netSavings / totalInflow) * 100) : 0;

  // Category Breakdown
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((tx) => tx.amount < 0 && tx.category !== 'Transfers')
    .forEach((tx) => {
      const amt = Math.abs(tx.amount);
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;
    });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId) return;

    const amt = parseFloat(contributionAmount);
    if (isNaN(amt) || amt <= 0) return;

    setIsContributing(true);
    setTimeout(() => {
      contributeToGoal(selectedGoalId, fromAccount, amt);
      setIsContributing(false);
      setSelectedGoalId(null);
      setContributionAmount('500');
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Financial Intelligence & Cash Flow
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time expense categorization, monthly liquidity velocity, and goal vaults.
        </p>
      </div>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            <span>Monthly Inflow</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
            +{formatCurrency(totalInflow)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Payroll, APY interest & check deposits</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
            <span>Monthly Outflow</span>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
            -{formatCurrency(totalOutflow)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Bills, lifestyle & card purchases</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Net Capital Retained</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-300 font-mono tabular-nums">
            +{formatCurrency(netSavings)}
          </p>
          <p className="text-[11px] text-emerald-400/80 font-mono mt-1 font-semibold">
            {savingsRate}% Net Savings Velocity
          </p>
        </div>

      </div>

      {/* Split: Spending by Category & Savings Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Spending Category Breakdown */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Spending by Category</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Total: {formatCurrency(totalOutflow)}
            </span>
          </div>

          <div className="space-y-4">
            {sortedCategories.map(([cat, amt]) => {
              const pct = totalOutflow > 0 ? Math.round((amt / totalOutflow) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat}</span>
                    <span className="font-mono text-white tabular-nums">
                      {formatCurrency(amt)} <span className="text-slate-500 text-[10px]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Savings Goal Vaults */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Target Savings Vaults</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              {goals.length} Goals Active
            </span>
          </div>

          <div className="space-y-5">
            {goals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-white">{goal.name}</h3>
                      <p className="text-[11px] text-slate-400">{goal.category} · Target: {goal.targetDate}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                      {pct}%
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: goal.color }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono pt-1">
                    <span className="text-slate-300 font-bold">{formatCurrency(goal.currentAmount)}</span>
                    <button
                      onClick={() => setSelectedGoalId(goal.id)}
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md transition-colors"
                    >
                      + Add Funds
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Goal Deposit Modal */}
      {selectedGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-white">Contribute to Savings Vault</h3>
            <p className="text-xs text-slate-400">
              Move liquid funds directly into {goals.find((g) => g.id === selectedGoalId)?.name}.
            </p>

            <form onSubmit={handleContributeSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Source Account</label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
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
                <label className="text-xs text-slate-400 block mb-1">Contribution Amount ($)</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-base font-bold font-mono text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGoalId(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isContributing}
                  className="flex-1 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  {isContributing ? 'Allocating...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
