import { fetchHeatMapGeoJSON } from '@/api/heatmap';
import { useEffect, useState } from 'react';

interface HeatMapFilters {
    category_id: string;
    disease_id: string;
    municipality_id?: string;
    barangay_id?: string;
    severity_id?: string;
    from?: string;
    to?: string;
}

export function useHeatMap(filters: HeatMapFilters) {
    const [geojson, setGeojson] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!filters.category_id || !filters.disease_id) return;

        setLoading(true);
        fetchHeatMapGeoJSON(filters)
            .then(setGeojson)
            .catch(() => setGeojson(null))
            .finally(() => setLoading(false));
    }, [filters]);

    return { geojson, loading };
}
