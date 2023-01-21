import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientInformation } from 'src/types/report';
import { DataService } from '../data.service';
import { DetailPageComponent } from '../detail-page-component/detail-page.component';
import { HtmlService } from '../html.service';
import * as moment from "jalali-moment";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-add-new-patient',
  templateUrl: './add-new-patient.component.html',
  styleUrls: ['./add-new-patient.component.scss'],
  providers: [HtmlService]
})
export class AddNewPatientComponent implements OnInit, AfterViewInit {
  id: number = -1;
  @ViewChild(DetailPageComponent) detailPage: DetailPageComponent;

  constructor(
    private htmlService: HtmlService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(data => {
      let surgery_date = data['date']
      if(surgery_date != null) {
        this.detailPage.form.controls['SurgeryDate'].setValue(moment.unix(surgery_date));
      } else{
        this.detailPage.form.controls['SurgeryDate'].setValue(moment.unix(moment.now() / 1000));
      }
    });
    let now = moment.unix(moment.now() / 1000)
    this.detailPage.form.controls['DateOfPayment'].setValue(now);
    this.detailPage.form.controls['DateOfFirstContact'].setValue(now);
    this.detailPage.form.controls['DateOfHospitalAdmission'].setValue(now);
  }

  AddNewPatient() {
    if (this.detailPage.form.valid) {
      let fulldata: PatientInformation = {};

      for (let key in this.detailPage.form.controls) {
        if (key == 'CashAmount') {
          (fulldata as any)[key] = this.detailPage.form.controls[key].value.toString();
          continue;
        }
        (fulldata as any)[key] = this.detailPage.form.controls[key].value;
      }

      this.htmlService.isPageReady = false;
      this.dataService.addPatient(fulldata).subscribe(
        (data: any) => {
          this.htmlService.isPageReady = true;
          this.router.navigate(['/reportsList']);
        }
      );
    } else {
      this.detailPage.form.markAllAsTouched();
    }
  }

  canDeactivate(): Observable<boolean> {
    if (this.detailPage.form.dirty) {
      const result = window.confirm('Changes you made may not be saved.');
      return of(result);
    }
    return of(true);
  }
}
