import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  BankAccount,
  BankNotification,
  CheckDepositRequest,
  PaymentCard,
  Payee,
  SavingsGoal,
  Transaction,
  TransactionStatus,
  TransferRequest,
  PendingUserChange,
  SupportMessage,
} from '../types/banking';
import {
  INITIAL_ACCOUNTS,
  INITIAL_CARDS,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYEES,
  INITIAL_TRANSACTIONS,
  INITIAL_PENDING_CHANGES,
  INITIAL_SUPPORT_MESSAGES,
} from '../data/initialData';

export interface UserProfile {
  name: string;
  email: string;
  tier: string;
  memberSince: string;
  avatarInitials: string;
  avatarUrl?: string;
  phone: string;
  address?: string;
  cityStateZip?: string;
  occupation?: string;
  primaryBranch?: string;
  branchAddress?: string;
  privateBanker?: string;
  privateBankerTitle?: string;
  privateBankerEmail?: string;
  privateBankerPhone?: string;
  ssnMasked?: string;
  dateOfBirth?: string;
  twoFactorEnabled?: boolean;
  biometricEnabled?: boolean;
  paperlessStatements?: boolean;
  transactionAlerts?: boolean;
  wireAlerts?: boolean;
}

interface BankingContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (admin: boolean) => void;
  activePortalTab: string;
  setActivePortalTab: (tab: string) => void;
  user: UserProfile;
  updateUser: (updatedFields: Partial<UserProfile>) => void;
  accounts: BankAccount[];
  transactions: Transaction[];
  cards: PaymentCard[];
  payees: Payee[];
  goals: SavingsGoal[];
  notifications: BankNotification[];
  selectedAccountId: string;
  setSelectedAccountId: (id: string) => void;
  unreadCount: number;

  // Pending user dashboard change requests & admin approval
  pendingChanges: PendingUserChange[];
  submitChangeRequest: (req: Omit<PendingUserChange, 'id' | 'requestedAt' | 'status'>) => string;
  approveChangeRequest: (id: string, notes?: string) => void;
  rejectChangeRequest: (id: string, notes?: string) => void;

  // Authentication
  login: (username: string, password: string) => { success: boolean; message: string; isAdmin?: boolean };
  logout: () => void;
  logoutAdmin: () => void;

  // Actions
  executeTransfer: (payload: TransferRequest) => { success: boolean; message: string; transactionId?: string };
  depositCheck: (request: CheckDepositRequest) => { success: boolean; message: string; transactionId?: string };
  payBill: (payeeId: string, fromAccountId: string, amount: number) => { success: boolean; message: string };
  addPayee: (name: string, accountNumber: string, category: string, typicalAmount: number) => void;
  toggleCardFreeze: (cardId: string) => void;
  toggleTravelMode: (cardId: string) => void;
  updateCardLimit: (cardId: string, newLimit: number) => void;
  generateVirtualCard: (name: string, spendingCap: number) => PaymentCard;
  issueNewCreditCard: (cardName: string, creditLimit: number) => PaymentCard;
  contributeToGoal: (goalId: string, fromAccountId: string, amount: number) => { success: boolean; message: string };
  openNewAccount: (type: 'checking' | 'savings' | 'credit' | 'cd', name: string, initialDeposit: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateTransferStatus: (txId: string, newStatus: TransactionStatus, reason?: string) => void;
  updateTransactionTag: (txId: string, tag: string) => void;
  updateTransactionNotes: (txId: string, notes: string) => void;
  updateTransactionImage: (txId: string, imageUrl: string) => void;
  resetAllData: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  formatCurrency: (amount: number) => string;

  // Direct Messaging / Support Desk
  supportMessages: SupportMessage[];
  sendSupportMessage: (message: string, subject?: string) => void;
  replySupportMessage: (replyText: string, originalMessageId?: string) => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'tompkins_bank_user_profile_v5',
  ACCOUNTS: 'tompkins_bank_accounts_v5',
  TRANSACTIONS: 'tompkins_bank_txs_v5',
  CARDS: 'tompkins_bank_cards_v5',
  PAYEES: 'tompkins_bank_payees_v5',
  GOALS: 'tompkins_bank_goals_v5',
  NOTIFICATIONS: 'tompkins_bank_notifs_v5',
  LOGGED_IN: 'tompkins_bank_auth_state_v5',
  ADMIN_LOGGED_IN: 'tompkins_bank_admin_auth_v5',
  PENDING_CHANGES: 'tompkins_bank_pending_changes_v5',
  SUPPORT_MESSAGES: 'tompkins_bank_support_messages_v5',
};

const DEFAULT_USER: UserProfile = {
  name: 'Paulina Villarreal',
  email: 'paulina.villarreal@tompkinsbank.com',
  tier: 'Tompkins Preferred Banking',
  memberSince: '2021',
  avatarInitials: 'PV',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  phone: '+1 (607) 273-2265 (WhatsApp Only)',
  address: '118 E Seneca Street, Apt 4B',
  cityStateZip: 'Ithaca, NY 14850',
  occupation: 'Professional Musician & Recording Artist',
  primaryBranch: 'Tompkins Bank & Trust - Ithaca Main Office',
  branchAddress: 'The Commons, 118 E Seneca St, Ithaca, NY 14850',
  privateBanker: 'Sarah Jenkins',
  privateBankerTitle: 'Customer Care & Digital Banking Officer',
  privateBankerEmail: 'customercare@tompkinsbank.com',
  privateBankerPhone: 'WhatsApp Only: +1 (607) 273-2265 (No Voice Calls)',
  ssnMasked: '•••-••-6110',
  dateOfBirth: 'February 5, 2002',
  twoFactorEnabled: true,
  biometricEnabled: true,
  paperlessStatements: true,
  transactionAlerts: true,
  wireAlerts: true,
};


export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // When site is clicked/opened, start on login page straight up unless explicitly logged in in this session
    const sessionActive = sessionStorage.getItem('tompkins_bank_session_active');
    return sessionActive === 'true';
  });

  const [activePortalTab, setActivePortalTab] = useState<string>('overview');
  const [activePage, setActivePage] = useState<string>(() => {
    const sessionActive = sessionStorage.getItem('tompkins_bank_session_active');
    return sessionActive === 'true' ? 'my-account' : 'login';
  });
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (!saved) return DEFAULT_USER;
    try {
      return { ...DEFAULT_USER, ...JSON.parse(saved), dateOfBirth: 'February 5, 2002' };
    } catch {
      return DEFAULT_USER;
    }
  });

  const updateUser = (updatedFields: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(next));
      return next;
    });
  };

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    const raw: BankAccount[] = saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    return raw.map((a) => {
      if (a.id === 'acc_chk_01' || a.type === 'checking') {
        return { ...a, balance: 82000.00, availableBalance: 82000.00 };
      }
      return a;
    });
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const rawList: Transaction[] = saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    const seen = new Set<string>();
    // Clear all pending transactions and ensure dates are capped at 2026-09-17
    return rawList
      .filter((tx) => tx.status !== 'pending')
      .map((tx, idx) => {
        let finalDate = tx.date;
        if (finalDate > '2026-09-17') {
          finalDate = '2026-09-17';
        }
        const uniqueId = seen.has(tx.id) ? `${tx.id}_uniq_${idx}` : tx.id;
        seen.add(uniqueId);
        return { ...tx, id: uniqueId, date: finalDate };
      });
  });

  const [cards, setCards] = useState<PaymentCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARDS);
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [payees, setPayees] = useState<Payee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYEES);
    return saved ? JSON.parse(saved) : INITIAL_PAYEES;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [notifications, setNotifications] = useState<BankNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [pendingChanges, setPendingChanges] = useState<PendingUserChange[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES);
    return saved ? JSON.parse(saved) : INITIAL_PENDING_CHANGES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYEES, JSON.stringify(payees));
  }, [payees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, JSON.stringify(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENDING_CHANGES, JSON.stringify(pendingChanges));
  }, [pendingChanges]);

  // Support Direct Messages (Client <-> Bank Desk)
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPORT_MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_MESSAGES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_MESSAGES, JSON.stringify(supportMessages));
  }, [supportMessages]);

  const isRemoteSyncRef = useRef<boolean>(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cross-device real-time sync with Firebase Firestore
  useEffect(() => {
    const mainStateRef = doc(db, 'banking_system', 'main_state');

    const unsubscribe = onSnapshot(
      mainStateRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          isRemoteSyncRef.current = true;

          if (data.accounts && Array.isArray(data.accounts)) {
            const normalizedAccounts = data.accounts.map((a: BankAccount) => {
              if (a.id === 'acc_chk_01' || a.type === 'checking') {
                return { ...a, balance: 82000.00, availableBalance: 82000.00 };
              }
              return a;
            });
            setAccounts(normalizedAccounts);
          }
          if (data.transactions && Array.isArray(data.transactions)) {
            const normalizedTxs = data.transactions
              .filter((t: Transaction) => t.status !== 'pending')
              .map((t: Transaction) => ({
                ...t,
                date: t.date > '2026-09-17' ? '2026-09-17' : t.date,
              }));
            setTransactions(normalizedTxs);
          }
          if (data.cards && Array.isArray(data.cards)) {
            setCards(data.cards);
          }
          if (data.payees && Array.isArray(data.payees)) {
            setPayees(data.payees);
          }
          if (data.goals && Array.isArray(data.goals)) {
            setGoals(data.goals);
          }
          if (data.notifications && Array.isArray(data.notifications)) {
            setNotifications(data.notifications);
          }
          if (data.pendingChanges && Array.isArray(data.pendingChanges)) {
            setPendingChanges(data.pendingChanges);
          }
          if (data.supportMessages && Array.isArray(data.supportMessages)) {
            setSupportMessages(data.supportMessages);
          }
          if (data.user && typeof data.user === 'object') {
            setUser((prev) => ({ ...prev, ...data.user, dateOfBirth: 'February 5, 2002' }));
          }

          setTimeout(() => {
            isRemoteSyncRef.current = false;
          }, 350);
        } else {
          // Initialize remote shared document with initial state on first boot
          setDoc(mainStateRef, {
            accounts,
            transactions,
            cards,
            payees,
            goals,
            notifications,
            pendingChanges,
            supportMessages,
            user,
            updatedAt: new Date().toISOString(),
          }).catch((err) => {
            console.warn('Initial Firestore seeding notice:', err.message);
          });
        }
      },
      (error) => {
        console.warn('Firestore real-time sync notice:', error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // Broadcast any local mutations to Firestore so laptop, phone, and tablet stay completely aligned
  useEffect(() => {
    if (isRemoteSyncRef.current) return;

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(() => {
      const mainStateRef = doc(db, 'banking_system', 'main_state');
      setDoc(
        mainStateRef,
        {
          accounts,
          transactions,
          cards,
          payees,
          goals,
          notifications,
          pendingChanges,
          supportMessages,
          user,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) => {
        console.warn('Firestore state sync skipped:', err.message);
      });
    }, 250);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [accounts, transactions, cards, payees, goals, notifications, pendingChanges, supportMessages, user]);

  const sendSupportMessage = (msgText: string, subject?: string) => {
    const newMsg: SupportMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      senderName: user.name,
      subject: subject || 'Direct Client Inquiry',
      message: msgText,
      timestamp: new Date().toLocaleTimeString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: true,
    };
    setSupportMessages((prev) => [...prev, newMsg]);
  };

  const replySupportMessage = (replyText: string, originalMessageId?: string) => {
    const replyMsg: SupportMessage = {
      id: `msg_rep_${Date.now()}`,
      sender: 'bank',
      senderName: 'Tompkins Client Care',
      subject: 'Re: Private Client Inquiry',
      message: replyText,
      timestamp: new Date().toLocaleTimeString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    };
    setSupportMessages((prev) => [...prev, replyMsg]);

    const notif: BankNotification = {
      id: `notif_${Date.now()}`,
      title: 'New Response from Tompkins Client Care',
      message: `Bank Desk: "${replyText.slice(0, 70)}${replyText.length > 70 ? '...' : ''}"`,
      date: 'Just now',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const login = (usernameInput: string, passwordInput: string) => {
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // Paulina Villarreal login credentials as requested
    if (cleanUser === 'paulina villarreal' && cleanPass === '27girlsplay') {
      setIsLoggedIn(true);
      setIsAdminLoggedIn(false);
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN, JSON.stringify(true));
      setActivePage('my-account');
      return { success: true, message: 'Welcome back, Paulina!', isAdmin: false };
    }

    // Discreet Admin login: admin / 27girlsplay or admin / admin
    if (
      (cleanUser === 'admin' || cleanUser === 'ops' || cleanUser === 'treasury') &&
      (cleanPass === 'admin' || cleanPass === '27girlsplay' || cleanPass === 'admin2026')
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, JSON.stringify(true));
      setActivePage('admin-dashboard');
      return { success: true, message: 'Operations Portal Authorized.', isAdmin: true };
    }

    return {
      success: false,
      message: 'Invalid username or password. Please verify your credentials and try again.',
    };
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, JSON.stringify(false));
    setActivePage('login');
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, JSON.stringify(false));
    setActivePage('login');
  };

  const submitChangeRequest = (req: Omit<PendingUserChange, 'id' | 'requestedAt' | 'status'>): string => {
    const id = `chg_${Date.now()}`;
    const newChange: PendingUserChange = {
      ...req,
      id,
      requestedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      status: 'pending',
    };

    setPendingChanges((prev) => [newChange, ...prev]);

    const notif: BankNotification = {
      id: `notif_${Date.now()}`,
      title: 'Change Request Queued for Approval',
      message: `${req.title} submitted. Pending compliance review by Operations.`,
      date: 'Just now',
      type: 'system',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);

    return id;
  };

  const approveChangeRequest = (id: string, notes?: string) => {
    let targetChange: PendingUserChange | undefined;

    setPendingChanges((prev) =>
      prev.map((chg) => {
        if (chg.id === id) {
          targetChange = chg;
          return {
            ...chg,
            status: 'approved' as const,
            adminDecisionNotes: notes || 'Approved by Operations Administrator',
            reviewedBy: 'Operations Administrator',
            reviewedAt: new Date().toLocaleString(),
          };
        }
        return chg;
      })
    );

    if (!targetChange) return;

    // Apply change to live data
    if (targetChange.type === 'profile_update' && targetChange.data) {
      updateUser(targetChange.data);
    } else if (targetChange.type === 'card_limit' && targetChange.data) {
      const { cardId, newLimit } = targetChange.data;
      if (cardId && newLimit) {
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, dailyWithdrawalLimit: Number(newLimit) } : c))
        );
      }
    } else if (targetChange.type === 'card_freeze' && targetChange.data) {
      const { cardId, freeze } = targetChange.data;
      if (cardId) {
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, isFrozen: Boolean(freeze) } : c))
        );
      }
    } else if (targetChange.type === 'new_card' && targetChange.data) {
      const { name, limit } = targetChange.data;
      issueNewCreditCard(name || 'Tompkins Preferred Card', limit || 10000);
    } else if (targetChange.type === 'new_account' && targetChange.data) {
      const { type, name, initialDeposit } = targetChange.data;
      openNewAccount(type || 'checking', name || 'New Account', initialDeposit || 0);
    }

    const notif: BankNotification = {
      id: `notif_${Date.now()}`,
      title: 'Dashboard Change Approved',
      message: `Your request "${targetChange.title}" has been reviewed and APPROVED by Operations.`,
      date: 'Just now',
      type: 'system',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);
  };

  const rejectChangeRequest = (id: string, notes?: string) => {
    let targetChange: PendingUserChange | undefined;

    setPendingChanges((prev) =>
      prev.map((chg) => {
        if (chg.id === id) {
          targetChange = chg;
          return {
            ...chg,
            status: 'rejected' as const,
            adminDecisionNotes: notes || 'Declined during Compliance Review',
            reviewedBy: 'Operations Administrator',
            reviewedAt: new Date().toLocaleString(),
          };
        }
        return chg;
      })
    );

    if (!targetChange) return;

    const notif: BankNotification = {
      id: `notif_${Date.now()}`,
      title: 'Change Request Declined',
      message: `Your request "${targetChange.title}" was declined by Operations. Reason: ${notes || 'Compliance verification criteria not met'}.`,
      date: 'Just now',
      type: 'security',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const executeTransfer = (payload: TransferRequest) => {
    const fromAcc = accounts.find((a) => a.id === payload.fromAccountId);
    if (!fromAcc) {
      return { success: false, message: 'Source account not found.' };
    }

    if (fromAcc.type === 'credit') {
      return { success: false, message: 'Cannot transfer outward directly from a credit card.' };
    }

    if (fromAcc.availableBalance < payload.amount) {
      return { success: false, message: `Insufficient funds. Available: ${formatCurrency(fromAcc.availableBalance)}` };
    }

    if (payload.amount <= 0) {
      return { success: false, message: 'Transfer amount must be greater than $0.00' };
    }

    if (payload.securityPin !== undefined && payload.securityPin.trim() !== '0502') {
      return { success: false, message: 'Invalid 4-digit Security PIN. Authorization denied.' };
    }

    const txDate = new Date().toISOString().split('T')[0];
    const txId = `tx_${Date.now()}`;

    // Handle Internal Transfer - Debits source immediately to reserve funds, queues as pending admin approval
    if (payload.type === 'internal' && payload.toAccountId) {
      const toAcc = accounts.find((a) => a.id === payload.toAccountId);
      if (!toAcc) {
        return { success: false, message: 'Destination account not found.' };
      }

      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === fromAcc.id) {
            const newBal = acc.balance - payload.amount;
            return { ...acc, balance: newBal, availableBalance: newBal };
          }
          return acc;
        })
      );

      const debitTx: Transaction = {
        id: `${txId}_deb`,
        accountId: fromAcc.id,
        accountName: fromAcc.name,
        date: txDate,
        merchant: `Transfer to ${toAcc.name}`,
        description: payload.memo || `Internal Transfer to ${toAcc.name} (··${toAcc.accountNumber.slice(-4)})`,
        amount: -payload.amount,
        category: 'Transfers',
        type: 'debit',
        status: 'pending',
        wireDetails: {
          bankName: 'Tompkins Community Bank (Internal Book Transfer)',
          routingNumber: fromAcc.routingNumber,
          accountNumber: toAcc.accountNumber,
          beneficiaryName: `${toAcc.name} Account`,
          transferType: 'fednow',
          adminHoldReason: 'Awaiting Operations Dual-Control Authorization',
        },
      };

      setTransactions((prev) => [debitTx, ...prev]);

      // Notification
      const notif: BankNotification = {
        id: `notif_${Date.now()}`,
        title: 'Transfer Submitted — Pending Approval',
        message: `Transfer of ${formatCurrency(payload.amount)} from ${fromAcc.name} to ${toAcc.name} has been queued for Operations approval.`,
        date: 'Just now',
        type: 'transaction',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      return {
        success: true,
        message: `Transfer of ${formatCurrency(payload.amount)} submitted successfully. Status: Pending.`,
        transactionId: debitTx.id,
      };
    }

    // Handle External ACH / Wire Transfer
    if (payload.type === 'external') {
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === fromAcc.id) {
            const newBal = acc.balance - payload.amount;
            return { ...acc, balance: newBal, availableBalance: newBal };
          }
          return acc;
        })
      );

      const recipient = payload.recipientName || 'External Beneficiary';
      const isWire = payload.wireType === 'wire_domestic';
      const initialStatus: TransactionStatus = 'pending';

      const transferLabel = isWire
        ? 'Domestic FedWire'
        : payload.speed === 'instant'
        ? 'FedNow Instant'
        : 'Standard ACH';

      const extTx: Transaction = {
        id: txId,
        accountId: fromAcc.id,
        accountName: fromAcc.name,
        date: txDate,
        merchant: `${recipient} (${payload.externalBankName || 'External Bank'})`,
        description: `${transferLabel} to ${recipient} at ${payload.externalBankName || 'External Bank'} (Routing: ${payload.externalRouting || '021000089'})`,
        amount: -payload.amount,
        category: 'Transfers',
        type: 'debit',
        status: initialStatus,
        wireDetails: {
          bankName: payload.externalBankName || 'External Financial Institution',
          routingNumber: payload.externalRouting || '021000089',
          accountNumber: payload.externalAccount || '••••4819',
          beneficiaryName: recipient,
          transferType: isWire ? 'wire_domestic' : payload.speed === 'instant' ? 'fednow' : 'ach',
          adminHoldReason: 'Awaiting Admin Authorization',
        },
      };

      setTransactions((prev) => [extTx, ...prev]);

      const notif: BankNotification = {
        id: `notif_${Date.now()}`,
        title: `Transfer Submitted — Pending`,
        message: `${formatCurrency(payload.amount)} to ${recipient} (${payload.externalBankName || 'External Bank'}) has been submitted for processing.`,
        date: 'Just now',
        type: 'transaction',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      return {
        success: true,
        message: `Transfer of ${formatCurrency(payload.amount)} submitted to ${payload.externalBankName || 'External Bank'}. Status: Pending.`,
        transactionId: txId,
      };
    }

    // Handle Apex Pay (P2P)
    if (payload.type === 'p2p') {
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === fromAcc.id) {
            const newBal = acc.balance - payload.amount;
            return { ...acc, balance: newBal, availableBalance: newBal };
          }
          return acc;
        })
      );

      const p2pRecipient = payload.recipientName || payload.recipientHandle || 'Apex Pay Recipient';
      const p2pTx: Transaction = {
        id: txId,
        accountId: fromAcc.id,
        accountName: fromAcc.name,
        date: txDate,
        merchant: `Apex Pay to ${p2pRecipient}`,
        description: payload.memo || `Instant P2P payment sent to ${payload.recipientHandle || p2pRecipient}`,
        amount: -payload.amount,
        category: 'Transfers',
        type: 'debit',
        status: 'pending',
        wireDetails: {
          bankName: 'Apex Pay P2P Network',
          routingNumber: fromAcc.routingNumber,
          accountNumber: payload.recipientHandle || 'P2P-REC',
          beneficiaryName: p2pRecipient,
          transferType: 'fednow',
          adminHoldReason: 'Awaiting Admin Authorization',
        },
      };

      setTransactions((prev) => [p2pTx, ...prev]);

      const notif: BankNotification = {
        id: `notif_${Date.now()}`,
        title: 'Apex Pay Submitted — Pending',
        message: `${formatCurrency(payload.amount)} to ${p2pRecipient} is queued for processing.`,
        date: 'Just now',
        type: 'transaction',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      return {
        success: true,
        message: `Payment of ${formatCurrency(payload.amount)} to ${p2pRecipient} submitted. Status: Pending.`,
        transactionId: txId,
      };
    }

    return { success: false, message: 'Invalid transfer configuration.' };
  };

  const depositCheck = (request: CheckDepositRequest) => {
    const acc = accounts.find((a) => a.id === request.accountId);
    if (!acc) {
      return { success: false, message: 'Destination deposit account not found.' };
    }

    if (request.amount <= 0 || isNaN(request.amount)) {
      return { success: false, message: 'Please enter a valid deposit amount greater than $0.00' };
    }

    if (request.amount > 50000) {
      return { success: false, message: 'Check amount exceeds daily remote deposit limit ($50,000.00).' };
    }

    const txDate = new Date().toISOString().split('T')[0];
    const txId = `chk_${Date.now()}`;

    // Update account balance
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === acc.id) {
          const newBal = a.balance + request.amount;
          return { ...a, balance: newBal, availableBalance: newBal };
        }
        return a;
      })
    );

    const checkTx: Transaction = {
      id: txId,
      accountId: acc.id,
      accountName: acc.name,
      date: txDate,
      merchant: `Mobile Check Deposit #${request.checkNumber || Math.floor(1000 + Math.random() * 9000)}`,
      description: request.notes || 'Remote Mobile Check Capture (Pending Authorization)',
      amount: request.amount,
      category: 'Income & Salary',
      type: 'credit',
      status: 'pending',
      wireDetails: {
        bankName: 'Mobile Check Clearing',
        routingNumber: acc.routingNumber,
        accountNumber: request.checkNumber ? `CHK-${request.checkNumber}` : 'CHECK-DEP',
        beneficiaryName: acc.name,
        transferType: 'ach',
        adminHoldReason: 'Awaiting Admin Check Verification & Clearance',
      },
    };

    setTransactions((prev) => [checkTx, ...prev]);

    const notif: BankNotification = {
      id: `notif_${Date.now()}`,
      title: 'Mobile Check Deposit Received',
      message: `${formatCurrency(request.amount)} deposited to ${acc.name}. Status: Pending.`,
      date: 'Just now',
      type: 'transaction',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      message: `Deposit of ${formatCurrency(request.amount)} submitted for verification. Status: Pending.`,
      transactionId: txId,
    };
  };

  const payBill = (payeeId: string, fromAccountId: string, amount: number) => {
    const fromAcc = accounts.find((a) => a.id === fromAccountId);
    const payee = payees.find((p) => p.id === payeeId);

    if (!fromAcc || !payee) {
      return { success: false, message: 'Account or payee not located.' };
    }

    if (fromAcc.availableBalance < amount) {
      return { success: false, message: `Insufficient funds. Available: ${formatCurrency(fromAcc.availableBalance)}` };
    }

    if (amount <= 0) {
      return { success: false, message: 'Payment amount must be greater than $0.00' };
    }

    const txDate = new Date().toISOString().split('T')[0];
    const txId = `bill_${Date.now()}`;

    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === fromAcc.id) {
          const newBal = a.balance - amount;
          return { ...a, balance: newBal, availableBalance: newBal };
        }
        return a;
      })
    );

    setPayees((prev) =>
      prev.map((p) => {
        if (p.id === payee.id) {
          return { ...p, status: 'paid' };
        }
        return p;
      })
    );

    const billTx: Transaction = {
      id: txId,
      accountId: fromAcc.id,
      accountName: fromAcc.name,
      date: txDate,
      merchant: payee.name,
      description: `Bill Payment - Account ${payee.accountNumberMasked}`,
      amount: -amount,
      category: 'Housing & Utilities',
      type: 'debit',
      status: 'pending',
      wireDetails: {
        bankName: payee.name,
        routingNumber: fromAcc.routingNumber,
        accountNumber: payee.accountNumberMasked,
        beneficiaryName: payee.name,
        transferType: 'ach',
        adminHoldReason: 'Awaiting Admin Disbursement Authorization',
      },
    };

    setTransactions((prev) => [billTx, ...prev]);

    const notif: BankNotification = {
      id: `notif_${Date.now()}`,
      title: `Bill Submitted: ${payee.name}`,
      message: `${formatCurrency(amount)} payment scheduled for ${payee.name}. Status: Pending.`,
      date: 'Just now',
      type: 'transaction',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      message: `Payment of ${formatCurrency(amount)} to ${payee.name} submitted. Status: Pending.`,
    };
  };

  const addPayee = (name: string, accountNumber: string, category: string, typicalAmount: number) => {
    const newPayee: Payee = {
      id: `payee_${Date.now()}`,
      name,
      accountNumberMasked: `····${accountNumber.slice(-4) || '1234'}`,
      category: category || 'Utilities & Services',
      autoPay: false,
      typicalAmount: typicalAmount || 100,
      dueDate: '2026-11-20',
      status: 'active',
    };
    setPayees((prev) => [newPayee, ...prev]);
  };

  const toggleCardFreeze = (cardId: string) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          const newFrozen = !card.isFrozen;
          const notif: BankNotification = {
            id: `notif_${Date.now()}`,
            title: newFrozen ? 'Card Frozen' : 'Card Unfrozen',
            message: `${card.name} (··${card.last4}) is now ${newFrozen ? 'temporarily locked' : 'unlocked and ready for use'}.`,
            date: 'Just now',
            type: 'security',
            read: false,
          };
          setNotifications((n) => [notif, ...n]);
          return { ...card, isFrozen: newFrozen };
        }
        return card;
      })
    );
  };

  const toggleTravelMode = (cardId: string) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          const newTravel = !card.internationalTravelMode;
          const notif: BankNotification = {
            id: `notif_${Date.now()}`,
            title: newTravel ? 'Travel Notice Active' : 'Travel Notice Disabled',
            message: `International transactions ${newTravel ? 'permitted worldwide' : 'restricted to domestic'} for ${card.name}.`,
            date: 'Just now',
            type: 'system',
            read: false,
          };
          setNotifications((n) => [notif, ...n]);
          return { ...card, internationalTravelMode: newTravel };
        }
        return card;
      })
    );
  };

  const updateCardLimit = (cardId: string, newLimit: number) => {
    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, dailyWithdrawalLimit: newLimit } : card))
    );
  };

  const generateVirtualCard = (name: string, spendingCap: number): PaymentCard => {
    const randomDigits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
    const newCard: PaymentCard = {
      id: `card_virt_${Date.now()}`,
      accountId: 'acc_chk_01',
      name: name || 'Apex Virtual Merchant Shield',
      tier: 'Apex Virtual Burner',
      cardholderName: user.name.toUpperCase(),
      cardNumber: randomDigits,
      last4: randomDigits.slice(-4),
      expiryMonth: '10',
      expiryYear: '28',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      pin: '0000',
      isFrozen: false,
      dailyWithdrawalLimit: spendingCap || 500,
      internationalTravelMode: true,
      contactlessEnabled: false,
      virtualSpendingCap: spendingCap,
      type: 'virtual',
    };

    setCards((prev) => [newCard, ...prev]);

    const notif: BankNotification = {
      id: `notif_${Date.now()}`,
      title: 'Virtual Card Generated',
      message: `Created ${newCard.name} with a ${formatCurrency(spendingCap)} spending ceiling.`,
      date: 'Just now',
      type: 'security',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newCard;
  };

  const issueNewCreditCard = (cardName: string, creditLimit: number): PaymentCard => {
    const randomDigits = '4128' + Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
    const newCard: PaymentCard = {
      id: `card_crd_${Date.now()}`,
      accountId: 'acc_crd_01',
      name: cardName,
      tier: 'Apex Obsidian Cash Visa Signature',
      cardholderName: user.name.toUpperCase(),
      cardNumber: randomDigits,
      last4: randomDigits.slice(-4),
      expiryMonth: '11',
      expiryYear: '29',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      pin: '1085',
      isFrozen: false,
      dailyWithdrawalLimit: 2500,
      internationalTravelMode: true,
      contactlessEnabled: true,
      type: 'credit',
    };

    setCards((prev) => [newCard, ...prev]);

    const notif: BankNotification = {
      id: `notif_${Date.now()}`,
      title: 'Tompkins Card Approved & Issued',
      message: `${cardName} (··${newCard.last4}) approved with a ${formatCurrency(creditLimit)} credit line.`,
      date: 'Just now',
      type: 'rewards',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newCard;
  };

  const contributeToGoal = (goalId: string, fromAccountId: string, amount: number) => {
    const fromAcc = accounts.find((a) => a.id === fromAccountId);
    const goal = goals.find((g) => g.id === goalId);

    if (!fromAcc || !goal) {
      return { success: false, message: 'Account or goal not found.' };
    }

    if (fromAcc.availableBalance < amount) {
      return { success: false, message: 'Insufficient funds in source account.' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Amount must be greater than $0.00' };
    }

    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === fromAcc.id) {
          const newBal = a.balance - amount;
          return { ...a, balance: newBal, availableBalance: newBal };
        }
        return a;
      })
    );

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goal.id) {
          return { ...g, currentAmount: g.currentAmount + amount };
        }
        return g;
      })
    );

    const txDate = new Date().toISOString().split('T')[0];
    const txId = `goal_${Date.now()}`;

    const goalTx: Transaction = {
      id: txId,
      accountId: fromAcc.id,
      accountName: fromAcc.name,
      date: txDate,
      merchant: `Savings Goal: ${goal.name}`,
      description: `Target Vault Allocation (${Math.round(((goal.currentAmount + amount) / goal.targetAmount) * 100)}% reached)`,
      amount: -amount,
      category: 'Transfers',
      type: 'debit',
      status: 'cleared',
    };

    setTransactions((prev) => [goalTx, ...prev]);

    return {
      success: true,
      message: `Allocated ${formatCurrency(amount)} toward ${goal.name}.`,
    };
  };

  const openNewAccount = (type: 'checking' | 'savings' | 'credit' | 'cd', name: string, initialDeposit: number) => {
    const acctNum = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    const newAccount: BankAccount = {
      id: `acc_${type}_${Date.now()}`,
      name: name || `Apex Premier ${type.toUpperCase()}`,
      accountNumber: acctNum,
      routingNumber: '021000089',
      type,
      balance: initialDeposit || 0,
      availableBalance: initialDeposit || 0,
      interestRate: type === 'savings' ? 4.85 : type === 'cd' ? 5.10 : 0.25,
      creditLimit: type === 'credit' ? 15000 : undefined,
      colorTheme: type === 'savings' ? 'blue' : type === 'credit' ? 'slate' : 'emerald',
    };

    setAccounts((prev) => [...prev, newAccount]);

    if (initialDeposit > 0) {
      const initTx: Transaction = {
        id: `tx_init_${Date.now()}`,
        accountId: newAccount.id,
        accountName: newAccount.name,
        date: new Date().toISOString().split('T')[0],
        merchant: 'Apex Initial Opening Deposit',
        description: 'New Account Opening Funding',
        amount: initialDeposit,
        category: 'Income & Salary',
        type: 'credit',
        status: 'cleared',
      };
      setTransactions((prev) => [initTx, ...prev]);
    }

    const notif: BankNotification = {
      id: `notif_${Date.now()}`,
      title: 'New Account Established',
      message: `${newAccount.name} (··${acctNum.slice(-4)}) is open and ready.`,
      date: 'Just now',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateTransferStatus = (txId: string, newStatus: TransactionStatus, reason?: string) => {
    let affectedTx: Transaction | undefined;

    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === txId) {
          affectedTx = tx;
          const updatedWireDetails = tx.wireDetails
            ? {
                ...tx.wireDetails,
                adminHoldReason: reason || tx.wireDetails.adminHoldReason,
                adminReviewedBy: 'Admin / Treasury Officer (You)',
                adminReviewedAt: new Date().toLocaleString(),
                clearanceCode: newStatus === 'cleared' ? `FEDWIRE-REL-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
              }
            : undefined;

          return {
            ...tx,
            status: newStatus,
            wireDetails: updatedWireDetails,
          };
        }
        return tx;
      })
    );

    // If rejected, refund the funds back to the source account
    if (newStatus === 'rejected' && affectedTx && affectedTx.amount < 0) {
      const refundAmount = Math.abs(affectedTx.amount);
      const accId = affectedTx.accountId;
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === accId) {
            const newBal = acc.balance + refundAmount;
            return { ...acc, balance: newBal, availableBalance: newBal };
          }
          return acc;
        })
      );

      const refundNotif: BankNotification = {
        id: `notif_${Date.now()}`,
        title: 'Transfer Rejected & Balance Refunded',
        message: `${formatCurrency(refundAmount)} from transfer #${txId.slice(-6)} has been refunded to your account. Note: ${reason || 'Rejected by Admin'}.`,
        date: 'Just now',
        type: 'security',
        read: false,
      };
      setNotifications((prev) => [refundNotif, ...prev]);
    } else if (newStatus === 'cleared' && affectedTx) {
      // If internal transfer, credit destination account
      if (affectedTx.merchant.startsWith('Transfer to ') && affectedTx.amount < 0) {
        const destAccountName = affectedTx.merchant.replace('Transfer to ', '').trim();
        const transferAmt = Math.abs(affectedTx.amount);
        const destAcc = accounts.find((a) =>
          a.name.toLowerCase().includes(destAccountName.toLowerCase()) ||
          destAccountName.toLowerCase().includes(a.name.toLowerCase())
        );

        if (destAcc) {
          setAccounts((prev) =>
            prev.map((a) => {
              if (a.id === destAcc.id) {
                const newBal = destAcc.type === 'credit'
                  ? Math.max(0, a.balance - transferAmt)
                  : a.balance + transferAmt;
                return { ...a, balance: newBal, availableBalance: newBal };
              }
              return a;
            })
          );

          const creditTx: Transaction = {
            id: `${affectedTx.id}_cred`,
            accountId: destAcc.id,
            accountName: destAcc.name,
            date: new Date().toISOString().split('T')[0],
            merchant: `Transfer from ${affectedTx.accountName}`,
            description: `Approved Internal Transfer from ${affectedTx.accountName}`,
            amount: transferAmt,
            category: 'Transfers',
            type: 'credit',
            status: 'cleared',
          };
          setTransactions((prev) => [creditTx, ...prev]);
        }
      }

      const clearedNotif: BankNotification = {
        id: `notif_${Date.now()}`,
        title: 'Transfer Approved & Released',
        message: `Transfer of ${formatCurrency(Math.abs(affectedTx.amount))} to ${affectedTx.merchant} has been approved and cleared by Operations.`,
        date: 'Just now',
        type: 'transaction',
        read: false,
      };
      setNotifications((prev) => [clearedNotif, ...prev]);
    } else if (newStatus === 'held' || newStatus === 'pending') {
      const heldNotif: BankNotification = {
        id: `notif_${Date.now()}`,
        title: 'Transfer Under Review / Held',
        message: `Transfer #${txId.slice(-6)} has been placed on hold by Admin. Reason: ${reason || 'Dual-control compliance verification'}.`,
        date: 'Just now',
        type: 'system',
        read: false,
      };
      setNotifications((prev) => [heldNotif, ...prev]);
    }
  };

  const updateTransactionTag = (txId: string, tag: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, tag } : tx))
    );
  };

  const updateTransactionNotes = (txId: string, notes: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, notes } : tx))
    );
  };

  const updateTransactionImage = (txId: string, imageUrl: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, attachedImageUrl: imageUrl } : tx))
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setUser(DEFAULT_USER);
    setIsLoggedIn(true);
    setIsAdminLoggedIn(false);
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCards(INITIAL_CARDS);
    setPayees(INITIAL_PAYEES);
    setGoals(INITIAL_GOALS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPendingChanges(INITIAL_PENDING_CHANGES);
    setSupportMessages(INITIAL_SUPPORT_MESSAGES);
    setSelectedAccountId('all');
    setActivePortalTab('overview');

    const mainStateRef = doc(db, 'banking_system', 'main_state');
    setDoc(mainStateRef, {
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
      cards: INITIAL_CARDS,
      payees: INITIAL_PAYEES,
      goals: INITIAL_GOALS,
      notifications: INITIAL_NOTIFICATIONS,
      pendingChanges: INITIAL_PENDING_CHANGES,
      supportMessages: INITIAL_SUPPORT_MESSAGES,
      user: DEFAULT_USER,
      updatedAt: new Date().toISOString(),
    }).catch((err) => {
      console.warn('Reset Firestore sync notice:', err.message);
    });
  };

  return (
    <BankingContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        activePortalTab,
        setActivePortalTab,
        user,
        updateUser,
        accounts,
        transactions,
        cards,
        payees,
        goals,
        notifications,
        selectedAccountId,
        setSelectedAccountId,
        unreadCount,
        pendingChanges,
        submitChangeRequest,
        approveChangeRequest,
        rejectChangeRequest,
        login,
        logout,
        logoutAdmin,
        executeTransfer,
        depositCheck,
        payBill,
        addPayee,
        toggleCardFreeze,
        toggleTravelMode,
        updateCardLimit,
        generateVirtualCard,
        issueNewCreditCard,
        contributeToGoal,
        openNewAccount,
        markNotificationRead,
        markAllNotificationsRead,
        updateTransferStatus,
        updateTransactionTag,
        updateTransactionNotes,
        updateTransactionImage,
        resetAllData,
        activePage,
        setActivePage,
        formatCurrency,
        supportMessages,
        sendSupportMessage,
        replySupportMessage,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
