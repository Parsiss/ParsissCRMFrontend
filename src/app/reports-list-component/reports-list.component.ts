import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {PatientInformation, tableData} from 'src/types/report';
import { DataService } from '../data.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormGroup } from '@angular/forms';

import { filterGroup, KeyListOfValues } from './interfaces';
import { Router } from '@angular/router';
import { HtmlService } from '../html.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import {MatDialog} from '@angular/material/dialog';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';
import {optionGroup} from "../detail-page-component/interfaces";
import {getMatIconFailedToSanitizeLiteralError} from "@angular/material/icon";
import {ExcelService} from "../excel.service";
import * as moment from "jalali-moment";
import {DateAdapter} from "@angular/material/core";
import {ChartAdopter} from "../chartAdopters/BaseAdopter";
import {SimplePieAdopter} from "../chartAdopters/Pie";
import {AddUnderlinePipe} from "../add-underline.pipe";
import {UploadService} from "../upload.service";

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {

  chartAdopters: ChartAdopter[] = [];

  patientData: PatientInformation[];

  dataSource = new MatTableDataSource<tableData>([]);
  displayedFields: string[] = ['Name', 'PaymentStatus', 'SurgeonFirst', 'Hospital', 'NationalId', 'PhoneNumber',
    'SurgeryResult', 'PaymentCard', 'CashAmount', 'OperatorFirst'];
  displayedColumns: string[] = [...this.displayedFields, 'Actions'];

  internalFilter: KeyListOfValues<string> = {};

  filters: filterGroup[] = [];

  options: Map<string, optionGroup> = new Map<string, optionGroup>();

  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  addUnderlinePipe = new AddUnderlinePipe();

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  shortLink: string = "";
  loading: boolean = false;
  file: File;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    public excelService: ExcelService,
    public dateAdapter: DateAdapter<moment.Moment>,
    private uploadService: UploadService,
  ) { }

  getReportData() {
    this.dataSource.paginator = this.paginator;
    this.dataService.getReports(null).subscribe(
      (data) => {
        this.patientData = data;
        var temp : tableData[] = [];
        data.forEach((patient) => {
          temp.push({
            ID: patient.ID,
            Name: patient.Name,
            NationalId: patient.NationalID,
            PhoneNumber: patient.PhoneNumber,
            SurgeonFirst: patient.SurgeonFirst,
            Hospital: patient.Hospital,
            OperatorFirst: patient.OperatorFirst,
            SurgeryResult: 
              this.options.get('surgery_result')!.values.find(f => f.value == (patient.SurgeryResult)) === undefined ? 
              '' : this.options.get('surgery_result')!.values.find(f => f.value == patient.SurgeryResult)!.text,
            
            PaymentStatus: 
              this.options.get('payment_status')!.values.find(f =>
              f.value == patient.PaymentStatus) === undefined ?
              '' : this.options.get('payment_status')!.values.find(f => f.value == patient.PaymentStatus!)!.text,
            PaymentCard: patient.LastFourDigitsCard,
            CashAmount: patient.CashAmount
          })
        });
        this.dataSource.data = temp;
        this.prepareChartData();
      });
  }

  ngOnInit(): void {
    this.dataService.getOptions().subscribe(
      (data) => {
        data.forEach((filter) => {
          if (this.filters.find(f => f.name === filter.Group) === undefined) {
            this.filters.push({
              name: filter.Group,
              values: []
            });
          }
          this.filters.find((f) => f.name === filter.Group)!.values.push({
            value: filter.Value.toString(),
            text: filter.Text,
            selected: filter.Selected
          });

          if (this.options.get(filter.Group) === undefined) {
            this.options.set(filter.Group, {
              name: filter.Group,
              values: []
            });
          }
          this.options.get(filter.Group)!.values.push({
            value: filter.Value,
            text: filter.Text,
            selected: filter.Selected
          });
        });
        this.getReportData();
      });
    this.dataSource.sort = this.sort;

    this.range.controls['start'].valueChanges.subscribe(() => {
      this.dateChanged();
    });

    this.range.controls['end'].valueChanges.subscribe(() => {
      this.dateChanged();
    });

  }

  checkboxChanged(group: string, value: string) {
    if (this.internalFilter[group] === undefined) {
      this.internalFilter[group] = [];
    }

    if (this.internalFilter[group].find(v => v === value) === undefined) {
      this.internalFilter[group].push(value);
    } else {
      this.internalFilter[group] = this.internalFilter[group].filter(v => v !== value);
    }

    this.applyFilters();
  }

  navigateTo(id: number) {
    this.router.navigate(['/detailPage/' + id]);
  }

  remove(id: number) {
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '350px',
      data: {title: "Remove Report", content: "Are you sure you want to remove this report?"},
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
            this.getReportData();
          });
      }
    );
  }

  dateChanged() {
    this.internalFilter["surgery_date"] = [
      this.range.controls['start'].value,
      this.range.controls['end'].value
    ];
    this.applyFilters();
  }

  applyFilters() {
    this.dataService.getReports(this.internalFilter).subscribe(
      (data) => {
        var temp : tableData[] = [];
        this.patientData = data;
        data.forEach((patient) => {
          temp.push({
            ID: patient.ID,
            Name: patient.Name,
            NationalId: patient.NationalID,
            PhoneNumber: patient.PhoneNumber,
            SurgeonFirst: patient.SurgeonFirst,
            Hospital: patient.Hospital,
            OperatorFirst: patient.OperatorFirst,
            SurgeryResult: this.options.get('surgery_result')!.values.find(f =>
              f.value == patient.SurgeryResult) === undefined ?
              '' : this.options.get('surgery_result')!.values.find(f => f.value == patient.SurgeryResult)!.text,
            
            PaymentStatus: this.options.get('payment_status')!.values.find(f =>
              f.value == patient.PaymentStatus) === undefined ?
              '' : this.options.get('payment_status')!.values.find(f => f.value == patient.PaymentStatus)!.text,
            PaymentCard: patient.LastFourDigitsCard,
            CashAmount: patient.CashAmount
          })
        });
        this.dataSource.data = temp;
        this.prepareChartData();
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  prepareExcelData(){
    let excelFileData: Map<string, any[]> = new Map<string, any[]>();
    this.patientData.forEach((patient) =>
    {
      for (let [key, value] of Object.entries(patient)) {
        if (excelFileData.get(key) === undefined) {
          excelFileData.set(key, []);
        }
        if (["SurgeryResult", "PaymentStatus", "SurgeryDay", "SurgeryArea", "HospitalType", "HeadFixType",
          "SurgeryTime", "CT", "MR", "FMRI", "DTI"].includes(key))
        {
          excelFileData.get(key)!.push(this.options.get(this.addUnderlinePipe.transform(key).toLowerCase())!.values.find(f =>
            f.value == value.toString()) === undefined ?
            '' : this.options.get(this.addUnderlinePipe.transform(key).toLowerCase())!.values.find(f => f.value == value.toString())!.text);
        }
        else if (key.includes("Date")){
          excelFileData.get(key)!.push(this.dateAdapter.format(moment.unix(value), "YYYY-MM-DD"));
        }
        else
          excelFileData.get(key)!.push(value);
      }
    });
    this.excelService.exportAsXLSX(excelFileData);
  }

  prepareChartData(){
    this.chartAdopters = [
      new SimplePieAdopter(this.patientData, ["SurgeryResult"])
    ]
  }
  onChange(event: Event) {
    // @ts-ignore
    this.file = event.target.files[0];
  }

  onUpload() {
    this.loading = !this.loading;
    this.uploadService.upload(this.file)
  }
}
