import { Time } from "@angular/common";

export interface Patient {
    ID?: number;
    Name?: string;
    Family?: string;
    Age?: number;
    PhoneNumber?: string;
    NationalID?: string;
    Address?: string;
    Email?: string;
    PlaceOfBirth?: string;
}

export interface SurgeriesInformation {
    ID?: number;
    PatientID?: number;
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
}

export interface PatientFinancialInformation {
    ID?: number;
    PatientID?: number;
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
    ReceiptDate?: number;
    ReceiptReceiver?: string;
}

export interface PatientFullInformation {
    Patient: Patient;
    SurgeryInfo: SurgeriesInformation;
    FinancialInfo: PatientFinancialInformation;
}

export interface Filter {
    Value: string;
    Text: string;
    Selected: string;
    Group: string;
}


export type Option = Filter;
