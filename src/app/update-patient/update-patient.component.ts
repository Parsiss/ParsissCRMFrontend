import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { PatientInformation } from 'src/types/report';
import { DataService } from '../data.service';
import { DetailPageComponent } from '../detail-page-component/detail-page.component';
import { HtmlService } from '../html.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.scss'],
  providers: [HtmlService]
})
export class UpdatePatientComponent implements OnInit {
  id: number = 0;
  @ViewChild(DetailPageComponent) detailPage: DetailPageComponent;

  patientName = new FormControl('', [Validators.required]);

  name: string | null;

  constructor(
    route: ActivatedRoute,
    private htmlService: HtmlService,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    route.params.subscribe(params => {
      this.id = parseInt(params['id'], 10);
    });
  }

  ngOnInit(): void {
    this.patientName.valueChanges.subscribe(value => {
      this.name = value;
    });
  }

  canDeactivate(): Observable<boolean> {
    console.log('canDeactivate');
    if (false) {
      const result = window.confirm('There are unsaved changes! Are you sure?');
      return of(result);
    }
    return of(true);
  }


  SaveChanges() {

    if (this.id == 0) return;

    if (this.detailPage.form.valid)
    {
      let fulldata: PatientInformation = {}

      fulldata["ID"] = this.id;

      for (let key in this.detailPage.form.controls) {
        if (key == 'CashAmount')
        {
          (fulldata as any)[key] = this.detailPage.form.controls[key].value.toString();
          continue;
        }
        (fulldata as any)[key] = this.detailPage.form.controls[key].value;
      }

      this.htmlService.isPageReady = false;
      this.dataService.updatePatient(fulldata).subscribe(
        (data: any) => {
          this.htmlService.isPageReady = true;
          this._snackBar.open("Profile Updated Successfully", "Close", {
            duration: 2000,
          });
        }
      );
      this.router.navigate(['/reportsList']);
    }
  }

}
