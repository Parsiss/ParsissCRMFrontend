import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { DataService } from '../data.service';
import {PatientInformation} from "../../types/report";
import {Moment} from "jalali-moment";


interface CalendarCell
{
  type: "empty" | "date" | "detail";
  data: any;
}


@Component({
  selector: 'app-our-calendar',
  templateUrl: './our-calendar.component.html',
  styleUrls: ['./our-calendar.component.scss']
})
export class OurCalendarComponent implements OnInit {

  @Input() templateRef: any;

  // read ng-container from parent input
  currentDate: moment.Moment;

  calendarCells: CalendarCell[] = [];

  today: Date;

  firstDayOfMonth: number;
  lastDayOfMonth: number;

  daysOrder = [6, 0, 1, 2, 3, 4, 5]

  daysOfWeek: string[];
  daysOfMonth: string[];

  eventsMap: Map<number, PatientInformation[]> = new Map<number, PatientInformation[]>();

  constructor(
    public dateAdapter: DateAdapter<moment.Moment>,
    public dataService: DataService,
    public router: Router
  ) {
    this.today = dateAdapter.today().toDate();
    this.currentDate = dateAdapter.today();
  }

  ngOnInit(): void {
    this.daysOfWeek = this.dateAdapter.getDayOfWeekNames('long');
    this.daysOfMonth = this.dateAdapter.getMonthNames('long');
    this.fillCalendarCells()

    this.dataService.getCalendarEvent().subscribe(
      (data) => {
        data.forEach(event => {
          if(!this.eventsMap.has(event.SurgeryDate as number)) {
            this.eventsMap.set(event.SurgeryDate as number, []);
          }
          this.eventsMap.get(event.SurgeryDate as number)!.push(event);
        })
        this.fillWeeklyReports();
    });

  }

  getListOfDaysInMonth() {
    const year = this.currentDate.jYear();
    const month = this.currentDate.jMonth();
    const daysInMonth = this.dateAdapter.getNumDaysInMonth(this.dateAdapter.createDate(year, month, 1));

    let currentMonthDays= [];
    for (let i = 0; i < daysInMonth; i++) {
      currentMonthDays.push(this.dateAdapter.createDate(year, month, i + 1));
    }

    return currentMonthDays;
  }

  fillCalendarCells() {
    this.calendarCells = [];
    const currentMonthDays = this.getListOfDaysInMonth();
    this.firstDayOfMonth =  this.daysOrder.findIndex((index) => index === currentMonthDays[0].day())
    for(let i = 0; i < this.firstDayOfMonth; i++) {
      this.calendarCells.push({type: "empty", data: null});
    }
    currentMonthDays.forEach((date) => {
      this.calendarCells.push({
        type: "date",
        data: date
      })
    })
    this.lastDayOfMonth = this.daysOrder.findIndex((index) => index === currentMonthDays[currentMonthDays.length - 1].day());
    for(let i = 1; i < 7 - this.lastDayOfMonth; i++) {
      this.calendarCells.push({type: "empty", data: null});
    }
  }

  isTehran(str?: string): boolean {
    if(str == null) {
      return false;
    }

    return str.trim() == 'تهران'
  }

  fillWeeklyReports() {
    if(this.calendarCells.length == 0) {
      throw Error("this method should be called after fillCalendarCells")
    }

    let daysOfThisWeek: moment.Moment[] = [];
    for(let i = 0; i < this.calendarCells.length + 1; ++i) {
      if(i % 8 == 7) {
        let publicHospital = 0, privateHospital = 0, tehran = 0;

        for(let day of daysOfThisWeek) {
          let events = this.eventsMap.get(day.unix());
          if(events == undefined) {
            events = [];
          }

          for(let event of events) {
            publicHospital += (event.HospitalType == 1 && event.SurgeryResult == 1) ? 1 : 0;
            privateHospital += (event.HospitalType == 0 && !this.isTehran(event.Hospital) && event.SurgeryResult == 1) ? 1 : 0;
            tehran += this.isTehran(event.Hospital) && event.SurgeryResult == 1 ? 1 : 0;
           }
        }


        this.calendarCells.splice(i, 0, {type: "detail", data: {
            'Public': publicHospital,
            'Private': privateHospital,
            'Tehran': tehran
        }});

        daysOfThisWeek = [];
        ++i;
      }
      if(i < this.calendarCells.length && this.calendarCells[i].type == 'date') {
        daysOfThisWeek.push(this.calendarCells[i].data)
      }
    }

  }

  nextMonth()
  {
    this.currentDate = this.currentDate.add(1, "jmonth")
    this.fillCalendarCells();
    this.fillWeeklyReports();
  }

  previousMonth()
  {
    this.currentDate = this.currentDate.add(-1, "jmonth")
    this.fillCalendarCells();
    this.fillWeeklyReports();
  }

  cliecked(date: any) {
    this.router.navigate(['/add_new_patient', { date: date.unix()}])
  }
}
