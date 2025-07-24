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
