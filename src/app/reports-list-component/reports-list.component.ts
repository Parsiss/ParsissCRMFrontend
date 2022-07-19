import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/types/report';
import { DataService } from '../data.service';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements AfterViewInit {  
  dataSource = new MatTableDataSource<Patient>([]);
  displayedColumns: string[] = ['ID', 'Name', 'PhoneNumber'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private dataService: DataService
  ) { }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.dataSource.paginator = this.paginator;
    this.dataService.getReports().subscribe(
      (data) => {
        this.dataSource.data = data.Patients;
      }
    );
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if(sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  removeIdColumn() {
    this.displayedColumns.splice(0, 1);
  }

  addIdColumn() {
    this.displayedColumns.splice(0, 0, 'ID');
  }

}