import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { api } from './lib/api';

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE: Code Splitting with React.lazy
// Heavy components are loaded on-demand to improve initial load time
// ═══════════════════════════════════════════════════════════════════════════
const MapView = lazy(() => import('./components/MapView'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const Overview = lazy(() => import('./components/Overview'));

// Static imports (lightweight components)
import NavigationSidebar from './components/NavigationSidebar';
import Alerts from './components/Alerts';
import LandingPage from './components/LandingPage';
import LayerControls from './components/LayerControls';
import Settings from './components/Settings';

// Types
type ViewType = 'home' | 'map' | 'analytics' | 'risks' | 'settings';

// ═══════════════════════════════════════════════════════════════════════════
// MAP STYLE PRESETS
// ═══════════════════════════════════════════════════════════════════════════
const MAP_STYLES = {
    dark: 'mapbox://styles/mapbox/dark-v11',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// LOADING FALLBACK (For Suspense boundaries)
// ═══════════════════════════════════════════════════════════════════════════
const LoadingFallback = ({ text = 'Loading...' }: { text?: string }) => (
    <div className="h-full w-full flex items-center justify-center bg-slate-950">
        <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3a9 9 0 0 0 3 2.8Z" />
                </svg>
            </div>
            <div className="text-slate-400 font-medium">{text}</div>
        </div>
    </div>
);

function App() {
    // ───────────────────────────────────────────────────────────────────────
    // GLOBAL STATE
    // ───────────────────────────────────────────────────────────────────────

    // Top Level State
    const [showLanding, setShowLanding] = useState(true);

    // View State
    const [activeView, setActiveView] = useState<ViewType>('map');

    // ═══════════════════════════════════════════════════════════════════════
    // GLOBAL MAP STYLE STATE (Lifted to App for cross-component access)
    // ═══════════════════════════════════════════════════════════════════════
    const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.dark);

    // Data State
    const [stats, setStats] = useState<any>({});
    const [heatIslands, setHeatIslands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedHeatIslandId, setSelectedHeatIslandId] = useState<string>();

    // Map State (Lifted for Dashboard -> Map Coordinate Targeting)
    const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lon: number } | null>(null);

    // Layer State
    const [layers, setLayers] = useState({
        temperature: true,
        heatIslands: true,
        vegetation: false
    });

    // ───────────────────────────────────────────────────────────────────────
    // DATA FETCHING
    // ───────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [tempStats, heatIslandsData, vegStats] = await Promise.all([
                    api.getTemperatureStats(),
                    api.getHeatIslands(),
                    api.getVegetationStats()
                ]);

                setStats({
                    avgTemperature: tempStats?.mean,
                    maxTemperature: tempStats?.max,
                    heatIslandsCount: heatIslandsData?.total_count || 0,
                    vegetationCoverage: vegStats?.vegetation_coverage_pct,
                    severeHeatIslands: (heatIslandsData?.severity_distribution?.extreme || 0) + (heatIslandsData?.severity_distribution?.high || 0),
                    avgNDVI: vegStats?.mean,
                    tempFullStats: tempStats
                });

                setHeatIslands(heatIslandsData?.heat_islands || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ───────────────────────────────────────────────────────────────────────
    // HANDLERS
    // ───────────────────────────────────────────────────────────────────────
    const handleStart = () => {
        setShowLanding(false);
        setActiveView('map');
    };

    const handleLayerToggle = (layer: keyof typeof layers) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    const handleLocate = useCallback((lat: number, lon: number) => {
        setFlyToTarget({ lat, lon });
        setActiveView('map');
    }, []);

    const handleHeatIslandSelect = useCallback((id: string) => {
        setSelectedHeatIslandId(id);
    }, []);

    // Clear flyTo target after it's been consumed
    const clearFlyToTarget = useCallback(() => {
        setFlyToTarget(null);
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // MAP STYLE HANDLER (Passed to Settings component)
    // ═══════════════════════════════════════════════════════════════════════
    const handleMapStyleChange = useCallback((style: string) => {
        setMapStyle(style);
    }, []);

    // ───────────────────────────────────────────────────────────────────────
    // RENDER: LANDING PAGE
    // ───────────────────────────────────────────────────────────────────────
    if (showLanding) {
        return <LandingPage onStart={handleStart} />;
    }

    // ───────────────────────────────────────────────────────────────────────
    // RENDER: MAIN APPLICATION
    // ───────────────────────────────────────────────────────────────────────
    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-orange-500/30">

            {/* Navigation Sidebar */}
            <NavigationSidebar activeView={activeView} onViewChange={(v) => setActiveView(v as ViewType)} />

            {/* Main Content */}
            <main className="relative flex-1 h-full overflow-hidden">

                {/* ═══════════════════════════════════════════════════════════════
                    HOME / OVERVIEW VIEW (Education & Project Info)
                    ═══════════════════════════════════════════════════════════════ */}
                {activeView === 'home' && (
                    <Suspense fallback={<LoadingFallback text="Loading Overview..." />}>
                        <Overview onNavigateToMap={() => setActiveView('map')} />
                    </Suspense>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    MAP VIEW (Main Geospatial Interface)
                    ═══════════════════════════════════════════════════════════════ */}
                {activeView === 'map' && (
                    <>
                        <LayerControls layers={layers} onLayerToggle={handleLayerToggle} />
                        <Suspense fallback={<LoadingFallback text="Loading Atlas..." />}>
                            <MapView
                                layers={layers}
                                heatIslands={heatIslands}
                                flyToTarget={flyToTarget}
                                selectedHeatIslandId={selectedHeatIslandId}
                                onFlyToComplete={clearFlyToTarget}
                                mapStyle={mapStyle}
                            />
                        </Suspense>
                        {loading && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                                <div className="text-orange-500 font-bold animate-pulse">Initializing Data Stream...</div>
                            </div>
                        )}
                    </>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    ANALYTICS VIEW (Dashboard & Statistics)
                    ═══════════════════════════════════════════════════════════════ */}
                {activeView === 'analytics' && (
                    <Suspense fallback={<LoadingFallback text="Loading Analytics..." />}>
                        <AnalyticsDashboard
                            stats={stats}
                            heatIslands={heatIslands}
                            loading={loading}
                            onLocate={handleLocate}
                            selectedHeatIslandId={selectedHeatIslandId}
                            onHeatIslandSelect={handleHeatIslandSelect}
                        />
                    </Suspense>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    ALERTS / RISKS VIEW
                    ═══════════════════════════════════════════════════════════════ */}
                {activeView === 'risks' && <Alerts />}

                {/* ═══════════════════════════════════════════════════════════════
                    SETTINGS VIEW (Control Center with Map Style Toggle)
                    ═══════════════════════════════════════════════════════════════ */}
                {activeView === 'settings' && (
                    <Settings
                        currentStyle={mapStyle}
                        onStyleChange={handleMapStyleChange}
                    />
                )}

            </main>
        </div>
    );
}

export default App;
