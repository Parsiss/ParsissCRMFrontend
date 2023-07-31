import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { filter, map, Observable, of } from 'rxjs';


import { DataService as BaseDataService } from '../data.service';

import { EventInfo, DeviceInfo } from './interfaces';

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


  updateEvent(data: EventInfo): Observable<object> {
    let body = JSON.stringify(data);
    return this.http.post<object>(`${this.base_url}events/${data.id.toString()}/`, body, this.httpOptions);
  }

  addEvent(data: EventInfo): Observable<object> {
    let body = JSON.stringify(data);
    return this.http.post<object>(this.base_url + 'events/', body, this.httpOptions);
  }

  getEvents(deivce_id: number): Observable<EventInfo[]> {
    return this.http.get<EventInfo[]>(`${this.base_url}events/search/${deivce_id}/`);
  }
}
 