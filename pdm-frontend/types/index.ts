// Core user types
export interface User {
  id: number;
  stackUserId: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'APPLICANT' | 'BANKER' | 'VERIFIER' | 'UNDERWRITER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// Message types
export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderEmail: string;
  recipientId: number;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  readStatus: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface MessageSendPayload {
  recipientId: number;
  subject: string;
  body: string;
}

// Application types
export interface Application {
  id: number;
  applicantId: number;
  applicant?: User;
  productId: number;
  product?: LoanProduct;
  requestedAmount: number;
  requestedTerm: number;
  purpose: string;
  status: ApplicationStatus;
  stage?: ApplicationStage;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'PENDING_RISK_ASSESSMENT'
  | 'RISK_ASSESSED'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'EXPIRED';

export type ApplicationStage =
  | 'SUBMISSION'
  | 'VERIFICATION'
  | 'RISK_ASSESSMENT'
  | 'UNDERWRITING'
  | 'OFFER_GENERATION'
  | 'OFFER_ACCEPTANCE'
  | 'CONTRACT_SIGNING'
  | 'DISBURSEMENT'
  | 'COMPLETED';

// Loan types
export interface Loan {
  id: number;
  userId: number;
  user?: User;
  applicationId?: number;
  application?: Application;
  amount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalPayable: number;
  amountPaid: number;
  remainingBalance: number;
  status: LoanStatus;
  purpose?: string;
  startDate?: string;
  endDate?: string;
  disbursedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LoanStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'PAID_OFF'
  | 'DEFAULTED'
  | 'REJECTED'
  | 'CANCELLED';

export interface LoanProduct {
  id: number;
  name: string;
  description?: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Wallet types
export interface Wallet {
  id: number;
  userId: number;
  balance: number;
  currency: string;
  status: WalletStatus;
  createdAt: string;
  updatedAt: string;
}

export type WalletStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';

// Transaction types
export interface Transaction {
  id: number;
  userId: number;
  user?: User;
  loanId?: number;
  loan?: Loan;
  walletId?: number;
  wallet?: Wallet;
  type: TransactionType;
  amount: number;
  description?: string;
  status: TransactionStatus;
  referenceNumber?: string;
  createdAt: string;
}

export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'LOAN_DISBURSEMENT'
  | 'LOAN_PAYMENT'
  | 'FEE'
  | 'REFUND'
  | 'TRANSFER';

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

// Support Ticket types
export interface SupportTicket {
  id: number;
  userId: number;
  user?: User;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  assignedTo?: number;
  assignedUser?: User;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_CUSTOMER'
  | 'WAITING_FOR_STAFF'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// Notification types
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export type NotificationType =
  | 'INFO'
  | 'SUCCESS'
  | 'WARNING'
  | 'ERROR'
  | 'LOAN_UPDATE'
  | 'PAYMENT_REMINDER'
  | 'SYSTEM';

// Document types
export interface Document {
  id: number;
  applicationId?: number;
  loanId?: number;
  userId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: number;
}

export type DocumentCategory =
  | 'ID_PROOF'
  | 'ADDRESS_PROOF'
  | 'INCOME_PROOF'
  | 'BANK_STATEMENT'
  | 'TAX_RETURN'
  | 'CONTRACT'
  | 'OTHER';

export type DocumentStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

// Repayment types
export interface Repayment {
  id: number;
  loanId: number;
  loan?: Loan;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: RepaymentStatus;
  principal: number;
  interest: number;
  lateFee?: number;
  createdAt: string;
  updatedAt: string;
}

export type RepaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'OVERDUE'
  | 'PARTIALLY_PAID'
  | 'WAIVED';

// Offer types
export interface Offer {
  id: number;
  applicationId: number;
  application?: Application;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalPayable: number;
  status: OfferStatus;
  expiresAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type OfferStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'WITHDRAWN';

// Contract types
export interface Contract {
  id: number;
  applicationId: number;
  offerId: number;
  userId: number;
  content: string;
  status: ContractStatus;
  signedAt?: string;
  signatureData?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContractStatus =
  | 'DRAFT'
  | 'PENDING_SIGNATURE'
  | 'SIGNED'
  | 'CANCELLED'
  | 'EXPIRED';

// Risk Assessment types
export interface RiskAssessment {
  id: number;
  applicationId: number;
  creditScore?: number;
  riskScore: number;
  riskLevel: RiskLevel;
  debtToIncomeRatio?: number;
  notes?: string;
  assessedBy?: number;
  assessedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

// Verification types
export interface Verification {
  id: number;
  applicationId: number;
  verifiedBy: number;
  verificationStatus: VerificationStatus;
  identityVerified: boolean;
  addressVerified: boolean;
  incomeVerified: boolean;
  creditCheckCompleted: boolean;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type VerificationStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED';

// Stats and Analytics types
export interface SystemStats {
  totalUsers: number;
  activeLoans: number;
  totalLoanAmount: number;
  pendingApplications: number;
  totalTransactions: number;
  revenueThisMonth: number;
}

export interface UserStats {
  loansCount: number;
  totalBorrowed: number;
  totalPaid: number;
  remainingBalance: number;
  creditScore?: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoanApplicationFormData {
  amount: number;
  purpose: string;
  termMonths: number;
  productId?: number;
}

export interface DepositFormData {
  amount: number;
  description?: string;
}

export interface WithdrawalFormData {
  amount: number;
  description?: string;
}

export interface TicketFormData {
  subject: string;
  description: string;
  category: string;
  priority?: TicketPriority;
}

// Component Props types
export interface ComponentPropsWithClassName {
  className?: string;
}

export interface ComponentPropsWithChildren {
  children?: React.ReactNode;
}

export type ComponentBaseProps = ComponentPropsWithClassName & ComponentPropsWithChildren;
