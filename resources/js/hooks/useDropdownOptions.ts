import { UseFormReturn } from 'react-hook-form';
import { useBarangayFilteredGeom, useBarangaysByMunicipalityOptionList } from './useBarangay';
import { useCategoriesOptionList } from './useCategory';
import { useDiseasesByCategoryOptionList } from './useDisease';
import { useMunicipalitiesOptionList } from './useMunicipality';
import { usePatientInfosOptionList } from './usePatientInfo';
import { useSeveritiesOptionList } from './useSeverity';
import { useSuffixesOptionList } from './useSuffix';

type DropdownKey = 'patient_infos' | 'categories' | 'municipalities' | 'severities' | 'suffixes' | 'diseases' | 'barangays' | 'barangayGeometry';

interface UseDropdownOptionsConfig {
    include: DropdownKey[];
}

export function useDropdownOptions(form: UseFormReturn<any>, config: UseDropdownOptionsConfig) {
    const { watch } = form;
    const selectedCategoryId = watch('category_id');
    const selectedMunicipalityId = watch('municipality_id');
    const selectedBarangayId = watch('barangay_id');

    const result: any = {
        loading: {},
        selected: {
            categoryId: selectedCategoryId,
            municipalityId: selectedMunicipalityId,
            barangayId: selectedBarangayId,
        },
    };

    // Define hook handlers for each dropdown type
    const hookHandlers: Record<DropdownKey, () => void> = {
        patient_infos: () => {
            const { data, loading } = usePatientInfosOptionList();
            result.patient_infos = data;
            result.loading.patient_infos = loading;
        },
        categories: () => {
            const { data, loading } = useCategoriesOptionList();
            result.categories = data;
            result.loading.categories = loading;
        },
        municipalities: () => {
            const { data, loading } = useMunicipalitiesOptionList();
            result.municipalities = data;
            result.loading.municipalities = loading;
        },
        severities: () => {
            const { data, loading } = useSeveritiesOptionList();
            result.severities = data;
            result.loading.severities = loading;
        },
        suffixes: () => {
            const { data, loading } = useSuffixesOptionList();
            result.suffixes = data;
            result.loading.suffixes = loading;
        },
        diseases: () => {
            const { data, loading } = useDiseasesByCategoryOptionList(selectedCategoryId);
            result.diseases = data;
            result.loading.diseases = loading;
        },
        barangays: () => {
            const { data, loading } = useBarangaysByMunicipalityOptionList(selectedMunicipalityId);
            result.barangays = data;
            result.loading.barangays = loading;
        },
        barangayGeometry: () => {
            const { geom, loading } = useBarangayFilteredGeom(selectedBarangayId);
            result.barangayGeometry = geom;
            result.loading.barangayGeometry = loading;
        },
    };

    // Execute required hooks
    config.include.forEach((key) => {
        if (hookHandlers[key]) hookHandlers[key]();
    });

    return result;
}
