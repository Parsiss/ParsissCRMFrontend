import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AddCenterDialogComponent } from './components/add-center-dialog/add-center-dialog.component';
import { CenterViewInfo } from './interfaces/centerInfo';
import { DataService } from './data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DetailCenterDialogComponent } from './components/detail-center-dialog/detail-center-dialog.component';
import { NestedTreeControl } from '@angular/cdk/tree';


@Component({
  selector: 'app-centers-info-page',
  templateUrl: './centers-info-page.component.html',
  styleUrls: ['./centers-info-page.component.scss']
})
export class CentersInfoPageComponent implements OnInit, AfterViewInit {
  public dataSource = new MatTableDataSource<CenterViewInfo> ();  
  public displayedColumns = ['name'];

  constructor(
    public dialog: MatDialog,
    public dataService: DataService
  ) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  
  ngOnInit(): void {
    this.updateTableInfo();
  }

  openDialog() {
    let dialog = this.dialog.open(AddCenterDialogComponent, {data: {name: ''}});
    dialog.afterClosed().subscribe((data: CenterViewInfo) => {
      let result = (data ? this.dataService.addCenter(data) : null);
      result?.subscribe(this.updateTableInfo.bind(this));
    });
  }


  tableRowCliecked(row: CenterViewInfo) {
    let dialog = this.dialog.open(DetailCenterDialogComponent, {data: row});
    dialog.afterClosed().subscribe((data: CenterViewInfo) => {
      let result = (data ? this.dataService.addCenter(data) : null);
      result?.subscribe(this.updateTableInfo.bind(this));
    });
  }


  updateTableInfo()  {
    this.dataService.getCenters().subscribe((data) => this.dataSource.data = data);
  }

}
