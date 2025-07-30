import { fetchCategoriesOptionList, fetchCategoriesTableData } from '@/api/category';
import { useOptionList, useTableData } from '@/hooks/useHooks';
import type { Category } from '@/types';

export function useCategoriesOptionList() {
    return useOptionList<Category>('categories', fetchCategoriesOptionList);
}

export function useSuffixesTableData(search = '', page = 1, per_page = 5) {
    return useTableData<Category>('categories', fetchCategoriesTableData, search, page, per_page);
}
