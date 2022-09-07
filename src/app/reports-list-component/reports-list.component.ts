import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {tableData} from 'src/types/report';
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

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<tableData>([]);

  displayedFields: string[] = ['Name', 'PaymentStatus', 'SurgeonFirst', 'Hospital', 'NationalID', 'PhoneNumber',
    'SurgeryResult', 'PaymentCard', 'CashAmount', 'OperatorFirst'];
  displayedColumns: string[] = [...this.displayedFields, 'Actions'];

  internalFilter: KeyListOfValues<string> = {};

  filters: filterGroup[] = [];

  options: Map<string, optionGroup> = new Map<string, optionGroup>();

  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    await new Promise(f => setTimeout(f, 2000));
    this.dataService.getReports(null).subscribe(
      (data) => {
        var temp : tableData[] = [];
        data.SurgeryInfo.forEach((surgery) => {
          temp.push({
            ID: surgery.PatientID,
            SurgeonFirst: surgery.SurgeonFirst,
            Hospital: surgery.Hospital,
            OperatorFirst: surgery.OperatorFirst,
            SurgeryResult: this.options.get('surgeryresult')!.values.find(f =>
              f.value == (surgery.SurgeryResult!).toString()) === undefined ?
              '' : this.options.get('surgeryresult')!.values.find(f => f.value == (surgery.SurgeryResult!).toString())!.text
            })
        });
        data.Patient.forEach((patient) => {
          temp.find(f => f.ID === patient.ID)!.Name = patient.Name,
            temp.find(f => f.ID === patient.ID)!.NationalID = patient.NationalID,
            temp.find(f => f.ID === patient.ID)!.PhoneNumber = patient.PhoneNumber
        });
        data.FinancialInfo.forEach((financial) => {
          temp.find(f => f.ID === financial.ID)!.PaymentStatus = this.options.get('paymentstatus')!.values.find(f =>
            f.value == (financial.PaymentStatus!).toString()) === undefined ?
            '' : this.options.get('paymentstatus')!.values.find(f => f.value == (financial.PaymentStatus!).toString())!.text,
            temp.find(f => f.ID === financial.ID)!.PaymentCard = financial.LastFourDigitsCard,
            temp.find(f => f.ID === financial.ID)!.CashAmount = financial.CashAmount
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
          (data) => {
            if ((data as any)['success']) {
              this.dataSource.data = this.dataSource.data.filter(p => p.ID !== id);
              this._snackBar.open('Patient removed successfully', 'close', {
                duration: 2000,
              });
            } else {
              this._snackBar.open('Error removing patient', 'close', {
                duration: 2000,
              });
            }
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
        data.SurgeryInfo.forEach((surgery) => {
          console.log(surgery);
          temp.push({
            ID: surgery.PatientID,
            SurgeonFirst: surgery.SurgeonFirst,
            Hospital: surgery.Hospital,
            OperatorFirst: surgery.OperatorFirst,
            SurgeryResult: this.options.get('surgeryresult')!.values.find(f =>
              f.value == (surgery.SurgeryResult!).toString()) === undefined ?
              '' : this.options.get('surgeryresult')!.values.find(f => f.value == (surgery.SurgeryResult!).toString())!.text
          })
        });
        data.Patient.forEach((patient) => {
          temp.find(f => f.ID === patient.ID)!.Name = patient.Name,
            temp.find(f => f.ID === patient.ID)!.NationalID = patient.NationalID,
            temp.find(f => f.ID === patient.ID)!.PhoneNumber = patient.PhoneNumber
        });
        data.FinancialInfo.forEach((financial) => {
          temp.find(f => f.ID === financial.ID)!.PaymentStatus = this.options.get('paymentstatus')!.values.find(f =>
            f.value == (financial.PaymentStatus!).toString()) === undefined ?
            '' : this.options.get('paymentstatus')!.values.find(f => f.value == (financial.PaymentStatus!).toString())!.text,
            temp.find(f => f.ID === financial.ID)!.PaymentCard = financial.LastFourDigitsCard,
            temp.find(f => f.ID === financial.ID)!.CashAmount = financial.CashAmount
        });
        this.dataSource.data = temp;
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
}
