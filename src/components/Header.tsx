import React, { useState, useRef, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { Search, User, LogOut, X, Shield, ChevronDown, Repeat, ArrowRight, Building2 } from 'lucide-react';

import { TompkinsLogo } from './TompkinsLogo';

interface HeaderProps {
  onOpenAccountClick: () => void;
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAccountClick, onOpenLoginModal }) => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    activePage,
    setActivePage,
    user,
    transactions,
  } = useBanking();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [transfersDropdownOpen, setTransfersDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pendingWireCount = transactions.filter(
    (t) => (t.status === 'pending' || t.status === 'held') && t.category === 'Transfers'
  ).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTransfersDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'my-account', label: 'My Account' },
    { id: 'cards', label: 'Cards' },
    { id: 'banking', label: 'Banking' },
    { id: 'rewards', label: 'Rewards & Benefits' },
    { id: 'business', label: 'Business' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setTransfersDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isTransfersActive = activePage === 'external-transfer' || activePage === 'transfers' || activePage === 'admin-wire-desk';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Left Side: Tompkins Logo + Navigation Links */}
        <div className="flex items-center gap-6 min-w-0">
          
          {/* Tompkins Bank & Trust Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="shrink-0 flex items-center focus:outline-none group text-left"
            title="Tompkins Bank & Trust"
          >
            <TompkinsLogo size="md" textColor="text-[#004732]" showSubtitle={true} />
          </button>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            <button
              onClick={() => handleNavClick('my-account')}
              className={`text-sm font-medium transition-colors whitespace-nowrap py-1 relative ${
                activePage === 'my-account'
                  ? 'text-[#004732] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#004732]'
                  : 'text-[#004732] hover:text-[#003827]'
              }`}
            >
              My Account
            </button>

            <button
              onClick={() => handleNavClick('cards')}
              className={`text-sm font-medium transition-colors whitespace-nowrap py-1 relative ${
                activePage === 'cards'
                  ? 'text-[#004732] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#004732]'
                  : 'text-[#004732] hover:text-[#003827]'
              }`}
            >
              Cards
            </button>

            <button
              onClick={() => handleNavClick('banking')}
              className={`text-sm font-medium transition-colors whitespace-nowrap py-1 relative ${
                activePage === 'banking'
                  ? 'text-[#004732] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#004732]'
                  : 'text-[#004732] hover:text-[#003827]'
              }`}
            >
              Banking
            </button>

            {/* Transfers Menu with External & Wire nested underneath */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setTransfersDropdownOpen(true)}
              onMouseLeave={() => setTransfersDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('external-transfer')}
                className={`text-sm font-medium transition-colors whitespace-nowrap py-1 relative flex items-center gap-1 ${
                  isTransfersActive
                    ? 'text-[#004732] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#004732]'
                    : 'text-[#004732] hover:text-[#003827]'
                }`}
              >
                <span>Quick Transfer</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${transfersDropdownOpen ? 'rotate-180' : ''}`} />
                {pendingWireCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-mono font-bold leading-none">
                    {pendingWireCount}
                  </span>
                )}
              </button>

              {/* Transfers Dropdown Menu */}
              {transfersDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-md shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Money Movement &amp; Rails
                    </span>
                  </div>

                  <button
                    onClick={() => handleNavClick('external-transfer')}
                    className="w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-start gap-2.5 group"
                  >
                    <Building2 className="w-4 h-4 text-[#004732] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#004732]">
                        External &amp; Wire Transfer
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Transfer to verified partner banks via FedWire, FedNow, or ACH
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('my-account')}
                    className="w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-start gap-2.5 group"
                  >
                    <Repeat className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#004732]">
                        Internal Account Transfer
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Move funds instantly between your Apex checking and savings
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('rewards')}
              className={`text-sm font-medium transition-colors whitespace-nowrap py-1 relative ${
                activePage === 'rewards'
                  ? 'text-[#004732] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#004732]'
                  : 'text-[#004732] hover:text-[#003827]'
              }`}
            >
              Rewards &amp; Benefits
            </button>

            <button
              onClick={() => handleNavClick('business')}
              className={`text-sm font-medium transition-colors whitespace-nowrap py-1 relative ${
                activePage === 'business'
                  ? 'text-[#004732] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#004732]'
                  : 'text-[#004732] hover:text-[#003827]'
              }`}
            >
              Business
            </button>
          </nav>

        </div>

        {/* Right Side: Search Icon + Customer Service + Log In / Sign In button */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">

          {/* Search Trigger */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-slate-100 rounded-md px-2.5 py-1 border border-slate-300">
                <Search className="w-4 h-4 text-slate-500 mr-1.5" />
                <input
                  type="text"
                  placeholder="Search cards, rates, FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-36 sm:w-52"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-slate-400 hover:text-slate-700 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-[#004732] hover:text-[#003827] p-1.5 transition-colors focus:outline-none"
                aria-label="Search site"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Customer Service Link */}
          <button
            onClick={() => handleNavClick('customer-service')}
            className={`hidden md:inline-block text-sm font-medium transition-colors ${
              activePage === 'customer-service'
                ? 'text-[#004732] font-semibold underline'
                : 'text-[#004732] hover:text-[#003827] hover:underline'
            }`}
          >
            Customer Service
          </button>

          {/* Log In / User Controls */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('profile')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-2 border ${
                  activePage === 'profile'
                    ? 'bg-[#004732] text-white border-[#004732]'
                    : 'bg-[#F1F5F9] hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
                title="View Profile & Settings"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-[#004732] text-white flex items-center justify-center font-bold text-[10px] ring-1 ring-white/50 shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.avatarInitials || 'PV'}</span>
                  )}
                </div>
                <span className="hidden sm:inline">Hi, {user.name.split(' ')[0] || 'Paulina'}</span>
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-slate-300 text-slate-600 hover:text-rose-600 rounded text-xs font-medium transition-colors flex items-center gap-1"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="px-6 py-2.5 bg-[#004732] hover:bg-[#005AB5] active:bg-[#004A94] text-white text-sm font-medium rounded-sm shadow-none transition-colors whitespace-nowrap"
            >
              Log In
            </button>
          )}

        </div>

      </div>

      {/* Mobile Nav Sub-row */}
      <div className="xl:hidden flex items-center gap-4 px-4 py-2 border-t border-slate-100 overflow-x-auto text-xs bg-slate-50">
        <button
          onClick={() => handleNavClick('my-account')}
          className={`whitespace-nowrap py-1 ${activePage === 'my-account' ? 'text-[#004732] font-bold' : 'text-slate-600'}`}
        >
          My Account
        </button>
        <button
          onClick={() => handleNavClick('profile')}
          className={`whitespace-nowrap py-1 ${activePage === 'profile' ? 'text-[#004732] font-bold' : 'text-slate-600'}`}
        >
          Profile
        </button>
        <button
          onClick={() => handleNavClick('cards')}
          className={`whitespace-nowrap py-1 ${activePage === 'cards' ? 'text-[#004732] font-bold' : 'text-slate-600'}`}
        >
          Cards
        </button>
        <button
          onClick={() => handleNavClick('banking')}
          className={`whitespace-nowrap py-1 ${activePage === 'banking' ? 'text-[#004732] font-bold' : 'text-slate-600'}`}
        >
          Banking
        </button>
        <button
          onClick={() => handleNavClick('external-transfer')}
          className={`whitespace-nowrap py-1 flex items-center gap-1 ${isTransfersActive ? 'text-[#004732] font-bold' : 'text-slate-600'}`}
        >
          <span>Quick Transfer</span>
          {pendingWireCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-mono font-bold leading-none">
              {pendingWireCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNavClick('rewards')}
          className={`whitespace-nowrap py-1 ${activePage === 'rewards' ? 'text-[#004732] font-bold' : 'text-slate-600'}`}
        >
          Rewards &amp; Benefits
        </button>
        <button
          onClick={() => handleNavClick('business')}
          className={`whitespace-nowrap py-1 ${activePage === 'business' ? 'text-[#006FCF] font-bold' : 'text-slate-600'}`}
        >
          Business
        </button>
      </div>
    </header>
  );
};
