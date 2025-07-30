import type { Disease } from '@/types';
import { DataParams, fetchBy, fetchOptionList, fetchTableData } from '@/utils/api-utils';

export const fetchDiseasesOptionList = () => fetchOptionList<Disease>('diseases');

export const fetchDiseasesTableData = (params?: DataParams) => fetchTableData<Disease>('diseases', params);

export function fetchDiseasesByCategoryOptionList(categoryId: string): Promise<Disease[]> {
    return fetchBy<Disease>('diseases', 'category', categoryId);
}
