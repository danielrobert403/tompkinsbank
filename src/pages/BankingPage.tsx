import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { Percent, Check, DollarSign, ArrowRight, ShieldCheck, Calculator } from 'lucide-react';

export const BankingPage: React.FC<{ onOpenCreateAccount: () => void }> = ({ onOpenCreateAccount }) => {
  const { setActivePage, formatCurrency } = useBanking();
  
  // Interactive Calculator
  const [deposit, setDeposit] = useState<number>(25000);
  const [months, setMonths] = useState<number>(24);
  const apy = 0.0485;

  const calculateEarnings = (p: number, m: number, r: number) => {
    return Math.round(p * Math.pow(1 + r / 12, m) - p);
  };

  const earnings = calculateEarnings(deposit, months, apy);
  const nationalEarnings = calculateEarnings(deposit, months, 0.0046);

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-10 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#004732]">
              Apex Personal Banking
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
              High-Yield Savings & Checking
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Grow your money faster with our 4.85% APY High-Yield Savings account. No minimums, no fees, Member FDIC insured.
            </p>
          </div>

          <button
            onClick={onOpenCreateAccount}
            className="self-start md:self-auto px-6 py-2.5 bg-[#004732] hover:bg-[#005AB5] text-white text-sm font-medium rounded-sm transition-colors whitespace-nowrap"
          >
            Open an Account Online
          </button>
        </div>

        {/* 2 Main Account Options: Clean, Uncluttered Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* High-Yield Savings */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase text-[#004732]">High-Yield Savings</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded">
                  4.85% APY
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Apex High-Yield Savings Account</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Over 10x the national average. Daily compounding interest with unlimited electronic deposits and zero maintenance fees.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>4.85% APY</strong> on all balance tiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>$0.00 Monthly service or maintenance fee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>$0 Minimum balance to earn maximum rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>FDIC insured up to $250,000</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenCreateAccount}
              className="mt-8 w-full py-2.5 bg-[#004732] hover:bg-[#005AB5] text-white text-sm font-medium rounded-sm transition-colors text-center"
            >
              Open Savings Account
            </button>
          </div>

          {/* Apex Checking */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase text-[#004732]">Checking Account</span>
                <span className="px-2.5 py-1 bg-blue-50 text-[#004732] border border-blue-200 font-bold text-xs rounded">
                  $0 Fee Checking
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Apex Premier Checking Account</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Everyday transactions with zero friction. Includes free domestic ATM fee rebates and real-time fraud telemetry.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited domestic ATM fee reimbursements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Contactless Platinum Debit Card included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant mobile check deposit up to $50,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>FedNow Instant Wire & Transfer rails</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenCreateAccount}
              className="mt-8 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-sm transition-colors text-center"
            >
              Open Checking Account
            </button>
          </div>

        </div>

        {/* Simple Interactive Yield Calculator Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#004732] mb-2">
            <Calculator className="w-4 h-4" />
            <span>Interactive Savings Calculator</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Calculate your estimated savings growth
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Initial Deposit:</span>
                  <strong className="text-slate-900 font-mono text-sm">${deposit.toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full accent-[#004732] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Time Horizon:</span>
                  <strong className="text-slate-900 font-mono text-sm">{months} Months</strong>
                </div>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="6"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full accent-[#004732] cursor-pointer"
                />
              </div>
            </div>

            <div className="md:col-span-5 bg-slate-50 p-6 rounded-lg border border-slate-200 text-center space-y-2">
              <span className="text-xs uppercase text-slate-500 font-semibold">Estimated Interest Earned</span>
              <p className="text-3xl font-bold text-emerald-600 font-mono tabular-nums">
                +${earnings.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">
                vs ${nationalEarnings.toLocaleString()} national average (0.46%)
              </p>
              <div className="pt-3">
                <button
                  onClick={onOpenCreateAccount}
                  className="w-full py-2 px-4 bg-[#004732] hover:bg-[#005AB5] text-white text-xs font-semibold rounded-sm transition-colors"
                >
                  Start Saving with 4.85% APY
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
