import type { PatientInfo } from '@/types';
import { DataParams, fetchOptionList, fetchTableData } from '@/utils/api-utils';

export const fetchPatientInfosOptionList = () => fetchOptionList<PatientInfo>('patient_infos');

export const fetchPatientInfosTableData = (params?: DataParams) => fetchTableData<PatientInfo>('patient_infos', params);
