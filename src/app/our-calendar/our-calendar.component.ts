import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { DataService } from '../data.service';


@Component({
  selector: 'app-our-calendar',
  templateUrl: './our-calendar.component.html',
  styleUrls: ['./our-calendar.component.scss']
})
export class OurCalendarComponent implements OnInit {

  @Input() templateRef: any;

  // read ng-container from parent input
  year = 1401;
  month = 7;

  days: any[];

  firstDayOfMonth: number;
  lastDayOfMonth: number;
  trash: any[];
  trash2: any[];

  
  daysOfWeek: string[];

  eventsMap: Map<number, string[]> = new Map<number, string[]>();

  constructor(
    public dateAdapter: DateAdapter<moment.Moment>,
    public dataService: DataService,
    public router: Router
  ) {
    
  }

  ngOnInit(): void {
    this.daysOfWeek = this.dateAdapter.getDayOfWeekNames('short');
    this.filldays()

    this.dataService.getCalendarEvent().subscribe(
      (data) => {
        data.forEach(event => {
          if(!this.eventsMap.has(event.SurgeryDate as number)) {
            this.eventsMap.set(event.SurgeryDate as number, []);
          }
          this.eventsMap.get(event.SurgeryDate as number)!.push(event.OperatorFirst as string);
          for(let [key, value] of this.eventsMap) {
            console.log(key, value);
          }
        })
    });
    
  }

  getListOfDaysInMonth(year: number, month: number) {    
    const daysInMonth = this.dateAdapter.getNumDaysInMonth(this.dateAdapter.createDate(year, month, 1));

    this.days = [];
    for (let i = 0; i < daysInMonth; i++) {
      this.days.push(this.dateAdapter.createDate(year, month, i + 1));
    }
    
    return this.days;
  }

  filldays() {
    this.days = this.getListOfDaysInMonth(this.year, this.month);
    this.firstDayOfMonth = this.days[0].day();
    this.lastDayOfMonth = this.days[this.days.length - 1].day();
    this.trash = [];
    for(let i = 0; i < this.firstDayOfMonth + 1; i++) {
      this.trash.push(this.days[i]);
    }
    this.trash2 = [];
    for(let i = 1; i < 6 - this.lastDayOfMonth; i++) {
      this.trash2.push(this.days[i]);
    }
  }

  cliecked(date: any) {
    this.router.navigate(['/add_new_patient', { date: date.unix()}])
  }
}
