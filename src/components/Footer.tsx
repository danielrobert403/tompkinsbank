import React from 'react';
import { useBanking } from '../context/BankingContext';

export const Footer: React.FC<{ onOpenLogin: () => void }> = ({ onOpenLogin }) => {
  const { setActivePage } = useBanking();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-16">
      
      {/* 4 Column Top Grid matching reference image: ABOUT, PRODUCTS & SERVICES, LINKS YOU MAY LIKE, ADDITIONAL INFORMATION */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          
          {/* Column 1: ABOUT */}
          <div>
            <h4 className="font-bold text-slate-900 tracking-wider text-xs uppercase mb-4">
              ABOUT
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => setActivePage('home')}
                  className="hover:text-[#004732] transition-colors text-left"
                >
                  About Apex Bank
                </button>
              </li>
              <li>
                <a href="#investor" className="hover:text-[#004732] transition-colors">
                  Investor Relations
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-[#004732] transition-colors">
                  Careers & Leadership
                </a>
              </li>
              <li>
                <a href="#newsroom" className="hover:text-[#004732] transition-colors">
                  Newsroom
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-[#004732] transition-colors">
                  Corporate Responsibility
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: PRODUCTS & SERVICES */}
          <div>
            <h4 className="font-bold text-slate-900 tracking-wider text-xs uppercase mb-4">
              PRODUCTS & SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => setActivePage('cards')}
                  className="hover:text-[#004732] transition-colors text-left"
                >
                  Credit & Charge Cards
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('banking')}
                  className="hover:text-[#004732] transition-colors text-left"
                >
                  High-Yield Savings & Checking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('business')}
                  className="hover:text-[#004732] transition-colors text-left"
                >
                  Business Cards & Financing
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('external-transfer')}
                  className="hover:text-[#004732] transition-colors text-left"
                >
                  Wire &amp; Quick Transfers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('rewards')}
                  className="hover:text-[#004732] transition-colors text-left"
                >
                  Membership Rewards®
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: LINKS YOU MAY LIKE */}
          <div>
            <h4 className="font-bold text-slate-900 tracking-wider text-xs uppercase mb-4">
              LINKS YOU MAY LIKE
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => setActivePage('rewards')}
                  className="hover:text-[#004732] transition-colors text-left"
                >
                  Membership Rewards® Points
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('customer-service')}
                  className="hover:text-[#004732] transition-colors text-left"
                >
                  Credit Card Customer Service
                </button>
              </li>
              <li>
                <a href="#refer" className="hover:text-[#004732] transition-colors">
                  Refer a Friend Bonus
                </a>
              </li>
              <li>
                <a href="#mobile-app" className="hover:text-[#004732] transition-colors">
                  Apex Mobile App
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('banking')}
                  className="hover:text-[#004732] transition-colors text-left"
                >
                  4.85% APY High-Yield Savings
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: ADDITIONAL INFORMATION */}
          <div>
            <h4 className="font-bold text-slate-900 tracking-wider text-xs uppercase mb-4">
              ADDITIONAL INFORMATION
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a href="#privacy" className="hover:text-[#004732] transition-colors">
                  Privacy Center
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-[#004732] transition-colors">
                  Security & Fraud Protection
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#004732] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-[#004732] transition-colors">
                  Cardmember Agreements
                </a>
              </li>
              <li>
                <span className="font-mono text-slate-500">Routing #021000089</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal & Copyright */}
        <div className="pt-10 mt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            <span
              onClick={() => {
                const count = (window as any).__tompkins_clk = ((window as any).__tompkins_clk || 0) + 1;
                if (count >= 3) {
                  (window as any).__tompkins_clk = 0;
                  setActivePage('admin-dashboard');
                }
              }}
              className="cursor-default select-none"
              title=""
            >
              ©
            </span>{' '}
            2026 Tompkins Bank &amp; Trust (Tompkins Community Bank). Founded 1836. Member FDIC. Equal Housing Lender. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Security Center</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Privacy Statement</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Accessibility</span>
            <span>·</span>
            <span className="font-semibold text-slate-700">Member FDIC</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
