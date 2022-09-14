import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../data.service';
import {PatientInformation} from 'src/types/report';

import { optionGroup } from './interfaces';
import { HtmlService } from '../html.service';
import * as moment from 'jalali-moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import {AutofillService} from "../autofill.service";

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  @Input() id: number;
  @Input() patientName: FormControl;

  time = { hour: 13, minute: 30 };

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#9fbd90',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  fulldata: PatientInformation = {}

  options: Map<string, optionGroup> = new Map<string, optionGroup>();

  form: FormGroup;

  constructor(
    route: ActivatedRoute,
    public dataService: DataService,
    public htmlService: HtmlService,
    public autofill: AutofillService
  ) {
    this.form = new FormGroup({
      NationalID: new FormControl(''),
      PhoneNumber: new FormControl('', Validators.pattern('^[0-9]{11}$')),
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
      DateOfFirstContact: new FormControl(''),
      FirstCaller: new FormControl(''),
      PaymentStatus: new FormControl(''),
      DateOfPayment: new FormControl(''),
      CashAmount: new FormControl(''),
      LastFourDigitsCard: new FormControl('', Validators.pattern('^[0-9]{4}(-[0-9]{4})*$')),
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
      StopTime: new FormControl(''),
      EnterTime: new FormControl(''),
      ExitTime: new FormControl(''),
      PatientEnterTime: new FormControl(''),
      HeadFixType: new FormControl(''),
    });

    this.form.controls['SurgeryDate'].valueChanges.subscribe(value => {
      const day = moment.unix(value).jDay() + 1;
      this.form.controls['SurgeryDay'].setValue(day);
    });
  }

  ngOnInit(): void {
    if (this.patientName != null) {
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

    this.dataService.getPatient(this.id).subscribe(fulldata => {
      this.fulldata = fulldata;
      for (let key in this.form.controls) {
        if((key == 'SurgeryDate' || key == 'SurgeryDay') && this.id == -1) {
          continue;
        }
        if ((key == 'DateOfPayment' || key == 'DateOfFirstContact' || key == 'DateOfHospitalAdmission') && this.id == -1)
        {
          this.form.controls['DateOfPayment'].setValue( Math.floor(moment.unix(moment.now()).unix()/1e3) )
          this.form.controls['DateOfFirstContact'].setValue( Math.floor(moment.unix(moment.now()).unix()/1e3)  )
          this.form.controls['DateOfHospitalAdmission'].setValue( Math.floor(moment.unix(moment.now()).unix()/1e3)  )
          continue;
        }
        this.form.controls[key].setValue((fulldata as any)[key]);
      }
    });
  }

  timestampToDate(timestamp: number): Date | null {
    return moment.unix(timestamp).toDate();
  }

  onDateChange(event: MatDatepickerInputEvent<moment.Moment>, control: AbstractControl) {
    const timestamp = event.value!.unix();
    control.setValue(timestamp);
  }

  onTimeChange(event: string, control: AbstractControl) {
    control.setValue(event + ':00');
  }

  toTime(time: string): string {
    return moment(time, 'HH:mm').format('HH:mm');
  }

}
