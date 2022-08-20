import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { DataService } from '../data.service';
import {SurgeriesInformation} from "../../types/report";


@Component({
  selector: 'app-our-calendar',
  templateUrl: './our-calendar.component.html',
  styleUrls: ['./our-calendar.component.scss']
})
export class OurCalendarComponent implements OnInit {

  @Input() templateRef: any;

  // read ng-container from parent input
  currentDate: moment.Moment;

  days: any[];
  today: Date;

  firstDayOfMonth: number;
  lastDayOfMonth: number;
  trash: any[];
  trash2: any[];

  daysOrder = [6, 0, 1, 2, 3, 4, 5]

  daysOfWeek: string[];
  daysOfMonth: string[];

  eventsMap: Map<number, SurgeriesInformation[]> = new Map<number, SurgeriesInformation[]>();

  constructor(
    public dateAdapter: DateAdapter<moment.Moment>,
    public dataService: DataService,
    public router: Router
  ) {
    this.today = dateAdapter.today().toDate();
    this.currentDate = dateAdapter.today();
    console.log(this.today)
  }

  ngOnInit(): void {
    this.daysOfWeek = this.dateAdapter.getDayOfWeekNames('long');
    this.daysOfMonth = this.dateAdapter.getMonthNames('long');
    this.filldays()

    this.dataService.getCalendarEvent().subscribe(
      (data) => {
        data.forEach(event => {
          if(!this.eventsMap.has(event.SurgeryDate as number)) {
            this.eventsMap.set(event.SurgeryDate as number, []);
          }
          this.eventsMap.get(event.SurgeryDate as number)!.push(event);
        })
    });

  }

  getListOfDaysInMonth() {
    const year = this.currentDate.jYear();
    const month = this.currentDate.jMonth();
    const daysInMonth = this.dateAdapter.getNumDaysInMonth(this.dateAdapter.createDate(year, month, 1));

    this.days = [];
    for (let i = 0; i < daysInMonth; i++) {
      this.days.push(this.dateAdapter.createDate(year, month, i + 1));
    }

    return this.days;
  }

  filldays() {
    this.days = this.getListOfDaysInMonth();
    this.firstDayOfMonth =  this.daysOrder.findIndex((index) => index === this.days[0].day())
    this.lastDayOfMonth = this.daysOrder.findIndex((index) => index === this.days[this.days.length - 1].day());
    this.trash = [];
    for(let i = 0; i < this.firstDayOfMonth; i++) {
      this.trash.push(this.days[i]);
    }
    this.trash2 = [];
    for(let i = 1; i < 7 - this.lastDayOfMonth; i++) {
      this.trash2.push(this.days[i]);
    }
  }

  nextMonth()
  {
    this.currentDate = this.currentDate.add(1, "jmonth")
    this.filldays()
  }

  previousMonth()
  {
    this.currentDate = this.currentDate.add(-1, "jmonth")
    this.filldays()
  }

  cliecked(date: any) {
    this.router.navigate(['/add_new_patient', { date: date.unix()}])
  }
}
