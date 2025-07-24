import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { feature, point } from '@turf/helpers';
import type { FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson';
import maplibregl, { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_CENTER: [number, number] = [124.47612493038605, 11.643319214056731];
const DEFAULT_ZOOM = 8.8;

type Props = {
    geom?: Geometry;
    loadingGeometry?: boolean;
    onSelectCoordinates?: (lat: number, lng: number) => void;
    resetMap?: number | string | boolean;
    initialLatitude?: number;
    initialLongitude?: number;
};

export default function MapComponent({ geom, loadingGeometry, onSelectCoordinates, resetMap, initialLatitude, initialLongitude }: Props) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const popupRef = useRef<Popup | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const [mapLoading, setMapLoading] = useState(true);

    // ------------------------------------------
    // 1. Initialize map once on mount
    // ------------------------------------------
    useEffect(() => {
        if (mapRef.current || !mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
        });

        map.once('load', () => {
            setMapReady(true);
            setMapLoading(false);
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // ------------------------------------------
    // 2. Click to place marker (with boundary check)
    // ------------------------------------------
    useEffect(() => {
        if (!mapReady || !mapRef.current) return;

        const map = mapRef.current;

        const handleClick = (e: maplibregl.MapMouseEvent) => {
            const { lng, lat } = e.lngLat;

            // If geometry exists, ensure point is inside it
            if (geom && geom.type !== 'GeometryCollection') {
                const shape = feature(geom as Polygon | MultiPolygon);
                const inside = booleanPointInPolygon(point([lng, lat]), shape);

                if (!inside) {
                    popupRef.current?.remove();
                    const popup = new maplibregl.Popup({ closeOnClick: true })
                        .setLngLat([lng, lat])
                        .setHTML('<div style="color:red;">Outside Barangay Boundary</div>')
                        .addTo(map);
                    popupRef.current = popup;
                    setTimeout(() => popup.remove(), 1000);
                    return;
                }
            }

            // Place or move marker
            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new maplibregl.Marker({ color: '#d00' }).setLngLat([lng, lat]).addTo(map);
            }

            onSelectCoordinates?.(lat, lng);
        };

        map.on('click', handleClick);
        // return () => map.off('click', handleClick);
        return () => {
            map.off('click', handleClick);
        };
    }, [geom, mapReady]);

    // ------------------------------------------
    // 3. Draw barangay boundary (GeoJSON line only)
    // ------------------------------------------
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapReady || !geom || geom.type === 'GeometryCollection') return;

        const sourceId = 'barangay-geom';
        const lineLayerId = `${sourceId}-line`;

        const geojson: FeatureCollection = {
            type: 'FeatureCollection',
            features: [feature(geom)],
        };

        const drawGeometry = () => {
            if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
            if (map.getSource(sourceId)) map.removeSource(sourceId);

            map.addSource(sourceId, { type: 'geojson', data: geojson });
            map.addLayer({
                id: lineLayerId,
                type: 'line',
                source: sourceId,
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 2,
                },
            });

            map.fitBounds(bbox(geojson) as [number, number, number, number], {
                padding: 40,
                duration: 1000,
            });

            markerRef.current?.remove();
            markerRef.current = null;
        };

        map.isStyleLoaded() ? drawGeometry() : map.once('styledata', drawGeometry);
    }, [geom, mapReady]);

    // ------------------------------------------
    // 4. Reset map view and cleanup on resetMap change
    // ------------------------------------------
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapReady) return;

        map.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 1000 });

        markerRef.current?.remove();
        markerRef.current = null;

        const sourceId = 'barangay-geom';
        const lineLayerId = `${sourceId}-line`;

        if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
    }, [resetMap, mapReady]);

    // ------------------------------------------
    // 5. Drop marker when editing existing coordinates
    // ------------------------------------------
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapReady || initialLatitude === undefined || initialLongitude === undefined) return;

        const lngLat: [number, number] = [initialLongitude, initialLatitude];

        if (markerRef.current) {
            markerRef.current.setLngLat(lngLat);
        } else {
            markerRef.current = new maplibregl.Marker({ color: '#d00' }).setLngLat(lngLat).addTo(map);
        }

        if (!geom) {
            map.flyTo({ center: lngLat });
        }
    }, [initialLatitude, initialLongitude, geom, mapReady]);

    // ------------------------------------------
    // 6. Render map container + loading overlays
    // ------------------------------------------
    return (
        <div className="relative h-[40vh] w-full overflow-hidden rounded-lg">
            {(mapLoading || loadingGeometry) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/100 text-sm text-gray-700">
                    {mapLoading && 'Loading map...'}
                    {loadingGeometry && !mapLoading && 'Loading barangay boundary...'}
                </div>
            )}
            <div ref={mapContainer} className="h-full w-full" />
        </div>
    );
}
