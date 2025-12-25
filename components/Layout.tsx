import React, { ReactNode } from 'react';
import { Users, PlusCircle, History, LogOut, Book } from 'lucide-react';
import { ViewState } from '../types';
import AdsterraBanner from './AdsterraBanner';
import Popunder from './Popunder';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, onLogout }) => {
  
  const navItems = [
    { view: 'DASHBOARD' as ViewState, icon: <Users size={24} />, label: 'Khata' },
    { view: 'ADD_CONTACT' as ViewState, icon: <PlusCircle size={40} className="text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />, label: 'Add', isSpecial: true },
    { view: 'HISTORY' as ViewState, icon: <History size={24} />, label: 'History' },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1a0b2e] text-white selection:bg-purple-500 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-700 rounded-full blur-[120px] opacity-40 pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-700 rounded-full blur-[120px] opacity-30 pointer-events-none z-0"></div>
      
      {/* Main Content Area */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 pt-6 pb-2 flex justify-between items-center backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Book size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                        Easy Khata
                    </h1>
                    <p className="text-[10px] text-purple-300/70 uppercase tracking-wider">Digital Ledger</p>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
                <LogOut size={18} className="text-purple-200" />
            </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-24 px-4 scroll-smooth">
          {/* Ad Placement: Top of content, non-intrusive */}
          <AdsterraBanner />
          <Popunder />
          
          {children}
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 pt-2 z-30">
            <nav className="mx-auto max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex justify-around items-center h-16 shadow-2xl shadow-purple-900/20">
                {navItems.map((item) => {
                    const isActive = currentView === item.view || (item.view === 'DASHBOARD' && currentView === 'CONTACT_DETAILS');
                    return (
                        <button
                            key={item.label}
                            onClick={() => onChangeView(item.view)}
                            className={`flex flex-col items-center justify-center w-16 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-purple-300/50 hover:text-purple-200'}`}
                        >
                            {item.icon}
                            {!item.isSpecial && <span className="text-[10px] mt-1 font-medium">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>
        </div>
      </div>
    </div>
  );
};

export default Layout;