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
    SurgeryDate?: string;
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
    StartTime?: string;
    StopTime?: string;
    EnterTime?: string;
    ExitTime?: string;
    PatientEnterTime?: string;
    HeadFixType?: number;
    CancellationReason?: string;
    FileNumber?: string;
    DateOfHospitalAdmission?: string;
}

export interface PatientFinancialInformation {
    ID?: number;
    PatientID?: number;
    PaymentStatus?: number;
    DateOfFirstContact?: string;
    PaymentNote?: string;
    FirstCaller?: string;
    DateOfPayment?: string;
    LastFourDigitsCard?: string;
    CashAmount?: string;
    Bank?: string;
    DiscountPercent?: number;
    ReasonForDiscount?: string;
    HealthPlanAmount?: string;
    TypeOfInsurance?: string;
    FinancialVerifier?: string;
    ReceiptNumber?: number;
    ReceiptDate?: string;
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
