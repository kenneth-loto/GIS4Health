import { fetchDiseasesByCategoryOptionList, fetchDiseasesOptionList, fetchDiseasesTableData } from '@/api/disease';
import { useFilteredOptionList, useOptionList, useTableData } from '@/hooks/useHooks';
import type { Disease } from '@/types';

export function useDiseasesOptionList() {
    return useOptionList<Disease>('diseases', fetchDiseasesOptionList);
}

export function useDiseasesTableData(search = '', page = 1, per_page = 5) {
    return useTableData<Disease>('diseases', fetchDiseasesTableData, search, page, per_page);
}

export function useDiseasesByCategoryOptionList(categoryId: string) {
    return useFilteredOptionList<Disease>('by-category', categoryId, fetchDiseasesByCategoryOptionList);
}
