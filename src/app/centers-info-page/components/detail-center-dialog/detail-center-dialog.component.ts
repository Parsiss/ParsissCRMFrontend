import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CenterViewInfo } from '../../interfaces/centerInfo';
import { AddCenterDialogComponent } from '../add-center-dialog/add-center-dialog.component';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-detail-center-dialog',
  templateUrl: './detail-center-dialog.component.html',
  styleUrls: ['./detail-center-dialog.component.scss']
})
export class DetailCenterDialogComponent implements OnInit {
  public editable: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CenterViewInfo,
    public dialogRef: MatDialogRef<AddCenterDialogComponent>,
    public dataService: DataService,
  ) { }

  ngOnInit(): void {
  }


  addDevice(centerId: number) {
    this.dataService.addDevice(centerId).subscribe(() => console.log("SUCESS"));
  }

}
