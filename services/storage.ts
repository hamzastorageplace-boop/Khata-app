import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Contact, Transaction, TransactionType, ContactType, User } from '../types';

// Helper to safely get env vars in various environments (Vite vs Node/CRA)
const getEnv = (key: string) => {
  // Check for Vite (Vercel standard)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // Check for Node/CRA
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return '';
};

// Robustly check for various environment variable naming conventions
const SUPABASE_URL = 
  getEnv('VITE_SUPABASE_URL') || 
  getEnv('NEXT_PUBLIC_SUPABASE_URL') || 
  'https://vhxjhdiefrqfzmkmvkew.supabase.co';

const SUPABASE_KEY = 
  getEnv('VITE_SUPABASE_KEY') || 
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
  getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY') || 
  'sb_publishable_gSOO8x1e2jRIePxOqmAnQw_hpdL2mSr';

const isSupabaseConfigured = SUPABASE_URL && SUPABASE_KEY;

let supabase: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (e) {
    console.warn("Failed to initialize Supabase client", e);
  }
}

// --- Local Storage Keys ---
const LS_CONTACTS = 'easy_khata_contacts';
const LS_TRANSACTIONS = 'easy_khata_transactions';
const LS_USERS = 'easy_khata_users';
const LS_SESSION = 'easy_khata_session';

// --- Helper Functions ---

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Auth Services ---

export const signUp = async (email: string, password: string, name: string): Promise<{ user: User | null; session: any; error: string | null }> => {
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) return { user: null, session: null, error: error.message };
      
      return { 
        user: { id: data.user?.id || '', email: data.user?.email || '', name }, 
        session: data.session, // If null, email confirmation is required
        error: null 
      };
    } catch (e: any) {
      return { user: null, session: null, error: e.message };
    }
  } else {
    // Local Fallback Simulation
    const usersRaw = localStorage.getItem(LS_USERS);
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    
    if (users.find((u: any) => u.email === email)) {
      return { user: null, session: null, error: 'User with this email already exists' };
    }

    const newUser = { id: generateId(), email, password, name };
    users.push(newUser);
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    
    // For local fallback, we simulate an immediate session since there's no email server
    const session = { id: newUser.id, email: newUser.email, name: newUser.name };
    localStorage.setItem(LS_SESSION, JSON.stringify(session));
    
    return { 
        user: { id: newUser.id, email: newUser.email, name: newUser.name }, 
        session: session,
        error: null 
    };
  }
};

export const signIn = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { user: null, error: error.message };
      return { 
        user: { id: data.user?.id || '', email: data.user?.email || '', name: data.user?.user_metadata?.name }, 
        error: null 
      };
    } catch (e: any) {
      return { user: null, error: e.message };
    }
  } else {
    // Local Fallback Simulation
    const usersRaw = localStorage.getItem(LS_USERS);
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const sessionUser = { id: user.id, email: user.email, name: user.name };
      localStorage.setItem(LS_SESSION, JSON.stringify(sessionUser));
      return { user: sessionUser, error: null };
    }
    
    return { user: null, error: 'Invalid email or password' };
  }
};

export const signOut = async (): Promise<void> => {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(LS_SESSION);
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        return { 
            id: session.user.id, 
            email: session.user.email || '', 
            name: session.user.user_metadata?.name 
        };
    }
  }
  // Check local fallback
  const sessionRaw = localStorage.getItem(LS_SESSION);
  return sessionRaw ? JSON.parse(sessionRaw) : null;
};

// --- Data Services ---

export const getContacts = async (): Promise<Contact[]> => {
  const user = await getCurrentUser();
  if (!user) return [];

  if (supabase) {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('user_id', user.id); // Map strict filtering to DB column name 'user_id'
            
        if (error) throw error;
        
        // Map DB snake_case to App camelCase
        return (data || []).map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            name: row.name,
            phone: row.phone,
            type: row.type,
            createdAt: row.created_at
        }));
    } catch (e) {
        console.warn("Supabase fetch failed, falling back to local", e);
        // Fallback: strictly filter local storage by user ID
        const data = localStorage.getItem(LS_CONTACTS);
        const allContacts = data ? JSON.parse(data) : [];
        return allContacts.filter((c: Contact) => c.userId === user.id);
    }
  } else {
    const data = localStorage.getItem(LS_CONTACTS);
    const allContacts = data ? JSON.parse(data) : [];
    return allContacts.filter((c: Contact) => c.userId === user.id);
  }
};

export const saveContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'userId'>): Promise<Contact> => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const newContact: Contact = {
    ...contact,
    id: generateId(),
    userId: user.id,
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
        // Map App camelCase to DB snake_case for Insert
        const dbPayload = {
            id: newContact.id,
            user_id: newContact.userId,
            name: newContact.name,
            phone: newContact.phone,
            type: newContact.type,
            created_at: newContact.createdAt
        };

        const { data, error } = await supabase.from('contacts').insert([dbPayload]).select();
        if (error) throw error;
        
        // Map response back
        const row = data[0];
        return {
            id: row.id,
            userId: row.user_id,
            name: row.name,
            phone: row.phone,
            type: row.type,
            createdAt: row.created_at
        };
    } catch (e) {
        console.warn("Supabase save failed, falling back to local", e);
        const allContactsRaw = localStorage.getItem(LS_CONTACTS);
        const allContacts = allContactsRaw ? JSON.parse(allContactsRaw) : [];
        allContacts.push(newContact);
        localStorage.setItem(LS_CONTACTS, JSON.stringify(allContacts));
        return newContact;
    }
  } else {
    const allContactsRaw = localStorage.getItem(LS_CONTACTS);
    const allContacts = allContactsRaw ? JSON.parse(allContactsRaw) : [];
    allContacts.push(newContact);
    localStorage.setItem(LS_CONTACTS, JSON.stringify(allContacts));
    return newContact;
  }
};

export const updateContact = async (id: string, updates: Partial<Contact>): Promise<void> => {
    const user = await getCurrentUser();
    if (!user) return;

    if(supabase) {
        try {
            // Map updates to snake_case
            const dbUpdates: any = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
            if (updates.type !== undefined) dbUpdates.type = updates.type;
            
            if (Object.keys(dbUpdates).length === 0) return;

            const { error } = await supabase
                .from('contacts')
                .update(dbUpdates)
                .eq('id', id)
                .eq('user_id', user.id); 
            if(error) throw error;
        } catch (e) {
             console.warn("Supabase update failed, falling back to local", e);
             const allContactsRaw = localStorage.getItem(LS_CONTACTS);
             const allContacts = allContactsRaw ? JSON.parse(allContactsRaw) : [];
             const index = allContacts.findIndex((c: Contact) => c.id === id && c.userId === user.id);
             if(index !== -1) {
                allContacts[index] = { ...allContacts[index], ...updates };
                localStorage.setItem(LS_CONTACTS, JSON.stringify(allContacts));
             }
        }
    } else {
        const allContactsRaw = localStorage.getItem(LS_CONTACTS);
        const allContacts = allContactsRaw ? JSON.parse(allContactsRaw) : [];
        const index = allContacts.findIndex((c: Contact) => c.id === id && c.userId === user.id);
        if(index !== -1) {
            allContacts[index] = { ...allContacts[index], ...updates };
            localStorage.setItem(LS_CONTACTS, JSON.stringify(allContacts));
        }
    }
}

export const deleteContact = async (contactId: string): Promise<void> => {
    const user = await getCurrentUser();
    if (!user) return;

    if (supabase) {
        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', contactId)
                .eq('user_id', user.id);
            if (error) throw error;
        } catch (e) {
            console.warn("Supabase delete failed, falling back to local", e);
            fallbackDelete(contactId, user.id);
        }
    } else {
        fallbackDelete(contactId, user.id);
    }
};

const fallbackDelete = (contactId: string, userId: string) => {
    // Delete transactions locally
    const allTxRaw = localStorage.getItem(LS_TRANSACTIONS);
    let allTx = allTxRaw ? JSON.parse(allTxRaw) : [];
    allTx = allTx.filter((t: Transaction) => t.contactId !== contactId);
    localStorage.setItem(LS_TRANSACTIONS, JSON.stringify(allTx));

    // Delete contact locally
    const allContactsRaw = localStorage.getItem(LS_CONTACTS);
    let allContacts = allContactsRaw ? JSON.parse(allContactsRaw) : [];
    // Ensure we only delete if it belongs to the user
    allContacts = allContacts.filter((c: Contact) => !(c.id === contactId && c.userId === userId));
    localStorage.setItem(LS_CONTACTS, JSON.stringify(allContacts));
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const user = await getCurrentUser();
  if (!user) return [];

  let transactions: Transaction[] = [];

  if (supabase) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id) // Map strict filtering to DB column name 'user_id'
            .order('date', { ascending: false });
        if (error) throw error;
        
        // Map DB snake_case to App camelCase
        transactions = (data || []).map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            contactId: row.contact_id,
            amount: row.amount,
            type: row.type,
            description: row.description,
            items: row.items,
            date: row.date,
            createdAt: row.created_at
        }));
    } catch (e) {
        console.warn("Supabase fetch failed, falling back to local", e);
        const data = localStorage.getItem(LS_TRANSACTIONS);
        const allTx = data ? JSON.parse(data) : [];
        transactions = allTx.filter((t: Transaction) => t.userId === user.id);
    }
  } else {
    const data = localStorage.getItem(LS_TRANSACTIONS);
    const allTx = data ? JSON.parse(data) : [];
    transactions = allTx.filter((t: Transaction) => t.userId === user.id);
  }

  // Sort by date, then creation time
  return transactions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) {
        return dateB - dateA;
    }
    const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return createdB - createdA;
  });
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>): Promise<Transaction> => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const newTx: Transaction = {
    ...transaction,
    id: generateId(),
    userId: user.id,
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    try {
        // Map App camelCase to DB snake_case
        const dbPayload = {
            id: newTx.id,
            user_id: newTx.userId,
            contact_id: newTx.contactId,
            amount: newTx.amount,
            type: newTx.type,
            description: newTx.description,
            items: newTx.items,
            date: newTx.date,
            created_at: newTx.createdAt
        };

        const { data, error } = await supabase.from('transactions').insert([dbPayload]).select();
        if (error) throw error;
        
        // Map response back
        const row = data[0];
        return {
            id: row.id,
            userId: row.user_id,
            contactId: row.contact_id,
            amount: row.amount,
            type: row.type,
            description: row.description,
            items: row.items,
            date: row.date,
            createdAt: row.created_at
        };
    } catch (e) {
        console.warn("Supabase save failed, falling back to local", e);
        const allTxRaw = localStorage.getItem(LS_TRANSACTIONS);
        const allTx = allTxRaw ? JSON.parse(allTxRaw) : [];
        const newTransactions = [newTx, ...allTx];
        localStorage.setItem(LS_TRANSACTIONS, JSON.stringify(newTransactions));
        return newTx;
    }
  } else {
    const allTxRaw = localStorage.getItem(LS_TRANSACTIONS);
    const allTx = allTxRaw ? JSON.parse(allTxRaw) : [];
    const newTransactions = [newTx, ...allTx];
    localStorage.setItem(LS_TRANSACTIONS, JSON.stringify(newTransactions));
    return newTx;
  }
};

// --- Seeding for Demo ---
export const seedInitialData = (userId: string) => {
  const contactsRaw = localStorage.getItem(LS_CONTACTS);
  let contacts = contactsRaw ? JSON.parse(contactsRaw) : [];
  
  // Check if this specific user has contacts
  const userContacts = contacts.filter((c: Contact) => c.userId === userId);

  if (userContacts.length === 0) {
    // Only seed local storage if the user has absolutely nothing
    // This is less likely to be used if Supabase is active, but kept for fallback consistency
    // Note: We do NOT seed Supabase, only local fallback to keep cloud clean
  }
};