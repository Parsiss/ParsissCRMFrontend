import { Component, OnInit } from '@angular/core';


import { ActivatedRoute, Router } from '@angular/router';
import { DeviceInfo, EventInfo, type_map } from './interfaces';
import { DataService } from './data.service';
import { EventEditDialogComponent } from './components/event-edit-dialog/event-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from "jalali-moment";



@Component({
  selector: 'app-device-info-page',
  templateUrl: './device-info-page.component.html',
  styleUrls: ['./device-info-page.component.scss']
})
export class DeviceInfoPageComponent implements OnInit {
  public type_map = type_map;

  public device_id: number;

  public device: DeviceInfo | null;
  public events?: EventInfo[] | null;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {
    route.params.subscribe(params => {
      this.device_id = parseInt(params['device_id'], 10);
    });
  }

  ngOnInit(): void {
    this.getDevice();
    this.getEvents();
  }

  getDevice(): void {
    this.device = null;
    this.dataService.getDevice(this.device_id).subscribe((data) => this.device = data);
  }

  getEvents(): void {
    this.events = null;
    this.dataService.getEvents(this.device_id).subscribe((data) => {
      this.events = data;
    });
  }


  openDialog(): void {
    let dialog = this.dialog.open(EventEditDialogComponent, {data: {device_id: this.device_id}});
    dialog.componentInstance.enableEdit();
    dialog.afterClosed().subscribe((data: EventInfo) => {
      let result = (data ? this.dataService.addEvent(data) : null);
      result?.subscribe(this.getEvents.bind(this));
    });
  }

  tableRowCliecked(i: number, row: EventInfo): void {
    let dialog = this.dialog.open(EventEditDialogComponent, {data: row});
    dialog.afterClosed().subscribe((data: EventInfo) => {
      let result = (data ? this.dataService.updateEvent(data) : null);
      result?.subscribe(this.getEvents.bind(this));
    });
    dialog.componentInstance.deleted.subscribe(() => this.events?.splice(i, 1));
  }

  update(): void {
    if(this.device != null) {
      this.dataService.updateDevice(this.device_id, this.device).subscribe(() => {
        this.getDevice();
      })
    }
  }

  delete(): void {
    this.dataService.deleteDevice(this.device_id).subscribe(() => this.router.navigate(['/centers']));
  }

  formatDate(datetime: Date): string {
    let date = moment(datetime).format("jYYYY/jMM/jDD")

    return date;
  }
}
