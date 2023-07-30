import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CenterInfo } from '../../interfaces/centerInfo';


@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-center-dialog.component.html',
  styleUrls: ['./add-center-dialog.component.scss']
})
export class AddCenterDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CenterInfo,
    public dialogRef: MatDialogRef<AddCenterDialogComponent>
  ) { }

  ngOnInit(): void {
  }

}
