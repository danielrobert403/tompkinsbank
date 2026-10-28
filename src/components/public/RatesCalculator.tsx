import React, { useState } from 'react';
import { ArrowRight, Calculator, Check, TrendingUp } from 'lucide-react';

export const RatesCalculator: React.FC<{ onOpenAccount: () => void }> = ({ onOpenAccount }) => {
  const [activeTab, setActiveTab] = useState<'savings' | 'loan'>('savings');

  // Savings Calculator State
  const [initialDeposit, setInitialDeposit] = useState<number>(25000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1000);
  const [years, setYears] = useState<number>(3);
  const apexAPY = 0.0485; // 4.85%
  const nationalAvgAPY = 0.0046; // 0.46%

  // Compound Interest Calculation: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
  const calculateCompoundInterest = (p: number, pmt: number, r: number, t: number) => {
    const n = 12; // monthly compounding
    const compoundRate = r / n;
    const totalPeriods = n * t;

    const principalGains = p * Math.pow(1 + compoundRate, totalPeriods);
    const contributionGains =
      compoundRate > 0
        ? pmt * ((Math.pow(1 + compoundRate, totalPeriods) - 1) / compoundRate)
        : pmt * totalPeriods;

    return Math.round(principalGains + contributionGains);
  };

  const apexFinal = calculateCompoundInterest(initialDeposit, monthlyContribution, apexAPY, years);
  const nationalFinal = calculateCompoundInterest(initialDeposit, monthlyContribution, nationalAvgAPY, years);
  const totalContributions = initialDeposit + monthlyContribution * 12 * years;
  const apexEarnings = apexFinal - totalContributions;
  const nationalEarnings = nationalFinal - totalContributions;
  const apexAdvantage = apexEarnings - nationalEarnings;

  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(450000);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [loanRate, setLoanRate] = useState<number>(6.25);

  const calculateMonthlyMortgage = (p: number, r: number, y: number) => {
    const monthlyRate = r / 100 / 12;
    const numPayments = y * 12;
    if (monthlyRate === 0) return p / numPayments;
    const payment = (p * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(payment);
  };

  const monthlyMortgage = calculateMonthlyMortgage(loanAmount, loanRate, loanTermYears);
  const totalLoanRepayment = monthlyMortgage * loanTermYears * 12;
  const totalLoanInterest = totalLoanRepayment - loanAmount;

  return (
    <section id="rates-calculator" className="py-20 bg-slate-900/60 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            <Calculator className="w-4 h-4" />
            <span>Interactive Yield & Lending Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
            See exactly how much your capital compounds at Apex.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Compare our 4.85% APY High-Yield Reserve against standard brick-and-mortar averages with full transparency.
          </p>

          {/* Calculator Selector Tabs */}
          <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl mt-6">
            <button
              onClick={() => setActiveTab('savings')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'savings'
                  ? 'bg-slate-850 text-white shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              High-Yield Savings Growth
            </button>
            <button
              onClick={() => setActiveTab('loan')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'loan'
                  ? 'bg-slate-850 text-white shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mortgage & Loan Estimator
            </button>
          </div>
        </div>

        {activeTab === 'savings' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Input Controls */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">
                  Adjust Your Savings Inputs
                </h3>

                {/* Initial Deposit Slider */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Initial Opening Balance</span>
                    <span className="font-semibold text-emerald-400 font-mono tabular-nums text-sm">
                      ${initialDeposit.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="150000"
                    step="1000"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>$1,000</span>
                    <span>$75,000</span>
                    <span>$150,000</span>
                  </div>
                </div>

                {/* Monthly Contribution Slider */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Monthly Contribution</span>
                    <span className="font-semibold text-emerald-400 font-mono tabular-nums text-sm">
                      ${monthlyContribution.toLocaleString()}/mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>$0</span>
                    <span>$2,500</span>
                    <span>$5,000</span>
                  </div>
                </div>

                {/* Growth Horizon (Years) */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 block">Growth Time Horizon</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setYears(yr)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          years === yr
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {yr} {yr === 1 ? 'Year' : 'Years'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rate Badges */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Apex High-Yield APY: <strong className="text-white font-mono">4.85%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  <span>National Average: <strong className="text-slate-300 font-mono">0.46%</strong></span>
                </div>
              </div>
            </div>

            {/* Results Preview Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Estimated Total Balance in {years} {years === 1 ? 'Year' : 'Years'}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                  ${apexFinal.toLocaleString()}
                </div>

                {/* Earnings Highlight Box */}
                <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Apex Total Interest Earned:</span>
                    <span className="text-emerald-400 font-bold font-mono tabular-nums text-sm">
                      +${apexEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Standard National Average Interest:</span>
                    <span className="text-slate-400 font-mono tabular-nums">
                      +${nationalEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-medium">Your Apex Interest Advantage:</span>
                    <span className="text-emerald-300 font-extrabold font-mono tabular-nums">
                      +${apexAdvantage.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Value bullets */}
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Compounded daily, credited on the 1st of every month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zero monthly maintenance charges or minimum balance penalties</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>FDIC insured up to $250,000 through Apex Bank Member FDIC</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenAccount}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open High-Yield Reserve</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Mortgage Inputs */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Loan & Mortgage Parameters
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Borrowing Principal</span>
                  <span className="font-semibold text-emerald-400 font-mono tabular-nums text-sm">
                    ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1500000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Interest Rate (APR)</span>
                  <span className="font-semibold text-emerald-400 font-mono tabular-nums text-sm">
                    {loanRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="12.0"
                  step="0.1"
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 block">Amortization Term</label>
                <div className="grid grid-cols-3 gap-3">
                  {[15, 20, 30].map((t) => (
                    <button
                      key={t}
                      onClick={() => setLoanTermYears(t)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        loanTermYears === t
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {t} Years Fixed
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mortgage Output */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Estimated Principal & Interest
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                  ${monthlyMortgage.toLocaleString()}<span className="text-base font-normal text-slate-400">/mo</span>
                </div>

                <div className="mt-6 space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Principal:</span>
                    <span className="text-slate-200">${loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Lifetime Interest:</span>
                    <span className="text-slate-200">${totalLoanInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                    <span>Total Payments:</span>
                    <span className="text-emerald-400 font-semibold">${totalLoanRepayment.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenAccount}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>Apply for Apex Pre-Approval</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
