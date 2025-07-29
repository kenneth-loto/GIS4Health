import { useBarangayGeom, useBarangayOptions } from '@/hooks/use-barangay';
import { useMunicipalitiesOption } from '@/hooks/use-municipality';
import { useSuffixesOption } from '@/hooks/useSuffix';
import { useEffect, useState } from 'react';

export function usePatientInfoLogic(form: any, open: boolean) {
    const { watch, setValue } = form;

    const selectedMunicipalityId = watch('municipality_id');
    const selectedBarangayId = watch('barangay_id');

    const { data: suffixes, loading } = useSuffixesOption();

    const { municipalities, loading: loadingMunicipalities } = useMunicipalitiesOption(open);

    const { barangays, loading: loadingBarangays } = useBarangayOptions(open ? selectedMunicipalityId : '');

    const { geom: barangayGeometry, loading: loadingBarangayGeometry } = useBarangayGeom(selectedBarangayId);

    const isBarangayDisabled = !selectedMunicipalityId;

    const [mapResetKey, setMapResetKey] = useState(0);

    useEffect(() => {
        if (!open) return;

        setValue('latitude', '');
        setValue('longitude', '');
        setMapResetKey((prev) => prev + 1);
    }, [selectedBarangayId]);

    useEffect(() => {
        if (!open) return;

        setValue('barangay_id', '');
        setValue('latitude', '');
        setValue('longitude', '');
        setMapResetKey((prev) => prev + 1);
    }, [selectedMunicipalityId]);

    return {
        suffixes,
        loading,

        municipalities,
        loadingMunicipalities,

        barangays,
        loadingBarangays,
        isBarangayDisabled,

        barangayGeometry,
        loadingBarangayGeometry,
        mapResetKey,
    };
}
