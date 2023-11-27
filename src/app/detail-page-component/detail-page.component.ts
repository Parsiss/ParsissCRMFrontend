import {Component, HostListener, Input, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../data.service';
import {PatientInformation} from 'src/types/report';

import { optionGroup } from './interfaces';
import { HtmlService } from '../html.service';
import * as moment from 'jalali-moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import {AutofillService} from "../autofill.service";
import {Observable, of} from "rxjs";
import { ComboOptions } from 'src/types/filters';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  @Input() id: number;
  @Input() patientName: FormControl;

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

  fulldata: PatientInformation = {};
  options: ComboOptions<number>
  form: FormGroup;

  constructor(
    route: ActivatedRoute,
    public dataService: DataService,
    public htmlService: HtmlService,
    public autofill: AutofillService,
    private router: Router
  ) {
    this.form = new FormGroup({
      NationalID: new FormControl(''),
      PhoneNumber: new FormControl('', Validators.pattern('^[0-9]{11}$')),
      SurgeryDate: new FormControl(0),
      Address: new FormControl(''),
      PlaceOfBirth: new FormControl(''),
      SurgeonFirst: new FormControl(''),
      Hospital: new FormControl(''),
      // THIS DEFAULT VALUE HAS TO CHANGE TO ZERO
      // CHANGE OPTIONS FILE IN BACKEND
      HospitalType: new FormControl(-1),
      SurgeryDay: new FormControl(null),
      SurgeryTime: new FormControl(0), // TODO: change to time
      MR: new FormControl(0),
      CT: new FormControl(0),
      OperatorFirst: new FormControl(''),
      OperatorSecond: new FormControl(''),
      DateOfFirstContact: new FormControl(0),
      FirstCaller: new FormControl(''),
      PaymentStatus: new FormControl(0),
      DateOfPayment: new FormControl(0),
      CashAmount: new FormControl(''),
      LastFourDigitsCard: new FormControl('', Validators.pattern('^[0-9]{4}(-[0-9]{4})*$')),
      Bank: new FormControl(''),
      DiscountPercent: new FormControl(0),
      ReasonForDiscount: new FormControl(''),
      TypeOfInsurance: new FormControl(''),
      FinancialVerifier: new FormControl(''),
      ReceiptNumber: new FormControl(0),
      SurgeryResult: new FormControl(0),
      CancellationReason: new FormControl(''),
      RefundStatus: new FormControl(''),
      FileNumber: new FormControl(''),
      DateOfHospitalAdmission: new FormControl(0),
      Age: new FormControl(0),
      SurgeryType: new FormControl(''),
      SurgeryArea: new FormControl(0),
      SurgeryDescription: new FormControl(''),
      SurgeonSecond: new FormControl(''),
      Resident: new FormControl(''),
      HospitalAddress: new FormControl(''),
      FMRI: new FormControl(0),
      DTI: new FormControl(0),
      StartTime: new FormControl('00:00:00'),
      StopTime: new FormControl('00:00:00'),
      EnterTime: new FormControl('00:00:00'),
      ExitTime: new FormControl('00:00:00'),
      PatientEnterTime: new FormControl('00:00:00'),
      HeadFixType: new FormControl(0),
      FRE: new FormControl(0),
    });

    this.form.controls['SurgeryDate'].valueChanges.subscribe(value => {
      const day = value.jDay() + 1;
      this.form.controls['SurgeryDay'].setValue(day);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: Event) {
    if(this.form.dirty) {
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    if (this.patientName != null) {
      this.form.addControl('Name', this.patientName);
    } else {
      this.form.addControl('Name', new FormControl('', Validators.required));
    }

    this.dataService.getOptions().subscribe(
      (data) => {
        this.options = data;
        this.htmlService.isPageReady = true;
      });

    if (this.id != -1) {
      this.dataService.getPatient(this.id).subscribe(fulldata => {
        this.fulldata = fulldata;
        for (let key in this.form.controls) {
          this.form.controls[key].setValue((fulldata as any)[key]);
        }
      });
    }
  }

  onTimeChange(event: string, control: AbstractControl) {
    control.setValue(event + ':00');
  }

  toTime(time: string): string {
    return moment(time, 'HH:mm').format('HH:mm');
  }

}
