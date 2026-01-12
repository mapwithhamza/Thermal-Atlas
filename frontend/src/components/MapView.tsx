import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import Map, { NavigationControl, FullscreenControl, MapRef } from 'react-map-gl';
import { GeoJsonLayer, ScatterplotLayer, ArcLayer } from '@deck.gl/layers';
import { FlyToInterpolator } from '@deck.gl/core';
import axios from 'axios';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import distance from '@turf/distance';
// @ts-ignore
import Draggable from 'react-draggable';

import MapControlPanel from './MapControlPanel';

// ═══════════════════════════════════════════════════════════════════════════
// SAFETY GUARD: Coordinate Validation (Crash Prevention)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validates geographic coordinates to prevent WebGL/Map crashes
 * Returns false for NaN, undefined, null, or out-of-bounds values
 */
const isValidCoordinate = (lat: number, lon: number): boolean => {
    if (typeof lat !== 'number' || typeof lon !== 'number') return false;
    if (isNaN(lat) || isNaN(lon)) return false;
    if (!isFinite(lat) || !isFinite(lon)) return false;
    if (lat < -90 || lat > 90) return false;
    if (lon < -180 || lon > 180) return false;
    return true;
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface MapViewProps {
    flyToTarget?: { lat: number; lon: number } | null;
    selectedHeatIslandId?: string | null;
    onFlyToComplete?: () => void;
    layers?: {
        heatIslands: boolean;
        temperature: boolean;
        vegetation: boolean;
    };
    heatIslands?: any[];
    mapStyle?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

const LA_PARKS = [
    { name: 'Griffith Park', lat: 34.1365, lon: -118.2942 },
    { name: 'Elysian Park', lat: 34.0838, lon: -118.2376 },
    { name: 'Kenneth Hahn Rec Area', lat: 34.0085, lon: -118.3644 },
    { name: 'Hansen Dam', lat: 34.2585, lon: -118.3779 },
    { name: 'Exposition Park', lat: 34.0183, lon: -118.2861 },
    { name: 'MacArthur Park', lat: 34.0594, lon: -118.2796 },
    { name: 'Echo Park', lat: 34.0728, lon: -118.2606 },
    { name: 'Grand Park', lat: 34.0564, lon: -118.2467 },
    { name: 'Vista Hermosa', lat: 34.0657, lon: -118.2656 },
    { name: 'Lafayette Park', lat: 34.0607, lon: -118.2914 }
];

const INITIAL_VIEW_STATE = {
    longitude: -118.25, latitude: 34.05, zoom: 10, pitch: 45, bearing: 0,
    transitionDuration: 2000, transitionInterpolator: new FlyToInterpolator()
};

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const MapView: React.FC<MapViewProps> = ({
    flyToTarget,
    selectedHeatIslandId,
    layers: activeLayersProp,
    heatIslands: externalHeatIslands,
    onFlyToComplete,
    mapStyle = 'mapbox://styles/mapbox/dark-v11'
}) => {
    // ───────────────────────────────────────────────────────────────────────
    // STATE
    // ───────────────────────────────────────────────────────────────────────
    const [heatIslands, setHeatIslands] = useState<any[]>([]);
    const [selectedIsland, setSelectedIsland] = useState<any>(null);
    const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
    const [neighborhoods, setNeighborhoods] = useState<any>(null);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const [animationTime, setAnimationTime] = useState(0);

    const infoRef = useRef(null);
    const mapRef = useRef<MapRef>(null);

    // ───────────────────────────────────────────────────────────────────────
    // DATA LOADING
    // ───────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (externalHeatIslands && externalHeatIslands.length > 0) {
            setHeatIslands(externalHeatIslands);
        } else {
            const loadData = async () => {
                try {
                    const [hiRes, hoodRes] = await Promise.all([
                        axios.get('http://localhost:5000/api/heat-islands/all').catch(() => ({ data: { heat_islands: [] } })),
                        fetch('/data/la_neighborhoods.geojson').then(r => r.json())
                    ]);
                    const validIslands = (hiRes.data.heat_islands || []).filter((hi: any) => hi.lat && hi.lon);
                    setHeatIslands(validIslands);
                    setNeighborhoods(hoodRes);
                } catch (e) { console.error(e); }
            };
            loadData();
        }
    }, [externalHeatIslands]);

    useEffect(() => {
        if (!neighborhoods) {
            fetch('/data/la_neighborhoods.geojson').then(r => r.json()).then(setNeighborhoods).catch(console.error);
        }
    }, []);

    // ───────────────────────────────────────────────────────────────────────
    // ANIMATION LOOP (Radar Pulse Effect - 60fps)
    // ───────────────────────────────────────────────────────────────────────
    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            const now = Date.now();
            setAnimationTime(now);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // ───────────────────────────────────────────────────────────────────────
    // HELPERS
    // ───────────────────────────────────────────────────────────────────────
    const getNeighborhoodName = (lon: number, lat: number) => {
        if (!neighborhoods) return null;
        const pt = point([lon, lat]);
        for (const feature of neighborhoods.features) {
            if (booleanPointInPolygon(pt as any, feature as any)) {
                return { name: feature.properties.name };
            }
        }
        return { name: "Outside LA City" };
    };

    const findNearestParks = useCallback((island: any) => {
        if (!island) return [];
        const pt = point([island.lon, island.lat]);
        return LA_PARKS.map(p => ({
            ...p,
            distance: distance(pt as any, point([p.lon, p.lat]) as any, { units: 'kilometers' })
        })).sort((a, b) => a.distance - b.distance).slice(0, 3);
    }, []);

    // ───────────────────────────────────────────────────────────────────────
    // HANDLERS (With Safety Guards)
    // ───────────────────────────────────────────────────────────────────────
    const handleFlyTo = useCallback((lat: number, lon: number, zoom = 14) => {
        if (!isValidCoordinate(lat, lon)) {
            console.warn('handleFlyTo blocked: invalid coordinates', { lat, lon });
            return;
        }

        setViewState(prev => ({
            ...prev, longitude: lon, latitude: lat, zoom, pitch: 60,
            transitionDuration: 2000, transitionInterpolator: new FlyToInterpolator()
        }));
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // DYNAMIC BOUNDING BOX ZOOM (Focus on Analysis)
    // Called directly when "Find Green Spaces" is clicked
    // ═══════════════════════════════════════════════════════════════════════
    const focusOnAnalysis = useCallback((island: any) => {
        if (!island || !isValidCoordinate(island.lat, island.lon)) {
            console.warn('focusOnAnalysis: invalid island coordinates');
            return;
        }

        // Get the 3 nearest parks
        const parks = findNearestParks(island);
        if (parks.length === 0) {
            console.warn('focusOnAnalysis: no parks found');
            return;
        }

        // Collect all 4 coordinates: Heat Island + 3 Parks
        const allPoints = [
            { lat: island.lat, lon: island.lon },
            ...parks.map(p => ({ lat: p.lat, lon: p.lon }))
        ];

        // ─────────────────────────────────────────────────────────────────
        // CALCULATE BOUNDING BOX
        // ─────────────────────────────────────────────────────────────────
        const lats = allPoints.map(p => p.lat);
        const lons = allPoints.map(p => p.lon);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        // Calculate center point
        const centerLat = (minLat + maxLat) / 2;
        const centerLon = (minLon + maxLon) / 2;

        // Calculate the spread (difference)
        const latDiff = maxLat - minLat;
        const lonDiff = maxLon - minLon;
        const maxDiff = Math.max(latDiff, lonDiff);

        // ─────────────────────────────────────────────────────────────────
        // CALCULATE ZOOM LEVEL
        // Heuristic: larger spread = lower zoom
        // Formula: zoom = 14 - log2(maxDiff * 100)
        // - Parks 2km away (~0.02°): zoom ≈ 13
        // - Parks 10km away (~0.1°): zoom ≈ 11
        // - Parks 20km away (~0.2°): zoom ≈ 10
        // ─────────────────────────────────────────────────────────────────
        let calculatedZoom: number;

        if (maxDiff <= 0) {
            calculatedZoom = 14; // Default if all points are the same
        } else {
            calculatedZoom = 14 - Math.log2(maxDiff * 100);
        }

        // Clamp zoom between 9 and 14 for reasonable viewing
        calculatedZoom = Math.max(9, Math.min(14, calculatedZoom));

        // ═══════════════════════════════════════════════════════════════════
        // ZOOM TWEAK: Add +0.8 to make camera TIGHTER (closer to ground)
        // User feedback: previous -0.5 was too far out
        // ═══════════════════════════════════════════════════════════════════
        const finalZoom = calculatedZoom + 0.8;

        console.log('📍 Dynamic Bounding Box Zoom:', {
            island: island.id,
            parks: parks.map(p => `${p.name} (${p.distance.toFixed(1)}km)`),
            bounds: { minLat, maxLat, minLon, maxLon },
            center: { centerLat, centerLon },
            spread: { latDiff: latDiff.toFixed(4), lonDiff: lonDiff.toFixed(4) },
            calculatedZoom: calculatedZoom.toFixed(1),
            finalZoom: finalZoom.toFixed(1)
        });

        // ─────────────────────────────────────────────────────────────────
        // ANIMATE CAMERA TO BOUNDING BOX CENTER (Tighter framing)
        // ─────────────────────────────────────────────────────────────────
        setViewState(prev => ({
            ...prev,
            longitude: centerLon,
            latitude: centerLat,
            zoom: finalZoom,
            pitch: 45,
            bearing: 0,
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator()
        }));
    }, [findNearestParks]);

    // ───────────────────────────────────────────────────────────────────────
    // "FIND GREEN SPACES" BUTTON HANDLER
    // ───────────────────────────────────────────────────────────────────────
    const handleFindGreenSpaces = useCallback(() => {
        if (!selectedIsland) return;

        // Set analysis mode to show arcs
        setShowAnalysis(true);

        // Trigger dynamic bounding box zoom
        focusOnAnalysis(selectedIsland);
    }, [selectedIsland, focusOnAnalysis]);

    // ───────────────────────────────────────────────────────────────────────
    // PROP WATCHERS (With Safety Guards)
    // ───────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (selectedHeatIslandId && heatIslands.length > 0) {
            const island = heatIslands.find(h => h.id === selectedHeatIslandId);
            if (island) {
                setSelectedIsland(island);
                setShowAnalysis(false);
            }
        }
    }, [selectedHeatIslandId, heatIslands]);

    useEffect(() => {
        // SAFETY GUARD: Strict validation for flyToTarget (Crash Prevention)
        if (!flyToTarget ||
            typeof flyToTarget.lat !== 'number' ||
            typeof flyToTarget.lon !== 'number' ||
            isNaN(flyToTarget.lat) ||
            isNaN(flyToTarget.lon)) {
            return;
        }

        if (!isValidCoordinate(flyToTarget.lat, flyToTarget.lon)) {
            console.warn('flyToTarget blocked: coordinates out of bounds', flyToTarget);
            if (onFlyToComplete) onFlyToComplete();
            return;
        }

        handleFlyTo(flyToTarget.lat, flyToTarget.lon);

        const target = heatIslands.find(h =>
            Math.abs(h.lat - flyToTarget.lat) < 0.0001 &&
            Math.abs(h.lon - flyToTarget.lon) < 0.0001
        );
        if (target) {
            setSelectedIsland(target);
            setShowAnalysis(false);
        }

        if (onFlyToComplete) {
            setTimeout(onFlyToComplete, 500);
        }
    }, [flyToTarget, heatIslands, handleFlyTo, onFlyToComplete]);

    const handleHeatIslandClick = (info: any) => {
        if (info?.object) {
            if (!isValidCoordinate(info.object.lat, info.object.lon)) {
                console.warn('Heat island click blocked: invalid coordinates');
                return;
            }
            setSelectedIsland(info.object);
            setShowAnalysis(false);
            handleFlyTo(info.object.lat, info.object.lon);
        } else {
            setSelectedIsland(null);
            setShowAnalysis(false);
        }
    };

    const handleReset = () => {
        setViewState(INITIAL_VIEW_STATE);
        setSelectedIsland(null);
        setShowAnalysis(false);
    };

    // ───────────────────────────────────────────────────────────────────────
    // LAYERS (All strokes use lineWidthUnits: 'pixels' for sharp rendering)
    // ───────────────────────────────────────────────────────────────────────
    const layers = useMemo(() => {
        const activeLayers: any[] = [];

        // BOUNDARIES (Pixel-based: stays crisp at all zoom levels)
        activeLayers.push(
            // County Boundary - Glow
            new GeoJsonLayer({
                id: 'la-county-glow',
                data: '/data/LA_County_Boundary.geojson',
                stroked: true,
                filled: false,
                getLineColor: [0, 255, 255, 40],
                getLineWidth: 6,
                lineWidthUnits: 'pixels',
                lineWidthMinPixels: 2,
                lineWidthMaxPixels: 8
            }),
            // County Boundary - Core
            new GeoJsonLayer({
                id: 'la-county-core',
                data: '/data/LA_County_Boundary.geojson',
                stroked: true,
                filled: false,
                getLineColor: [0, 255, 255, 150],
                getLineWidth: 2,
                lineWidthUnits: 'pixels',
                lineWidthMinPixels: 1,
                lineWidthMaxPixels: 3
            }),
            // City Boundary - Glow
            new GeoJsonLayer({
                id: 'la-city-glow',
                data: '/data/la_boundary.geojson',
                stroked: true,
                filled: true,
                getFillColor: [255, 0, 255, 5],
                getLineColor: [255, 0, 150, 50],
                getLineWidth: 8,
                lineWidthUnits: 'pixels',
                lineWidthMinPixels: 3,
                lineWidthMaxPixels: 10
            }),
            // City Boundary - Core
            new GeoJsonLayer({
                id: 'la-city-core',
                data: '/data/la_boundary.geojson',
                stroked: true,
                filled: false,
                getLineColor: [255, 0, 150, 200],
                getLineWidth: 2,
                lineWidthUnits: 'pixels',
                lineWidthMinPixels: 1,
                lineWidthMaxPixels: 3
            })
        );

        // Neighborhoods (subtle)
        if (neighborhoods) {
            activeLayers.push(new GeoJsonLayer({
                id: 'hoods',
                data: neighborhoods,
                stroked: true,
                filled: false,
                getLineColor: [100, 116, 139, 40],
                getLineWidth: 1,
                lineWidthUnits: 'pixels'
            }));
        }

        // PARKS (Green markers)
        activeLayers.push(
            new ScatterplotLayer({
                id: 'parks',
                data: LA_PARKS,
                getPosition: (d: any) => [d.lon, d.lat],
                getRadius: 8,
                radiusUnits: 'pixels',
                getFillColor: [34, 197, 94, 200],
                getLineColor: [16, 120, 60, 255],
                getLineWidth: 2,
                lineWidthUnits: 'pixels',
                pickable: true
            })
        );

        // HEAT ISLANDS
        if (!activeLayersProp || activeLayersProp.heatIslands) {
            activeLayers.push(
                new ScatterplotLayer({
                    id: 'heat-islands',
                    data: heatIslands,
                    getPosition: (d: any) => [d.lon, d.lat],
                    getRadius: (d: any) => Math.max(6, d.intensity * 1.5),
                    radiusUnits: 'pixels',
                    getFillColor: (d: any) => {
                        const colors: any = {
                            extreme: [239, 68, 68],
                            high: [249, 115, 22],
                            medium: [234, 179, 8],
                            low: [250, 204, 21]
                        };
                        return [...(colors[d.severity] || [200, 200, 200]), 200] as [number, number, number, number];
                    },
                    getLineColor: [255, 255, 255, 150],
                    getLineWidth: 1,
                    lineWidthUnits: 'pixels',
                    pickable: true,
                    onClick: handleHeatIslandClick,
                    autoHighlight: true,
                    highlightColor: [255, 255, 255, 100]
                })
            );
        }

        // RADAR PULSE ANIMATION (Professional Sonar Effect)
        if (selectedIsland && isValidCoordinate(selectedIsland.lat, selectedIsland.lon)) {
            // RING 1: Core (Static, always visible)
            activeLayers.push(
                new ScatterplotLayer({
                    id: 'radar-core',
                    data: [selectedIsland],
                    getPosition: (d: any) => [d.lon, d.lat],
                    getRadius: 12,
                    radiusUnits: 'pixels',
                    stroked: true,
                    filled: true,
                    getFillColor: [0, 255, 255, 25],
                    getLineColor: [0, 255, 255, 255],
                    getLineWidth: 3,
                    lineWidthUnits: 'pixels'
                })
            );

            // RING 2-4: Expanding Pulse Rings (Staggered, fading)
            for (let i = 0; i < 3; i++) {
                const cycleDuration = 2000;
                const phase = ((animationTime / cycleDuration) + (i * 0.33)) % 1;
                const radius = 20 + phase * 60;
                const opacity = Math.floor(180 * (1 - phase));

                activeLayers.push(
                    new ScatterplotLayer({
                        id: `radar-pulse-${i}`,
                        data: [selectedIsland],
                        getPosition: (d: any) => [d.lon, d.lat],
                        getRadius: radius,
                        radiusUnits: 'pixels',
                        stroked: true,
                        filled: false,
                        getLineColor: [0, 255, 255, opacity],
                        getLineWidth: 2,
                        lineWidthUnits: 'pixels',
                        updateTriggers: {
                            getRadius: animationTime,
                            getLineColor: animationTime
                        }
                    })
                );
            }
        }

        // 3D ARCS (Green Spaces Analysis)
        if (selectedIsland && showAnalysis) {
            const parks = findNearestParks(selectedIsland);
            activeLayers.push(
                new ArcLayer({
                    id: 'connections',
                    data: parks.map(p => ({ source: p, target: selectedIsland })),
                    getSourcePosition: (d: any) => [d.source.lon, d.source.lat],
                    getTargetPosition: (d: any) => [d.target.lon, d.target.lat],
                    getSourceColor: [34, 197, 94, 255],
                    getTargetColor: [239, 68, 68, 255],
                    getWidth: 4,
                    getHeight: 0.3,
                    greatCircle: true
                })
            );

            // Highlight connected parks
            activeLayers.push(
                new ScatterplotLayer({
                    id: 'connected-parks',
                    data: parks,
                    getPosition: (d: any) => [d.lon, d.lat],
                    getRadius: 14,
                    radiusUnits: 'pixels',
                    stroked: true,
                    filled: false,
                    getLineColor: [34, 197, 94, 255],
                    getLineWidth: 3,
                    lineWidthUnits: 'pixels'
                })
            );
        }

        return activeLayers;
    }, [viewState.zoom, heatIslands, neighborhoods, selectedIsland, showAnalysis, activeLayersProp, animationTime, findNearestParks]);

    // ───────────────────────────────────────────────────────────────────────
    // TOOLTIP (Dark themed)
    // ───────────────────────────────────────────────────────────────────────
    const getTooltip = ({ object }: any) => {
        if (!object) return null;
        if (object.avg_temp) {
            const loc = getNeighborhoodName(object.lon, object.lat);
            return {
                html: `
                    <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155; min-width: 200px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="color: #cbd5e1; font-size: 10px; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Heat Island Overview</div>
                        <div style="color: #06b6d4; font-size: 11px; font-weight: 600; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px;">📍 ${loc?.name || 'Loading...'}</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; color: #e2e8f0; font-size: 12px;">
                            <div>Avg Temp:</div><div style="text-align: right; font-weight: 700;">${object.avg_temp}°C</div>
                            <div>Intensity:</div><div style="text-align: right; font-weight: 700; color: #fbbf24;">+${object.intensity}°C</div>
                        </div>
                    </div>
                `,
                style: { pointerEvents: 'none' }
            };
        }
        if (object.name) {
            return {
                html: `<div style="background: #064e3b; padding: 8px 12px; border-radius: 6px; color: white; font-weight: 600; border: 1px solid #34d399; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🌲 ${object.name}</div>`
            };
        }
        return null;
    };

    if (!MAPBOX_TOKEN) return <div className="text-white p-10 bg-red-900">⚠️ Mapbox Token Missing</div>;

    const locInfo = selectedIsland ? getNeighborhoodName(selectedIsland.lon, selectedIsland.lat) : null;

    return (
        <div className="relative w-full h-full bg-slate-950">
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                viewState={viewState}
                onViewStateChange={(e: any) => setViewState(e.viewState)}
                controller={true}
                layers={layers}
                getTooltip={getTooltip}
                getCursor={({ isHovering }: any) => isHovering ? 'pointer' : 'grab'}
            >
                <Map
                    ref={mapRef}
                    mapboxAccessToken={MAPBOX_TOKEN}
                    mapStyle={mapStyle}
                >
                    <NavigationControl position="top-right" />
                    <FullscreenControl position="top-right" />
                </Map>
            </DeckGL>

            <MapControlPanel neighborhoods={neighborhoods} onSelectLocation={handleFlyTo} onReset={handleReset} />

            {/* DRAGGABLE INFO PANEL */}
            {selectedIsland && (
                <Draggable nodeRef={infoRef}>
                    <div ref={infoRef} className="absolute bottom-10 left-10 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-6 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 cursor-move text-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">Heat Island {selectedIsland.id.replace('hi_', '#')}</h3>
                                {locInfo && <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">{locInfo.name}</div>}
                            </div>
                            <button onClick={() => setSelectedIsland(null)} className="text-slate-500 hover:text-white transition-colors">✕</button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Intensity</div>
                                <div className="text-xl font-mono font-bold text-orange-400">+{selectedIsland.intensity}°C</div>
                            </div>
                            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Max Temp</div>
                                <div className="text-xl font-mono font-bold text-white">{selectedIsland.max_temp}°C</div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════════════════════
                            PURPLE "FIND GREEN SPACES" BUTTON
                            Calls handleFindGreenSpaces which triggers focusOnAnalysis
                            ═══════════════════════════════════════════════════════════ */}
                        {!showAnalysis ? (
                            <button
                                onClick={handleFindGreenSpaces}
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 active:scale-[0.98]"
                            >
                                🌳 Find Green Spaces
                            </button>
                        ) : (
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="text-xs font-bold text-green-400 border-b border-white/10 pb-1 uppercase tracking-wider">Nearest Parks</div>
                                {findNearestParks(selectedIsland).map((p: any) => (
                                    <div key={p.name} className="flex justify-between text-sm text-slate-300 py-1">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            {p.name}
                                        </span>
                                        <span className="font-mono text-slate-500">{p.distance.toFixed(1)}km</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Draggable>
            )}
        </div>
    );
};

export default MapView;
