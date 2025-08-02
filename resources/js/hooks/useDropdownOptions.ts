import { useBarangayFilteredGeom, useBarangaysByMunicipalityOptionList } from '@/hooks/useBarangay';
import { useCategoriesOptionList } from '@/hooks/useCategory';
import { useDiseasesByCategoryOptionList } from '@/hooks/useDisease';
import { useMunicipalitiesOptionList } from '@/hooks/useMunicipality';
import { usePatientInfosOptionList } from '@/hooks/usePatientInfo';
import { useSeveritiesOptionList } from '@/hooks/useSeverity';
import { useSuffixesOptionList } from '@/hooks/useSuffix';
import { UseFormReturn } from 'react-hook-form';

type DropdownKey = 'patient_infos' | 'categories' | 'municipalities' | 'severities' | 'suffixes' | 'diseases' | 'barangays' | 'barangayGeometry';

interface UseDropdownOptionsConfig {
    include: DropdownKey[];
}

export function useDropdownOptions(form: UseFormReturn<any>, config: UseDropdownOptionsConfig) {
    const { watch } = form;

    const selectedCategoryId = watch('category_id');
    const selectedMunicipalityId = watch('municipality_id');
    const selectedBarangayId = watch('barangay_id');

    const patientInfos = usePatientInfosOptionList();
    const categories = useCategoriesOptionList();
    const municipalities = useMunicipalitiesOptionList();
    const severities = useSeveritiesOptionList();
    const suffixes = useSuffixesOptionList();
    const diseases = useDiseasesByCategoryOptionList(selectedCategoryId);
    const barangays = useBarangaysByMunicipalityOptionList(selectedMunicipalityId);
    const barangayGeometry = useBarangayFilteredGeom(selectedBarangayId);

    const allData: Record<DropdownKey, any> = {
        patient_infos: patientInfos.data,
        categories: categories.data,
        municipalities: municipalities.data,
        severities: severities.data,
        suffixes: suffixes.data,
        diseases: diseases.data,
        barangays: barangays.data,
        barangayGeometry: barangayGeometry.geom,
    };

    const allLoading: Record<DropdownKey, boolean> = {
        patient_infos: patientInfos.loading,
        categories: categories.loading,
        municipalities: municipalities.loading,
        severities: severities.loading,
        suffixes: suffixes.loading,
        diseases: diseases.loading,
        barangays: barangays.loading,
        barangayGeometry: barangayGeometry.loading,
    };

    const result: {
        loading: Record<string, boolean>;
        selected: {
            categoryId: string;
            municipalityId: string;
            barangayId: string;
        };
    } & Partial<Record<DropdownKey, any>> = {
        loading: {},
        selected: {
            categoryId: selectedCategoryId,
            municipalityId: selectedMunicipalityId,
            barangayId: selectedBarangayId,
        },
    };

    config.include.forEach((key) => {
        result[key] = allData[key];
        result.loading[key] = allLoading[key];
    });

    return result;
}
