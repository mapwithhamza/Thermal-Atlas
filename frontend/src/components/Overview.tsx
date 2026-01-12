import React from 'react';
import { Activity, Map, Satellite, Target, Leaf, Globe, ArrowRight, Database, Cpu } from 'lucide-react';

interface OverviewProps {
    onNavigateToMap: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// OVERVIEW COMPONENT (Knowledge Base)
// Educational content moved from LandingPage
// ═══════════════════════════════════════════════════════════════════════════

const Overview: React.FC<OverviewProps> = ({ onNavigateToMap }) => {
    return (
        <div className="h-full overflow-y-auto bg-slate-950 p-8">
            <div className="max-w-5xl mx-auto">

                {/* ═══════════════════════════════════════════════════════════
                    HEADER
                    ═══════════════════════════════════════════════════════════ */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center shadow-xl border border-orange-500/30">
                        <Globe size={28} className="text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Project Overview</h1>
                        <p className="text-slate-400 text-sm">Urban Heat Island Analysis Platform</p>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    PROJECT GOAL
                    ═══════════════════════════════════════════════════════════ */}
                <section className="mb-10">
                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                                <Target size={24} className="text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-3">Project Goal</h2>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    Leveraging <span className="text-cyan-400 font-semibold">Sentinel-2 Satellite Data</span> to visualize
                                    thermal anomalies, track vegetation coverage, and identify climate risks across the
                                    <span className="text-orange-400 font-semibold"> Los Angeles Basin</span>.
                                </p>
                                <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                                    This platform enables urban planners, researchers, and citizens to understand how heat islands
                                    form in urban environments and explore mitigation strategies through green space analysis.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    TECHNICAL SPECIFICATIONS
                    ═══════════════════════════════════════════════════════════ */}
                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Cpu size={18} className="text-indigo-400" />
                        Technical Specifications
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Resolution */}
                        <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <Satellite size={20} className="text-purple-400" />
                                </div>
                                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Resolution</span>
                            </div>
                            <div className="text-3xl font-bold text-white">10m</div>
                            <div className="text-slate-500 text-sm mt-1">Sentinel-2 MSI Analysis</div>
                        </div>

                        {/* Coverage */}
                        <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Map size={20} className="text-blue-400" />
                                </div>
                                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Coverage</span>
                            </div>
                            <div className="text-3xl font-bold text-white">LA Basin</div>
                            <div className="text-slate-500 text-sm mt-1">Los Angeles Metropolitan Area</div>
                        </div>

                        {/* Analysis Type */}
                        <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <Activity size={20} className="text-emerald-400" />
                                </div>
                                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Analysis</span>
                            </div>
                            <div className="text-3xl font-bold text-white">Real-Time</div>
                            <div className="text-slate-500 text-sm mt-1">Interactive 3D Visualization</div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    FEATURES
                    ═══════════════════════════════════════════════════════════ */}
                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Leaf size={18} className="text-green-400" />
                        Key Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-5 flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                            <div>
                                <h3 className="text-white font-medium">Heat Island Detection</h3>
                                <p className="text-slate-500 text-sm mt-1">Automatic identification of thermal anomalies with severity classification</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-5 flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <div>
                                <h3 className="text-white font-medium">Green Space Analysis</h3>
                                <p className="text-slate-500 text-sm mt-1">Find nearest parks and vegetation zones for mitigation planning</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-5 flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                            <div>
                                <h3 className="text-white font-medium">Neighborhood Insights</h3>
                                <p className="text-slate-500 text-sm mt-1">Jump to any LA neighborhood and explore local heat conditions</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-5 flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                            <div>
                                <h3 className="text-white font-medium">3D Visualization</h3>
                                <p className="text-slate-500 text-sm mt-1">Interactive globe with smooth camera transitions and animations</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    DATA CREDITS
                    ═══════════════════════════════════════════════════════════ */}
                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Database size={18} className="text-slate-400" />
                        Data Sources & Credits
                    </h2>

                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Satellite Data</div>
                                <div className="text-white font-semibold">ESA Copernicus</div>
                                <div className="text-slate-500 text-sm">Sentinel-2 MSI</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Earth Science</div>
                                <div className="text-white font-semibold">NASA EarthData</div>
                                <div className="text-slate-500 text-sm">LANCE Processing</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Map Data</div>
                                <div className="text-white font-semibold">OpenStreetMap</div>
                                <div className="text-slate-500 text-sm">& Mapbox GL</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    CTA
                    ═══════════════════════════════════════════════════════════ */}
                <section className="text-center">
                    <button
                        onClick={onNavigateToMap}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 active:scale-[0.98]"
                    >
                        Open Map View
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </section>

            </div>
        </div>
    );
};

export default Overview;
