import { useReducer } from 'react';

export type TableState<T> = {
    data: T[];
    page: number;
    perPage: number;
    total: number;
    search: string;
    loading: boolean;
    error: boolean;
};

export type TableAction<T> =
    | { type: 'SET_DATA'; payload: T[] }
    | { type: 'SET_TOTAL'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: boolean }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_PER_PAGE'; payload: number }
    | { type: 'SET_SEARCH'; payload: string };

function tableReducer<T>(state: TableState<T>, action: TableAction<T>): TableState<T> {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, data: action.payload };
        case 'SET_TOTAL':
            return { ...state, total: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'SET_PER_PAGE':
            return { ...state, perPage: action.payload };
        case 'SET_SEARCH':
            return { ...state, search: action.payload };
        default:
            return state;
    }
}

export function useTableReducer<T>() {
    return useReducer(tableReducer<T>, {
        data: [],
        page: 1,
        perPage: 5,
        total: 0,
        search: '',
        loading: false,
        error: false,
    });
}
