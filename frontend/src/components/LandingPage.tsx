import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// THERMAL ATLAS - MINIMALIST SPLASH SCREEN
// Only: Gradient Logo, Title, CTA Button
// ═══════════════════════════════════════════════════════════════════════════

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black flex items-center justify-center">

            {/* ═══════════════════════════════════════════════════════════════
                BACKGROUND ANIMATIONS (Subtle Ambient Effects)
                ═══════════════════════════════════════════════════════════════ */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px] animate-pulse delay-1000" />
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                CENTERED CONTENT (Minimalist Layout)
                ═══════════════════════════════════════════════════════════════ */}
            <div className="relative z-10 text-center px-4 flex flex-col items-center justify-center">

                {/* ─────────────────────────────────────────────────────────────
                    ANIMATED GRADIENT FLAME LOGO
                    ───────────────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-10"
                >
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 blur-3xl opacity-30 animate-pulse scale-150" />

                        {/* Logo Container */}
                        <div className="relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-white">
                                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3a9 9 0 0 0 3 2.8Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ─────────────────────────────────────────────────────────────
                    TITLE: "THERMAL ATLAS"
                    ───────────────────────────────────────────────────────────── */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 animate-gradient-x">
                        Thermal Atlas
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-slate-400 text-lg mb-10 max-w-md"
                >
                    Urban Heat Island Analysis Platform
                </motion.p>

                {/* ─────────────────────────────────────────────────────────────
                    CTA BUTTON
                    ───────────────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-4"
                >
                    <button
                        onClick={onStart}
                        className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 text-lg font-bold rounded-full transition-all duration-300 hover:bg-slate-200 hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)] active:scale-100"
                    >
                        Explore Heat Map
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="mt-6 text-xs text-slate-600 font-mono tracking-widest uppercase opacity-70">
                        Powered by Sentinel-2 MSI • v2.1.0
                    </p>
                </motion.div>

            </div>
        </div>
    );
};

export default LandingPage;
