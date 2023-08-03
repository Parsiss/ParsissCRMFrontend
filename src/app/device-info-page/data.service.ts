import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { filter, map, Observable, of } from 'rxjs';


import { DataService as BaseDataService } from '../data.service';

import { EventInfo, DeviceInfo, FileInfo } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public base_url = BaseDataService.base_url + 'centers/';
  public httpOptions = BaseDataService.httpOptions;

  constructor(
    public http: HttpClient,
    public dateAdapter: DateAdapter<moment.Moment>
  ) {
  }

  getDevice(id: number): Observable<DeviceInfo> {
    return this.http.get<DeviceInfo>(`${this.base_url}devices/${id}`);
  }

  updateDevice(id: number, device: DeviceInfo): Observable<object> {
    return this.http.post<object>(`${this.base_url}devices/${id}/`, JSON.stringify(device), this.httpOptions);
  }

  deleteDevice(id: number): Observable<object> {
    return this.http.delete<object>(`${this.base_url}devices/${id}`);
  }

  addEvent(data: EventInfo): Observable<object> {
    let body = JSON.stringify(data);
    return this.http.post<object>(this.base_url + 'events/', body, this.httpOptions);
  }

  getEvents(deivce_id: number): Observable<EventInfo[]> {
    return this.http.get<EventInfo[]>(`${this.base_url}events/search/${deivce_id}/`);
  }
  
  updateEvent(data: EventInfo): Observable<object> {
    let body = JSON.stringify(data);
    return this.http.post<object>(`${this.base_url}events/${data.id.toString()}/`, body, this.httpOptions);
  }

  deleteEvent(id: number): Observable<object> {
    return this.http.delete<object>(`${this.base_url}events/${id.toString()}/`);
  }

  deleteFile(id: number): Observable<object> {
    return this.http.delete<object>(`${this.base_url}file/delete/${id.toString()}/`);
  }

  addFile(data: FormData): Observable<object> {
    return this.http.post<object>(`${this.base_url}file/upload/`, data);
  }

  getFiles(device_id: number): Observable<FileInfo[]> {
    return this.http.get<FileInfo[]>(`${this.base_url}devices/files/${device_id}/`);
  }
}
 