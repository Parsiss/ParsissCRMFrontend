import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {
  id: string;

  form: FormGroup;

  constructor(
    route: ActivatedRoute,
    private cd : ChangeDetectorRef
  ) {
    route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      national_id: new FormControl('', Validators.pattern('^[0-9]*$')),
      phone: new FormControl('', Validators.pattern('^[0-9]{10}$')),
      surgery_date: new FormControl(''),
      address: new FormControl(''),
      palce_of_birth: new FormControl(''),
      surgeon_first: new FormControl(''),
      hospital: new FormControl(''),
      hospital_type: new FormControl(''),
      surgery_day: new FormControl(''),
    });
    
    this.form.controls['surgery_date'].valueChanges.subscribe(value => {
      const day = new Date(value).getDay();
      this.form.controls['surgery_day'].setValue(String(day));
    });

  }

  ngOnInit(): void {

  }

}
