import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { DataService } from '../data.service';
import { DatedReportDialogData, PatientInformation } from "../../types/report";
import { DialogOverviewComponent } from "../dialog-overview/dialog-overview.component";
import { MatDialog } from "@angular/material/dialog";
import { saveAs } from 'file-saver';
import { NgxCaptureService } from 'ngx-capture';
import renderReport from "./dialog_content";
import { ReportOverviewDialogComponent } from '../report-overview-dialog/report-overview-dialog.component';


interface CalendarCell {
  type: "date" | "detail" | "transparent-date";
  data: any;
}


@Component({
  selector: 'app-our-calendar',
  templateUrl: './our-calendar.component.html',
  styleUrls: ['./our-calendar.component.scss'],
  providers: [Document]
})
export class OurCalendarComponent implements OnInit {

  @Input() templateRef: any;

  // read ng-container from parent input
  currentDate: moment.Moment;

  calendarCells: CalendarCell[] = [];

  dialogRef: any;

  monthlyReportData: DatedReportDialogData;
  today: Date;

  currentMonthDays: moment.Moment[] = [];

  daysOrder = [6, 0, 1, 2, 3, 4, 5]

  daysOfWeek: string[];
  daysOfMonth: string[];

  eventsMap: Map<number, PatientInformation[]> = new Map<number, PatientInformation[]>();

  constructor(
    public dateAdapter: DateAdapter<moment.Moment>,
    public dataService: DataService,
    public router: Router,
    private dialog: MatDialog,
  ) {
    this.today = dateAdapter.today().toDate();
    this.currentDate = dateAdapter.today();
  }

  ngOnInit(): void {
    this.daysOfWeek = this.dateAdapter.getDayOfWeekNames('long');
    this.daysOfMonth = this.dateAdapter.getMonthNames('long');
    this.fillCalendarCells();

    this.dataService.getCalendarEvent().subscribe(
      (data) => {
        data.forEach(event => {
          let unix = event.SurgeryDate ? event.SurgeryDate : 0;
          if (!this.eventsMap.has(unix)) {
            this.eventsMap.set(unix, []);
          }
          this.eventsMap.get(unix)!.push(event);
        })
        this.fillWeeklyReports();
        this.fillMonthlyReports();
      });
  }

  fillListOfDaysInMonth() {
    const year = this.currentDate.jYear();
    const month = this.currentDate.jMonth();
    const daysInMonth = this.dateAdapter.getNumDaysInMonth(this.dateAdapter.createDate(year, month, 1));
    this.currentMonthDays = [];
    for (let i = 0; i < daysInMonth; i++) {
      this.currentMonthDays.push(this.dateAdapter.createDate(year, month, i + 1));
    }
  }

  fillCalendarCells() {
    this.calendarCells = [];
    this.fillListOfDaysInMonth();
    let firstDayOfMonth = this.daysOrder.findIndex((index) => index === this.currentMonthDays[0].day())
    for (let i = 0; i < firstDayOfMonth; i++) {
      let date = this.currentMonthDays[0].clone().subtract(firstDayOfMonth - i, 'days');
      this.calendarCells.push({
        type: "transparent-date",
        data: date
      })
    }

    this.currentMonthDays.forEach((date) => {
      this.calendarCells.push({
        type: "date",
        data: date
      })
    })

    let lastDayOfMonth = this.daysOrder.findIndex((index) => index === this.currentMonthDays[this.currentMonthDays.length - 1].day());
    for (let i = 1; i < 7 - lastDayOfMonth; i++) {
      let date = this.currentMonthDays[this.currentMonthDays.length - 1].clone().add(i, 'days');
      this.calendarCells.push({ type: "transparent-date", data: date });
    }

    for (let i = 0; i < this.calendarCells.length; i++) {
      if (i % 8 == 7) {
        this.calendarCells.splice(i, 0, { type: "detail", data: {
          'date': this.calendarCells[i - 1].data,
          'Public': 0,
          'Private': 0,
          'Total': 0,
        }});
      }
    }
  }

  isTehran(str?: string): boolean {
    if (str == null) {
      return false;
    }

    return str.trim() == 'تهران'
  }

  fillWeeklyReports() {
    if (this.calendarCells.length == 0) {
      throw Error("this method should be called after fillCalendarCells")
    }

    for (let i = 0; i < this.calendarCells.length; ++i) {
      if (this.calendarCells[i].type == "detail") {
        let to = this.calendarCells[i].data.date;
        let from = this.calendarCells[i].data.date.clone().subtract(6, 'days');

        this.dataService.getDatedReports(from.unix(), to.unix()).subscribe(
          (data) => {
            let total = data.result['مجموع'];
            this.calendarCells[i].data = {
              'Public': total[0],
              'Private': total[1],
              'Tehran': total[2],
              'data': {
                title: 'گزارش هفتگی',
                result: data.result,
                types: data.types,
                operators: Object.keys(data.result),
                from: from.format('jYYYY/jMM/jDD'),
                to: to.format('jYYYY/jMM/jDD')
              }
            }
          });
      }
    }
  }

  nextMonth() {
    this.currentDate = this.currentDate.add(1, "jmonth")
    this.fillCalendarCells();
    this.fillWeeklyReports();
    this.fillMonthlyReports();
  }

  previousMonth() {
    this.currentDate = this.currentDate.add(-1, "jmonth")
    this.fillCalendarCells();
    this.fillWeeklyReports();
    this.fillMonthlyReports();
  }

  cliecked(date: any) {
    this.router.navigate(['/add_new_patient', { date: date.unix() }])
  }

  dialogReportClick(data: DatedReportDialogData) {
    if(this.dialogRef != null) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(ReportOverviewDialogComponent, {
      width: '800px',
      height: '300px',
      direction: 'rtl',
      data: data
    });
  }

  private fillMonthlyReports() {
    let from = this.currentMonthDays[0], to = this.currentMonthDays[this.currentMonthDays.length - 1];
    this.dataService.getDatedReports(from.unix(), to.unix()).subscribe(
      (data) => {
        this.monthlyReportData = {
          title: 'گزارش ماهانه',
          result: data.result,
          types: data.types,
          operators: Object.keys(data.result),
          from: from.format('jYYYY/jMM/jDD'),
          to: to.format('jYYYY/jMM/jDD')
        }
      }
    );
  }
}
