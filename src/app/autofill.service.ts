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
    this.dataService.getAutofillData(this.autofillFields).subscribe(
      (data) => {
        for(let [key, value] of Object.entries(data)) {
          this.autofillOptions.set(key, new Map(value));
          for(let [item, count] of this.autofillOptions.get(key)!) {
            this.autofillOptions.get(key)!.set(item, count);
          }
        }
      }
    );

    this.dataService.getAllHints().subscribe((data: Map<string, number>) => {
      let map = new Map<string, number>();
      for(let [name, value] of Object.entries(data)) {
        map.set(name, value);
      }
      this.autofillOptions.set("Hints", map);
    })
  }

  get(str: string, filter: any, threshold: number = 3) {
    if(filter.length < threshold) {
      return [];
    }

    const options = this.autofillOptions.get(str)
    if(options !== undefined) {
      let lst = Array.from(options, ([name, value]) => ({name, value}));
      const sorted = lst.sort((a, b) => b.value - a.value).map((struct) => struct.name)
      return sorted.filter(option => option && option.includes(filter));      
    }

    return [];
  }
}
