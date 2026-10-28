import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { Award, CheckCircle2, DollarSign, Gift, ShoppingBag, Sparkles } from 'lucide-react';

export const RewardsPage: React.FC = () => {
  const { user, accounts, executeTransfer, formatCurrency } = useBanking();
  
  const [points, setPoints] = useState<number>(34050);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const cardAccount = accounts.find((a) => a.type === 'credit') || accounts[0];
  const pointsCashValue = points / 100; // 34,050 points = $340.50

  const handleRedeemStatementCredit = () => {
    if (points < 1000) {
      alert('Minimum 1,000 points required to redeem.');
      return;
    }

    const redeemAmount = 100.00; // $100 statement credit (10,000 points)
    setPoints((p) => p - 10000);

    setRedeemSuccess(`Successfully redeemed 10,000 points for a $100.00 statement credit on ${cardAccount.name}!`);
    setTimeout(() => setRedeemSuccess(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-10 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* Top Points Summary Banner */}
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#004732]">
              Membership Rewards® Program
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
              Your Rewards Balance
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Points never expire as long as your account remains open and in good standing.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex items-center gap-6 self-start md:self-auto">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Available Points</p>
              <p className="text-3xl font-extrabold text-[#004732] font-mono tabular-nums">
                {points.toLocaleString()} <span className="text-sm font-sans font-medium text-slate-600">pts</span>
              </p>
            </div>
            <div className="border-l border-slate-200 pl-5">
              <p className="text-xs font-semibold text-slate-500 uppercase">Cash Value</p>
              <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                ${pointsCashValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {redeemSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{redeemSuccess}</span>
          </div>
        )}

        {/* Redemption Ways - Clean 3 Columns */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Popular Ways to Use Points</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Option 1: Statement Credit */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-blue-50 text-[#004732] flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Cover Your Card Charges</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Apply your points directly as a statement credit toward recent card purchases.
                </p>
                <div className="mt-4 p-3 bg-slate-50 rounded text-xs font-mono text-slate-700">
                  10,000 pts = $100.00 credit
                </div>
              </div>

              <button
                onClick={handleRedeemStatementCredit}
                className="mt-6 w-full py-2.5 bg-[#004732] hover:bg-[#005AB5] text-white text-xs font-semibold rounded-sm transition-colors"
              >
                Redeem 10k Pts ($100 Credit)
              </button>
            </div>

            {/* Option 2: Direct Checking Deposit */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Direct Checking Deposit</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Deposit your cash back earnings directly into your primary Tompkins Checking or Savings account.
                </p>
                <div className="mt-4 p-3 bg-slate-50 rounded text-xs font-mono text-slate-700">
                  10,000 pts = $100.00 cash
                </div>
              </div>

              <button
                onClick={handleRedeemStatementCredit}
                className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-sm transition-colors"
              >
                Deposit to Account
              </button>
            </div>

            {/* Option 3: Gift Cards & Shopping */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Merchant Gift Cards</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Choose e-gift cards from over 100 retailers including Apple, Amazon, Home Depot, and Nordstrom.
                </p>
                <div className="mt-4 p-3 bg-slate-50 rounded text-xs font-mono text-slate-700">
                  Instant Digital Delivery
                </div>
              </div>

              <button
                onClick={() => alert('Gift card catalog opened: select merchant to redeem.')}
                className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-sm transition-colors"
              >
                Browse Gift Cards
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
