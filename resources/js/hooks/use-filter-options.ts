import { useWatch } from 'react-hook-form';
import { useBarangayOptions } from './use-barangay';
import { useCategoriesOption } from './use-category';
import { useDiseasesByCategoryOptions } from './use-disease';
import { useMunicipalitiesOption } from './useMunicipality';
import { useSeveritiesOptionList } from './useSeverity';

export function useFilterOptions(control: any) {
    const selectedCategoryId = useWatch({ control, name: 'category_id' });
    const selectedMunicipalityId = useWatch({ control, name: 'municipality_id' });

    const { categories, loading: loadingCategories } = useCategoriesOption();
    const { data: municipalities, loading: loadingMunicipalities } = useMunicipalitiesOption();
    const { data: severities, loading: loadingSeverities } = useSeveritiesOptionList();
    const { diseases, loading: loadingDiseases } = useDiseasesByCategoryOptions(selectedCategoryId);
    const { barangays, loading: loadingBarangays } = useBarangayOptions(selectedMunicipalityId ?? '');

    return {
        categories,
        municipalities,
        severities,
        diseases,
        barangays,
        loading: {
            categories: loadingCategories,
            municipalities: loadingMunicipalities,
            severities: loadingSeverities,
            diseases: loadingDiseases,
            barangays: loadingBarangays,
        },
        selected: {
            categoryId: selectedCategoryId,
            municipalityId: selectedMunicipalityId,
        },
    };
}
