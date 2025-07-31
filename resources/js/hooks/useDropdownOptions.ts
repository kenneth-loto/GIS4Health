import { UseFormReturn } from 'react-hook-form';
import { useBarangayFilteredGeom, useBarangaysByMunicipalityOptionList } from './useBarangay';
import { useCategoriesOptionList } from './useCategory';
import { useDiseasesByCategoryOptionList } from './useDisease';
import { useMunicipalitiesOptionList } from './useMunicipality';
import { usePatientInfosOptionList } from './usePatientInfo';
import { useSeveritiesOptionList } from './useSeverity';
import { useSuffixesOptionList } from './useSuffix';

export function useDropdownOptions(form: UseFormReturn<any>) {
    const { watch } = form;

    // Watch selected values from form to use in dependent dropdowns
    const selectedMunicipalityId = watch('municipality_id');
    const selectedCategoryId = watch('category_id');
    const selectedBarangayId = watch('barangay_id');

    // Fetch independent option lists
    const { data: patient_infos, loading: loadingPatientInfos } = usePatientInfosOptionList();
    const { data: categories, loading: loadingCategories } = useCategoriesOptionList();
    const { data: municipalities, loading: loadingMunicipalities } = useMunicipalitiesOptionList();
    const { data: severities, loading: loadingSeverities } = useSeveritiesOptionList();
    const { data: suffixes, loading: loadingSuffixes } = useSuffixesOptionList();

    // Fetch dependent option lists
    const { data: diseases, loading: loadingDiseases } = useDiseasesByCategoryOptionList(selectedCategoryId);
    const { data: barangays, loading: loadingBarangays } = useBarangaysByMunicipalityOptionList(selectedMunicipalityId);
    const { geom: barangayGeometry, loading: loadingBarangayGeometry } = useBarangayFilteredGeom(selectedBarangayId);

    return {
        // Option lists for dropdowns
        patient_infos,
        categories,
        municipalities,
        severities,
        diseases,
        barangays,
        suffixes,
        barangayGeometry,

        // Loading states for each dropdown
        loading: {
            patient_infos: loadingPatientInfos,
            categories: loadingCategories,
            municipalities: loadingMunicipalities,
            severities: loadingSeverities,
            diseases: loadingDiseases,
            barangays: loadingBarangays,
            suffixes: loadingSuffixes,
            barangayGeometry: loadingBarangayGeometry,
        },

        // Currently selected values being watched
        selected: {
            categoryId: selectedCategoryId,
            municipalityId: selectedMunicipalityId,
            barangayId: selectedBarangayId,
        },
    };
}
