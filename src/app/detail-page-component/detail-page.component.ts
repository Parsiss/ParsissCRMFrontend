import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../data.service';
import { Patient, PatientFinancialInformation, SurgeriesInformation, PatientFullInformation } from 'src/types/report';

import { optionGroup } from './interfaces';
import { HtmlService } from '../html.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  @Input() id: number;
  @Input() patientName: FormControl;

  fulldata: PatientFullInformation = {
    Patient: { },
    SurgeryInfo: { },
    FinancialInfo: { }
  }

  options: Map<string, optionGroup> = new Map<string, optionGroup>();

  form: FormGroup;

  constructor(
    route: ActivatedRoute,
    public dataService: DataService,
    public htmlService: HtmlService,
  ) {
    this.form = new FormGroup({
      NationalID: new FormControl('', Validators.pattern('^[0-9]*$')),
      PhoneNumber: new FormControl('', Validators.pattern('^[0-9]{10}$')),
      SurgeryDate: new FormControl(''),
      Address: new FormControl(''),
      PlaceOfBirth: new FormControl(''),
      SurgeonFirst: new FormControl(''),
      Hospital: new FormControl(''),
      HospitalType: new FormControl(''),
      SurgeryDay: new FormControl(''),
      SurgeryTime: new FormControl(''),
      MR: new FormControl(''),
      CT: new FormControl(''),
      OperatorFirst: new FormControl(''),
      OperatorSecond: new FormControl(''),
      FirstContact: new FormControl(''),
      FirstCaller: new FormControl(''),
      PaymentStatus: new FormControl(''),
      PaymentDate: new FormControl(''),
      PaymentAmount: new FormControl(''),
      LastFourDigitsCard: new FormControl(''),
      Bank: new FormControl(''),
      DiscountPercent: new FormControl(''),
      ReasonForDiscount: new FormControl(''),
      TypeOfInsurance: new FormControl(''),
      FinancialVerifier: new FormControl(''),
      ReceiptNumber: new FormControl(''),
      SurgeryResult: new FormControl(''),
      CancellationReason: new FormControl(''),
      FileNumber: new FormControl(''),
      DateOfHospitalAdmission: new FormControl(''),
      Age: new FormControl(''),
      SurgeryType: new FormControl(''),
      SurgeryArea: new FormControl(''),
      SurgeryDescription: new FormControl(''),
      SurgeonSecond: new FormControl(''),
      Resident: new FormControl(''),
      HospitalAddress: new FormControl(''),
      FMRI: new FormControl(''),
      DTI: new FormControl(''),
      StartTime: new FormControl(''),
      EndTime: new FormControl(''),
      EnterTime: new FormControl(''),
      ExitTime: new FormControl(''),
      PatientEnterTime: new FormControl(''),
      HeadFixType: new FormControl(''),
    });

    this.form.controls['SurgeryDate'].valueChanges.subscribe(value => {
      const day = new Date(value).getDay();
      this.form.controls['SurgeryDay'].setValue(String(day));
    });
  }

  ngOnInit(): void {
    if(this.patientName != null) {
      this.form.addControl('Name', this.patientName);
    } else {
      this.form.addControl('Name', new FormControl('', Validators.required));
    }

    this.dataService.getOptions().subscribe(
      (data) => {
        data.forEach((filter) => {
          if (this.options.get(filter.Group) === undefined) {
            this.options.set(filter.Group, {
              name: filter.Group,
              values: []
            });
          }
          this.options.get(filter.Group)!.values.push({
            value: filter.Value,
            text: filter.Text,
            selected: filter.Selected
          });
        });

        this.htmlService.isPageReady = true;
      });

    if(this.id == -1) {
      return
    }

    this.dataService.getPatient(this.id).subscribe(fulldata => {
      this.fulldata = fulldata;
      for(let key in this.form.controls) {
        if(key in fulldata.Patient) {
          this.form.controls[key].setValue((fulldata.Patient as any)[key]);
        } else if(key in fulldata.SurgeryInfo) {
          this.form.controls[key].setValue((fulldata.SurgeryInfo as any)[key]);
        } else if(key in fulldata.FinancialInfo) {
          this.form.controls[key].setValue((fulldata.FinancialInfo as any)[key]);
        }
      }
    });
  }

}
