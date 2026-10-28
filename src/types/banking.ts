export type AccountType = 'checking' | 'savings' | 'credit' | 'cd';

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
  type: AccountType;
  balance: number;
  availableBalance: number;
  interestRate?: number; // APY in %
  creditLimit?: number;
  dueDate?: string;
  minPayment?: number;
  rewardsPoints?: number;
  maturityDate?: string;
  colorTheme: string;
}

export type TransactionCategory =
  | 'Income & Salary'
  | 'Groceries & Dining'
  | 'Shopping & Retail'
  | 'Housing & Utilities'
  | 'Health & Wellness'
  | 'Entertainment'
  | 'Travel & Transit'
  | 'Transfers'
  | 'Investments & Interest';

export type TransactionStatus = 'cleared' | 'pending' | 'held' | 'rejected';

export interface WireMetadata {
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  beneficiaryName: string;
  transferType: 'ach' | 'wire_domestic' | 'fednow';
  adminHoldReason?: string;
  adminReviewedBy?: string;
  adminReviewedAt?: string;
  clearanceCode?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  date: string;
  merchant: string;
  description: string;
  amount: number; // positive for deposit/credit, negative for debit
  runningBalance?: number; // Running balance after transaction
  checkImageAvailable?: boolean;
  category: TransactionCategory;
  type: 'credit' | 'debit';
  status: TransactionStatus;
  receiptUrl?: string;
  wireDetails?: WireMetadata;
  tag?: string;
  notes?: string;
  attachedImageUrl?: string;
}

export interface ExternalBank {
  id: string;
  name: string;
  routingNumber: string;
  shortCode: string;
  category: 'National Bank' | 'Investment & Brokerage' | 'Digital & Online' | 'Regional Bank';
  wireCapable: boolean;
  cityState: string;
}

export interface Payee {
  id: string;
  name: string;
  accountNumberMasked: string;
  category: string;
  autoPay: boolean;
  typicalAmount: number;
  dueDate: string;
  status: 'active' | 'scheduled' | 'paid';
}

export interface PaymentCard {
  id: string;
  accountId: string;
  name: string;
  tier: 'Apex Platinum Debit' | 'Apex Obsidian Cash Visa Signature' | 'Apex Virtual Burner';
  cardholderName: string;
  cardNumber: string; // full 16 digits
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  pin: string;
  isFrozen: boolean;
  dailyWithdrawalLimit: number;
  internationalTravelMode: boolean;
  contactlessEnabled: boolean;
  virtualSpendingCap?: number;
  type: 'debit' | 'credit' | 'virtual';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  targetDate: string;
  category: string;
}

export interface BankNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'transaction' | 'security' | 'system' | 'rewards';
  read: boolean;
  urgent?: boolean;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId?: string;
  type: 'internal' | 'external' | 'p2p';
  amount: number;
  memo: string;
  recipientName?: string;
  recipientHandle?: string; // phone or email
  externalBankName?: string;
  externalRouting?: string;
  externalAccount?: string;
  speed: 'instant' | 'standard';
  wireType?: 'ach' | 'wire_domestic' | 'fednow';
  requireReview?: boolean;
}

export interface CheckDepositRequest {
  accountId: string;
  amount: number;
  checkNumber: string;
  frontImagePreview?: string;
  backImagePreview?: string;
  notes?: string;
}

export type ChangeRequestType =
  | 'profile_update'
  | 'card_limit'
  | 'card_freeze'
  | 'new_card'
  | 'new_account';

export interface ChangeDiffItem {
  field: string;
  label: string;
  oldValue: string;
  newValue: string;
}

export interface PendingUserChange {
  id: string;
  type: ChangeRequestType;
  title: string;
  description: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminDecisionNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  data: Record<string, any>;
  diff?: ChangeDiffItem[];
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'bank';
  senderName: string;
  subject?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

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
