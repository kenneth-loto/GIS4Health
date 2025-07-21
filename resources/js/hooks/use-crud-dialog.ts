import { useReducer } from 'react';

type DialogState<T> = {
    isOpen: boolean;
    isDeleteOpen: boolean;
    mode: 'add' | 'edit' | null;
    data: T | null;
    isDeleting: boolean;
};

type Action<T> =
    | { type: 'OPEN_ADD' }
    | { type: 'OPEN_EDIT'; payload: T }
    | { type: 'CLOSE_FORM' }
    | { type: 'OPEN_DELETE'; payload: T }
    | { type: 'CLOSE_DELETE' }
    | { type: 'SET_DELETING'; payload: boolean };

const initialState = <T>(): DialogState<T> => ({
    isOpen: false,
    isDeleteOpen: false,
    mode: null,
    data: null,
    isDeleting: false,
});

function reducer<T>(state: DialogState<T>, action: Action<T>): DialogState<T> {
    switch (action.type) {
        case 'OPEN_ADD':
            return { ...state, isOpen: true, mode: 'add', data: null };
        case 'OPEN_EDIT':
            return { ...state, isOpen: true, mode: 'edit', data: action.payload };
        case 'CLOSE_FORM':
            return { ...state, isOpen: false, mode: null, data: null };
        case 'OPEN_DELETE':
            return { ...state, isDeleteOpen: true, data: action.payload };
        case 'CLOSE_DELETE':
            return { ...state, isDeleteOpen: false, data: null, isDeleting: false };
        case 'SET_DELETING':
            return { ...state, isDeleting: action.payload };
        default:
            return state;
    }
}

export function useCrudDialog<T>() {
    const [state, dispatch] = useReducer(reducer<T>, initialState<T>());

    return {
        ...state,
        openAdd: () => dispatch({ type: 'OPEN_ADD' }),
        openEdit: (item: T) => dispatch({ type: 'OPEN_EDIT', payload: item }),
        closeForm: () => dispatch({ type: 'CLOSE_FORM' }),
        openDelete: (item: T) => dispatch({ type: 'OPEN_DELETE', payload: item }),
        closeDelete: () => dispatch({ type: 'CLOSE_DELETE' }),
        setDeleting: (value: boolean) => dispatch({ type: 'SET_DELETING', payload: value }),
    };
}
