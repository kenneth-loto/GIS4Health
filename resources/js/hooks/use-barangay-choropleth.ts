import { fetchBarangayChoroplethGeoJSON } from '@/api/barangay-choropleth-geojson';
import { useEffect, useState } from 'react';

interface Filters {
    category_id?: string;
    disease_id?: string;
    time_range?: string;
}

export function useBarangayChoropleth(filters: Filters) {
    const [geojson, setGeojson] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!filters.category_id || !filters.disease_id || !filters.time_range) return;

        setLoading(true);
        fetchBarangayChoroplethGeoJSON(filters)
            .then(setGeojson)
            .catch(() => setGeojson(null))
            .finally(() => setLoading(false));
    }, [filters]);

    return { geojson, loading };
}
