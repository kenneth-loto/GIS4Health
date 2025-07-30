import { fetchDiseasesByCategory, fetchDiseasesOptionList, fetchDiseasesTableData } from '@/api/disease';
import type { Disease } from '@/types';
import { useFilteredOptionList, useOptionList, usePaginatedTableData } from './useHooks';

export function useDiseasesOptionList() {
    return useOptionList<Disease>('diseases', fetchDiseasesOptionList);
}

export function useDiseasesTableData(search = '', page = 1, per_page = 5) {
    return usePaginatedTableData<Disease>('diseases', fetchDiseasesTableData, search, page, per_page);
}

export function useDiseasesByCategoryOptionList(categoryId: string) {
    return useFilteredOptionList<Disease>('by-category', categoryId, fetchDiseasesByCategory);
}
