import { useWatch } from 'react-hook-form';
import { useBarangayOptions } from './use-barangay';
import { useCategoriesOption } from './use-category';
import { useDiseasesByCategoryOptions } from './use-disease';
import { useMunicipalitiesOption } from './use-municipality';
import { useSeveritiesOption } from './use-severity';

export function useFilterOptions(control: any) {
    const selectedCategoryId = useWatch({ control, name: 'category_id' });
    const selectedMunicipalityId = useWatch({ control, name: 'municipality_id' });

    const { categories, loading: loadingCategories } = useCategoriesOption();
    const { municipalities, loading: loadingMunicipalities } = useMunicipalitiesOption();
    const { severities, loading: loadingSeverities } = useSeveritiesOption();
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
