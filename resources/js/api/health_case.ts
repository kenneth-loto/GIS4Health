import type { HealthCase } from '@/types';
import { DataParams, fetchTableData } from '@/utils/api-utils';

export const fetchHealthCasesTableData = (params?: DataParams) => fetchTableData<HealthCase>('health_cases', params);
