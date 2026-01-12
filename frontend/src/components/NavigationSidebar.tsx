import React, { useState } from 'react';
import { Home, Map, BarChart2, AlertTriangle, Settings, ChevronLeft } from 'lucide-react';

interface SidebarProps {
    activeView: string;
    onViewChange: (view: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// THERMAL ATLAS - NAVIGATION SIDEBAR
// Glassmorphism design with gradient flame logo
// ═══════════════════════════════════════════════════════════════════════════

const NavigationSidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const navItems = [
        { id: 'home', icon: Home, label: 'Overview' },
        { id: 'map', icon: Map, label: 'Map View' },
        { id: 'analytics', icon: BarChart2, label: 'Analytics' },
        { id: 'risks', icon: AlertTriangle, label: 'Risk' }
    ];

    return (
        <div className={`${isCollapsed ? 'w-20' : 'w-72'} h-screen bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-50 relative`}>

            {/* ═══════════════════════════════════════════════════════════════
                HEADER: Gradient Flame Logo + "Thermal Atlas" Branding
                ═══════════════════════════════════════════════════════════════ */}
            <div
                className="h-20 flex items-center px-5 border-b border-slate-800 cursor-pointer hover:bg-slate-900/50 transition-colors relative group"
                onClick={() => setIsCollapsed(false)}
                title={isCollapsed ? "Click to Open Sidebar" : ""}
            >
                <div className="flex items-center gap-3 min-w-max">
                    {/* ─────────────────────────────────────────────────────────
                        GRADIENT FLAME LOGO (Matches Landing Page)
                        ───────────────────────────────────────────────────────── */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3a9 9 0 0 0 3 2.8Z" />
                        </svg>
                    </div>

                    {/* Brand Name */}
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-white tracking-wide text-lg">Thermal Atlas</span>
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Sentinel-2 Analysis</span>
                        </div>
                    )}
                </div>

                {/* TOGGLE BUTTON: Only visible when OPEN */}
                {!isCollapsed && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsCollapsed(true); }}
                        className="ml-auto p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                NAV ITEMS (With Active State Highlighting)
                ═══════════════════════════════════════════════════════════════ */}
            <nav className="flex-1 py-8 flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                        <div key={item.id} className="relative group px-4">
                            {/* Active Indicator Bar (Orange Glow) */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                            )}
                            <button
                                onClick={() => onViewChange(item.id)}
                                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${isActive
                                    ? 'bg-orange-500/10 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? 'text-orange-500' : ''} />
                                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                            </button>
                        </div>
                    );
                })}
            </nav>

            {/* ═══════════════════════════════════════════════════════════════
                SETTINGS BUTTON (Bottom of Sidebar)
                ═══════════════════════════════════════════════════════════════ */}
            <div className="p-4 border-t border-slate-800">
                <div className="relative px-0">
                    {activeView === 'settings' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                    )}
                    <button
                        onClick={() => onViewChange('settings')}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeView === 'settings'
                            ? 'bg-orange-500/10 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                    >
                        <Settings size={22} className={activeView === 'settings' ? 'text-orange-500' : ''} />
                        {!isCollapsed && <span className="font-medium">Settings</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(NavigationSidebar);
