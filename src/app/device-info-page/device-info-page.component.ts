import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';

import { ActivatedRoute, Router } from '@angular/router';
import { DeviceHint, DeviceInfo, EventInfo, FileInfo, event_type_map, file_type_map } from './interfaces';
import { DataService } from './data.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from "jalali-moment";
import { Observable, of } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';

import {AutofillService} from "../autofill.service";


@Component({
  selector: 'app-device-info-page',
  templateUrl: './device-info-page.component.html',
  styleUrls: ['./device-info-page.component.scss'],
})
export class DeviceInfoPageComponent implements OnInit, OnChanges {
  @Input() public device_id: number;
  @Output() public deviceDeleted = new EventEmitter<number>();
  @Output() public updated = new EventEmitter<number>(); 

  public device_versions: string[] = [];
  public bundle_versions: string[] = [];

  public readonly separatorKeysCodes = [ENTER, COMMA, SPACE];


  addVersion(list: string[], event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      list.push(value);
    }

    event.chipInput!.clear();
  }
  
  removeVersion(list: string[], version: string): void {
    const index = list.indexOf(version);

    if (index >= 0) {
      list.splice(index, 1);
    }
  }

  public windows_versions = [
    'Windows XP',
    'Windows 7',
    'Windows 8',
    'Windows 10',
    'Windows 11',
  ]

  public installation_years: number[];

  public device_models = [
    'Iv2',
    'OV3',
    'OV4',
    'Compo',
    'CompoPlus',
    'OPTO'
  ]

  public event_type_map = event_type_map;
  public file_type_map = file_type_map;

  public new_hint: string = '';
  public has_essential_hints: boolean;


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
    public dialog: MatDialog,
    public autofill: AutofillService
  ) {
    let years = [...Array(20).keys()];
    let currentYear = moment().jYear();
    this.installation_years = years.map((d) => currentYear - d)
  }

  ngOnInit(): void {
    this.getDevice();
    this.getEvents();
  }

  getDevice(): void {
    this.device = null;
    this.dataService.getDevice(this.device_id).subscribe((data) => {
      for(let i = 0; i < data.files.length; ++i) {
        data.files[i].created_at = moment(data.files[i].created_at).format("jYYYY/MM/DD - HH:mm")
      }

      this.device = data;
      this.has_essential_hints = ((this.device.hints.filter(value => value.is_essential)).length != 0);
      if(this.has_essential_hints) {
        this.device.hints.sort((x, y) => (x.is_essential == y.is_essential) ? 0 : x.is_essential ? -1 : 1);
        this.device.hints = [...this.device.hints]
      }
      
      // Check this shit out: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split#using_split
      this.device_versions = this.device.version.split("\n").filter(r => r !== '');
      this.bundle_versions = this.device.bundle_version.split("\n").filter(r => r !== '');
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

  deleteHint(id: number) {
    this.dataService.deleteHint(id).subscribe((data) => {
      this.device!.hints = this.device!.hints.filter((value) => value.id !== id);
      this.has_essential_hints = ((this.device!.hints.filter(value => value.is_essential)).length != 0);
    })

  }

  addHint() {
    let description = this.new_hint.trim();

    if(description == '') {
      return;
    }
    
    let has_essential_hints = false;
    if(description.startsWith('*')) {
      description = description.slice(1);
      has_essential_hints = true;
    }

    this.dataService.addHint(this.device_id, description, has_essential_hints).subscribe((data) => {
      this.device!.hints = [...this.device!.hints, data as DeviceHint]
      this.new_hint = ''
      this.has_essential_hints = ((this.device!.hints.filter(value => value.is_essential)).length != 0);
      if(this.has_essential_hints) {
        this.device!.hints.sort((x, y) => (x.is_essential == y.is_essential) ? 0 : x.is_essential ? -1 : 1);
        this.device!.hints = [...this.device!.hints]
      }
    })
  }

  addFile(file: FormData, data: EventInfo): Observable<any> {        
    if(file) {
      file = (file as FormData);
      file.append("device_id", this.device_id.toString());
      file.append("event_id", data.id.toString());
      file.append("type", "MC")
      return this.dataService.addFile(file);
    }
    return of('ok!');
  }

  update(): void {
    if(this.device != null) {
      this.device.version = this.device_versions.join("\n");
      this.device.bundle_version = this.bundle_versions.join("\n");

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
}
