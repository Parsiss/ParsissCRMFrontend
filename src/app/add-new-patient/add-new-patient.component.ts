import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientFullInformation } from 'src/types/report';
import { DataService } from '../data.service';
import { DetailPageComponent } from '../detail-page-component/detail-page.component';
import { HtmlService } from '../html.service';

@Component({
  selector: 'app-add-new-patient',
  templateUrl: './add-new-patient.component.html',
  styleUrls: ['./add-new-patient.component.scss'],
  providers: [HtmlService]
})
export class AddNewPatientComponent implements OnInit {
  id: number = -1;
  @ViewChild(DetailPageComponent) detailPage: DetailPageComponent;

  constructor(
    private htmlService: HtmlService,
    private dataService: DataService,
    private router: Router) {

  }

  ngOnInit(): void {

  }

  AddNewPatient() {
    let fulldata: PatientFullInformation = this.detailPage.fulldata;

    for (let key in this.detailPage.form.controls) {
      if (key in this.detailPage.fulldata.Patient) {
        (fulldata.Patient as any)[key] = this.detailPage.form.controls[key].value;
      } else if (key in this.detailPage.fulldata.SurgeryInfo) {
        (fulldata.SurgeryInfo as any)[key] = this.detailPage.form.controls[key].value;
      } else if (key in this.detailPage.fulldata.FinancialInfo) {
        (fulldata.FinancialInfo as any)[key] = this.detailPage.form.controls[key].value;
      }
    }

    this.htmlService.isPageReady = false;
    this.dataService.addPatient(fulldata).subscribe(
      (data: any) => {
        this.htmlService.isPageReady = true;
        this.router.navigate(['/reportsList']);
      }
    );
  }

}
