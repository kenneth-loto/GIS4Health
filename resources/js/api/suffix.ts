import type { Suffix } from '@/types';
import { DataParams, fetchOptionList, fetchTableData } from '@/utils/api-utils';

export const fetchSuffixesOption = () => fetchOptionList<Suffix>('suffixes');
export const fetchSuffixesTableData = (params?: DataParams) => fetchTableData<Suffix>('suffixes', params);
