import axios from 'axios';

export async function fetchHeatMapGeoJSON(filters: {
    category_id?: string;
    disease_id?: string;
    municipality_id?: string;
    barangay_id?: string;
    severity_id?: string;
    from?: string;
    to?: string;
}) {
    const res = await axios.get('/api/heatmap', {
        params: filters,
    });
    return res.data; // already in GeoJSON format
}

// export async function fetchHeatmapGeoJSON(): Promise<GeoJSON.FeatureCollection> {
//     const res = await axios.get('/api/heatmap/geojson');
//     return res.data;
// }
