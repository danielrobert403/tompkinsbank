import React from 'react';
import { useBanking } from '../context/BankingContext';
import { Briefcase, Check, Building2, CreditCard, Shield, Users } from 'lucide-react';

export const BusinessPage: React.FC<{ onOpenCreateAccount: () => void }> = ({ onOpenCreateAccount }) => {
  const { setActivePage } = useBanking();

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-10 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#004732]">
              Apex Business Solutions
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
              Powering Modern Business Cash Flow
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              From startups to enterprise commercial teams, manage employee cards, vendor payments, and cash flow with confidence.
            </p>
          </div>

          <button
            onClick={onOpenCreateAccount}
            className="self-start md:self-auto px-6 py-2.5 bg-[#004732] hover:bg-[#005AB5] text-white text-sm font-medium rounded-sm transition-colors whitespace-nowrap"
          >
            Apply for Business Card
          </button>
        </div>

        {/* 3 Pillar Cards - Less Complex View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-blue-50 text-[#004732] flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Apex Business Gold Card</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Earn 4X points on the 2 categories where your business spends the most each billing cycle (up to $150k/yr).
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                <p>✓ Cloud computing, advertising & shipping</p>
                <p>✓ Flexible payment terms</p>
              </div>
            </div>

            <button
              onClick={onOpenCreateAccount}
              className="mt-6 w-full py-2 bg-[#004732] hover:bg-[#005AB5] text-white text-xs font-semibold rounded-sm transition-colors"
            >
              Apply Online
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Employee Card Controls</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Issue physical and virtual employee cards with individual spending limits and instant freeze controls.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                <p>✓ Zero liability protection</p>
                <p>✓ Automated QuickBooks export</p>
              </div>
            </div>

            <button
              onClick={() => setActivePage('my-account')}
              className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-sm transition-colors"
            >
              Manage Team Cards
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Commercial Treasury</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                High-volume wire disbursements, automated ACH payroll rails, and insured cash sweep accounts up to $5M.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                <p>✓ FedNow instant settlement</p>
                <p>✓ Dedicated Treasury Specialist</p>
              </div>
            </div>

            <button
              onClick={() => setActivePage('customer-service')}
              className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-sm transition-colors"
            >
              Contact Treasury Desk
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
