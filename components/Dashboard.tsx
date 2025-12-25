import React, { useMemo, useState } from 'react';
import { ContactWithBalance, ContactType } from '../types';
import { Search, ArrowUpRight, ArrowDownLeft, ChevronRight, Filter, ChevronDown, Check } from 'lucide-react';

interface DashboardProps {
  contacts: ContactWithBalance[];
  onSelectContact: (contact: ContactWithBalance) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, onSelectContact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | ContactType>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (c.phone && c.phone.includes(searchTerm));
      const matchesType = filterType === 'ALL' || c.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [contacts, searchTerm, filterType]);

  const totalReceivable = contacts.reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0);
  const totalPayable = contacts.reduce((sum, c) => sum + (c.balance < 0 ? Math.abs(c.balance) : 0), 0);

  const getFilterLabel = (type: 'ALL' | ContactType) => {
      switch(type) {
          case 'ALL': return 'All';
          case ContactType.CUSTOMER: return 'Customers';
          case ContactType.SUPPLIER: return 'Suppliers';
      }
  };

  return (
    <div className="space-y-6 pt-2 animate-fade-in">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-900/40 border border-green-500/30 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-green-500/20 rounded-full">
                    <ArrowDownLeft size={14} className="text-green-400" />
                </div>
                <span className="text-xs text-green-200 font-medium">You will get</span>
            </div>
            <div className="text-xl font-bold text-white">Rs. {totalReceivable.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-red-500/20 to-rose-900/40 border border-red-500/30 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-red-500/20 rounded-full">
                    <ArrowUpRight size={14} className="text-red-400" />
                </div>
                <span className="text-xs text-red-200 font-medium">You will give</span>
            </div>
            <div className="text-xl font-bold text-white">Rs. {totalPayable.toLocaleString()}</div>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="flex gap-3 relative z-20">
        {/* Search */}
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300/50" size={18} />
            <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
            />
        </div>

        {/* Custom Filter Dropdown */}
        <div className="relative w-[140px]">
             {/* Invisible Backdrop for click-outside */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
            )}
            
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`w-full h-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl pl-3 pr-3 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all relative z-20 ${isFilterOpen ? 'bg-white/10 border-purple-500/30 ring-2 ring-purple-500/20' : ''}`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <Filter size={16} className="text-purple-300/50 flex-shrink-0" />
                    <span className="truncate">{getFilterLabel(filterType)}</span>
                </div>
                <ChevronDown size={14} className={`text-purple-300/50 transition-transform duration-300 flex-shrink-0 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute right-0 top-full mt-2 w-48 bg-[#1e0b36]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30 transition-all duration-200 origin-top-right ${isFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                <div className="p-1 space-y-1">
                    {[
                        { value: 'ALL', label: 'All Contacts' },
                        { value: ContactType.CUSTOMER, label: 'Customers Only' },
                        { value: ContactType.SUPPLIER, label: 'Suppliers Only' }
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setFilterType(option.value as any);
                                setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${filterType === option.value ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span>{option.label}</span>
                            {filterType === option.value && <Check size={14} className="animate-fade-in" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 relative z-0">
        <div className="flex items-center justify-between pl-1">
            <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                {filterType === 'ALL' ? 'All Contacts' : (filterType === ContactType.CUSTOMER ? 'Customers' : 'Suppliers')}
            </h2>
            <span className="text-xs text-white/30">{filteredContacts.length} found</span>
        </div>
        
        {filteredContacts.length === 0 ? (
            <div className="text-center py-12 opacity-50">
                <p>No contacts found.</p>
                <p className="text-xs mt-2">Try adjusting your search or filter.</p>
            </div>
        ) : (
            filteredContacts.map(contact => (
                <div 
                    key={contact.id}
                    onClick={() => onSelectContact(contact)}
                    className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 active:scale-[0.98] transition-all duration-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                            contact.type === ContactType.SUPPLIER 
                                ? 'bg-gradient-to-tr from-orange-500 to-pink-600 shadow-orange-900/30' 
                                : 'bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-purple-900/30'
                        }`}>
                            {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-white group-hover:text-purple-200 transition-colors">{contact.name}</h3>
                                {contact.type === ContactType.SUPPLIER && (
                                    <span className="text-[10px] bg-orange-500/20 text-orange-200 px-1.5 py-0.5 rounded border border-orange-500/10">Sup</span>
                                )}
                            </div>
                            <p className="text-xs text-white/40">
                                {contact.lastTransactionDate 
                                    ? new Date(contact.lastTransactionDate).toLocaleDateString() 
                                    : 'No transactions'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className={`font-bold ${contact.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                Rs. {Math.abs(contact.balance).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-white/30 uppercase">
                                {contact.balance >= 0 ? 'Receivable' : 'Payable'}
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-white/20" />
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;