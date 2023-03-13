import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { KeyListOfValues } from '../reports-list-component/interfaces';

@Component({
  selector: 'app-periodic-reports',
  templateUrl: './periodic-reports.component.html',
  styleUrls: ['./periodic-reports.component.scss']
})
export class PeriodicReportsComponent implements OnInit, OnChanges {
  @Input() filters: KeyListOfValues<number> | null = null;
  public filters_without_time: KeyListOfValues<number> | null = null;
  
  constructor() { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {
    if(changes['filters']) {
      this.filters_without_time = changes['filters'].currentValue;
      if(this.filters_without_time) {
        delete this.filters_without_time['surgery_date'];
        this.filters_without_time = {...this.filters_without_time};
      } else {
        this.filters_without_time = {};
      }
    }
  }

}
