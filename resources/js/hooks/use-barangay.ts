import { fetchBarangayGeom, fetchBarangaysByMunicipality } from '@/api/barangay';
import type { Barangay } from '@/types';
import { useEffect, useState } from 'react';

export function useBarangayOptions(municipalityId: string) {
    const [barangays, setBarangays] = useState<Barangay[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!municipalityId) {
            setBarangays([]);
            return;
        }

        setLoading(true);
        fetchBarangaysByMunicipality(municipalityId)
            .then(setBarangays)
            .catch(() => setBarangays([]))
            .finally(() => setLoading(false));
    }, [municipalityId]);

    return { barangays, loading };
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
