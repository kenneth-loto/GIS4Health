import type { Category } from '@/types';
import { DataParams, fetchOptionList, fetchTableData } from '@/utils/api-utils';

export const fetchCategoriesOptionList = () => fetchOptionList<Category>('categories');

export const fetchCategoriesTableData = (params?: DataParams) => fetchTableData<Category>('categories', params);
