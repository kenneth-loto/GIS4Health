import { fetchBarangayGeom, fetchBarangaysByMunicipality } from '@/api/barangay';
import type { Barangay } from '@/types';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export function useBarangayOptions(municipalityId: string) {
    const shouldFetch = Boolean(municipalityId);
    const { data, error, isLoading } = useSWR<Barangay[]>(shouldFetch ? `/api/barangays/by-municipality/${municipalityId}` : null, () =>
        fetchBarangaysByMunicipality(municipalityId),
    );

    return {
        barangays: data ?? [],
        loading: isLoading,
        error,
    };
}

export function useBarangayGeom(barangayId: string) {
    const [geom, setGeom] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!barangayId) {
            setGeom(null);
            return;
        }

        setLoading(true);
        fetchBarangayGeom(barangayId)
            .then(setGeom)
            .catch(() => setGeom(null))
            .finally(() => setLoading(false));
    }, [barangayId]);

    return { geom, loading };
}
