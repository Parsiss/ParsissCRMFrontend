import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';


import { ActivatedRoute, Router } from '@angular/router';
import { DeviceInfo, EventInfo, FileInfo, event_type_map, file_type_map } from './interfaces';
import { DataService } from './data.service';
import { EventEditDialogComponent } from './components/event-edit-dialog/event-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from "jalali-moment";
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-device-info-page',
  templateUrl: './device-info-page.component.html',
  styleUrls: ['./device-info-page.component.scss'],
})
export class DeviceInfoPageComponent implements OnInit, OnChanges {
  @Input() public device_id: number;
  @Output() public deviceDeleted = new EventEmitter<number>();
  @Output() public updated = new EventEmitter<number>(); 


  public event_type_map = event_type_map;
  public file_type_map = file_type_map;

  public device: DeviceInfo | null;
  public events?: EventInfo[] | null;


  // file manager
  @ViewChild('fileInput') fileInput: ElementRef;
  public selected_file_name: string | null;
  public selected_file_type: string = "NA";
  public dataForm: FormData | null;

  public password_show: boolean = false;

  
  constructor(
    route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getDevice();
    this.getEvents();
  }

  getDevice(): void {
    this.device = null;
    this.dataService.getDevice(this.device_id).subscribe((data) =>{
      for(let i = 0; i < data.files.length; ++i) {
        data.files[i].created_at = moment(data.files[i].created_at).format("jYYYY/MM/DD - HH:mm")
      }
      this.device = data;
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if(simpleChanges['device_id']) {
      this.getDevice();
      this.getEvents();
    }
  }


  getEvents(): void {
    this.events = null;
    this.dataService.getEvents(this.device_id).subscribe((data) => {
      this.events = data;
      for(let event of this.events) {
        event.files = event.files || [];
        for(let i = 0; i < event.files.length; ++i) {
          event.files[i].created_at = moment(event.files[i].created_at).format("jYYYY/MM/DD - HH:mm")
        }
      }
    });
  }


  openDialog(): void {
    let dialog = this.dialog.open(EventEditDialogComponent, {direction: 'rtl', data: {device_id: this.device_id}});
    dialog.componentInstance.enableEdit();
    dialog.afterClosed().subscribe((data: EventInfo) => {
      let file = data && (data as any)['file'];
      let result = (data ? this.dataService.addEvent(data) : null);
      result?.subscribe((data: EventInfo) => {
        this.addFile(file, data).subscribe(this.getEvents.bind(this));
      });
    });
  }

  tableRowCliecked(i: number, row: EventInfo): void {
    let dialog = this.dialog.open(EventEditDialogComponent, {direction: 'rtl', data: row});
    dialog.afterClosed().subscribe((data: EventInfo) => {
      let file = data && (data as any)['file'];
      let result = (data ? this.dataService.updateEvent(data) : null);
      result?.subscribe((data: EventInfo) => {
        this.addFile(file, data).subscribe(this.getEvents.bind(this));
      });
    });
    
    dialog.componentInstance.deleted.subscribe(() => this.events?.splice(i, 1));
  }

  addFile(file: FormData, data: EventInfo): Observable<any> {        
    if(file) {
      file = (file as FormData);
      file.append("device_id", this.device_id.toString());
      file.append("event_id", data.id.toString());
      file.append("type", "MC")
      console.log(data)
      return this.dataService.addFile(file);
    }
    return of('ok!');
  }

  update(): void {
    if(this.device != null) {
      this.dataService.updateDevice(this.device_id, this.device).subscribe(() => {
        this.getDevice();
        this.updated.emit(this.device_id);
      })
    }
  }

  delete(): void {
    this.dataService.deleteDevice(this.device_id).subscribe(() => this.deviceDeleted.emit(this.device_id));
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if(fileList && fileList.length == 1) {
      let file = fileList[0];
      this.selected_file_name = file.name;
      this.dataForm = new FormData();
      this.dataForm.append("file", file, this.selected_file_name);
      this.dataForm.append("device_id", this.device_id.toString());
    }
  }

  sendFile(): void {
    if(this.dataForm) {
      this.dataForm.append("type", this.selected_file_type);
      this.dataService.addFile(this.dataForm).subscribe(() => {
        this.getFiles();
        this.dataForm = null;
        this.selected_file_name = null;
        this.selected_file_type = "NA";
        this.fileInput.nativeElement.value = '';
      });
    }
  }

  getFiles(): void {
    this.dataService.getFiles(this.device_id).subscribe((data) => {
      for(let i = 0; i < data.length; ++i) {
        data[i].created_at = moment(data[i].created_at).format("jYYYY/MM/DD - HH:mm")
      }
      if(this.device) {
        this.device.files = data;
      }
    })
  }

  deleteFile(id: number): void {
    this.dataService.deleteFile(id).subscribe(() => this.getFiles());
  }

  formatDate(datetime: Date): string {
    let date = moment(datetime).format("jYYYY/jMM/jDD")
    return date;
  }
}
