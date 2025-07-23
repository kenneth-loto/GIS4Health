import { fetchMunicipalitiesOption } from '@/api/municipality';
import type { Municipality } from '@/types';
import useSWR from 'swr';

export function useMunicipalitiesOption(dialogOpen: boolean = true) {
    const shouldFetch = dialogOpen;
    const { data, error, isLoading } = useSWR<Municipality[]>(shouldFetch ? '/api/municipalities/options' : null, fetchMunicipalitiesOption);

    return {
        municipalities: data ?? [],
        loading: isLoading,
        error,
    };
}

// import useSWRImmutable from 'swr/immutable';

// export function useMunicipalitiesOption(dialogOpen: boolean = true) {
//     const shouldFetch = dialogOpen;
//     const { data, error, isLoading } = useSWRImmutable<Municipality[]>(
//         shouldFetch ? '/api/municipalities/options' : null,
//         fetchMunicipalitiesOption
//     );

//     return {
//         municipalities: data ?? [],
//         loading: isLoading,
//         error,
//     };
// }
