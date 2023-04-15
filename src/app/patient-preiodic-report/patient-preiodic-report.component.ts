import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DataService } from '../data.service';
import { KeyListOfValues } from '../reports-list-component/interfaces';
import { HospitalsPeriodicReportData } from 'src/types/report';
import { Moment } from 'jalali-moment';

@Component({
  selector: 'app-patient-preiodic-report',
  templateUrl: './patient-preiodic-report.component.html',
  styleUrls: ['./patient-preiodic-report.component.scss']
})
export class PatientPreiodicReportComponent implements OnInit {
  @Input() filters: KeyListOfValues<number> | null = null;
  @Input() surgery_date_period: Moment[];

  public labels: string[] = [];
  public series: Map<string, number[]> = new Map<string, number[]>();

  constructor(
    private dataService: DataService,
  ) {

  }

  ngOnInit(): void {
      
  }
  
  getReport(): void {
    let [p1start, p1end, p2start, p2end] = this.surgery_date_period;
    this.dataService.getPatientPeriodicReport(
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

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['filters'] || changes['surgery_date_period']) {
      this.getReport();
    }
  }
}