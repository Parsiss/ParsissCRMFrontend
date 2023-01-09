import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {PatientInformation, tableData} from 'src/types/report';
import { DataService } from '../data.service';
import { FormControl, FormGroup } from '@angular/forms';

import { filterGroup, KeyListOfValues } from './interfaces';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {MatDialog} from '@angular/material/dialog';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';
import {optionGroup} from "../detail-page-component/interfaces";
import {ExcelService} from "../excel.service";
import * as moment from "jalali-moment";
import {DateAdapter} from "@angular/material/core";

import {AddUnderlinePipe} from "../add-underline.pipe";
import {UploadService} from "../upload.service";

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  patientData: PatientInformation[];

  dataSource = new MatTableDataSource<tableData>([]);
  displayedFields: string[] = [
    'SurgeryDay', 'Name', 'PaymentStatus', 'SurgeonFirst', 'Hospital', 'NationalId', 'PhoneNumber',
    'SurgeryResult', 'PaymentCard', 'CashAmount', 'OperatorFirst'
  ];

  displayedColumns: string[] = [...this.displayedFields, 'Actions'];

  public internalFilter: KeyListOfValues<number> = {};

  filters: filterGroup[] = [];

  options: Map<string, optionGroup> = new Map<string, optionGroup>();

  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  addUnderlinePipe = new AddUnderlinePipe();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  shortLink: string = "";
  loading: boolean = false;
  file: File;

  constructor(
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
    this.dataService.getReports().subscribe(
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
            
            SurgeryDay: 
              this.options.get('surgery_day')!.values.find(f => f.value == patient.SurgeryDay) === undefined ?
              '' : this.options.get('surgery_day')!.values.find(f => f.value == patient.SurgeryDay)!.text,
            PaymentCard: patient.LastFourDigitsCard,
            CashAmount: patient.CashAmount
          })
        });
        this.dataSource.data = temp;
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
            value: filter.Value,
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

    this.range.controls['start'].valueChanges.subscribe(() => {
      this.dateChanged();
    });

    this.range.controls['end'].valueChanges.subscribe(() => {
      this.dateChanged();
    });

  }

  checkboxChanged(group: string, value: number) {
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
    if(this.range.controls['start'].value === null && this.range.controls['end'].value === null) {
      delete this.internalFilter["surgery_date"];
    } else if(this.range.controls['start'].value === null) {
      this.internalFilter["surgery_date"] = [
        null,
        this.range.controls['end'].value.unix()
      ];
    } else if(this.range.controls['end'].value === null) {
      this.internalFilter["surgery_date"] = [
        this.range.controls['start'].value.unix(),
        null
      ];
    } else {
      this.internalFilter["surgery_date"] = [
        this.range.controls['start'].value.unix(),
        this.range.controls['end'].value.unix()
      ];
    }
    
    this.applyFilters();
  }

  applyFilters() {
    this.internalFilter = {...this.internalFilter};
    
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
            
            SurgeryDay: 
              this.options.get('surgery_day')!.values.find(f => f.value == patient.SurgeryDay) === undefined ?
              '' : this.options.get('surgery_day')!.values.find(f => f.value == patient.SurgeryDay)!.text,
            PaymentCard: patient.LastFourDigitsCard,
            CashAmount: patient.CashAmount
          })
        });
        this.dataSource.data = temp;
    });
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  dowloadExcel(){
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
      }
    });
    this.excelService.exportAsXLSX(excelFileData);
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
