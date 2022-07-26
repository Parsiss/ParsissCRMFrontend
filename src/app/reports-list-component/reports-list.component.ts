import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/types/report';
import { DataService } from '../data.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormGroup } from '@angular/forms';

import { filterGroup, KeyListOfValues } from './interfaces';
import { Router } from '@angular/router';
import { HtmlService } from '../html.service';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Patient>([]);

  displayedFields: string[] = ['Name', 'NationalID', 'PhoneNumber'];
  displayedColumns: string[] = [...this.displayedFields, 'Actions'];

  internalFilter: KeyListOfValues<string> = {};

  filters: filterGroup[] = [];

  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private dataService: DataService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    
    console.log(this.paginator);
    this.dataService.getReports(null).subscribe(
      (data) => {
        this.dataSource.data = data;
      });

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

  dateChanged() {
    this.internalFilter["surgery_date"] = [];
    if (this.range.controls['start'].value) {
      this.internalFilter["surgery_date"].push(this.range.controls['start'].value);
    }
    if (this.range.controls['end'].value) {
      this.internalFilter["surgery_date"].push(this.range.controls['end'].value);
    }

    if (this.internalFilter["surgery_date"].length === 0) {
      delete this.internalFilter["surgery_date"];
    }

    this.applyFilters();
  }

  applyFilters() {
    this.dataService.getReports(this.internalFilter).subscribe(
      (data) => this.dataSource.data = data
    );
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