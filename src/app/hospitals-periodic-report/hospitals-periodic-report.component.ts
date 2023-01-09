import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { HospitalsPeriodicReportData } from 'src/types/report';
import { DataService } from '../data.service';


@Component({
  selector: 'app-hospitals-periodic-report',
  templateUrl: './hospitals-periodic-report.component.html',
  styleUrls: ['./hospitals-periodic-report.component.scss']
})
export class HospitalsPeriodicReportComponent implements OnInit, AfterViewInit {
  range_first_period: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  range_second_period: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  public labels: string[] = [];
  public series: Map<string, number[]> = new Map<string, number[]>();

  constructor(
    private dataService: DataService,
    private dateAdapter: DateAdapter<moment.Moment>,
  ) {
  }


  initializeForms() {
    this.range_first_period.get('start')!.setValue(this.dateAdapter.today().startOf('year'));
    this.range_first_period.get('end')!.setValue(this.dateAdapter.today().endOf('month'));

    this.range_second_period.get('start')!.setValue(this.dateAdapter.today().subtract(1, 'year').startOf('year'));
    this.range_second_period.get('end')!.setValue(this.dateAdapter.today().subtract(1, 'year').endOf('month'));
  }

  ngOnInit(): void {
    this.initializeForms();
    this.updateForm();
  }

  ngAfterViewInit() {
    this.range_first_period.valueChanges.subscribe((value) => {
      this.updateForm();
    });

    this.range_second_period.valueChanges.subscribe((value) => {
      this.updateForm();
    });
  }

  updateForm() {
    this.getReport(
      this.range_first_period.get('start')!.value,
      this.range_first_period.get('end')!.value,
      this.range_second_period.get('start')!.value,
      this.range_second_period.get('end')!.value
    );
  }
  
  public getReport(
    p1start: moment.Moment,
    p1end: moment.Moment,
    p2start: moment.Moment,
    p2end: moment.Moment
  ) {
    this.dataService.getHospitalsPeriodicReport(
      p1start.unix(),
      p1end.unix(),
      p2start.unix(),
      p2end.unix()
    ).subscribe(
      (data: HospitalsPeriodicReportData) => {
        let map = new Map<string, number[]>();
        map.set(`${p1start.format('YYYY/MM')} - ${p1end.format('YYYY/MM')}`, data.first_period);
        map.set(`${p2start.format('YYYY/MM')} - ${p2end.format('YYYY/MM')}`, data.second_period);

        this.series = map;
        this.labels = data.hospitals;
      }
    );
  }
  
}
