import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EventInfo, event_type_map, file_type_map } from '../../interfaces';
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
  public event_type_map = event_type_map;
  
  asIsOrder(a:any, b:any) {return 1;}

  public deleted = new EventEmitter<boolean>();

  public editable: boolean = false;
  public form: FormGroup;

  // file manager
  public selected_file_name: string | null;
  public dataForm: FormData | null;


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
      type: {value: data.type ? data.type : "NA", disabled: true},
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
    if(this.dataForm) {
      (result as any)['file'] = this.dataForm;
    }
    result.type_specific_field = {};
    this.dialogRef.close(result);
  }

  delete() {
    this.dataService.deleteEvent(this.data.id).subscribe(() => {
      this.deleted.emit();
      this.dialogRef.close();
    })
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if(fileList && fileList.length == 1) {
      let file = fileList[0];
      this.selected_file_name = file.name;
      this.dataForm = new FormData();
      this.dataForm.append("file", file, this.selected_file_name);
    }
  }

  enableEdit() {
    this.editable = true;
    this.form.enable({emitEvent: false});
  }

  ngOnInit(): void {
  }

  deleteFile(id: number): void {
    this.dataService.deleteFile(id).subscribe(() => {
      this.data.files = this.data.files.filter((value) => value.id !== id);
    });
  }

}
