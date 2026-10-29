import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { QuickTransferModal } from '../components/portal/QuickTransferModal';
import { TompkinsLogo } from '../components/TompkinsLogo';
import { Transaction } from '../types/banking';
import {
  Menu,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Repeat,
  ArrowDownToLine,
  Receipt,
  MessageSquare,
  Search,
  X,
  Tag,
  FileText,
  Camera,
  MapPin,
  Phone,
  Mail,
  Info,
  Plane,
  Lock,
  Unlock,
  CheckCircle2,
  Calendar,
  DollarSign,
  Upload,
  Plus,
  Play,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface MyAccountPageProps {
  onOpenStatement?: () => void;
  onOpenCreateAccount?: () => void;
}

export const MyAccountPage: React.FC<MyAccountPageProps> = ({ onOpenStatement, onOpenCreateAccount }) => {
  const {
    user,
    accounts,
    transactions,
    cards,
    toggleCardFreeze,
    toggleTravelMode,
    depositCheck,
    payBill,
    payees,
    formatCurrency,
    setActivePage,
    updateTransactionTag,
    updateTransactionNotes,
    updateTransactionImage,
    sendSupportMessage,
  } = useBanking();

  // Active Account
  const [activeAccountIdx, setActiveAccountIdx] = useState<number>(0);
  const currentAccount = accounts[activeAccountIdx] || accounts[0];

  // Modals
  const [isQuickTransferOpen, setIsQuickTransferOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isBillPayModalOpen, setIsBillPayModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLocationsModalOpen, setIsLocationsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // Search & Filter
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  // Transaction Edit states
  const [editingTag, setEditingTag] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState('');

  // Check deposit form
  const [depositAmount, setDepositAmount] = useState('425.00');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  // Bill pay form
  const [selectedPayeeId, setSelectedPayeeId] = useState(payees[0]?.id || '');
  const [billAmount, setBillAmount] = useState('85.00');
  const [billSuccessMsg, setBillSuccessMsg] = useState<string | null>(null);

  // Message form
  const [messageSubject, setMessageSubject] = useState('Question about checking account');
  const [messageBody, setMessageBody] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Current selected transaction for drilldown
  const selectedTx = transactions.find((t) => t.id === selectedTxId) || null;
  const primaryCard = cards.find((c) => c.type === 'debit') || cards[0];

  // Filtering
  const filteredTransactions = transactions.filter((tx) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchesMerchant = tx.merchant.toLowerCase().includes(q) || tx.description.toLowerCase().includes(q);
    const matchesAmount = Math.abs(tx.amount).toFixed(2).includes(q) || Math.abs(tx.amount).toString().includes(q);
    const matchesDate = tx.date.toLowerCase().includes(q);
    const matchesTag = tx.tag?.toLowerCase().includes(q) || false;
    const matchesNotes = tx.notes?.toLowerCase().includes(q) || false;
    return matchesMerchant || matchesAmount || matchesDate || matchesTag || matchesNotes;
  });

  // Group transactions by date label matching screenshots
  const groupTransactionsByDate = (txs: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    txs.forEach((tx) => {
      let label = tx.date;
      try {
        const d = new Date(tx.date + 'T00:00:00');
        label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      } catch {
        label = tx.date;
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(tx);
    });
    return groups;
  };

  const groupedTx = groupTransactionsByDate(filteredTransactions);

  const handleSaveTag = (txId: string) => {
    if (tagInput.trim()) {
      updateTransactionTag(txId, tagInput.trim());
    }
    setEditingTag(false);
  };

  const handleSaveNotes = (txId: string) => {
    updateTransactionNotes(txId, notesInput.trim());
    setEditingNotes(false);
  };

  const handleAttachSampleReceipt = (txId: string) => {
    // Attach an authentic receipt preview
    updateTransactionImage(
      txId,
      'https://images.unsplash.com/photo-1554415707-9e4c079fe885?auto=format&fit=crop&w=600&q=80'
    );
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;
    const res = depositCheck({
      accountId: currentAccount.id,
      amount: amt,
      checkNumber: String(Math.floor(1000 + Math.random() * 9000)),
      notes: 'Mobile Remote Check Deposit',
    });
    if (res.success) {
      setDepositSuccessMsg(res.message);
      setTimeout(() => {
        setDepositSuccessMsg(null);
        setIsDepositModalOpen(false);
      }, 1500);
    }
  };

  const handleBillPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(billAmount);
    if (isNaN(amt) || amt <= 0) return;
    const res = payBill(selectedPayeeId, currentAccount.id, amt);
    if (res.success) {
      setBillSuccessMsg(res.message);
      setTimeout(() => {
        setBillSuccessMsg(null);
        setIsBillPayModalOpen(false);
      }, 1500);
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;
    sendSupportMessage(messageBody.trim(), messageSubject.trim() || undefined);
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageBody('');
      setIsMessageModalOpen(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0F3F1] pb-16">
      
      {/* =========================================================================
          TOP FOREST CANOPY HERO HEADER (Matching image_05f477bd.png & image_f9c1d597.png)
          ========================================================================= */}
      <section
        className="relative bg-[#003B26] text-white pt-6 pb-8 px-4 sm:px-6 md:px-10 overflow-hidden shadow-md bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 48, 32, 0.75), rgba(0, 35, 23, 0.92)), url('/assets/aistudio/image_360d8650.png')`,
        }}
      >
        <div className="max-w-[1360px] mx-auto relative z-10">
          
          {/* Top Bar: Menu Hamburger + Hi, Mike + Avatar Profile */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActivePage('profile')}
                className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
                aria-label="Open menu"
                title="Profile & Navigation"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Hi, {user.name.split(' ')[0] || 'Paulina'}
              </h1>
            </div>

            {/* Paulina's Circular Avatar */}
            <button
              onClick={() => setActivePage('profile')}
              className="relative group focus:outline-none"
              title={`View ${user.name}'s Profile & Photo Settings`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/80 shadow-md ring-2 ring-emerald-400/30 group-hover:scale-105 transition-transform flex items-center justify-center bg-[#003828]">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm tracking-wider">
                    {user.avatarInitials || 'PV'}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Accounts Header & More Options */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold tracking-wide text-white/85 uppercase">
              Accounts
            </h2>
            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors"
              title="Account Options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Horizontal Account Cards Carousel - Perfectly aligned with Quick Transfer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {accounts.map((acc, idx) => (
              <div
                key={acc.id}
                onClick={() => setActiveAccountIdx(idx)}
                className={`cursor-pointer rounded-xl p-5 transition-all duration-200 border ${
                  activeAccountIdx === idx
                    ? 'bg-[#004732] border-emerald-400/50 shadow-lg ring-1 ring-emerald-300/30'
                    : 'bg-[#004732]/75 hover:bg-[#004732] border-white/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{acc.name}</h3>
                    <p className="text-xs text-white/75 font-mono mt-0.5">{acc.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white tracking-tight tabular-nums">
                      {formatCurrency(acc.availableBalance)}
                    </p>
                    <p className="text-xs text-white/70 font-medium">Available</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add an Account Tile */}
            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="hidden lg:flex items-center justify-center p-5 rounded-xl border border-dashed border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white/90 text-sm font-semibold transition-all group"
            >
              <span className="group-hover:scale-105 transition-transform flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>+ Add an account</span>
              </span>
            </button>
          </div>

          {/* Carousel Pagination & View All Link */}
          <div className="flex items-center justify-between pt-1 pb-4">
            <div className="flex items-center gap-3 text-white/80">
              <button
                onClick={() => setActiveAccountIdx((prev) => (prev > 0 ? prev - 1 : accounts.length - 1))}
                className="hover:text-white transition-colors cursor-pointer"
                aria-label="Previous account"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {accounts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveAccountIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      activeAccountIdx === idx ? 'bg-white scale-125' : 'bg-white/40'
                    }`}
                    aria-label={`Go to account ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveAccountIdx((prev) => (prev < accounts.length - 1 ? prev + 1 : 0))}
                className="hover:text-white transition-colors cursor-pointer"
                aria-label="Next account"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="text-xs font-semibold text-white/90 hover:text-white hover:underline transition-colors"
            >
              View all
            </button>
          </div>

          {/* 4 Square Action Buttons (Transfer, Deposit, Pay, Message) */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg">
            {/* Transfer Tile */}
            <button
              onClick={() => setIsQuickTransferOpen(true)}
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-[#004732] hover:bg-[#00573E] active:scale-95 text-white shadow transition-all duration-150 border border-white/10 group"
            >
              <Repeat className="w-6 h-6 mb-2 text-white group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold tracking-wide">Transfer</span>
            </button>

            {/* Deposit Tile */}
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-[#004732] hover:bg-[#00573E] active:scale-95 text-white shadow transition-all duration-150 border border-white/10 group"
            >
              <ArrowDownToLine className="w-6 h-6 mb-2 text-white group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold tracking-wide">Deposit</span>
            </button>

            {/* Pay Tile */}
            <button
              onClick={() => setIsBillPayModalOpen(true)}
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-[#004732] hover:bg-[#00573E] active:scale-95 text-white shadow transition-all duration-150 border border-white/10 group"
            >
              <Receipt className="w-6 h-6 mb-2 text-white group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold tracking-wide">Pay</span>
            </button>

            {/* Message Tile */}
            <button
              onClick={() => setIsMessageModalOpen(true)}
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-[#004732] hover:bg-[#00573E] active:scale-95 text-white shadow transition-all duration-150 border border-white/10 group"
            >
              <MessageSquare className="w-6 h-6 mb-2 text-white group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold tracking-wide">Message</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          MAIN SPLIT VIEW: LEFT TRANSACTIONS + RIGHT TOMPKINS WIDGETS
          ========================================================================= */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =====================================================================
              LEFT COLUMN: TRANSACTIONS LIST & DRILLDOWN (Lg: col-span-7)
              ===================================================================== */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Card Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              
              {/* Transactions Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Transactions
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    {currentAccount.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className={`p-2 rounded-lg transition-colors ${
                      searchOpen ? 'bg-emerald-50 text-[#004732]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                    title="Search transactions"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onOpenStatement && onOpenStatement()}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Transaction statement & options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search input when open */}
              {searchOpen && (
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 animate-in fade-in duration-150">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter by merchant, amount ($23.11), date, notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#004732] text-slate-800"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Grouped Transactions List */}
              <div className="divide-y divide-slate-100">
                {Object.keys(groupedTx).length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No transactions match your search criteria.
                  </div>
                ) : (
                  Object.entries(groupedTx).map(([dateGroup, txList]) => (
                    <div key={dateGroup} className="py-2">
                      {/* Date Header */}
                      <div className="px-5 py-1.5 bg-[#F9FBFA] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {dateGroup}
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-slate-100">
                        {txList.map((tx, idx) => {
                          const isSelected = selectedTxId === tx.id;
                          const isCredit = tx.type === 'credit' || tx.amount > 0;
                          return (
                            <div
                              key={`${tx.id}-${idx}`}
                              onClick={() => setSelectedTxId(isSelected ? null : tx.id)}
                              className={`px-5 py-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                                isSelected ? 'bg-emerald-50/70 border-l-4 border-[#004732]' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="min-w-0 pr-4">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                  {tx.merchant}
                                </p>
                                
                                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                  {tx.status === 'pending' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                      <Clock className="w-3 h-3 text-amber-600" />
                                      Pending
                                    </span>
                                  )}
                                  {tx.notes ? (
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                                      <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span>{tx.notes}</span>
                                    </div>
                                  ) : tx.tag ? (
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                                      <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span>{tx.tag}</span>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-slate-500">
                                      {(() => {
                                        try {
                                          const d = new Date(tx.date + 'T00:00:00');
                                          return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, Checking`;
                                        } catch {
                                          return 'Jul 20, Checking';
                                        }
                                      })()}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span
                                  className={`text-sm font-bold tabular-nums ${
                                    isCredit ? 'text-emerald-700' : 'text-slate-900'
                                  }`}
                                >
                                  {isCredit ? `+${formatCurrency(tx.amount)}` : formatCurrency(Math.abs(tx.amount))}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* =====================================================================
              RIGHT COLUMN: TRANSACTION DRILLDOWN (WHEN SELECTED) OR TOMPKINS WIDGETS
              ===================================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* If a transaction is selected, display the exact Transaction Details drilldown from image_ce7bca0e.png */}
            {selectedTx ? (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200">
                
                {/* Back to widgets bar */}
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedTxId(null)}
                    className="text-xs font-semibold text-[#004732] hover:underline flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Bank Widgets</span>
                  </button>
                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    Drilldown View
                  </span>
                </div>

                {/* Dark Banner with Currency Motif Watermark (Exact image_ce7bca0e.png) */}
                <div className="bg-[#2D3732] text-white p-5 flex items-center justify-between relative overflow-hidden">
                  
                  {/* Faint Currency Watermark matching image_ce7bca0e.png */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-start overflow-hidden">
                    <svg className="w-56 h-56 -translate-x-6 -translate-y-6" viewBox="0 0 100 100" fill="none">
                      <circle cx="35" cy="50" r="26" stroke="#34D399" strokeWidth="2.5" />
                      <circle cx="65" cy="45" r="26" stroke="#34D399" strokeWidth="2.5" />
                      <text x="35" y="58" fontSize="26" fontWeight="bold" textAnchor="middle" fill="#34D399">$</text>
                      <text x="65" y="53" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#34D399">$</text>
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold tracking-tight">{selectedTx.merchant}</h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      REF #{selectedTx.id.toUpperCase()}
                    </p>
                  </div>
                  <div className="relative z-10 text-right">
                    <p className="text-xl font-bold tracking-tight tabular-nums">
                      {selectedTx.type === 'credit'
                        ? `+${formatCurrency(selectedTx.amount)}`
                        : `$${Math.abs(selectedTx.amount).toFixed(2)}`}
                    </p>
                    <p className="text-xs text-slate-300 font-medium">{selectedTx.date}</p>
                  </div>

                  {/* Close Drilldown Button */}
                  <button
                    onClick={() => setSelectedTxId(null)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded"
                    title="Close Details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drilldown Interactive Actions (Tags, Add notes, Attach Image) */}
                <div className="divide-y divide-slate-100">
                  
                  {/* 1. Tags Item */}
                  <div className="p-4 sm:p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#004732] flex items-center justify-center shrink-0 mt-0.5">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          Tags
                        </span>
                        {!editingTag && (
                          <button
                            onClick={() => {
                              setTagInput(selectedTx.tag || 'Entertainment');
                              setEditingTag(true);
                            }}
                            className="text-xs font-semibold text-[#004732] hover:underline"
                          >
                            {selectedTx.tag ? 'Edit tag' : '+ Add tag'}
                          </button>
                        )}
                      </div>

                      {editingTag ? (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Tag name (e.g. Entertainment, Groceries)"
                            className="text-xs px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-[#004732] w-full"
                          />
                          <button
                            onClick={() => handleSaveTag(selectedTx.id)}
                            className="px-3 py-1.5 bg-[#004732] text-white text-xs font-semibold rounded hover:bg-[#00573E]"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTag(false)}
                            className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 mt-1">
                          {selectedTx.tag ? (
                            <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium">
                              {selectedTx.tag}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">No tag assigned</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 2. Notes Item */}
                  <div className="p-4 sm:p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#004732] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          Notes
                        </span>
                        {!editingNotes && (
                          <button
                            onClick={() => {
                              setNotesInput(selectedTx.notes || '');
                              setEditingNotes(true);
                            }}
                            className="text-xs font-semibold text-[#004732] hover:underline"
                          >
                            {selectedTx.notes ? 'Edit note' : '+ Add notes'}
                          </button>
                        )}
                      </div>

                      {editingNotes ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            placeholder="Add memo or return note (e.g. Need to return this)..."
                            rows={2}
                            className="text-xs p-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732] w-full"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveNotes(selectedTx.id)}
                              className="px-3 py-1.5 bg-[#004732] text-white text-xs font-semibold rounded hover:bg-[#00573E]"
                            >
                              Save Note
                            </button>
                            <button
                              onClick={() => setEditingNotes(false)}
                              className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 mt-1">
                          {selectedTx.notes ? (
                            <span className="font-medium text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 inline-block">
                              "{selectedTx.notes}"
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Add personal notes or return reminders</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 3. Attach Image Item */}
                  <div className="p-4 sm:p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#004732] flex items-center justify-center shrink-0 mt-0.5">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          Attach Image
                        </span>
                        {!selectedTx.attachedImageUrl && (
                          <button
                            onClick={() => handleAttachSampleReceipt(selectedTx.id)}
                            className="text-xs font-semibold text-[#004732] hover:underline flex items-center gap-1"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Attach receipt</span>
                          </button>
                        )}
                      </div>

                      {selectedTx.attachedImageUrl ? (
                        <div className="mt-2 space-y-2">
                          <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <img
                              src={selectedTx.attachedImageUrl}
                              alt="Receipt"
                              className="w-32 h-32 object-cover"
                            />
                            <button
                              onClick={() => updateTransactionImage(selectedTx.id, '')}
                              className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full"
                              title="Remove receipt"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-[11px] text-emerald-700 font-medium">Receipt verified &amp; stored.</p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic mt-1">
                          No receipt or invoice image attached.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 4. Details Breakdown */}
                  <div className="p-5 bg-slate-50/60">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                      Details
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-700">Account:</span> Tompkins Bank &amp; Trust - {selectedTx.accountName || 'Checking'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">Merchant Detail:</span> {selectedTx.merchant} CA
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">Description:</span> {selectedTx.description}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">Category:</span> {selectedTx.category}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">Status:</span> Cleared &amp; Posted
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* When no transaction is selected, display the 3 Tompkins widgets (image_f9c1d597.png) */
              <>
                {/* 1. TOMPKINS BRAND & CONTACT TILE (Exact match to image_f9c1d597.png) */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 flex flex-col items-center">
                  
                  {/* Tompkins Logo with Acorn Motif */}
                  <div className="mb-6">
                    <TompkinsLogo size="lg" textColor="text-[#004732]" />
                  </div>

                  {/* 4 Action Buttons: Locations, Call, Email, Info */}
                  <div className="grid grid-cols-4 gap-2 w-full pt-2">
                    
                    {/* Locations Button */}
                    <button
                      onClick={() => setIsLocationsModalOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-[#004732] flex items-center justify-center text-[#004732] mb-1.5 transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Locations</span>
                    </button>

                    {/* WhatsApp Care Button */}
                    <button
                      onClick={() => setActivePage('customer-service')}
                      className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-[#25D366] flex items-center justify-center text-[#25D366] mb-1.5 transition-colors">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">WhatsApp</span>
                    </button>

                    {/* Email Button */}
                    <button
                      onClick={() => setIsMessageModalOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-[#004732] flex items-center justify-center text-[#004732] mb-1.5 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Email</span>
                    </button>

                    {/* Info Button */}
                    <button
                      onClick={() => setIsInfoModalOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-[#004732] flex items-center justify-center text-[#004732] mb-1.5 transition-colors">
                        <Info className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Info</span>
                    </button>

                  </div>
                </div>

                {/* 2. TRANSFERS CARD (Exact match to image_f9c1d597.png) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Transfers
                    </h3>
                    <button
                      onClick={() => setIsQuickTransferOpen(true)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Make a transfer button */}
                  <button
                    onClick={() => setIsQuickTransferOpen(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left group mb-5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#004732] flex items-center justify-center shrink-0 group-hover:bg-[#004732] group-hover:text-white transition-colors">
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-[#004732] transition-colors">
                        Make a transfer
                      </p>
                      <p className="text-xs text-slate-500">Internal, external, or wire</p>
                    </div>
                  </button>

                  {/* Scheduled transfers subsection */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Scheduled transfers
                    </p>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">$100.00 to Savings</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Every month on the 21st, from Checking
                      </p>
                    </div>

                    {/* See More Button */}
                    <button
                      onClick={() => setIsQuickTransferOpen(true)}
                      className="w-full py-2.5 px-4 bg-[#E8EEEC] hover:bg-[#DCE4E1] text-slate-800 text-xs font-bold rounded-lg transition-colors text-center"
                    >
                      See more
                    </button>
                  </div>
                </div>

                {/* 3. CARD MANAGEMENT CARD (From image_f9c1d597.png) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        Card management
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTravelMode(primaryCard.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          primaryCard.internationalTravelMode
                            ? 'bg-emerald-100 text-[#004732]'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Toggle Travel Notice"
                      >
                        <Plane className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActivePage('cards')}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="All Cards"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Debit Card Tile */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#003B26] to-[#004732] text-white shadow-sm mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                          Tompkins Debit
                        </p>
                        <p className="text-sm font-bold tracking-tight">Checking Account</p>
                      </div>
                      <TompkinsLogo size="sm" textColor="text-white" leafColor="#E2A64B" />
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="font-mono text-xs tracking-widest text-emerald-100">
                        •••• •••• •••• 6110
                      </p>
                      <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded text-white">
                        {primaryCard.isFrozen ? 'LOCKED' : 'ACTIVE'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions for Card */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toggleCardFreeze(primaryCard.id)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border ${
                        primaryCard.isFrozen
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {primaryCard.isFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{primaryCard.isFrozen ? 'Unlock Card' : 'Lock Card'}</span>
                    </button>

                    <button
                      onClick={() => toggleTravelMode(primaryCard.id)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border ${
                        primaryCard.internationalTravelMode
                          ? 'bg-emerald-50 border-emerald-200 text-[#004732]'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>{primaryCard.internationalTravelMode ? 'Travel On' : 'Travel Notice'}</span>
                    </button>
                  </div>

                </div>
              </>
            )}
          </div>

        </div>
      </main>

      {/* =========================================================================
          MODALS & OVERLAYS
          ========================================================================= */}

      {/* 1. Quick Transfer Modal */}
      <QuickTransferModal
        isOpen={isQuickTransferOpen}
        onClose={() => setIsQuickTransferOpen(false)}
      />

      {/* 2. Mobile Check Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-800">
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#004732] flex items-center justify-center">
                <ArrowDownToLine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tompkins Mobile Deposit</h3>
                <p className="text-xs text-slate-500">Deposit paper check to {currentAccount.name}</p>
              </div>
            </div>

            {depositSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-800">{depositSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Deposit Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-base font-bold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#004732]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center hover:bg-slate-50 cursor-pointer">
                    <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold text-slate-600 block">Front of Check</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Captured ✓</span>
                  </div>
                  <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center hover:bg-slate-50 cursor-pointer">
                    <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold text-slate-600 block">Back of Check</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Endorsed ✓</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#004732] hover:bg-[#00573E] text-white text-xs font-bold rounded-lg shadow transition-colors"
                  >
                    Submit Deposit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. Bill Pay Modal */}
      {isBillPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-800">
            <button
              onClick={() => setIsBillPayModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#004732] flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tompkins Bill Pay</h3>
                <p className="text-xs text-slate-500">Pay utility, mortgage, or credit bills</p>
              </div>
            </div>

            {billSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-800">{billSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleBillPaySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select Payee</label>
                  <select
                    value={selectedPayeeId}
                    onChange={(e) => setSelectedPayeeId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#004732]"
                  >
                    {payees.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.accountNumberMasked}) - {p.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-base font-bold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#004732]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#004732] hover:bg-[#00573E] text-white text-xs font-bold rounded-lg shadow transition-colors"
                  >
                    Schedule Payment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. Customer Care Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-800">
            <button
              onClick={() => setIsMessageModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#004732] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tompkins Secure Message</h3>
                <p className="text-xs text-slate-500">Contact Tompkins Customer Care desk</p>
              </div>
            </div>

            {messageSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-800">Message sent securely! Our team responds within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Type your message or inquiry..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#004732]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#004732] hover:bg-[#00573E] text-white text-xs font-bold rounded-lg shadow transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. Locations Modal */}
      {isLocationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 text-slate-800 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsLocationsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-[#004732]" />
              <h3 className="text-lg font-bold text-slate-900">Tompkins Branches &amp; ATMs</h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Tompkins Bank &amp; Trust serves communities across Central, Western, and Hudson Valley New York, and Southeastern Pennsylvania.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-900">Ithaca Main Branch &amp; HQ</p>
                <p className="text-xs text-slate-600">The Commons, 118 E Seneca St, Ithaca, NY 14850</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">Open today until 5:00 PM · Full Service &amp; 24h ATM</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-900">White Plains Financial Center</p>
                <p className="text-xs text-slate-600">50 Main Street, Suite 100, White Plains, NY 10606</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">Open today until 4:30 PM · Wealth &amp; Commercial</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-900">Syracuse Regional Office</p>
                <p className="text-xs text-slate-600">220 Salina Street, Syracuse, NY 13202</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">Open today until 5:00 PM · ATM Drive-thru</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-900">Blue Bell, Pennsylvania Branch</p>
                <p className="text-xs text-slate-600">650 Sentry Parkway, Blue Bell, PA 19422</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">Open today until 4:00 PM · Business &amp; Personal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tompkins Info Modal with Video from uploaded asset */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 text-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsInfoModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 text-center">
              <TompkinsLogo size="lg" textColor="text-[#004732]" showSubtitle={true} />
              <p className="text-xs text-slate-500 mt-2">
                With trust in your bank, amazing things happen. After 190 years of earning your trust, we are Tompkins Bank &amp; Trust.
              </p>
            </div>

            {/* Embedded Tompkins Overview Video from workspace asset */}
            <div className="rounded-xl overflow-hidden shadow-md border border-slate-200 bg-black aspect-video mb-4">
              <video
                controls
                className="w-full h-full object-contain"
                src="/assets/aistudio/TompkinsBank.com_Website_Overview_-_What_to_Expect_a9c24f7b.mp4"
                poster="/assets/aistudio/image_360d8650.png"
              >
                Your browser does not support HTML video.
              </video>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-800">About Tompkins Bank &amp; Trust:</p>
              <p>
                Founded in 1836, Tompkins Bank &amp; Trust provides personal banking, business banking, mortgages, lending, and digital banking with mobile check deposit, bill pay, touch ID, and card shield.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add Account Modal */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-slate-800">
            <button
              onClick={() => setIsAddAccountModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Open a New Tompkins Account</h3>
            <p className="text-xs text-slate-500 mb-4">Select an account type to establish immediately for Mike.</p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  if (onOpenCreateAccount) onOpenCreateAccount();
                  setIsAddAccountModalOpen(false);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#004732] hover:bg-emerald-50/50 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">Direct Checking Account</p>
                  <p className="text-[11px] text-slate-500">Includes contactless debit card &amp; online bill pay</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  if (onOpenCreateAccount) onOpenCreateAccount();
                  setIsAddAccountModalOpen(false);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#004732] hover:bg-emerald-50/50 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">High-Yield Reserve Savings</p>
                  <p className="text-[11px] text-slate-500">4.25% APY compound interest monthly</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  if (onOpenCreateAccount) onOpenCreateAccount();
                  setIsAddAccountModalOpen(false);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#004732] hover:bg-emerald-50/50 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">Guaranteed Certificate of Deposit (CD)</p>
                  <p className="text-[11px] text-slate-500">Fixed rate terms from 6 to 36 months</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
