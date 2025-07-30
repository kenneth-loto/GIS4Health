import { fetchPatientInfosOptionList, fetchPatientInfosTableData } from '@/api/patient_info';
import { useOptionList, usePaginatedTableData } from '@/hooks/useHooks';
import type { PatientInfo } from '@/types';

export function usePatientInfosOptionList() {
    return useOptionList<PatientInfo>('patient_infos', fetchPatientInfosOptionList);
}

export function usePatientInfosTableData(search = '', page = 1, per_page = 5) {
    return usePaginatedTableData<PatientInfo>('patient_infos', fetchPatientInfosTableData, search, page, per_page);
}
