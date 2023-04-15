import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { KeyListOfValues } from '../reports-list-component/interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Moment } from 'jalali-moment';

@Component({
  selector: 'app-periodic-reports',
  templateUrl: './periodic-reports.component.html',
  styleUrls: ['./periodic-reports.component.scss']
})
export class PeriodicReportsComponent implements OnInit, OnChanges {
  @Input() filters: KeyListOfValues<number> | null = null;

  public filters_without_time: KeyListOfValues<number> | null = null;
  public surgery_date_period: Moment[]; 
  
  range_first_period: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  range_second_period: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  constructor(
    private dateAdapter: DateAdapter<moment.Moment>,
  ) { }

  ngOnInit(): void {
    this.range_first_period.get('start')!.setValue(this.dateAdapter.today().startOf('year'));
    this.range_first_period.get('end')!.setValue(this.dateAdapter.today().endOf('month'));

    this.range_second_period.get('start')!.setValue(this.dateAdapter.today().subtract(1, 'year').startOf('year'));
    this.range_second_period.get('end')!.setValue(this.dateAdapter.today().subtract(1, 'year').endOf('month'));

    this.range_first_period.valueChanges.subscribe((value) => {
      this.updateForm();
    });

    this.range_second_period.valueChanges.subscribe((value) => {
      this.updateForm();
    });

    this.updateForm();
  }

  updateForm() {
    this.surgery_date_period = [
      this.range_first_period.get('start')!.value,
      this.range_first_period.get('end')!.value,
      this.range_second_period.get('start')!.value,
      this.range_second_period.get('end')!.value
    ]
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['filters']) {
      this.filters_without_time = {...changes['filters'].currentValue};
      if(this.filters_without_time) {
        delete this.filters_without_time['surgery_date'];
        this.filters_without_time = {...this.filters_without_time};
      } else {
        this.filters_without_time = {};
      }
    }
  }

}
