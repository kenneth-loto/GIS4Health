export type PatientInfo = {
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix_id: string;
    suffix: {
        id: string;
        name: string;
    };
    municipality_id: string;
    municipality: {
        id: string;
        name: string;
    };
    barangay_id: string;
    barangay: {
        id: string;
        name: string;
    };
    street: string;
    latitude: string;
    longitude: string;
};
