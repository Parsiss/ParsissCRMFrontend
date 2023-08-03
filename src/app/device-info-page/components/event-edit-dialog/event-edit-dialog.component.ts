import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventInfo, file_type_map } from '../../interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../data.service';
import * as moment from "jalali-moment";

@Component({
  selector: 'app-event-edit-dialog',
  templateUrl: './event-edit-dialog.component.html',
  styleUrls: ['./event-edit-dialog.component.scss']
})
export class EventEditDialogComponent implements OnInit {
  public file_type_map = file_type_map;
  
  public deleted = new EventEmitter<boolean>();

  public editable: boolean = false;
  public form: FormGroup;

  // file manager
  public selected_file_name: string | null;
  public dataFile: File | null;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EventInfo,
    public dialogRef: MatDialogRef<EventEditDialogComponent>,
    private fb: FormBuilder,
    public dataService: DataService,
  ) {
    let time = data?.date ? moment(data?.date).format("HH:mm") : null;
    let date = (data?.date ? moment(data?.date) : moment()).clone().startOf('day');

    this.form = this.fb.group({
      description: {value: data?.description, disabled: true},
      date: {value: date, disabled: true},
      time: {value: time, disabled: true},
      type: {value: data?.type, disabled: true},
    });
  }

  processResult(): void {
    let result = {... this.data};    
    let time = moment(this.form.get('time')?.value, "HH:mm")
    let date = this.form.get('date')?.value;
    date.set({
        hour: parseInt(time.format("HH")),
        minute: parseInt(time.format("mm"))
    });

    result.date = date;  
    result.type = this.form.get('type')?.value
    result.description = this.form.get('description')?.value;
    this.dialogRef.close(result);
  }

  delete() {
    this.dataService.deleteEvent(this.data.id).subscribe(() => {
      this.deleted.emit();
      this.dialogRef.close();
    })
  }


  onFileSelected(event: Event) {
    this.selected_file_name = "";
  }

  enableEdit() {
    this.editable = true;
    this.form.enable({emitEvent: false});
  }

  ngOnInit(): void {
  }

  deleteFile(id: number): void {
    this.dataService.deleteFile(id).subscribe();
  }

}
