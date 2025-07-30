import { UseFormReturn } from 'react-hook-form';
import { useBarangaysByMunicipalityOptionList } from './useBarangay';
import { useCategoriesOptionList } from './useCategory';
import { useDiseasesByCategoryOptionList } from './useDisease';
import { useMunicipalitiesOptionList } from './useMunicipality';
import { useSeveritiesOptionList } from './useSeverity';

export function useDropdownOptions(form: UseFormReturn<any>) {
    const { watch } = form;

    // Watch selected values from form to use in dependent dropdowns
    const selectedMunicipalityId = watch('municipality_id');
    const selectedCategoryId = watch('category_id');

    // Fetch independent option lists
    const { data: categories, loading: loadingCategories } = useCategoriesOptionList();
    const { data: municipalities, loading: loadingMunicipalities } = useMunicipalitiesOptionList();
    const { data: severities, loading: loadingSeverities } = useSeveritiesOptionList();

    // Fetch dependent option lists
    const { data: diseases, loading: loadingDiseases } = useDiseasesByCategoryOptionList(selectedCategoryId);
    const { data: barangays, loading: loadingBarangays } = useBarangaysByMunicipalityOptionList(selectedMunicipalityId);

    return {
        // Option lists for dropdowns
        categories,
        municipalities,
        severities,
        diseases,
        barangays,

        // Loading states for each dropdown
        loading: {
            categories: loadingCategories,
            municipalities: loadingMunicipalities,
            severities: loadingSeverities,
            diseases: loadingDiseases,
            barangays: loadingBarangays,
        },

        // Currently selected values being watched
        selected: {
            categoryId: selectedCategoryId,
            municipalityId: selectedMunicipalityId,
        },
    };
}
