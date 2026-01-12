import React from 'react';
import { Settings as SettingsIcon, Moon, Satellite, Thermometer, Palette, Map, Check } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// MAP STYLE PRESETS
// ═══════════════════════════════════════════════════════════════════════════
const MAP_STYLES = {
    dark: 'mapbox://styles/mapbox/dark-v11',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
} as const;

interface SettingsProps {
    currentStyle: string;
    onStyleChange: (style: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS COMPONENT (Control Center)
// ═══════════════════════════════════════════════════════════════════════════
const Settings: React.FC<SettingsProps> = ({ currentStyle, onStyleChange }) => {

    const isDarkMode = currentStyle === MAP_STYLES.dark;
    const isSatelliteMode = currentStyle === MAP_STYLES.satellite;

    return (
        <div className="h-full overflow-y-auto bg-slate-950 p-8">
            <div className="max-w-4xl mx-auto">

                {/* ═══════════════════════════════════════════════════════════
                    HEADER
                    ═══════════════════════════════════════════════════════════ */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-xl border border-slate-700/50">
                        <SettingsIcon size={28} className="text-slate-300" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Settings</h1>
                        <p className="text-slate-400 text-sm">Visualization & Data Parameters</p>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    MAP VISUALIZATION MODE (Main Feature)
                    ═══════════════════════════════════════════════════════════ */}
                <section className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Palette size={18} className="text-indigo-400" />
                        <h2 className="text-lg font-semibold text-white">Map Visualization Mode</h2>
                    </div>
                    <p className="text-slate-500 text-sm mb-6">
                        Choose between heat-optimized dark mode for analysis or satellite imagery for real-world context.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* ─────────────────────────────────────────────────────
                            DARK MODE CARD
                            ───────────────────────────────────────────────────── */}
                        <button
                            onClick={() => onStyleChange(MAP_STYLES.dark)}
                            className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 text-left
                                ${isDarkMode
                                    ? 'bg-slate-900/95 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]'
                                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-900/70'
                                } backdrop-blur-xl`}
                        >
                            {/* Selection Indicator */}
                            {isDarkMode && (
                                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all
                                ${isDarkMode
                                    ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/50'
                                    : 'bg-slate-800/50 border border-slate-700/50 group-hover:border-slate-600'
                                }`}
                            >
                                <Moon size={26} className={isDarkMode ? 'text-indigo-400' : 'text-slate-400'} />
                            </div>

                            {/* Title & Description */}
                            <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-300'}`}>
                                Heat Map (Dark)
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Optimized for heat island visualization with high contrast thermal overlays and neon boundary lines.
                            </p>

                            {/* Feature Tags */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="px-2 py-1 text-xs rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50">
                                    High Contrast
                                </span>
                                <span className="px-2 py-1 text-xs rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50">
                                    Low Eye Strain
                                </span>
                            </div>
                        </button>

                        {/* ─────────────────────────────────────────────────────
                            SATELLITE MODE CARD
                            ───────────────────────────────────────────────────── */}
                        <button
                            onClick={() => onStyleChange(MAP_STYLES.satellite)}
                            className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 text-left
                                ${isSatelliteMode
                                    ? 'bg-slate-900/95 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-900/70'
                                } backdrop-blur-xl`}
                        >
                            {/* Selection Indicator */}
                            {isSatelliteMode && (
                                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all
                                ${isSatelliteMode
                                    ? 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/50'
                                    : 'bg-slate-800/50 border border-slate-700/50 group-hover:border-slate-600'
                                }`}
                            >
                                <Satellite size={26} className={isSatelliteMode ? 'text-emerald-400' : 'text-slate-400'} />
                            </div>

                            {/* Title & Description */}
                            <h3 className={`text-lg font-bold mb-1 ${isSatelliteMode ? 'text-white' : 'text-slate-300'}`}>
                                Satellite (Real World)
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Real satellite imagery with street labels. Perfect for identifying physical features and land use.
                            </p>

                            {/* Feature Tags */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="px-2 py-1 text-xs rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50">
                                    Real Imagery
                                </span>
                                <span className="px-2 py-1 text-xs rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50">
                                    Street Labels
                                </span>
                            </div>
                        </button>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    ANALYSIS PARAMETERS (Read-Only Info)
                    ═══════════════════════════════════════════════════════════ */}
                <section className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Thermometer size={18} className="text-orange-400" />
                        <h2 className="text-lg font-semibold text-white">Analysis Parameters</h2>
                    </div>

                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                    <Thermometer size={20} className="text-orange-400" />
                                </div>
                                <div>
                                    <div className="text-white font-medium">Heat Island Threshold</div>
                                    <div className="text-slate-500 text-sm">Default: +3.0°C above baseline</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                    <Map size={20} className="text-cyan-400" />
                                </div>
                                <div>
                                    <div className="text-white font-medium">Analysis Resolution</div>
                                    <div className="text-slate-500 text-sm">10m (Sentinel-2 MSI)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    SYSTEM INFO
                    ═══════════════════════════════════════════════════════════ */}
                <section>
                    <div className="text-center text-slate-600 text-xs font-mono space-y-1">
                        <div>Urban Heat Island Mapper • v2.1.0 RC1</div>
                        <div>Powered by Sentinel-2 MSI & Mapbox GL</div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Settings;
