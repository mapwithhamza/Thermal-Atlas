import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Target, Thermometer } from 'lucide-react';

interface HeatIslandsListProps {
    heatIslands: Array<{
        id: string;
        severity: 'extreme' | 'high' | 'medium' | 'low';
        avg_temp: number;
        intensity: number;
        size_pixels: number;
    }>;
    onSelect?: (id: string) => void;
    selectedId?: string;
    loading?: boolean;
}

const severityConfig = {
    extreme: { color: 'bg-red-900 border-red-700 text-red-100', label: 'Extreme' },
    high: { color: 'bg-red-700 border-red-500 text-white', label: 'High' },
    medium: { color: 'bg-orange-600 border-orange-400 text-white', label: 'Medium' },
    low: { color: 'bg-yellow-600 border-yellow-400 text-white', label: 'Low' }
};

const HeatIslandsList: React.FC<HeatIslandsListProps> = ({ heatIslands, onSelect, selectedId, loading }) => {
    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-800/50 border border-slate-700" />
                ))}
            </div>
        );
    }

    if (!heatIslands.length) {
        return (
            <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800/30 text-slate-500">
                <Target className="mb-2 h-6 w-6 opacity-50" />
                <p className="text-sm">No heat islands detected</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
                {heatIslands.map((island, index) => {
                    const config = severityConfig[island.severity] || severityConfig.low;
                    const isSelected = selectedId === island.id;

                    return (
                        <motion.div
                            key={island.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelect?.(island.id)}
                            className={clsx(
                                "group relative cursor-pointer rounded-lg border p-3 transition-all",
                                "bg-slate-800/40 hover:bg-slate-800",
                                isSelected
                                    ? "border-orange-500 ring-1 ring-orange-500/50 bg-slate-800"
                                    : "border-slate-700 hover:border-slate-600"
                            )}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={clsx("px-2 py-0.5 rounded textxs font-semibold uppercase tracking-wider border", config.color)}>
                                    {config.label} Severity
                                </span>
                                <span className="text-xs text-slate-500 font-mono">
                                    #{island.id.split('_')[1]}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center space-x-2 text-slate-300">
                                    <Thermometer className="h-4 w-4 text-orange-400" />
                                    <span>{island.avg_temp}°C</span>
                                </div>
                                <div className="text-right text-slate-400">
                                    <span className="text-orange-400 font-bold">+{island.intensity}</span> above avg
                                </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                                <span>Size: {island.size_pixels}px</span>
                                <span className="opacity-0 group-hover:opacity-100 text-orange-400 transition-opacity">
                                    Click to locate →
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default HeatIslandsList;
