export type HealthCase = {
    id: string;
    patient_info: {
        id: string;
        first_name: string;
        middle_name: string;
        last_name: string;
        suffix: {
            id: string;
            name: string;
        };
        municipality: {
            id: string;
            name: string;
        };
        barangay: {
            id: string;
            name: string;
        };
        street: string;
    };
    category: {
        id: string;
        name: string;
    };
    disease: {
        id: string;
        name: string;
    };
    severity: {
        id: string;
        name: string;
    };
};
