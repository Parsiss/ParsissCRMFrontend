import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetailPageComponent } from '../detail-page-component/detail-page.component';

@Component({
  selector: 'app-add-new-patient',
  templateUrl: './add-new-patient.component.html',
  styleUrls: ['./add-new-patient.component.scss']
})
export class AddNewPatientComponent implements OnInit {
  id: number = -1;
  
  constructor() {
    
  }

  ngOnInit(): void {

  }

}
