import React from 'react';

interface LayerControlsProps {
    layers: {
        temperature: boolean;
        heatIslands: boolean;
        vegetation: boolean;
    };
    onLayerToggle: (layer: keyof LayerControlsProps['layers']) => void;
}

const LayerControls: React.FC<LayerControlsProps> = ({ layers, onLayerToggle }) => {
    return (
        <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg border border-slate-700 shadow-xl max-w-xs z-10 transition-colors">
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Map Layers</h3>

            <div className="space-y-3">
                {/* Heat Islands Toggle */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-slate-200 cursor-pointer hover:text-white">
                        <input
                            type="checkbox"
                            checked={layers.heatIslands}
                            onChange={() => onLayerToggle('heatIslands')}
                            className="rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-sm">Heat Islands</span>
                    </label>
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                </div>

                {/* Temperature Toggle */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-slate-200 cursor-pointer hover:text-white">
                        <input
                            type="checkbox"
                            checked={layers.temperature}
                            onChange={() => onLayerToggle('temperature')}
                            className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-sm">Temperature</span>
                    </label>
                </div>

                {/* Legend for Temperature */}
                {layers.temperature && (
                    <div className="mt-2 pl-6">
                        <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-600 via-green-500 via-yellow-400 via-orange-500 to-red-600"></div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>Cool</span>
                            <span>Hot</span>
                        </div>
                    </div>
                )}

                {/* Vegetation Toggle */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-slate-200 cursor-pointer hover:text-white">
                        <input
                            type="checkbox"
                            checked={layers.vegetation}
                            onChange={() => onLayerToggle('vegetation')}
                            className="rounded border-slate-600 bg-slate-700 text-green-500 focus:ring-green-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-sm">Vegetation (NDVI)</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default LayerControls;
