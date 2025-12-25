import React, { useState, useEffect, useCallback } from 'react';
import { 
  Contact, 
  Transaction, 
  ContactWithBalance, 
  ViewState, 
  TransactionType, 
  ContactType,
  TransactionItem
} from './types';
import * as StorageService from './services/storage';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ContactDetails from './components/ContactDetails';
import AddEntry from './components/AddEntry';
import History from './components/History';
import Welcome from './components/Welcome';

const App: React.FC = () => {
  // Global State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  // Modal State
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [txModalType, setTxModalType] = useState<TransactionType>(TransactionType.CREDIT_GIVEN);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [initialTxAmount, setInitialTxAmount] = useState<number | undefined>(undefined);

  // Initialization
  useEffect(() => {
    const initApp = async () => {
      const user = await StorageService.getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        StorageService.seedInitialData(user.id);
      }
      setLoading(false);
    };
    initApp();
  }, []);

  // Data Fetching
  const refreshData = useCallback(async () => {
    try {
      const c = await StorageService.getContacts();
      const t = await StorageService.getTransactions();
      setContacts(c);
      setTransactions(t);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, refreshData]);

  // Derived State (View Model)
  const contactsWithBalances: ContactWithBalance[] = contacts.map(c => {
    const contactTx = transactions.filter(t => t.contactId === c.id);
    const balance = contactTx.reduce((acc, t) => {
      // Logic: Credit Given = They Owe (+) | Payment Received = They Paid (-)
      // Positive Balance = Receivable. Negative Balance = Payable.
      return acc + (t.type === TransactionType.CREDIT_GIVEN ? t.amount : -t.amount);
    }, 0);
    const lastTx = contactTx.length > 0 ? contactTx[0].date : undefined; // Transactions are sorted DESC in service
    return { ...c, balance, lastTransactionDate: lastTx };
  }).sort((a, b) => {
    // Sort by most recent activity
    if(!a.lastTransactionDate) return 1;
    if(!b.lastTransactionDate) return -1;
    return new Date(b.lastTransactionDate).getTime() - new Date(a.lastTransactionDate).getTime();
  });

  const selectedContact = contactsWithBalances.find(c => c.id === selectedContactId);
  const selectedContactTransactions = transactions.filter(t => t.contactId === selectedContactId);

  // Handlers
  const handleLogin = async () => {
    const user = await StorageService.getCurrentUser();
    if (user) {
        StorageService.seedInitialData(user.id);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await StorageService.signOut();
    setIsAuthenticated(false);
    setCurrentView('DASHBOARD');
    setSelectedContactId(null);
    setShowWelcome(true);
  };

  const handleSelectContact = (contact: ContactWithBalance) => {
    setSelectedContactId(contact.id);
    setCurrentView('CONTACT_DETAILS');
  };

  const handleSaveContact = async (name: string, phone: string, type: ContactType) => {
    try {
      if (showEditContactModal && selectedContactId) {
          await StorageService.updateContact(selectedContactId, { name, phone, type });
          setShowEditContactModal(false);
      } else {
          await StorageService.saveContact({ name, phone, type });
          setCurrentView('DASHBOARD'); // Go back to list
      }
      await refreshData();
    } catch (e) {
      console.error(e);
      alert('Error saving contact');
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContactId) return;
    try {
        await StorageService.deleteContact(selectedContactId);
        setSelectedContactId(null);
        setCurrentView('DASHBOARD');
        await refreshData();
    } catch (e) {
        console.error(e);
        alert('Error deleting contact');
    }
  };

  const handleSaveTransaction = async (amount: number, description: string, date: string, items?: TransactionItem[]) => {
    if (!selectedContactId) return;
    try {
      await StorageService.saveTransaction({
        contactId: selectedContactId,
        amount,
        description,
        type: txModalType,
        items,
        date
      });
      setShowAddTransactionModal(false);
      setInitialTxAmount(undefined);
      await refreshData();
    } catch (e) {
      console.error(e);
      alert('Error saving transaction');
    }
  };

  const handleSettle = (balance: number) => {
      if (balance > 0) {
          // They owe me, so I need to receive payment to settle
          setTxModalType(TransactionType.PAYMENT_RECEIVED);
      } else {
          // I owe them (negative balance), so I need to "give credit" (pay them back) to settle 
          // (Mathematically: -500 + 500 = 0. CREDIT_GIVEN adds to balance)
          setTxModalType(TransactionType.CREDIT_GIVEN);
      }
      setInitialTxAmount(Math.abs(balance));
      setShowAddTransactionModal(true);
  };

  if (loading) {
      return <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center text-white">Loading...</div>;
  }

  // Render
  if (!isAuthenticated) {
    if (showWelcome) {
      return <Welcome onGetStarted={() => setShowWelcome(false)} />;
    }
    return <Auth onAuthenticated={handleLogin} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={(view) => {
        setCurrentView(view);
        if (view !== 'CONTACT_DETAILS') setSelectedContactId(null);
      }}
      onLogout={handleLogout}
    >
      {currentView === 'DASHBOARD' && (
        <Dashboard 
          contacts={contactsWithBalances} 
          onSelectContact={handleSelectContact} 
        />
      )}

      {currentView === 'ADD_CONTACT' && (
        <AddEntry 
          mode="CONTACT" 
          onCancel={() => setCurrentView('DASHBOARD')}
          onSaveContact={handleSaveContact}
        />
      )}

      {currentView === 'HISTORY' && (
        <History transactions={transactions} contacts={contacts} />
      )}

      {currentView === 'CONTACT_DETAILS' && selectedContact && (
        <ContactDetails 
          contact={selectedContact}
          transactions={selectedContactTransactions}
          onBack={() => {
            setSelectedContactId(null);
            setCurrentView('DASHBOARD');
          }}
          onAddTransaction={(type) => {
            setTxModalType(type);
            setInitialTxAmount(undefined);
            setShowAddTransactionModal(true);
          }}
          onEditContact={() => {
            setShowEditContactModal(true);
          }}
          onSettle={handleSettle}
          onDelete={handleDeleteContact}
        />
      )}

      {/* Modals */}
      {showAddTransactionModal && selectedContact && (
        <AddEntry 
          mode="TRANSACTION"
          contactName={selectedContact.name}
          transactionType={txModalType}
          onCancel={() => {
              setShowAddTransactionModal(false);
              setInitialTxAmount(undefined);
          }}
          onSaveTransaction={handleSaveTransaction}
          initialAmount={initialTxAmount}
        />
      )}

      {showEditContactModal && selectedContact && (
         <AddEntry
            mode="CONTACT"
            initialContactData={{ 
              name: selectedContact.name, 
              phone: selectedContact.phone || '',
              type: selectedContact.type
            }}
            onCancel={() => setShowEditContactModal(false)}
            onSaveContact={handleSaveContact}
         />
      )}

    </Layout>
  );
};

export default App;