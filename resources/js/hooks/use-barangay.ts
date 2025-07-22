import { fetchBarangaysByMunicipality } from '@/api/barangay';
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
