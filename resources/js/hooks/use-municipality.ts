import { fetchMunicipalitiesOption } from '@/api/municipality';
import type { Municipality } from '@/types';
import { useEffect, useState } from 'react';

// 🔹 Simple list fetch (used in dialogs)
export function useMunicipalitiesOption(dialogOpen: boolean = true) {
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!dialogOpen) return;

        setLoading(true);

        fetchMunicipalitiesOption()
            .then((res) => {
                setMunicipalities(res);
            })
            .catch(() => {
                setMunicipalities([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dialogOpen]);

    return { municipalities, loading };
}
