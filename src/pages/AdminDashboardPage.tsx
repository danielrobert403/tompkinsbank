import React, { useState } from 'react';
import { useBanking, formatTransactionDate, getRealtimeDate } from '../context/BankingContext';
import {
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  Building2,
  ArrowRight,
  Send,
  UserCheck,
  CreditCard,
  User,
  Sliders,
  FileCheck2,
  AlertTriangle,
  History,
  Lock,
  LogOut,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Trash2,
  Calendar,
  Edit3,
  CheckSquare,
  Square,
  Trash,
} from 'lucide-react';
import { Transaction, TransactionStatus, PendingUserChange } from '../types/banking';

export const AdminDashboardPage: React.FC = () => {
  const {
    transactions,
    updateTransferStatus,
    deleteTransaction,
    deleteMultipleTransactions,
    clearAllTransactions,
    updateTransactionDate,
    accounts,
    cards,
    user,
    executeTransfer,
    pendingChanges,
    approveChangeRequest,
    rejectChangeRequest,
    submitChangeRequest,
    formatCurrency,
    setActivePage,
    logoutAdmin,
    supportMessages,
    replySupportMessage,
  } = useBanking();

  // Active Main View Tab: 'transfers' | 'changes' | 'messages' | 'audit'
  const [activeTab, setActiveTab] = useState<'transfers' | 'changes' | 'messages' | 'audit'>('transfers');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [replySuccessMsg, setReplySuccessMsg] = useState<string | null>(null);

  // Transaction History & Queue filters
  const [transactionScope, setTransactionScope] = useState<'all' | 'pending' | 'transfers' | 'income' | 'card'>('all');
  const [filterTransferStatus, setFilterTransferStatus] = useState<'all' | 'pending' | 'held' | 'cleared' | 'rejected'>('all');
  const [transferSearch, setTransferSearch] = useState('');

  // Multi-select transactions for batch operations
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);

  // Deletion Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    tx?: Transaction;
    isBulk?: boolean;
    isClearAll?: boolean;
    revertBalance?: boolean;
  }>({ isOpen: false, revertBalance: true });

  // Date Edit Modal State
  const [editDateModal, setEditDateModal] = useState<{
    isOpen: boolean;
    tx?: Transaction;
    date: string;
  }>({ isOpen: false, date: '' });

  // Changes queue filter
  const [changeStatusFilter, setChangeStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modals & Actions
  const [transferActionModal, setTransferActionModal] = useState<{
    type: 'pend' | 'approve' | 'reject';
    tx: Transaction;
  } | null>(null);
  const [holdReason, setHoldReason] = useState('Secondary OFAC / Sanctions Verification');
  const [rejectReason, setRejectReason] = useState('Beneficiary account details verification mismatch');

  const [changeActionModal, setChangeActionModal] = useState<{
    type: 'approve' | 'reject';
    change: PendingUserChange;
  } | null>(null);
  const [changeRejectNote, setChangeRejectNote] = useState('Requested documentation did not meet Tompkins compliance threshold');

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Sorted transactions by real-time date descending
  const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  // Transfers and pending transaction approval data
  const transferTxs = sortedTransactions.filter(
    (tx) => tx.category === 'Transfers' || tx.status === 'pending' || tx.status === 'held' || tx.wireDetails !== undefined
  );
  const incomeTxs = sortedTransactions.filter((tx) => tx.amount > 0 || tx.category === 'Income & Salary');
  const cardTxs = sortedTransactions.filter((tx) => tx.category !== 'Transfers' && !tx.wireDetails && tx.category !== 'Income & Salary');

  const pendingTransfers = transferTxs.filter((tx) => tx.status === 'pending' || tx.status === 'held');
  const pendingTransfersVolume = pendingTransfers.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Filtered transactions based on scope, status filter, and search query
  const filteredTransactions = sortedTransactions.filter((tx) => {
    // 1. Scope filter
    if (transactionScope === 'pending') {
      if (tx.status !== 'pending' && tx.status !== 'held') return false;
    } else if (transactionScope === 'transfers') {
      if (tx.category !== 'Transfers' && !tx.wireDetails && tx.status !== 'pending') return false;
    } else if (transactionScope === 'income') {
      if (tx.amount <= 0 && tx.category !== 'Income & Salary') return false;
    } else if (transactionScope === 'card') {
      if (tx.category === 'Transfers' || tx.wireDetails || tx.category === 'Income & Salary') return false;
    }

    // 2. Status filter
    if (filterTransferStatus !== 'all') {
      if (filterTransferStatus === 'pending' && tx.status !== 'pending') return false;
      if (filterTransferStatus === 'held' && tx.status !== 'held') return false;
      if (filterTransferStatus === 'cleared' && tx.status !== 'cleared') return false;
      if (filterTransferStatus === 'rejected' && tx.status !== 'rejected') return false;
    }

    // 3. Search query
    if (transferSearch.trim()) {
      const q = transferSearch.toLowerCase();
      const match =
        tx.merchant.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q) ||
        (tx.accountName && tx.accountName.toLowerCase().includes(q)) ||
        tx.date.includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Toggle selection for a single transaction
  const handleToggleSelectTx = (txId: string) => {
    setSelectedTxIds((prev) =>
      prev.includes(txId) ? prev.filter((id) => id !== txId) : [...prev, txId]
    );
  };

  // Select all or deselect all visible transactions
  const handleToggleSelectAll = () => {
    const visibleIds = filteredTransactions.map((tx) => tx.id);
    const areAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedTxIds.includes(id));
    if (areAllSelected) {
      setSelectedTxIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedTxIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Confirm delete handler (single, bulk, or clear all)
  const handleConfirmDelete = () => {
    if (deleteModal.isClearAll) {
      clearAllTransactions();
      setSelectedTxIds([]);
      setActionSuccessMsg('All customer transaction history has been cleared permanently.');
    } else if (deleteModal.isBulk) {
      deleteMultipleTransactions(selectedTxIds);
      setActionSuccessMsg(`Successfully deleted ${selectedTxIds.length} transactions from customer history.`);
      setSelectedTxIds([]);
    } else if (deleteModal.tx) {
      deleteTransaction(deleteModal.tx.id, deleteModal.revertBalance ?? true);
      setSelectedTxIds((prev) => prev.filter((id) => id !== deleteModal.tx!.id));
      setActionSuccessMsg(`Transaction #${deleteModal.tx.id.slice(-6)} deleted from customer history.`);
    }
    setDeleteModal({ isOpen: false });
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Confirm date edit handler
  const handleSaveDate = () => {
    if (editDateModal.tx && editDateModal.date) {
      updateTransactionDate(editDateModal.tx.id, editDateModal.date);
      setActionSuccessMsg(`Transaction #${editDateModal.tx.id.slice(-6)} date updated to ${formatTransactionDate(editDateModal.date)}.`);
      setEditDateModal({ isOpen: false, date: '' });
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  // Changes data
  const pendingChangesCount = pendingChanges.filter((c) => c.status === 'pending').length;
  const filteredChanges = pendingChanges.filter((c) =>
    changeStatusFilter === 'all' ? true : c.status === changeStatusFilter
  );

  // Transfer action execution
  const handleExecuteTransferAction = () => {
    if (!transferActionModal) return;
    const { type, tx } = transferActionModal;

    if (type === 'pend') {
      updateTransferStatus(tx.id, 'held', holdReason);
      setActionSuccessMsg(`Transfer #${tx.id.slice(-6)} placed on PENDING HOLD. Compliance note logged.`);
    } else if (type === 'approve') {
      updateTransferStatus(tx.id, 'cleared');
      setActionSuccessMsg(`Transfer #${tx.id.slice(-6)} APPROVED & RELEASED. Settlement transmitted.`);
    } else if (type === 'reject') {
      updateTransferStatus(tx.id, 'rejected', rejectReason);
      setActionSuccessMsg(`Transfer #${tx.id.slice(-6)} REJECTED. Funds of ${formatCurrency(Math.abs(tx.amount))} refunded to customer account.`);
    }

    setTransferActionModal(null);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Change action execution
  const handleExecuteChangeAction = () => {
    if (!changeActionModal) return;
    const { type, change } = changeActionModal;

    if (type === 'approve') {
      approveChangeRequest(change.id, 'Approved by Operations Administrator');
      setActionSuccessMsg(`Change Request #${change.id.slice(-6)} ("${change.title}") has been APPROVED and applied to customer profile.`);
    } else if (type === 'reject') {
      rejectChangeRequest(change.id, changeRejectNote);
      setActionSuccessMsg(`Change Request #${change.id.slice(-6)} declined. Customer notified.`);
    }

    setChangeActionModal(null);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Simulation helpers for testing approval workflows
  const handleSimulateWire = () => {
    const chk = accounts[0];
    if (!chk) return;
    executeTransfer({
      fromAccountId: chk.id,
      type: 'external',
      amount: 4500.00,
      memo: 'Corporate Equipment Purchase - Escrow',
      recipientName: 'Apex Commercial Logistics LLC',
      externalBankName: 'JPMorgan Chase Bank, N.A.',
      externalRouting: '021000021',
      externalAccount: '9984102914',
      speed: 'standard',
      wireType: 'wire_domestic',
      requireReview: true,
    });
    setActionSuccessMsg('Simulated High-Value Wire ($4,500.00) initiated! Added to Pending Queue.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleSimulateChange = () => {
    submitChangeRequest({
      type: 'profile_update',
      title: 'Residential Address & Phone Update',
      description: 'Paulina Villarreal requested an address and contact number change.',
      data: {
        phone: '(607) 555-8821',
        address: '520 E Buffalo Street, Penthouse 4',
      },
      diff: [
        {
          field: 'phone',
          label: 'Contact Phone',
          oldValue: user.phone || '(607) 273-3210',
          newValue: '(607) 555-8821',
        },
        {
          field: 'address',
          label: 'Street Address',
          oldValue: user.address || '118 E Seneca Street',
          newValue: '520 E Buffalo Street, Penthouse 4',
        },
      ],
    });
    setActionSuccessMsg('Simulated Profile Change Request submitted! Added to Changes Queue.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F0F3F1] py-8 px-4 sm:px-6 selection:bg-[#004732] selection:text-white">
      <div className="max-w-[1360px] mx-auto space-y-6">
        
        {/* =========================================================================
            ADMIN TOP COMMAND BANNER
            ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold uppercase rounded">
                Admin Command Console
              </span>
              <span className="text-xs font-bold text-[#004732] uppercase tracking-wider">
                Tompkins Financial Corporation · Operations &amp; Treasury
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Dual-Control Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Operations &amp; Compliance Management Portal
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Confidential internal operations desk. Authorize or reject customer wire transfers and internal payments, and review user dashboard changes (profile contact updates, card limit modifications, and account requests).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleSimulateWire}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Test new outbound transfer queueing"
            >
              <Send className="w-3.5 h-3.5 text-[#004732]" />
              <span>Simulate Wire ($4.5k)</span>
            </button>

            <button
              onClick={handleSimulateChange}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Test new profile change request"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#004732]" />
              <span>Simulate Profile Change</span>
            </button>

            <button
              onClick={() => {
                logoutAdmin();
                setActivePage('my-account');
              }}
              className="px-4 py-2 bg-[#004732] hover:bg-[#003B26] text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin &amp; Return to Banking</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
              Dismiss
            </button>
          </div>
        )}

        {/* =========================================================================
            METRICS CARDS
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Pending Transfers</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{pendingTransfers.length}</p>
            <p className="text-xs text-amber-700 mt-1 font-mono font-semibold">
              Volume: {formatCurrency(pendingTransfersVolume)}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Pending Dashboard Changes</span>
              <Sliders className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{pendingChangesCount}</p>
            <p className="text-xs text-blue-700 mt-1 font-medium">
              Profile, card limits &amp; preferences
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Customer Under Review</span>
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 mt-2 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 mt-1">
              Member ID: TPK-6110634-PV
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Risk &amp; Dual Verification</span>
              <ShieldCheck className="w-4 h-4 text-[#004732]" />
            </div>
            <p className="text-xl font-bold text-emerald-700 mt-2">Passed (Low Risk)</p>
            <p className="text-xs text-slate-500 mt-1">
              FDIC &amp; FedWire Ready
            </p>
          </div>
        </div>

        {/* =========================================================================
            MAIN WORKSPACE TABS: Transfers | Dashboard Changes | Audit
            ========================================================================= */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Navigation Bar */}
          <div className="border-b border-slate-200 px-6 pt-4 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('transfers')}
                className={`pb-3 text-sm font-semibold relative transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'transfers'
                    ? 'text-[#004732] border-b-2 border-[#004732]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Transaction History &amp; Approvals</span>
                <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded-full text-[10px] font-mono font-bold">
                  {transactions.length}
                </span>
                {pendingTransfers.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-mono font-bold" title="Pending approvals">
                    {pendingTransfers.length} Pending
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('changes')}
                className={`pb-3 text-sm font-semibold relative transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'changes'
                    ? 'text-[#004732] border-b-2 border-[#004732]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>User Dashboard Changes</span>
                {pendingChangesCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-mono font-bold">
                    {pendingChangesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`pb-3 text-sm font-semibold relative transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'messages'
                    ? 'text-[#004732] border-b-2 border-[#004732]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Client Direct Messages</span>
                {supportMessages.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-mono font-bold">
                    {supportMessages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`pb-3 text-sm font-semibold relative transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'audit'
                    ? 'text-[#004732] border-b-2 border-[#004732]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Audit &amp; Operations Log</span>
              </button>
            </div>
          </div>

          {/* TAB 1: TRANSACTION HISTORY & APPROVALS MANAGEMENT */}
          {activeTab === 'transfers' && (
            <div className="p-6 space-y-5">
              
              {/* Real-time Date & Operations Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#004732] shrink-0" />
                  <span className="text-slate-700">
                    <strong>Real-Time Calendar Date:</strong> {formatTransactionDate(getRealtimeDate(), { showDayOfWeek: true })}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">({getRealtimeDate()})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>Total Records: <strong className="text-slate-800">{transactions.length}</strong></span>
                  <span>·</span>
                  <span>Pending Volume: <strong className="text-amber-700">{formatCurrency(pendingTransfersVolume)}</strong></span>
                </div>
              </div>

              {/* Scope & Status Filter Bar */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Scope Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
                  <button
                    onClick={() => setTransactionScope('all')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      transactionScope === 'all'
                        ? 'bg-[#004732] text-white border-[#004732]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    All Transactions ({transactions.length})
                  </button>
                  <button
                    onClick={() => setTransactionScope('pending')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      transactionScope === 'pending'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Queue ({pendingTransfers.length})</span>
                  </button>
                  <button
                    onClick={() => setTransactionScope('transfers')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      transactionScope === 'transfers'
                        ? 'bg-[#004732] text-white border-[#004732]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Transfers &amp; Wires ({transferTxs.length})
                  </button>
                  <button
                    onClick={() => setTransactionScope('income')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      transactionScope === 'income'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    Deposits &amp; Earnings ({incomeTxs.length})
                  </button>
                  <button
                    onClick={() => setTransactionScope('card')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      transactionScope === 'card'
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Card &amp; POS ({cardTxs.length})
                  </button>
                </div>

                {/* Status Selector & Search */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <select
                    value={filterTransferStatus}
                    onChange={(e) => setFilterTransferStatus(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:border-[#004732]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Approval</option>
                    <option value="held">Held by Admin</option>
                    <option value="cleared">Cleared &amp; Released</option>
                    <option value="rejected">Rejected &amp; Refunded</option>
                  </select>

                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search payee, ID, date, amount..."
                      value={transferSearch}
                      onChange={(e) => setTransferSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                    />
                  </div>
                </div>
              </div>

              {/* Batch Actions & History Purge Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-100/70 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleToggleSelectAll}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    {filteredTransactions.length > 0 && filteredTransactions.every((tx) => selectedTxIds.includes(tx.id)) ? (
                      <CheckSquare className="w-4 h-4 text-[#004732]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <span>Select All Visible ({filteredTransactions.length})</span>
                  </button>

                  {selectedTxIds.length > 0 && (
                    <div className="flex items-center gap-2 pl-3 border-l border-slate-300">
                      <span className="px-2 py-0.5 bg-[#004732] text-white text-[11px] font-bold rounded-full">
                        {selectedTxIds.length} Selected
                      </span>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, isBulk: true, revertBalance: true })}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Selected ({selectedTxIds.length})</span>
                      </button>
                      <button
                        onClick={() => setSelectedTxIds([])}
                        className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Deselect
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, isClearAll: true })}
                    className="px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Delete entire transaction history from customer account"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Clear All History</span>
                  </button>
                </div>
              </div>

              {/* Table of Transactions */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-3 px-3 w-8 text-center">
                          <span className="sr-only">Select</span>
                        </th>
                        <th className="py-3 px-4">Ref &amp; Real-Time Date</th>
                        <th className="py-3 px-4">Beneficiary / Merchant</th>
                        <th className="py-3 px-4">Account</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Administrative Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredTransactions.map((tx) => {
                        const isPending = tx.status === 'pending' || tx.status === 'held';
                        const isCleared = tx.status === 'cleared';
                        const isRejected = tx.status === 'rejected';
                        const isCredit = tx.amount > 0;
                        const isSelected = selectedTxIds.includes(tx.id);

                        return (
                          <tr
                            key={tx.id}
                            className={`transition-colors ${
                              isSelected ? 'bg-emerald-50/50 hover:bg-emerald-50/80' : 'hover:bg-slate-50/70'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-3.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleSelectTx(tx.id)}
                                className="cursor-pointer inline-flex items-center justify-center"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-[#004732]" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                                )}
                              </button>
                            </td>

                            {/* Ref & Date with Real-Time formatting and edit trigger */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <p className="font-bold text-slate-900">#{tx.id.slice(-8)}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[11px] text-slate-700 font-sans font-medium">
                                  {formatTransactionDate(tx.date)}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">({tx.date})</span>
                                <button
                                  type="button"
                                  onClick={() => setEditDateModal({ isOpen: true, tx, date: tx.date })}
                                  className="text-slate-400 hover:text-[#004732] p-0.5 rounded cursor-pointer"
                                  title="Change date or align with real-time date"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Beneficiary & Category Details */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-900 font-sans text-xs">{tx.merchant}</p>
                                {tx.category && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-sans font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                    {tx.category}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-sans mt-0.5">{tx.description}</p>
                              {tx.wireDetails?.adminHoldReason && (
                                <p className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block mt-1 font-sans border border-amber-200">
                                  Hold Reason: {tx.wireDetails.adminHoldReason}
                                </p>
                              )}
                              {tx.wireDetails?.clearanceCode && (
                                <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                                  Auth Ref: {tx.wireDetails.clearanceCode}
                                </p>
                              )}
                            </td>

                            {/* Origin Account */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-sans">
                              {tx.accountName || 'Checking (*4491)'}
                            </td>

                            {/* Amount */}
                            <td className="py-3.5 px-4 text-right font-bold text-sm tabular-nums whitespace-nowrap">
                              <span className={isCredit ? 'text-emerald-700' : 'text-slate-900'}>
                                {isCredit ? '+' : ''}{formatCurrency(tx.amount)}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              {isPending && (
                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px] uppercase rounded">
                                  {tx.status === 'held' ? 'Held by Admin' : 'Pending Approval'}
                                </span>
                              )}
                              {isCleared && (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase rounded">
                                  Cleared &amp; Released
                                </span>
                              )}
                              {isRejected && (
                                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px] uppercase rounded">
                                  Rejected &amp; Refunded
                                </span>
                              )}
                            </td>

                            {/* Actions: Approvals, Edit Date & Delete */}
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5 font-sans">
                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => {
                                        updateTransferStatus(tx.id, 'cleared');
                                        setActionSuccessMsg(`Transfer #${tx.id.slice(-6)} APPROVED & RELEASED. Federal Reserve settlement transmitted in real time.`);
                                        setTimeout(() => setActionSuccessMsg(null), 4000);
                                      }}
                                      className="px-2.5 py-1.5 bg-[#004732] hover:bg-[#003828] text-white rounded text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                                      title="1-Click Approve and Clear Transfer"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                                      <span>Approve</span>
                                    </button>

                                    <button
                                      onClick={() => setTransferActionModal({ type: 'reject', tx })}
                                      className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs font-semibold transition-colors cursor-pointer"
                                      title="Decline transfer and refund customer"
                                    >
                                      Reject
                                    </button>

                                    {tx.status !== 'held' && (
                                      <button
                                        onClick={() => setTransferActionModal({ type: 'pend', tx })}
                                        className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-xs font-medium transition-colors cursor-pointer"
                                        title="Place on compliance hold"
                                      >
                                        Hold
                                      </button>
                                    )}
                                  </>
                                )}

                                {/* Edit Date Button */}
                                <button
                                  type="button"
                                  onClick={() => setEditDateModal({ isOpen: true, tx, date: tx.date })}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                                  title="Align or edit transaction date"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Transaction Button */}
                                <button
                                  type="button"
                                  onClick={() => setDeleteModal({ isOpen: true, tx, revertBalance: true })}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded transition-colors cursor-pointer"
                                  title="Delete transaction from history"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredTransactions.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500 font-sans">
                            <p className="font-semibold text-slate-700">No transactions match your current filters.</p>
                            <p className="text-xs text-slate-400 mt-1">Try switching tabs or resetting the search term.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: USER DASHBOARD CHANGES APPROVALS */}
          {activeTab === 'changes' && (
            <div className="p-6 space-y-6">
              
              {/* Guidance Notice */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-start gap-3 text-xs text-slate-700">
                <Sliders className="w-5 h-5 text-[#004732] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">User Dashboard Modifications Review Queue:</p>
                  <p>
                    When customer Paulina Villarreal requests profile updates (phone number, mailing address, email), increases card withdrawal caps, or requests new account products from her dashboard, they appear here for official Operations authorization. Approving immediately applies the change live; rejecting preserves the previous state and informs the customer.
                  </p>
                </div>
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChangeStatusFilter('all')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                    changeStatusFilter === 'all'
                      ? 'bg-[#004732] text-white border-[#004732]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  All Requests ({pendingChanges.length})
                </button>
                <button
                  onClick={() => setChangeStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    changeStatusFilter === 'pending'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Approval ({pendingChangesCount})</span>
                </button>
                <button
                  onClick={() => setChangeStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                    changeStatusFilter === 'approved'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Approved &amp; Applied
                </button>
                <button
                  onClick={() => setChangeStatusFilter('rejected')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                    changeStatusFilter === 'rejected'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Rejected
                </button>
              </div>

              {/* Changes Cards List */}
              <div className="space-y-4">
                {filteredChanges.map((change) => {
                  const isPending = change.status === 'pending';
                  const isApproved = change.status === 'approved';
                  const isRejected = change.status === 'rejected';

                  return (
                    <div
                      key={change.id}
                      className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                    >
                      {/* Top Header of Change Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded bg-emerald-50 text-[#004732]">
                            {change.type === 'profile_update' && <User className="w-4 h-4" />}
                            {change.type === 'card_limit' && <CreditCard className="w-4 h-4" />}
                            {change.type === 'card_freeze' && <Lock className="w-4 h-4" />}
                            {change.type === 'new_card' && <CreditCard className="w-4 h-4" />}
                            {change.type === 'new_account' && <Building2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900">{change.title}</h3>
                              <span className="font-mono text-[10px] text-slate-400">#{change.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{change.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-500">Requested: {change.requestedAt}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isPending
                                ? 'bg-amber-100 text-amber-800'
                                : isApproved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {change.status}
                          </span>
                        </div>
                      </div>

                      {/* Diff Comparison Table */}
                      {change.diff && change.diff.length > 0 && (
                        <div className="bg-slate-50 rounded-md border border-slate-200 overflow-hidden text-xs">
                          <div className="grid grid-cols-12 bg-slate-100/80 px-4 py-2 font-semibold text-slate-600 text-[11px]">
                            <div className="col-span-4">Field / Parameter</div>
                            <div className="col-span-4 text-slate-500">Current Value</div>
                            <div className="col-span-4 text-[#004732]">Requested New Value</div>
                          </div>
                          <div className="divide-y divide-slate-200">
                            {change.diff.map((item, idx) => (
                              <div key={idx} className="grid grid-cols-12 px-4 py-2.5 items-center">
                                <div className="col-span-4 font-medium text-slate-800">{item.label}</div>
                                <div className="col-span-4 text-slate-600 line-through font-mono text-[11px]">
                                  {item.oldValue}
                                </div>
                                <div className="col-span-4 text-emerald-700 font-semibold font-mono text-[11px] flex items-center gap-1.5">
                                  <span>{item.newValue}</span>
                                  <span className="px-1 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] rounded uppercase font-sans">
                                    New
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes / Review outcome */}
                      {change.adminDecisionNotes && (
                        <div className="p-2.5 bg-slate-50 rounded text-xs text-slate-600 flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>
                            <strong>Decision Log:</strong> {change.adminDecisionNotes} (by {change.reviewedBy || 'Operations'}, {change.reviewedAt})
                          </span>
                        </div>
                      )}

                      {/* Action buttons if Pending */}
                      {isPending && (
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                          <button
                            onClick={() => setChangeActionModal({ type: 'reject', change })}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Decline Request
                          </button>
                          <button
                            onClick={() => setChangeActionModal({ type: 'approve', change })}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve &amp; Apply Changes</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredChanges.length === 0 && (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No customer change requests match your selected status.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Operations Dual-Control Compliance Log</h3>
              <p className="text-xs text-slate-500">
                All administrative approvals, transfer clearances, and profile modifications are archived in this tamper-evident ledger.
              </p>

              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs font-mono">
                <div className="p-3 bg-slate-50 text-slate-500 font-semibold grid grid-cols-12 text-[11px]">
                  <div className="col-span-3">Timestamp (EST)</div>
                  <div className="col-span-3">Entity &amp; Ref</div>
                  <div className="col-span-4">Action Summary</div>
                  <div className="col-span-2 text-right">Operator</div>
                </div>

                <div className="p-3 grid grid-cols-12 items-center hover:bg-slate-50">
                  <div className="col-span-3 text-slate-500">2026-10-27 09:14:22</div>
                  <div className="col-span-3 font-semibold text-slate-800">Wire #FED-6110-842</div>
                  <div className="col-span-4 text-emerald-700">Outbound FedWire ($6,800.00) clearance authorized</div>
                  <div className="col-span-2 text-right text-slate-600">Ops_Admin_01</div>
                </div>

                <div className="p-3 grid grid-cols-12 items-center hover:bg-slate-50">
                  <div className="col-span-3 text-slate-500">2026-10-27 08:52:10</div>
                  <div className="col-span-3 font-semibold text-slate-800">Profile #CHG-01</div>
                  <div className="col-span-4 text-blue-700">Paulina Villarreal contact address verified</div>
                  <div className="col-span-2 text-right text-slate-600">Compliance_Desk</div>
                </div>

                <div className="p-3 grid grid-cols-12 items-center hover:bg-slate-50">
                  <div className="col-span-3 text-slate-500">2026-10-26 16:30:00</div>
                  <div className="col-span-3 font-semibold text-slate-800">Card #6110</div>
                  <div className="col-span-4 text-slate-700">Daily ATM Withdrawal limit increase authorized to $5,000</div>
                  <div className="col-span-2 text-right text-slate-600">Risk_Officer</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT DIRECT MESSAGES & INQUIRIES (Bank End) */}
          {activeTab === 'messages' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#004732]" />
                    <span>Client Direct Messages Console — Response Desk</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct inquiries submitted by <strong className="text-slate-800">{user.name}</strong> (Member ID: TPK-6110634-PV). Responses typed here appear immediately in the client portal.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                    Messages: {supportMessages.length} Total
                  </span>
                </div>
              </div>

              {replySuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{replySuccessMsg}</span>
                  </div>
                  <button
                    onClick={() => setReplySuccessMsg(null)}
                    className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Message History Thread */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200">
                {supportMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg text-xs space-y-1.5 border ${
                        isUser
                          ? 'bg-white border-blue-200 shadow-2xs mr-8'
                          : 'bg-emerald-50/70 border-emerald-200 shadow-2xs ml-8'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[11px]">
                        <span className={`font-bold flex items-center gap-1.5 ${isUser ? 'text-blue-900' : 'text-[#004732]'}`}>
                          {isUser && user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                          ) : (
                            <User className="w-3.5 h-3.5" />
                          )}
                          <span>{isUser ? msg.senderName : 'Tompkins Client Care'} ({isUser ? 'Client' : 'Bank Operations Desk'})</span>
                        </span>
                        <span className="text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {msg.timestamp}
                        </span>
                      </div>

                      {msg.subject && (
                        <p className="font-semibold text-slate-900 text-xs">{msg.subject}</p>
                      )}

                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Bank Reply Composer Form */}
              <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Compose Official Bank Response
                  </h4>
                  <span className="text-[11px] text-slate-400">Transmitted directly to client portal</span>
                </div>

                {/* Quick Templates */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">Quick Templates:</span>
                  {[
                    'Your international tour wire pre-authorizations are confirmed and active.',
                    'Your daily debit and ATM withdrawal limits have been temporarily elevated for tour production.',
                    'Wire transfer settlement received and verified with the beneficiary institution.',
                  ].map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAdminReplyText(tmpl)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] rounded transition-colors cursor-pointer"
                    >
                      {tmpl.slice(0, 35)}...
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!adminReplyText.trim()) return;
                    replySupportMessage(adminReplyText.trim());
                    setAdminReplyText('');
                    setReplySuccessMsg(`Response sent to ${user.name}. Delivered to customer service portal.`);
                    setTimeout(() => setReplySuccessMsg(null), 4000);
                  }}
                  className="space-y-3"
                >
                  <textarea
                    rows={3}
                    required
                    placeholder={`Type official bank response to ${user.name}...`}
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                  />

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-500">
                      Sending this response will update the direct message thread and send an in-app notice to the client.
                    </p>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#004732] hover:bg-[#003828] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Response from Bank End</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* =========================================================================
          TRANSFER ACTION MODAL (Pend, Approve, Reject)
          ========================================================================= */}
      {transferActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 p-6 space-y-4">
            
            <div className="flex items-center gap-2">
              {transferActionModal.type === 'pend' && <Clock className="w-5 h-5 text-amber-600" />}
              {transferActionModal.type === 'approve' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {transferActionModal.type === 'reject' && <XCircle className="w-5 h-5 text-rose-600" />}
              <h3 className="text-lg font-bold text-slate-900">
                {transferActionModal.type === 'pend' && 'Pend Transfer / Place On Hold'}
                {transferActionModal.type === 'approve' && 'Approve & Release Transfer'}
                {transferActionModal.type === 'reject' && 'Reject Transfer & Refund Customer'}
              </h3>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Transfer ID:</span>
                <span className="font-bold text-slate-900">#{transferActionModal.tx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Beneficiary:</span>
                <span className="font-bold text-slate-900">{transferActionModal.tx.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Amount:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {formatCurrency(Math.abs(transferActionModal.tx.amount))}
                </span>
              </div>
            </div>

            {transferActionModal.type === 'pend' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Hold Reason / Compliance Memo
                </label>
                <select
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#004732]"
                >
                  <option value="Secondary OFAC / Sanctions Verification">Secondary OFAC / Sanctions Verification</option>
                  <option value="High-Value Outbound Wire Dual Review">High-Value Outbound Wire Dual Review</option>
                  <option value="Beneficiary Account Verification Pending">Beneficiary Account Verification Pending</option>
                  <option value="Customer Confirmation Callback Scheduled">Customer Confirmation Callback Scheduled</option>
                </select>
              </div>
            )}

            {transferActionModal.type === 'reject' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Rejection Reason (Funds will automatically refund immediately)
                </label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#004732]"
                />
              </div>
            )}

            {transferActionModal.type === 'approve' && (
              <p className="text-xs text-slate-600">
                Authorizing this transfer will clear the debited amount and transmit payment through the Federal Reserve FedWire/ACH rail. A settlement clearance code will be generated.
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTransferActionModal(null)}
                className="flex-1 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteTransferAction}
                className={`flex-1 py-2 rounded text-white text-xs font-semibold transition-colors cursor-pointer ${
                  transferActionModal.type === 'pend'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : transferActionModal.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {transferActionModal.type === 'pend' && 'Confirm Hold Status'}
                {transferActionModal.type === 'approve' && 'Authorize & Release'}
                {transferActionModal.type === 'reject' && 'Confirm Reject & Refund'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          CHANGE ACTION MODAL (Approve, Reject)
          ========================================================================= */}
      {changeActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 p-6 space-y-4">
            
            <div className="flex items-center gap-2">
              {changeActionModal.type === 'approve' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {changeActionModal.type === 'reject' && <XCircle className="w-5 h-5 text-rose-600" />}
              <h3 className="text-lg font-bold text-slate-900">
                {changeActionModal.type === 'approve' ? 'Approve Customer Dashboard Change' : 'Decline Customer Request'}
              </h3>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
              <p className="font-semibold text-slate-900">{changeActionModal.change.title}</p>
              <p className="text-slate-600">{changeActionModal.change.description}</p>
            </div>

            {changeActionModal.type === 'reject' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Decline Reason / Compliance Note
                </label>
                <input
                  type="text"
                  value={changeRejectNote}
                  onChange={(e) => setChangeRejectNote(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#004732]"
                />
              </div>
            )}

            {changeActionModal.type === 'approve' && (
              <p className="text-xs text-slate-600">
                Approving will immediately update the live customer account and reflect in Paulina Villarreal&apos;s active dashboard.
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setChangeActionModal(null)}
                className="flex-1 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteChangeAction}
                className={`flex-1 py-2 rounded text-white text-xs font-semibold transition-colors cursor-pointer ${
                  changeActionModal.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {changeActionModal.type === 'approve' ? 'Confirm & Apply Change' : 'Confirm Decline'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE TRANSACTION MODAL (Single, Bulk, or Clear All)
          ========================================================================= */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 p-6 space-y-4">
            
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-50 rounded-full text-rose-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {deleteModal.isClearAll
                    ? 'Clear All Transaction History'
                    : deleteModal.isBulk
                    ? `Delete ${selectedTxIds.length} Transactions`
                    : 'Delete Transaction from History'}
                </h3>
                <p className="text-xs text-slate-500">
                  {deleteModal.isClearAll
                    ? 'Purge customer transaction records across devices'
                    : 'Remove transaction record from customer ledger'}
                </p>
              </div>
            </div>

            {/* Single Transaction Details */}
            {deleteModal.tx && !deleteModal.isBulk && !deleteModal.isClearAll && (
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Reference:</span>
                  <span className="font-bold text-slate-900">#{deleteModal.tx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Payee / Merchant:</span>
                  <span className="font-bold text-slate-900 font-sans">{deleteModal.tx.merchant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Date:</span>
                  <span className="text-slate-800 font-sans">
                    {formatTransactionDate(deleteModal.tx.date)} ({deleteModal.tx.date})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Amount:</span>
                  <span className={`font-bold text-sm ${deleteModal.tx.amount > 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {deleteModal.tx.amount > 0 ? '+' : ''}{formatCurrency(deleteModal.tx.amount)}
                  </span>
                </div>
              </div>
            )}

            {/* Single Tx Option to Revert Balance */}
            {deleteModal.tx && !deleteModal.isBulk && !deleteModal.isClearAll && (
              <label className="flex items-start gap-2.5 p-3 bg-amber-50/60 border border-amber-200/70 rounded-md text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteModal.revertBalance ?? true}
                  onChange={(e) =>
                    setDeleteModal((prev) => ({ ...prev, revertBalance: e.target.checked }))
                  }
                  className="mt-0.5 rounded text-[#004732] focus:ring-[#004732]"
                />
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-800 block">
                    Restore / Revert Account Balance
                  </span>
                  <span className="text-slate-500 block text-[11px] leading-relaxed">
                    If checked, funds will be automatically credited back for debits/wires, or deducted for incoming deposits.
                  </span>
                </div>
              </label>
            )}

            {/* Bulk Deletion Summary */}
            {deleteModal.isBulk && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 space-y-1">
                <p className="font-semibold">
                  You are about to delete {selectedTxIds.length} selected transaction records.
                </p>
                <p className="text-[11px] text-rose-700">
                  This will remove them permanently from the customer&apos;s transaction history.
                </p>
              </div>
            )}

            {/* Clear All Confirmation */}
            {deleteModal.isClearAll && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Permanent History Purge</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  Are you sure you want to clear <strong>all {transactions.length} transactions</strong>? This resets the customer&apos;s transaction history completely across all devices in real time.
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false })}
                className="flex-1 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {deleteModal.isClearAll
                    ? 'Confirm Purge History'
                    : deleteModal.isBulk
                    ? `Delete (${selectedTxIds.length})`
                    : 'Confirm Delete'}
                </span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT TRANSACTION DATE MODAL (Align to Real Time or Custom Date)
          ========================================================================= */}
      {editDateModal.isOpen && editDateModal.tx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 p-6 space-y-4">
            
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 rounded-full text-[#004732]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Align or Edit Transaction Date
                </h3>
                <p className="text-xs text-slate-500">
                  Sync transaction date with real-time calendar date
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Reference:</span>
                <span className="font-bold text-slate-900">#{editDateModal.tx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Payee / Merchant:</span>
                <span className="font-bold text-slate-900 font-sans">{editDateModal.tx.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Current Date:</span>
                <span className="text-slate-800 font-sans">
                  {formatTransactionDate(editDateModal.tx.date)} ({editDateModal.tx.date})
                </span>
              </div>
            </div>

            {/* Quick action to align with Real-Time Date (Today) */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-md text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-950">Quick Real-Time Sync:</span>
                <span className="font-mono text-emerald-800 text-[11px] font-bold">{getRealtimeDate()}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditDateModal((prev) => ({ ...prev, date: getRealtimeDate() }))}
                className="w-full py-1.5 px-3 bg-[#004732] hover:bg-[#003828] text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Set to Today&apos;s Real-Time Date ({formatTransactionDate(getRealtimeDate())})</span>
              </button>
            </div>

            {/* Custom Date Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Custom Transaction Date:
              </label>
              <input
                type="date"
                value={editDateModal.date}
                onChange={(e) => setEditDateModal((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
              />
              {editDateModal.date && (
                <p className="text-[11px] text-slate-500">
                  Will display as: <strong>{formatTransactionDate(editDateModal.date, { showDayOfWeek: true })}</strong>
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditDateModal({ isOpen: false, date: '' })}
                className="flex-1 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDate}
                disabled={!editDateModal.date}
                className="flex-1 py-2 rounded bg-[#004732] hover:bg-[#003828] disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save &amp; Sync Date</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
