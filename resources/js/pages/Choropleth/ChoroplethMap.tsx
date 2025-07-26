import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface ChoroplethProps {
    geojson: GeoJSON.FeatureCollection | null;
    days: 7 | 30 | 90;
    onMapLoad?: () => void;
}

export interface ChoroplethRef {
    resetMap: () => void;
}

const Choropleth = forwardRef<ChoroplethRef, ChoroplethProps>(({ geojson, days, onMapLoad }, ref) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const popupRef = useRef<maplibregl.Popup | null>(null);

    // Expose resetMap method to parent using useImperativeHandle
    useImperativeHandle(ref, () => ({
        resetMap: () => {
            const map = mapInstance.current;
            if (!map) return;

            map.flyTo({
                center: [124.4761, 11.6433],
                zoom: 10,
                speed: 1.2,
                curve: 1.42,
            });

            // Clean up existing choropleth layer and source
            if (map.getLayer('barangay-3d')) {
                map.removeLayer('barangay-3d');
            }
            if (map.getSource('barangays')) {
                map.removeSource('barangays');
            }
        },
    }));

    // Initialize MapLibre map once on mount
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = new maplibregl.Map({
            container: mapRef.current,
            style: 'https://api.maptiler.com/maps/streets-v2-light/style.json?key=LKaPH41xQMzKJ6a6ho42',
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

        // Add basic map controls
        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.addControl(new maplibregl.FullscreenControl(), 'top-right');
        map.addControl(new maplibregl.ScaleControl(), 'bottom-left');

        map.on('load', () => {
            onMapLoad?.();
        });

        mapInstance.current = map;
        popupRef.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
        });

        // Cleanup on unmount
        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    // Handle rendering the choropleth layer when geojson or days change
    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !geojson || geojson.features.length === 0) return;

        // Remove old choropleth layer if exists
        if (map.getLayer('barangay-3d')) map.removeLayer('barangay-3d');
        if (map.getSource('barangays')) map.removeSource('barangays');

        map.addSource('barangays', {
            type: 'geojson',
            data: geojson,
        });

        // Determine color scale based on time range
        const scaleMax = days === 90 ? 100 : days === 30 ? 50 : 10;

        map.addLayer({
            id: 'barangay-3d',
            type: 'fill-extrusion',
            source: 'barangays',
            paint: {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'value'],
                    0,
                    '#fef0d9',
                    scaleMax * 0.2,
                    '#fdcc8a',
                    scaleMax * 0.4,
                    '#fc8d59',
                    scaleMax * 0.6,
                    '#e34a33',
                    scaleMax,
                    '#b30000',
                ],
                'fill-extrusion-height': ['*', ['get', 'value'], 100],
                'fill-extrusion-opacity': 0.85,
            },
        });

        // Show popup on hover
        map.on('mousemove', 'barangay-3d', (e) => {
            const feature = e.features?.[0];
            const props = feature?.properties;
            if (!props) return;

            const popupContent = document.createElement('div');
            popupContent.className = 'text-black text-sm';
            popupContent.innerHTML = `<strong>${props['name'] ?? 'Unknown'}</strong><br/>Cases: ${props['value'] ?? 0}`;

            popupRef.current!.setLngLat(e.lngLat).setDOMContent(popupContent).addTo(map);
        });

        map.on('mouseleave', 'barangay-3d', () => {
            popupRef.current?.remove();
        });

        // Cleanup layer/source when geojson or days change
        return () => {
            if (map.getLayer('barangay-3d')) map.removeLayer('barangay-3d');
            if (map.getSource('barangays')) map.removeSource('barangays');
        };
    }, [geojson, days]);

    return <div ref={mapRef} className="h-full w-full" />;
});

export default Choropleth;
