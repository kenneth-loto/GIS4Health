import type { Municipality } from '@/types';
import { DataParams, fetchOptionList, fetchTableData } from '@/utils/api-utils';

export const fetchMunicipalitiesOptionList = () => fetchOptionList<Municipality>('municipalities');

export const fetchMunicipalitiesTableData = (params?: DataParams) => fetchTableData<Municipality>('municipalities', params);
