import React, { useState } from 'react';
import { Settings, RefreshCw, ChevronDown, MapPin, Navigation } from 'lucide-react';
import center from '@turf/center';

interface MapControlPanelProps {
    neighborhoods: any; // GeoJSON Collection
    onSelectLocation: (lat: number, lon: number, zoom: number) => void;
    onReset: () => void;
}

const MapControlPanel: React.FC<MapControlPanelProps> = ({ neighborhoods, onSelectLocation, onReset }) => {
    const [manualLat, setManualLat] = useState('');
    const [manualLon, setManualLon] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);

    // ═══════════════════════════════════════════════════════════════════════
    // SAFETY GUARD: Wrapped in try/catch to prevent crashes
    // ═══════════════════════════════════════════════════════════════════════
    const handleNeighborhoodSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        if (!name || !neighborhoods) return;

        const feature = neighborhoods.features.find((n: any) => n.properties.name === name);
        if (!feature) {
            console.warn('Neighborhood not found:', name);
            return;
        }

        try {
            // Calculate centroid using Turf.js
            const centroid = center(feature);
            const [lon, lat] = centroid.geometry.coordinates;

            // ─────────────────────────────────────────────────────────────────
            // SAFETY GUARD: Validate coordinates before sending to parent
            // ─────────────────────────────────────────────────────────────────
            if (typeof lat !== 'number' || typeof lon !== 'number') {
                console.error('Centroid returned non-numeric coordinates:', { lat, lon });
                return;
            }

            if (isNaN(lat) || isNaN(lon)) {
                console.error('Centroid returned NaN coordinates:', { lat, lon });
                return;
            }

            if (!isFinite(lat) || !isFinite(lon)) {
                console.error('Centroid returned infinite coordinates:', { lat, lon });
                return;
            }

            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                console.error('Centroid coordinates out of bounds:', { lat, lon });
                return;
            }

            // Safe to proceed - call parent handler
            onSelectLocation(lat, lon, 13);

        } catch (error) {
            // ═══════════════════════════════════════════════════════════════════
            // CRASH PREVENTION: Log error but don't crash the app
            // ═══════════════════════════════════════════════════════════════════
            console.error('Error computing centroid for neighborhood:', name, error);
        }
    };

    const handleManualGo = () => {
        const lat = parseFloat(manualLat);
        const lon = parseFloat(manualLon);

        // Validate manual input
        if (isNaN(lat) || isNaN(lon)) {
            console.warn('Invalid manual coordinates');
            return;
        }

        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            console.warn('Manual coordinates out of bounds');
            return;
        }

        onSelectLocation(lat, lon, 14);
    };

    // Safe access to features
    const features = neighborhoods?.features || [];
    const sortedFeatures = [...features].sort((a: any, b: any) =>
        (a.properties.name || '').localeCompare(b.properties.name || '')
    );

    // ───────────────────────────────────────────────────────────────────────
    // COLLAPSED STATE
    // ───────────────────────────────────────────────────────────────────────
    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="absolute top-6 left-6 z-10 bg-slate-900/90 backdrop-blur-lg text-white p-3 rounded-xl border border-white/10 shadow-xl hover:bg-slate-800 hover:border-cyan-500/30 transition-all pointer-events-auto"
            >
                <Settings size={20} />
            </button>
        );
    }

    // ───────────────────────────────────────────────────────────────────────
    // EXPANDED PANEL
    // ───────────────────────────────────────────────────────────────────────
    return (
        <div className="absolute top-6 left-6 z-10 w-80 pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                                <Settings size={18} className="text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-white">Inspector Mode</h3>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Camera Control</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="w-7 h-7 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700/50 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Controls Body */}
                <div className="p-4 space-y-4">

                    {/* ═══════════════════════════════════════════════════════════════
                        NEIGHBORHOOD JUMPER (Glassmorphism Dark Theme)
                        ═══════════════════════════════════════════════════════════════ */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                            <MapPin size={12} />
                            Jump to Neighborhood
                        </label>
                        <div className="relative group">
                            {/* ─────────────────────────────────────────────────────────
                                DARK THEMED SELECT (Glassmorphism Style)
                                ───────────────────────────────────────────────────────── */}
                            <select
                                className="w-full bg-slate-900 border border-slate-700 hover:border-indigo-500/50 text-slate-200 text-sm rounded-lg pl-3 pr-10 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all cursor-pointer"
                                onChange={handleNeighborhoodSelect}
                                disabled={!neighborhoods}
                                defaultValue=""
                                style={{
                                    // Force dark mode even on browsers that don't respect dark classes
                                    backgroundColor: '#0f172a',
                                    colorScheme: 'dark'
                                }}
                            >
                                <option value="" disabled className="bg-slate-900 text-slate-400">
                                    {!neighborhoods ? '⏳ Loading map data...' : '📍 Select location...'}
                                </option>
                                {sortedFeatures.map((n: any, i: number) => (
                                    <option
                                        key={`${n.properties.name}-${i}`}
                                        value={n.properties.name}
                                        className="bg-slate-900 text-slate-200"
                                        style={{ backgroundColor: '#0f172a' }}
                                    >
                                        {n.properties.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-indigo-400 transition-colors pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
                        MANUAL COORDINATES INPUT
                        ═══════════════════════════════════════════════════════════════ */}
                    <div className="space-y-2 pt-2 border-t border-slate-700/50">
                        <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                            <Navigation size={12} />
                            Manual Coordinates
                        </label>
                        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                            <input
                                type="text"
                                placeholder="Latitude"
                                value={manualLat}
                                onChange={(e) => setManualLat(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Longitude"
                                value={manualLon}
                                onChange={(e) => setManualLon(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                            <button
                                onClick={handleManualGo}
                                className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/30 rounded-lg px-3 flex items-center justify-center transition-all hover:border-indigo-400/50 active:scale-95"
                            >
                                <ChevronDown size={16} className="-rotate-90" />
                            </button>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
                        RESET BUTTON
                        ═══════════════════════════════════════════════════════════════ */}
                    <button
                        onClick={onReset}
                        className="w-full flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium py-2.5 rounded-lg transition-all border border-transparent hover:border-slate-600 active:scale-[0.98] mt-1 group"
                    >
                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        Reset Camera View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapControlPanel;
