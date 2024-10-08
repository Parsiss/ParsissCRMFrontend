import { Time } from "@angular/common";


export interface PatientListData {
    data: PatientInformation[];
    total: number;
}

export interface PatientInformation {
    ID?: number;
    Name?: string;
    Family?: string;
    Age?: number;
    PhoneNumber?: string;
    NationalID?: string;
    Address?: string;
    Email?: string;
    PlaceOfBirth?: string;

    SurgeryDate?: number;
    SurgeryDay?: number;
    SurgeryTime?: number;
    SurgeryType?: string;
    SurgeryArea?: number;
    SurgeryDescription?: string;
    SurgeryResult?: number;
    SurgeonFirst?: string;
    SurgeonSecond?: string;
    Resident?: string;
    Hospital?: string;
    HospitalType?: number;
    HospitalAddress?: string;
    CT?: number;
    MR?: number;
    FMRI?: number;
    DTI?: number;
    OperatorFirst?: string;
    OperatorSecond?: string;
    StartTime?: number;
    StopTime?: number;
    EnterTime?: number;
    ExitTime?: number;
    PatientEnterTime?: number;
    HeadFixType?: number;
    CancellationReason?: string;
    FileNumber?: string;
    DateOfHospitalAdmission?: number;
    FRE? : number

    PaymentStatus?: number;
    DateOfFirstContact?: number;
    PaymentNote?: string;
    FirstCaller?: string;
    DateOfPayment?: number;
    LastFourDigitsCard?: string;
    CashAmount?: string;
    Bank?: string;
    DiscountPercent?: number;
    ReasonForDiscount?: string;
    HealthPlanAmount?: string;
    TypeOfInsurance?: string;
    FinancialVerifier?: string;
    ReceiptNumber?: number;
    PreviousSurgeries?: [string, string][];
}

export interface tableData {
    ID?: number;
    SurgeryDate?: any;
    SurgeryDay?: string;
    PaymentStatus?: string;
    Name?: string;
    SurgeonFirst?: string;
    Hospital?: string;
    NationalId?: string;
    PhoneNumber?: string;
    SurgeryResult?: string;
    PaymentCard?: string;
    CashAmount?: string;
    OperatorFirst?: string;
    PreviousSurgeries?: string;

}


export interface DatedReportData {
    types: string[];
    result: { [key: string]: number[] };
}


export interface DatedReportDialogData {
    title: string;
    types: string[];
    operators: string[];
    result: { [key: string]: number[] };
    from: string;
    to: string;
}

export interface HospitalsPeriodicReportData {
    hospitals: string[];
    first_period: number[];
    second_period: number[];
}
