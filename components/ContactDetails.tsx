import React, { useState } from 'react';
import { ContactWithBalance, Transaction, TransactionType } from '../types';
import { ArrowLeft, Phone, Share2, Download, ArrowUpRight, ArrowDownLeft, Edit2, ShoppingBag, Trash2, AlertTriangle } from 'lucide-react';

interface ContactDetailsProps {
    contact: ContactWithBalance;
    transactions: Transaction[];
    onBack: () => void;
    onAddTransaction: (type: TransactionType) => void;
    onEditContact: () => void;
    onSettle: (balance: number) => void;
    onDelete: () => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
    contact,
    transactions,
    onBack,
    onAddTransaction,
    onEditContact,
    onSettle,
    onDelete
}) => {
    const [filter, setFilter] = useState<'ALL' | TransactionType>('ALL');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const filteredTransactions = transactions.filter(t => filter === 'ALL' || t.type === filter);

    return (
        <div className="pt-2 animate-fade-in pb-20">
            {/* Navbar override for this view */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <span className="font-medium">Customer Ledger</span>

                <div className="flex gap-1 -mr-2">
                    <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-full hover:bg-red-500/20 group transition-colors">
                        <Trash2 size={18} className="text-white/60 group-hover:text-red-400 transition-colors" />
                    </button>
                    <button onClick={onEditContact} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <Edit2 size={18} />
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 text-center mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                <div className="h-20 w-20 mx-auto bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mb-4">
                    {contact.name.charAt(0).toUpperCase()}
                </div>

                <h2 className="text-2xl font-bold mb-1">{contact.name}</h2>
                <p className="text-white/50 text-sm mb-6">{contact.phone || 'No Phone Number'}</p>

                <div className="flex items-center justify-center gap-4 mb-6">
                    <button className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-green-500/20 hover:border-green-500/50 transition-all">
                        <Phone size={18} className="text-green-300" />
                    </button>
                    <button className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all">
                        <Share2 size={18} className="text-blue-300" />
                    </button>
                    <button className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all">
                        <Download size={18} className="text-orange-300" />
                    </button>
                </div>

                <div className="py-4 bg-black/20 rounded-2xl border border-white/5">
                    <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Current Balance</p>
                    <p className={`text-3xl font-bold ${contact.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        Rs. {Math.abs(contact.balance).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-white/30 mt-1">
                        {contact.balance >= 0 ? 'You will receive' : 'You need to pay'}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => onAddTransaction(TransactionType.CREDIT_GIVEN)}
                    className="flex flex-col items-center justify-center py-4 rounded-2xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 active:scale-95 transition-all"
                >
                    <ArrowUpRight className="text-red-400 mb-1" />
                    <span className="text-red-200 font-semibold text-sm">You Gave</span>
                    <span className="text-[10px] text-red-200/50">Credit</span>
                </button>
                <button
                    onClick={() => onAddTransaction(TransactionType.PAYMENT_RECEIVED)}
                    className="flex flex-col items-center justify-center py-4 rounded-2xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 active:scale-95 transition-all"
                >
                    <ArrowDownLeft className="text-green-400 mb-1" />
                    <span className="text-green-200 font-semibold text-sm">You Got</span>
                    <span className="text-[10px] text-green-200/50">Payment</span>
                </button>
            </div>

            {/* Ledger History */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Transactions</h3>
                    <div className="flex bg-white/5 rounded-lg p-1">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={`px-3 py-1 rounded-md text-xs transition-colors ${filter === 'ALL' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                        >All</button>
                        <button
                            onClick={() => setFilter(TransactionType.CREDIT_GIVEN)}
                            className={`px-3 py-1 rounded-md text-xs transition-colors ${filter === TransactionType.CREDIT_GIVEN ? 'bg-red-500/20 text-red-300' : 'text-white/40'}`}
                        >Gave</button>
                        <button
                            onClick={() => setFilter(TransactionType.PAYMENT_RECEIVED)}
                            className={`px-3 py-1 rounded-md text-xs transition-colors ${filter === TransactionType.PAYMENT_RECEIVED ? 'bg-green-500/20 text-green-300' : 'text-white/40'}`}
                        >Got</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredTransactions.map((tx) => (
                        <div key={tx.id} className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded text-[10px]">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </span>
                                    {tx.items && tx.items.length > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] text-purple-300">
                                            <ShoppingBag size={10} /> {tx.items.length} items
                                        </span>
                                    )}
                                </div>
                                <div className={`font-mono font-bold ${tx.type === TransactionType.CREDIT_GIVEN ? 'text-red-400' : 'text-green-400'}`}>
                                    {tx.type === TransactionType.CREDIT_GIVEN ? '-' : '+'} Rs. {tx.amount.toLocaleString()}
                                </div>
                            </div>

                            <div className="pl-1">
                                {tx.items && tx.items.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {tx.items.map((item, idx) => (
                                            <span key={idx} className="text-xs text-white/80 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                                                {item.name} <span className="text-white/40">x{item.quantity}</span>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-white/80 font-medium">{tx.description || 'No description'}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-8 text-white/30 text-sm">
                            No transactions found.
                        </div>
                    )}
                </div>

                {/* Settle Up Button */}
                {contact.balance !== 0 && (
                    <button
                        className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-lg active:scale-95 transition-all"
                        onClick={() => onSettle(contact.balance)}
                    >
                        Settle Up (Checkout)
                    </button>
                )}

            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)}></div>
                    <div className="relative z-10 w-full max-w-sm bg-[#1e1035] border border-white/20 rounded-3xl p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Contact?</h3>
                            <p className="text-white/60 text-sm mb-6">
                                Are you sure you want to delete <span className="text-white font-semibold">{contact.name}</span>?
                                This action cannot be undone and will delete all associated transaction history.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold shadow-lg shadow-red-900/30 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ContactDetails;