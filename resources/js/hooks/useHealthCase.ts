import { fetchHealthCasesTableData } from '@/api/health_case';
import { usePaginatedTableData } from '@/hooks/useHooks';
import type { HealthCase } from '@/types';

export function useDiseasesTableData(search = '', page = 1, per_page = 5) {
    return usePaginatedTableData<HealthCase>('health_cases', fetchHealthCasesTableData, search, page, per_page);
}
