import type { Severity } from '@/types';
import { DataParams, fetchOptionList, fetchTableData } from '@/utils/api-utils';

export const fetchSeveritiesOptionList = () => fetchOptionList<Severity>('severities');

export const fetchSeveritiesTableData = (params?: DataParams) => fetchTableData<Severity>('severities', params);
