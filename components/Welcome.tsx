import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, ArrowRight, TrendingUp, Zap, Lock, Cloud, Smartphone, PieChart, ChevronDown, Star, Users, CheckCircle, Book } from 'lucide-react';

interface WelcomeProps {
  onGetStarted: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onGetStarted }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper for scroll animations - Triggers ONLY ONCE
  const FadeInSection: React.FC<{ children: React.ReactNode; delay?: string }> = ({ children, delay = '0s' }) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            // Stop observing immediately after it becomes visible to prevent reset
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      }, { threshold: 0.1 });

      const currentRef = domRef.current;
      if (currentRef) observer.observe(currentRef);

      return () => {
        if (currentRef) observer.unobserve(currentRef);
      };
    }, []);

    return (
      <div
        ref={domRef}
        className={`transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: delay }}
      >
        {children}
      </div>
    );
  };

  const testimonials = [
    { name: "Ahmed Store", role: "Retail Shop", text: "Easy Khata changed how I manage my udhaar. No more lost notebooks!" },
    { name: "Sarah's Boutique", role: "Fashion Design", text: "Beautiful app and so fast. I can send reminders to clients easily." },
    { name: "Tech Point", role: "Mobile Repair", text: "The best digital ledger app. Secure and simple to use." },
    { name: "City Café", role: "Restaurant", text: "Tracking daily expenses has never been this smooth. Highly recommended!" },
    { name: "Ravi Traders", role: "Wholesale", text: "Data sync is a lifesaver. I can access my ledger from home or shop." },
    { name: "Fresh Mart", role: "Grocery", text: "Customer balances are always accurate now. My losses have gone down." },
  ];

  return (
    <div className="min-h-screen bg-[#1e0b36] text-white font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* --- Ambient Backgrounds (Fixed) --- */}
      <div className="fixed top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-purple-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-20%] w-[90vw] h-[90vw] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>

      {/* --- Sticky Navigation --- */}
      <nav className={`fixed top-0 w-full px-6 py-4 flex justify-between items-center z-50 transition-all duration-300 ${scrolled ? 'bg-[#1e0b36]/80 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Book size={16} className="text-white" />
            </div>
            <span className="font-semibold tracking-wide text-sm text-white">Easy Khata</span>
        </div>
        <button 
            onClick={onGetStarted}
            className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-all px-4 py-2 rounded-full border border-white/10 active:scale-95"
        >
            Login
        </button>
      </nav>

      {/* --- Section 1: Hero (Full Screen) --- */}
      <header className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-24 pb-12 px-6 z-10">
        
        {/* Headlines */}
        <div className={`text-center max-w-lg mx-auto transition-all duration-1000 relative z-20 mb-10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-purple-200 mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                v2.0 Now Available
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-purple-200">
                    Master Your
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    Daily Ledger.
                </span>
            </h1>
            <p className="text-base text-purple-200/60 px-4 leading-relaxed max-w-sm mx-auto">
                The professional way to track payments, manage customers, and send reminders. 
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                    onClick={onGetStarted}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-[#1e0b36] rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-purple-50 active:scale-[0.98] transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                >
                    Get Started Free
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>

        {/* 3D Visual Stack */}
        <div className={`relative w-full max-w-[300px] aspect-[3/4] transition-all duration-1000 delay-300 ease-out transform ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
            <div className="w-full h-full relative perspective-1000">
                <div className="w-full h-full relative preserve-3d animate-float">
                    
                    {/* Decorative Blur Back */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[40px] transform translate-x-4 translate-y-6 opacity-30 blur-2xl"></div>
                    
                    {/* Main Phone Card */}
                    <div className="absolute inset-0 bg-[#2a1b3d]/80 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
                        {/* Mock Header */}
                        <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-white/5">
                             <div className="w-12 h-3 bg-white/10 rounded-full"></div>
                             <div className="flex gap-1.5">
                                 <div className="w-2 h-2 rounded-full bg-red-400/50"></div>
                                 <div className="w-2 h-2 rounded-full bg-yellow-400/50"></div>
                                 <div className="w-2 h-2 rounded-full bg-green-400/50"></div>
                             </div>
                        </div>
                        
                        {/* Mock Dashboard */}
                        <div className="p-6 flex-1 flex flex-col relative">
                            <div className="mb-6">
                                <div className="text-[10px] text-purple-300 uppercase font-bold tracking-wider mb-2">Total Balance</div>
                                <div className="text-4xl font-bold text-white mb-2 tracking-tight">Rs. 45k</div>
                                <div className="inline-flex items-center text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/10">
                                    <TrendingUp size={10} className="mr-1" /> +24% growth
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${i === 2 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                            {i === 2 ? 'Out' : 'In'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="w-16 h-2 bg-white/20 rounded-full mb-1.5"></div>
                                            <div className="w-10 h-1.5 bg-white/10 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating Badges */}
                    <div className="absolute top-[20%] -left-6 bg-[#1a0b2e]/90 border border-white/20 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float backdrop-blur-md" style={{ animationDelay: '1s', animationDuration: '6s' }}>
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><ShieldCheck size={18} /></div>
                        <div>
                            <div className="text-xs font-bold">100% Secure</div>
                            <div className="text-[8px] text-white/50">Encrypted Data</div>
                        </div>
                    </div>

                    <div className="absolute bottom-[20%] -right-6 bg-[#1a0b2e]/90 border border-white/20 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float backdrop-blur-md" style={{ animationDelay: '1.5s', animationDuration: '7s' }}>
                        <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400"><Cloud size={18} /></div>
                        <div>
                            <div className="text-xs font-bold">Auto Sync</div>
                            <div className="text-[8px] text-white/50">Always Online</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <ChevronDown size={24} />
        </div>
      </header>

      {/* --- Section 2: Features Grid --- */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-4xl mx-auto">
            <FadeInSection>
                <h2 className="text-3xl font-bold text-center mb-12">
                    Everything you need to <br/>
                    <span className="text-purple-400">grow your business</span>
                </h2>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { icon: <Lock className="text-purple-400" />, title: "Secure Storage", desc: "Your data is encrypted and stored securely in the cloud." },
                    { icon: <Zap className="text-yellow-400" />, title: "Lightning Fast", desc: "Optimized for speed. Record transactions in seconds." },
                    { icon: <Smartphone className="text-blue-400" />, title: "Mobile First", desc: "Designed for your phone. Use it anywhere, anytime." },
                    { icon: <PieChart className="text-pink-400" />, title: "Smart Reports", desc: "Visualize your cash flow with beautiful charts." }
                ].map((feature, idx) => (
                    <FadeInSection key={idx} delay={`${idx * 100}ms`}>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    </FadeInSection>
                ))}
            </div>
        </div>
      </section>

      {/* --- Section 3: Social Proof / Stats --- */}
      <section className="py-20 bg-gradient-to-b from-transparent to-black/20 z-10 relative border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
             <FadeInSection>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 divide-x divide-white/10">
                    <div>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-1">10k+</div>
                        <div className="text-xs text-purple-300 uppercase tracking-widest">Users</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-1">50k+</div>
                        <div className="text-xs text-purple-300 uppercase tracking-widest">Entries</div>
                    </div>
                    <div className="col-span-2 md:col-span-1 border-t md:border-t-0 border-white/10 pt-8 md:pt-0 mt-8 md:mt-0">
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-1">4.9</div>
                        <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs mb-1">
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                        </div>
                        <div className="text-xs text-purple-300 uppercase tracking-widest">Rating</div>
                    </div>
                </div>
             </FadeInSection>
        </div>
      </section>

      {/* --- Section 4: Testimonials (Auto Scroll) --- */}
      <section className="py-20 z-10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 mb-12">
             <FadeInSection>
                <h2 className="text-2xl font-bold text-center">Trusted by Local Businesses</h2>
            </FadeInSection>
        </div>
        
        {/* Infinite Scroll Container */}
        <div 
          className="relative w-full overflow-hidden" 
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', 
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' 
          }}
        >
            <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
                {/* Duplicate the array to create an infinite loop */}
                {[...testimonials, ...testimonials].map((t, i) => (
                    <div key={i} className="w-[300px] flex-shrink-0 bg-[#2a1b3d] border border-white/10 p-6 rounded-3xl relative mr-6">
                        <div className="mb-4 flex gap-1 text-yellow-500">
                            {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                        </div>
                        <p className="text-white/80 text-sm mb-6 leading-relaxed relative z-10">"{t.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-sm">
                                {t.name[0]}
                            </div>
                            <div>
                                <div className="font-bold text-sm">{t.name}</div>
                                <div className="text-xs text-white/40">{t.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- Section 5: CTA --- */}
      <section className="py-20 px-6 z-10 relative">
        <FadeInSection>
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-white/10 rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full transform scale-75 pointer-events-none"></div>
                
                <h2 className="text-3xl font-bold mb-4 relative z-10">Start Managing Today</h2>
                <p className="text-purple-200/70 mb-8 max-w-md mx-auto relative z-10">
                    Join thousands of businesses who have switched to a smarter, digital ledger.
                </p>
                
                <button 
                    onClick={onGetStarted}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-purple-900 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10"
                >
                    Create Free Account
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/40 relative z-10">
                    <span className="flex items-center gap-1"><CheckCircle size={12} /> No credit card</span>
                    <span className="flex items-center gap-1"><CheckCircle size={12} /> Free forever plan</span>
                </div>
            </div>
        </FadeInSection>
      </section>

      {/* --- Footer --- */}
      <footer className="py-8 text-center text-white/20 text-xs border-t border-white/5 relative z-10">
        <p>&copy; {new Date().getFullYear()} Easy Khata. Crafted for Business.</p>
      </footer>

    </div>
  );
};

export default Welcome;