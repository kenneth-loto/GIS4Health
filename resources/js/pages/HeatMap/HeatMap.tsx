import bbox from '@turf/bbox';
import { feature } from '@turf/helpers';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface HeatMapProps {
    geojson: (GeoJSON.FeatureCollection & { geometry?: GeoJSON.Geometry }) | null;
    onMapLoad?: () => void;
}

export interface HeatMapRef {
    resetMap: () => void;
}

const HeatMap = forwardRef<HeatMapRef, HeatMapProps>(({ geojson, onMapLoad }, ref) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<maplibregl.Map | null>(null);

    // Imperative reset function to re-center and clear layers
    useImperativeHandle(ref, () => ({
        resetMap: () => {
            const map = mapInstanceRef.current;
            if (!map) return;

            // ✅ Smooth transition to default center/zoom
            map.flyTo({
                center: [124.4761, 11.6433],
                zoom: 10,
                speed: 1.2,
                curve: 1.42,
            });

            // ✅ Remove existing layers and source
            if (map.getLayer('health-heatmap-layer')) map.removeLayer('health-heatmap-layer');
            if (map.getLayer('health-circle-layer')) map.removeLayer('health-circle-layer');
            if (map.getSource('health-heatmap')) map.removeSource('health-heatmap');
        },
    }));

    // Initialize map
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = new maplibregl.Map({
            container: mapRef.current,
            style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=LKaPH41xQMzKJ6a6ho42',
            center: [124.4761, 11.6433],
            zoom: 10,
            pitch: 45,
            bearing: -17.6,
            minZoom: 9,
            maxBounds: [
                [124.4761 - 0.5, 11.6433 - 0.5],
                [124.4761 + 0.5, 11.6433 + 0.5],
            ],
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.addControl(new maplibregl.FullscreenControl(), 'top-right');
        map.addControl(new maplibregl.ScaleControl(), 'bottom-left');
        // map.addControl(new LegendControl(), 'bottom-left');

        mapInstanceRef.current = map;

        map.on('load', () => {
            onMapLoad?.();
        });

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Load or update geojson heatmap layers
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !map.isStyleLoaded() || !geojson) return;

        // Zoom to bounding box if geometry exists
        if (geojson.geometry) {
            try {
                const geometryFeature = feature(geojson.geometry);
                const bounds = bbox(geometryFeature);
                map.fitBounds(bounds as [number, number, number, number], {
                    padding: 40,
                    duration: 1000,
                });
            } catch (e) {
                console.warn('Failed to compute bounds for geometry:', e);
            }
        }

        const sourceId = 'health-heatmap';

        // Update source if already present
        if (map.getSource(sourceId)) {
            (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
            return;
        }

        // Add new source and layers
        map.addSource(sourceId, {
            type: 'geojson',
            data: geojson,
        });

        map.addLayer({
            id: 'health-heatmap-layer',
            type: 'heatmap',
            source: sourceId,
            paint: {
                'heatmap-weight': ['interpolate', ['linear'], ['get', 'weight'], 0.2, 0, 1, 0.9],
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 8, 0.3, 10, 0.8, 13, 1.5],
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0,
                    'rgba(33,102,172,0)',
                    0.3,
                    'rgb(103,169,207)',
                    0.5,
                    'rgb(209,229,240)',
                    0.7,
                    'rgb(253,219,199)',
                    0.9,
                    'rgb(239,138,98)',
                    1,
                    'rgb(178,24,43)',
                ],
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 8, 2, 10, 8, 13, 16],
                'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 11, 1, 14, 0],
            },
        });

        map.addLayer({
            id: 'health-circle-layer',
            type: 'circle',
            source: sourceId,
            minzoom: 12,
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    12,
                    ['interpolate', ['linear'], ['get', 'weight'], 0.2, 1.5, 1, 5],
                    16,
                    ['interpolate', ['linear'], ['get', 'weight'], 0.2, 2.5, 1, 7],
                ],
                'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'weight'],
                    0.1,
                    'rgba(33,102,172,0)',
                    0.2,
                    'rgba(103,169,207,0.3)',
                    0.4,
                    'rgba(209,229,240,0.6)',
                    0.6,
                    'rgba(253,219,199,0.7)',
                    0.8,
                    'rgba(239,138,98,0.9)',
                    1.0,
                    'rgba(178,24,43,1)',
                ],
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 13, 1],
            },
        });
    }, [geojson]);

    return <div ref={mapRef} className="h-full w-full" />;
});

export default HeatMap;
