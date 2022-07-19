export interface Patient {
    ID: number;
    Name: string;
    Family: string;
    Age: number;
    PhoneNumber: string;
    NationalID: string;
    Address: string;
    Email: string;
    PlaceOfBirth: string;
}

export interface Filter {
    Value: string;
    Text: string;
    Selected: string;
    Group: string;
}

export interface ReportData {
    Patients: Patient[];
    Filters: Filter[];
}