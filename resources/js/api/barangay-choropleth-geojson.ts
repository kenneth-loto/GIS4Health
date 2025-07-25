import axios from 'axios';

export async function fetchBarangayChoroplethGeoJSON(filters: { category_id?: string; disease_id?: string; time_range?: string }) {
    const res = await axios.get('/api/barangays/choropleth', {
        params: filters,
    });
    return res.data; // already in GeoJSON format
}
