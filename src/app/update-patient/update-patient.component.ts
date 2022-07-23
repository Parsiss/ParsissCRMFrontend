import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetailPageComponent } from '../detail-page-component/detail-page.component';

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.scss']
})
export class UpdatePatientComponent implements AfterViewInit {
  id: number = 11234;
  @ViewChild(DetailPageComponent) detailPage: DetailPageComponent;

  patientName = new FormControl('', [Validators.required]);

  name: string;

  constructor(
    route: ActivatedRoute,
  ) {
    route.params.subscribe(params => {
      this.id = parseInt(params['id'], 10);
    });
  }

  ngAfterViewInit(): void {
    this.patientName.valueChanges.subscribe(value => {
      this.name = value;
    });

  }

}
