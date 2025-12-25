export enum TransactionType {
  CREDIT_GIVEN = 'CREDIT_GIVEN', // You gave money/goods (Balance increases)
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED' // You received money (Balance decreases)
}

export enum ContactType {
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER'
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Contact {
  id: string;
  userId: string; // Link to specific user
  name: string;
  phone?: string;
  type: ContactType;
  createdAt: string;
}

export interface TransactionItem {
  name: string;
  quantity: number;
}

export interface Transaction {
  id: string;
  userId: string; // Link to specific user
  contactId: string;
  amount: number;
  type: TransactionType;
  description: string;
  items?: TransactionItem[];
  date: string;
  createdAt?: string;
}

// Calculated view model
export interface ContactWithBalance extends Contact {
  balance: number; // Positive means they owe you, Negative means you owe them
  lastTransactionDate?: string;
}

export type ViewState = 'AUTH' | 'DASHBOARD' | 'ADD_CONTACT' | 'HISTORY' | 'CONTACT_DETAILS' | 'ADD_TRANSACTION';

export interface UserSession {
  isAuthenticated: boolean;
  user: User | null;
}