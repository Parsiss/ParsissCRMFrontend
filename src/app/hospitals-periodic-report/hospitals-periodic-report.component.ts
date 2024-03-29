import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { HospitalsPeriodicReportData } from 'src/types/report';
import { DataService } from '../data.service';
import { KeyListOfValues } from '../reports-list-component/interfaces';
import { Moment } from 'jalali-moment';


@Component({
  selector: 'app-hospitals-periodic-report',
  templateUrl: './hospitals-periodic-report.component.html',
  styleUrls: ['./hospitals-periodic-report.component.scss']
})
export class HospitalsPeriodicReportComponent implements OnChanges {
  @Input() filters: KeyListOfValues<number> | null = null;
  @Input() surgery_date_period: Moment[];

  public labels: string[] = [];
  public series: Map<string, number[]> = new Map<string, number[]>();

  constructor(
    private dataService: DataService,
  ) {

  }
  
  public getReport(
  ) {
    let [p1start, p1end, p2start, p2end] = this.surgery_date_period;
    this.dataService.getHospitalsPeriodicReport(
      this.filters,
      p1start.unix(),
      p1end.unix(),
      p2start.unix(),
      p2end.unix()
    ).subscribe(
      (data: HospitalsPeriodicReportData) => {
        let map = new Map<string, number[]>();
        map.set(`${(p1start).format('YYYY/MM')} - ${(p1end).format('YYYY/MM')}`, data.first_period);
        map.set(`${(p2start).format('YYYY/MM')} - ${(p2end).format('YYYY/MM')}`, data.second_period);
        this.series = map;
        this.labels = data.hospitals;
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['filters'] || changes['surgery_date_period']) {
      this.getReport();
    }
  }
}
