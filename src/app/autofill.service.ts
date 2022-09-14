import {Injectable, OnInit} from '@angular/core';
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class AutofillService {

  private autofillFields = [
    'Name',
    'NationalID',
    'PhoneNumber',
    'Address',
    'PlaceOfBirth',
    'SurgeonFirst',
    'Hospital',
    'OperatorFirst',
    'OperatorSecond',
    'CancellationReason',
    'SurgeonSecond',
    'Resident',
    'Bank',
    'ReasonForDiscount',
    'TypeOfInsurance',
    'FinancialVerifier',
    'FirstCaller',
  ];

  private autofillOptions = new Map<string, Map<string, number>>();

  constructor(
    public dataService : DataService
  ) {
    this.dataService.getReports().subscribe(
      (fulldata) => {
        this.autofillFields.forEach((field) => {
          this.autofillOptions.set(field, new Map());
          for(let info of (fulldata as any)) {
            const option = (info as any)[field].trim();
            if(this.autofillOptions.get(field)!.get(option) == undefined) {
              this.autofillOptions.get(field)!.set(option, 0);
            }
            this.autofillOptions.get(field)!.set(option, this.autofillOptions.get(field)!.get(option) as number + 1);
          }
        });
      }
    );
  }

  get(str: string, filter: any, threshold: number = 3) {
    if(filter.length < threshold) {
      return [];
    }

    const options = this.autofillOptions.get(str)
    if(options !== undefined) {
      let lst = Array.from(options, ([name, value]) => ({name, value}));
      const sorted = lst.sort((a, b) => b.value - a.value).map((struct) => struct.name)
      return sorted.filter(option => option && option.includes(filter))
    }
    return [];
  }
}
