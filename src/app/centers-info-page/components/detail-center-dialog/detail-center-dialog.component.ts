import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CenterInfo } from '../../interfaces';
import { DataService } from '../../data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detail-center-dialog',
  templateUrl: './detail-center-dialog.component.html',
  styleUrls: ['./detail-center-dialog.component.scss']
})
export class DetailCenterDialogComponent implements OnInit {
  public editable: boolean = false;

  public form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CenterInfo,
    public dialogRef: MatDialogRef<DetailCenterDialogComponent>,
    private fb: FormBuilder,
    public dataService: DataService,
  ) {
    this.form = this.fb.group({
      name: {value: data?.name, disabled: true}
    });
  }

  processResult(): CenterInfo {
    let result = {... this.data};
    result.name = this.form.get('name')?.value;
    return result;
  }

  enableEdit() {
    this.editable = true;
    this.form.get('name')!.enable({ emitEvent: false });
  }

  ngOnInit(): void {
  }
}
