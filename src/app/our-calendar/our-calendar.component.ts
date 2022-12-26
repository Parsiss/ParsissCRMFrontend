import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { DataService } from '../data.service';
import {PatientInformation} from "../../types/report";
import {DialogOverviewComponent} from "../dialog-overview/dialog-overview.component";
import {MatDialog} from "@angular/material/dialog";
import { saveAs } from 'file-saver';
import { NgxCaptureService } from 'ngx-capture';
import renderReport from "./dialog_content";


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

  monthlyReportData: CalendarCell;
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
    public router: Router,
    private dialog: MatDialog,
    private captureService:NgxCaptureService
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
          if(!this.eventsMap.has(event.SurgeryDate as number)) {
            this.eventsMap.set(event.SurgeryDate as number, []);
          }
          this.eventsMap.get(event.SurgeryDate as number)!.push(event);
        })
        this.fillWeeklyReports();
        this.fillMonthlyReports();
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

    let endOfWeekNotDetail = false;
    for(let i = 0; i < this.calendarCells.length; ++i) {
      if(i % 8 == 7) {
        if(endOfWeekNotDetail) {
          this.calendarCells.splice(i, 0, {type: "empty", data: null});
          endOfWeekNotDetail = false;
        }
        else {
          let publicHospital = 0, privateHospital = 0, tehran = 0;
          interface IHospitalType {
            public: number;
            private: number;
            tehran: number;
          }
          var optList: { [name: string] : IHospitalType;} = {};

          for(let j = 1; j < 8; ++j) {
            let events = this.eventsMap.get(this.calendarCells[i].data.unix() - (86400 * j));
            if(events == undefined) {
              events = [];
            }
            for(let event of events) {
              publicHospital += (event.HospitalType == 1 && event.SurgeryResult == 1) ? 1 : 0;
              privateHospital += (event.HospitalType == 0 && !this.isTehran(event.Hospital) && event.SurgeryResult == 1) ? 1 : 0;
              tehran += this.isTehran(event.Hospital) && event.SurgeryResult == 1 ? 1 : 0;
              if(event.SurgeryResult == 1){
                if (optList[event.OperatorFirst!] == undefined){
                  optList[event.OperatorFirst!] = {public:0,private:0,tehran:0}
                }
                optList[event.OperatorFirst!].public += event.HospitalType == 1 ? 1 : 0;
                optList[event.OperatorFirst!].private += event.HospitalType == 0 && !this.isTehran(event.Hospital) ? 1 : 0;
                optList[event.OperatorFirst!].tehran += this.isTehran(event.Hospital) ? 1 : 0;
              }
            }
          }
          let to = this.calendarCells[i].data.format('jYYYY/jMM/jDD');
          let from = this.calendarCells[i].data.subtract(7, 'days').format('jYYYY/jMM/jDD');
          this.calendarCells[i].data.add(7, 'days');
          this.calendarCells.splice(i, 0, {type: "detail", data: {
              'Public': publicHospital,
              'Private': privateHospital,
              'Tehran': tehran,
              'Total': publicHospital + privateHospital + tehran,
              'optList':optList,
              'optName': Object.keys(optList),
              'fromDate': from,
              'toDate': to
            }});
        }
      }
      if (i < this.calendarCells.length){
        if (this.calendarCells[i].type == "date" && this.calendarCells[i+1].type == "empty") {
          endOfWeekNotDetail = true;
        }
      }
    }

  }

  nextMonth()
  {
    this.currentDate = this.currentDate.add(1, "jmonth")
    this.fillCalendarCells();
    this.fillWeeklyReports();
    this.fillMonthlyReports();
  }

  previousMonth()
  {
    this.currentDate = this.currentDate.add(-1, "jmonth")
    this.fillCalendarCells();
    this.fillWeeklyReports();
    this.fillMonthlyReports();
  }

  cliecked(date: any) {
    this.router.navigate(['/add_new_patient', { date: date.unix()}])
  }

  @ViewChild('screen', { static: true }) screen: any;
  convertBase64ToFile(base64String: string, fileName: string): File {
    let arr = base64String.split(',');
    // @ts-ignore
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
      uint8Array[n] = bstr.charCodeAt(n);
    }
    return new File([uint8Array], fileName, {type: mime});
  }
  downloadBase64Data(base64String: string, fileName: string): void {
    let file = this.convertBase64ToFile(base64String, fileName);
    saveAs(file, fileName);
  }

  dialogReportClick(title: string, data: any) {
    console.log(data)
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '800px',

      height: '300px',
      direction: 'rtl',
      data: {title: title, content: renderReport(data)}
    });
    let base64_img: string;
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Canceled') {
        return;
      }
      this.downloadBase64Data(base64_img, "Weekly Report");
    });
    dialogRef.afterOpened().subscribe(result => {
      this.captureService.getImage(document.getElementById('dialog_content')!, true).subscribe(img=>{
        base64_img = img
      })
    });
  }

  private fillMonthlyReports() {
    let publicHospital = 0, privateHospital = 0, tehran = 0;
    interface IHospitalType {
      public: number;
      private: number;
      tehran: number;
    }
    var optList: { [name: string] : IHospitalType;} = {};

    let from: any, to: any;
    for (let i = 0; i < this.calendarCells.length; ++i) {
      if ((this.calendarCells[i].type == "date" && i == 0) ||
        (this.calendarCells[i].type == "date" && this.calendarCells[i-1].type == "empty")) {
        from = this.calendarCells[i].data.format('jYYYY/jMM/jDD');
      }
      if ((this.calendarCells[i].type == "date" && i == this.calendarCells.length - 1) ||
        (this.calendarCells[i].type == "date" && this.calendarCells[i+1].type == "empty")) {
        to = this.calendarCells[i].data.format('jYYYY/jMM/jDD');
      }
      if (this.calendarCells[i].type == "date") {
        let events = this.eventsMap.get(this.calendarCells[i].data.unix());
        if (events == undefined) {
          events = [];
        }
        for (let event of events) {
          publicHospital += (event.HospitalType == 1 && event.SurgeryResult == 1) ? 1 : 0;
          privateHospital += (event.HospitalType == 0 && !this.isTehran(event.Hospital) && event.SurgeryResult == 1) ? 1 : 0;
          tehran += this.isTehran(event.Hospital) && event.SurgeryResult == 1 ? 1 : 0;
          if(event.SurgeryResult == 1){
            if (optList[event.OperatorFirst!] == undefined){
              optList[event.OperatorFirst!] = {public:0,private:0,tehran:0}
            }
            optList[event.OperatorFirst!].public += event.HospitalType == 1 ? 1 : 0;
            optList[event.OperatorFirst!].private += event.HospitalType == 0 && !this.isTehran(event.Hospital) ? 1 : 0;
            optList[event.OperatorFirst!].tehran += this.isTehran(event.Hospital) ? 1 : 0;
          }
        }
      }
    }
    this.monthlyReportData = {
      type: "detail", data: {
        'Public': publicHospital,
        'Private': privateHospital,
        'Tehran': tehran,
        'Total': publicHospital + privateHospital + tehran,
        'optList': optList,
        'optName': Object.keys(optList),
        'fromDate': from,
        'toDate': to
      }
    }
  }
}
