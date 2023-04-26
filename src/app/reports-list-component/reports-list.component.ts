// زن زندگی آزادی
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PatientInformation, PatientListData, tableData } from 'src/types/report';
import { DataService } from '../data.service';
import { FormControl, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';
import { ExcelService } from "../excel.service";
import * as moment from "jalali-moment";
import { DateAdapter } from "@angular/material/core";

import { UploadService } from "../upload.service";
import { ActiveFilters, ComboOptions } from 'src/types/filters';

import { combineLatest } from 'rxjs';
import { AddUnderlinePipe } from '../add-underline.pipe';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  patientData: PatientInformation[];
  public dataCount: number;


  public weekdays_color: { [key: string]: string } = {
    'Saturday': 'black',
    'Sunday': 'steelblue',
    'Monday': 'black',
    'Tuesday': 'steelblue',
    'Wednesday': 'black',
    'Thursday': 'steelblue',
    'Friday': 'black',
  };


  dataSource = new MatTableDataSource<tableData>([]);
  displayedFields: string[] = [
    'SurgeryDate', 'Name', 'PaymentStatus', 'SurgeonFirst', 'Hospital', 'NationalId', 'PhoneNumber',
    'SurgeryResult', 'PaymentCard', 'CashAmount', 'OperatorFirst'
  ];

  displayedColumns: string[] = [...this.displayedFields, 'Actions', 'Previous'];

  comboOptions: ComboOptions<number>;
  public basicfilterOptions: ComboOptions<number>;
  public adaptiveFilterOptions: ComboOptions<string> = {};

  public activeFilters: ActiveFilters;

  date_filter_range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  loading: boolean = false;
  periodicTab: boolean = false;
  file: File;

  addUnderlinePipe = new AddUnderlinePipe();

  constructor(
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    public excelService: ExcelService,
    public dateAdapter: DateAdapter<moment.Moment>,
    private uploadService: UploadService,
    private translate: TranslateService
  ) { }


  ngOnInit(): void {
    this.activeFilters = localStorage.getItem('ReportsList_internalFilter') ? JSON.parse(localStorage.getItem('ReportsList_internalFilter')!) : {};

    this.date_filter_range.controls['start'].valueChanges.subscribe(this.dateFilterChanged.bind(this));
    this.date_filter_range.controls['end'].valueChanges.subscribe(this.dateFilterChanged.bind(this));

    this.dataService.getOptions().subscribe({
      next: (data) => this.comboOptions = data,
      complete: () => this.dataService.getReports(this.activeFilters, this.paginator.pageIndex, this.paginator.pageSize).subscribe(this.fillTableReportData.bind(this))
    });

    let basicFilter$ = this.dataService.getFilters();
    let adaptiverFilter$ = this.dataService.getAdaptiveFilterOptions(this.activeFilters);
    combineLatest([basicFilter$, adaptiverFilter$]).subscribe(([basicFilter, adaptiveFilter]) => {
      this.basicfilterOptions = basicFilter;
      this.adaptiveFilterOptions = adaptiveFilter;
      this.initialize_activeFilters();
    });
  }

  initialize_activeFilters() {
    if(this.activeFilters["surgery_date"]) {
      this.date_filter_range.controls['start'].setValue(moment.unix(this.activeFilters["surgery_date"][0]));
      this.date_filter_range.controls['end'].setValue(moment.unix(this.activeFilters["surgery_date"][1]));
    }

    for(const [key, values] of Object.entries(this.activeFilters)) {
      if(key === 'surgery_date') {
        continue;
      }

      if(this.basicfilterOptions[key]) {
        this.basicfilterOptions[key].forEach((item) => {
          if(values.indexOf(item.Value) !== -1) {
            item.Selected = true;
          }
        });
      } else {
        values.forEach(value => {
          let option = this.adaptiveFilterOptions[key].find((item) => item.Value === value);
          if(option) {
            option.Selected = true;
          } else {
            this.adaptiveFilterOptions[key].unshift({Value: value, Text: `${value} (0)`, Selected: true});
          }
        });
      }
    }
  }

  pageChanged(event: PageEvent) {
    this.dataService.getReports(this.activeFilters, event.pageIndex, event.pageSize).subscribe(this.fillTableReportData.bind(this));
  }

  checkboxChanged(group: string, value: any) {
    let will_afterward_be_selected = false;
    if(Object.keys(this.adaptiveFilterOptions).indexOf(group) === -1) {
      let comboOption = this.basicfilterOptions[group].find((item) => item.Value === value)!;
      will_afterward_be_selected = comboOption.Selected = !comboOption.Selected;
    } else {
      let comboOption = this.adaptiveFilterOptions[group].find((item) => item.Value === value)!;
      will_afterward_be_selected = comboOption.Selected = !comboOption.Selected;
    }


    if(will_afterward_be_selected){
      if(!this.activeFilters[group]) {
        this.activeFilters[group] = []
      }
      this.activeFilters[group].push(value);
    } else {
      this.activeFilters[group] = this.activeFilters[group].filter((item) => item !== value);
      if(!this.activeFilters[group].length) {
        delete this.activeFilters[group];
      }
    }

    this.applyFilters();
  }

  navigateTo(id: number) {
    this.router.navigate(['/detailPage/' + id]);
  }

  remove(id: number) {
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '350px',
      data: { title: "Remove Report", content: "Are you sure you want to remove this report?" },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Canceled') {
        return;
      }
      this.dataService.deletePatient(id).subscribe(
        (_) => {
          this._snackBar.open("Report removed successfully", "Close", {
            duration: 2000,
          });
          this.dataService.getReports(this.activeFilters, this.paginator.pageIndex, this.paginator.pageSize).subscribe(this.fillTableReportData.bind(this));
        });
    }
    );
  }

  dateFilterChanged() {
    if(this.date_filter_range.controls['start'].value === null && this.date_filter_range.controls['end'].value === null) {
      delete this.activeFilters["surgery_date"];
    } else if(this.date_filter_range.controls['start'].value === null) {
      this.activeFilters["surgery_date"] = [
        null,
        this.date_filter_range.controls['end'].value.unix()
      ];
    } else if(this.date_filter_range.controls['end'].value === null) {
      this.activeFilters["surgery_date"] = [
        this.date_filter_range.controls['start'].value.unix(),
        null
      ];
    } else {
      this.activeFilters["surgery_date"] = [
        this.date_filter_range.controls['start'].value.unix(),
        this.date_filter_range.controls['end'].value.unix()
      ];
    }

    this.applyFilters();
  }

  applyFilters() {
    this.activeFilters = {...this.activeFilters};

    this.dataService.getReports(this.activeFilters, this.paginator.pageIndex, this.paginator.pageSize).subscribe(this.fillTableReportData.bind(this));
    this.dataService.getAdaptiveFilterOptions(this.activeFilters).subscribe((filters) => {
      for(let field of ['hospital', 'surgeon_first', 'operator_first']) {
        let selected = this.adaptiveFilterOptions[field].filter((item) => item.Selected).map((item) => item.Value);
        this.adaptiveFilterOptions[field].splice(0, this.adaptiveFilterOptions[field].length)

        for(let value of selected) {
          if(filters[field].findIndex((item) => item.Value === value) === -1) {
            this.adaptiveFilterOptions[field].push({Value: value, Text: `${value} (0)`, Selected: true});
          }
        }

        for(let item of filters[field]) {
          if(selected.indexOf(item.Value) !== -1) {
            item.Selected = true;
          }
          this.adaptiveFilterOptions[field].push(item);
        }
      }
    });

    localStorage.setItem('ReportsList_internalFilter', JSON.stringify(this.activeFilters));
  }


  formatJdate(date: string) {
    let m = moment(date, 'YYYY-MM-DD');
    let localMonth = this.dateAdapter.getMonthNames('long')[m.jMonth()];
    let weekday = this.dateAdapter.getDayOfWeekNames('long')[((m.jDay() + 6) % 7)];
    return `${weekday} ${m.jDate()} ${localMonth}`;
  }

  fillTableReportData(data: PatientListData) {
    var temp: tableData[] = [];
    this.patientData = data.data;

    this.patientData.forEach((patient) => {
      let previous_surgeries = '';
      for(let [date, result] of patient.PreviousSurgeries!) {
        let jdate = this.formatJdate(date);
        let result_text = this.translate.instant(this.getBasicComboOptionText('surgery_result', result))
        previous_surgeries += `${jdate}(${result_text}), `;
      }
      previous_surgeries = previous_surgeries.slice(0, -2);

      temp.push({
        ID: patient.ID,
        SurgeryDate: this.formatJdate(patient.SurgeryDate!.toString()),
        Name: patient.Name,
        NationalId: patient.NationalID,
        PhoneNumber: patient.PhoneNumber,
        SurgeonFirst: patient.SurgeonFirst,
        Hospital: patient.Hospital,
        OperatorFirst: patient.OperatorFirst,
        SurgeryResult: this.getBasicComboOptionText('surgery_result', patient.SurgeryResult),
        SurgeryDay: this.getBasicComboOptionText('surgery_day', patient.SurgeryDay),
        PaymentStatus: this.getBasicComboOptionText('payment_status', patient.PaymentStatus),
        PaymentCard: patient.LastFourDigitsCard,
        CashAmount: patient.CashAmount,
        PreviousSurgeries: previous_surgeries
      })
    });
    this.dataSource.data = temp;
    this.dataCount = data.total;
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadExcel() {
    // pop up
    // this._snackBar.open('This feature is not working right now', 'Close', {
    //   duration: 2000,
    // });
    this.dataService.getFilteredReportExcel(this.activeFilters).subscribe(data => {
      let excelFileData: Map<string, any[]> = new Map<string, any[]>();
      data.data.forEach((patient) => {
        for(let [key, value] of Object.entries(patient)) {
          try {
            if(excelFileData.get(key) === undefined) {
              excelFileData.set(key, []);
            }
            if(["SurgeryResult", "PaymentStatus", "SurgeryDay", "SurgeryArea", "HospitalType", "HeadFixType",
              "SurgeryTime", "CT", "MR", "FMRI", "DTI"].includes(key)) {
              if(value != null) {
                excelFileData.get(key)!.push(this.comboOptions[this.addUnderlinePipe.transform(key).toLowerCase()].find(f =>
                  f.Value == value.toString()) === undefined ?
                  '' : this.comboOptions[this.addUnderlinePipe.transform(key).toLowerCase()].find(f => f.Value == value.toString())!.Text);


              } else {
                excelFileData.get(key)!.push('');
              }
            }
            else if(key.includes("Date")) {
              if(value != null) {
                let date = this.dateAdapter.parse(value, "YYYY-MM-DD");
                if(date != null) {
                  excelFileData.get(key)!.push(this.dateAdapter.format(date, "YYYY-MM-DD"));
                } else {
                  console.error("Date is not in the correct format ", value);
                }
              }
            }
            else
              excelFileData.get(key)!.push(value);

          } catch (e) {
            console.log(patient);
            console.log(key, value);
            console.error(e);
          }
        }
      });
      this.excelService.exportAsXLSX(excelFileData);
    });

  }


  getBasicComboOptionText(group: string, value: any): string {
    if(value === undefined) {
      return ""
    }

    let optionsList = this.comboOptions[group];
    if(optionsList === undefined) {
      throw Error('Invalid Group of Combo Box: ' + group)
    }

    let option = optionsList.find(item => item.Value == value);
    if(option === undefined) {
      // throw Error(`Invalid Value of Combo Box: ${value} in group ${group}`)
      return "";
    }
    return option.Text;
  }

  onChange(event: Event) {
    // @ts-ignore
    this.file = event.target.files[0];
    this.onUpload();
  }

  onUpload() {
    this.loading = !this.loading;
    this.uploadService.upload(this.file)
  }

  tabChanged(event: MatTabChangeEvent): void {
    this.periodicTab = (event.index === 2);
  }
}
