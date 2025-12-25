import React, { useState, useRef } from 'react';
import { ContactType, TransactionType, TransactionItem } from '../types';
import { X, Calendar, Plus, Trash2 } from 'lucide-react';

interface AddEntryProps {
    mode: 'CONTACT' | 'TRANSACTION';
    transactionType?: TransactionType;
    contactName?: string; // For display in transaction mode
    onSaveContact?: (name: string, phone: string, type: ContactType) => void;
    onSaveTransaction?: (amount: number, description: string, date: string, items?: TransactionItem[]) => void;
    onCancel: () => void;
    initialContactData?: { name: string, phone: string, type?: ContactType }; // For edit mode
    initialAmount?: number;
}

const AddEntry: React.FC<AddEntryProps> = ({
    mode,
    transactionType,
    contactName,
    onSaveContact,
    onSaveTransaction,
    onCancel,
    initialContactData,
    initialAmount
}) => {
    // Contact State
    const [name, setName] = useState(initialContactData?.name || '');
    const [phone, setPhone] = useState(initialContactData?.phone || '');
    const [cType, setCType] = useState<ContactType>(initialContactData?.type || ContactType.CUSTOMER);

    // Transaction State
    const [amount, setAmount] = useState(initialAmount ? initialAmount.toString() : '');
    const [desc, setDesc] = useState(initialAmount ? 'Full Settlement' : '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Items State (Only used for Credit Given)
    const [items, setItems] = useState<TransactionItem[]>([]);
    const [itemName, setItemName] = useState('');
    const [itemQty, setItemQty] = useState('1');
    const itemNameRef = useRef<HTMLInputElement>(null);

    const handleAddItem = (e?: React.MouseEvent) => {
        e?.preventDefault(); // Prevent form submission
        if (!itemName.trim()) return;

        setItems(prev => [...prev, { name: itemName, quantity: parseInt(itemQty) || 1 }]);
        setItemName('');
        setItemQty('1');
        itemNameRef.current?.focus(); // Focus back for rapid entry
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItem();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'CONTACT' && onSaveContact) {
            if (!name) return;
            onSaveContact(name, phone, cType);
        } else if (mode === 'TRANSACTION' && onSaveTransaction) {
            if (!amount) return;

            let finalDescription = desc;
            const isCreditGiven = transactionType === TransactionType.CREDIT_GIVEN;

            // Auto-generate description if empty but items exist
            if (isCreditGiven && !finalDescription && items.length > 0) {
                finalDescription = `${items.length} Items`;
            }

            onSaveTransaction(parseFloat(amount), finalDescription, date, items);
        }
    };

    const isCredit = transactionType === TransactionType.CREDIT_GIVEN;
    // Show items builder if: Transaction Mode AND Credit Type AND Not a Settlement (pre-filled amount)
    const showItemsBuilder = mode === 'TRANSACTION' && isCredit && !initialAmount;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onCancel}></div>

            <div className="bg-[#1e1035] border border-white/20 w-full max-w-sm rounded-3xl overflow-hidden relative z-10 shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className={`p-6 flex-shrink-0 ${mode === 'TRANSACTION' ? (isCredit ? 'bg-red-900/30' : 'bg-green-900/30') : 'bg-purple-900/30'} border-b border-white/5`}>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-white">
                            {mode === 'CONTACT'
                                ? (initialContactData ? 'Edit Contact' : 'New Contact')
                                : (isCredit ? 'You Gave Credit' : 'You Received Payment')}
                        </h2>
                        <button onClick={onCancel} className="text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    {mode === 'TRANSACTION' && (
                        <p className={`text-sm ${isCredit ? 'text-red-300' : 'text-green-300'}`}>
                            To {contactName}
                        </p>
                    )}
                </div>

                <div className="overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">

                        {mode === 'CONTACT' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Enter name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="Enter phone number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider">Contact Type</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setCType(ContactType.CUSTOMER)}
                                            className={`flex-1 py-2 rounded-lg text-sm transition-all ${cType === ContactType.CUSTOMER ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-white/50'}`}
                                        >Customer</button>
                                        <button
                                            type="button"
                                            onClick={() => setCType(ContactType.SUPPLIER)}
                                            className={`flex-1 py-2 rounded-lg text-sm transition-all ${cType === ContactType.SUPPLIER ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-white/50'}`}
                                        >Supplier</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider">Amount</label>
                                    <div className="relative">
                                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold ${isCredit ? 'text-red-400' : 'text-green-400'}`}>Rs. </span>
                                        <input
                                            type="number"
                                            required
                                            autoFocus
                                            value={amount}
                                            onChange={e => setAmount(e.target.value)}
                                            placeholder="0"
                                            className={`w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-3xl font-bold text-white focus:outline-none transition-all ${isCredit ? 'focus:border-red-500/50' : 'focus:border-green-500/50'}`}
                                        />
                                    </div>
                                </div>

                                {/* Items Builder vs Description */}
                                {showItemsBuilder ? (
                                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider flex justify-between items-center">
                                            <span>Items List</span>
                                            <span className="text-[10px] text-white/30 lowercase font-normal">
                                                {items.length} items added
                                            </span>
                                        </label>

                                        {/* Item Input Row */}
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                ref={itemNameRef}
                                                type="text"
                                                value={itemName}
                                                onChange={e => setItemName(e.target.value)}
                                                onKeyDown={handleItemKey}
                                                placeholder="Item Name"
                                                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-3 text-sm focus:border-purple-500 focus:outline-none"
                                            />
                                            <input
                                                type="number"
                                                value={itemQty}
                                                onChange={e => setItemQty(e.target.value)}
                                                onKeyDown={handleItemKey}
                                                placeholder="Qty"
                                                className="w-20 bg-black/20 border border-white/10 rounded-lg px-2 py-3 text-sm text-center focus:border-purple-500 focus:outline-none"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="w-full py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 active:scale-95 transition-all flex items-center justify-center gap-2 mb-2 shadow-lg shadow-purple-900/20"
                                        >
                                            <Plus size={18} /> Add Item
                                        </button>

                                        {/* Items List */}
                                        <div className="flex flex-col gap-2 mt-2 max-h-40 overflow-y-auto custom-scrollbar">
                                            {items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2 animate-fade-in">
                                                    <span className="text-sm text-purple-100 font-medium">
                                                        {item.name} <span className="text-white/40 text-xs ml-1">x{item.quantity}</span>
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(idx)}
                                                        className="p-1 hover:text-red-300 text-white/30 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {items.length === 0 && (
                                                <div className="w-full text-center py-6 text-white/20 text-xs italic border border-dashed border-white/10 rounded-lg">
                                                    Add items above...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider">Description</label>
                                        <input
                                            type="text"
                                            value={desc}
                                            onChange={e => setDesc(e.target.value)}
                                            placeholder="e.g. Milk, Repair, Cash"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-purple-300 font-semibold tracking-wider">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={e => setDate(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:bg-white/10 transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all mt-4 ${mode === 'CONTACT'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                                    : (isCredit ? 'bg-gradient-to-r from-red-600 to-rose-700' : 'bg-gradient-to-r from-green-600 to-emerald-700')
                                }`}
                        >
                            {mode === 'CONTACT' ? 'Save Contact' : 'Save Transaction'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEntry;