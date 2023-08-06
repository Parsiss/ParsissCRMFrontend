import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { filter, map, Observable, of } from 'rxjs';


import { DataService as BaseDataService } from '../data.service';

import { CenterInfo, CenterViewInfo } from './interfaces';

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

  deleteCenter(id: number): Observable<object> {
    return this.http.delete<object>(`${this.base_url}centers/${id}/`);
  }


  updateCenter(data: CenterInfo): Observable<object> {
    let body = JSON.stringify(data);
    return this.http.post<object>(`${this.base_url}centers/${data.id.toString()}/`, body, this.httpOptions);
  }

  addCenter(data: CenterInfo): Observable<object> {
    let body = JSON.stringify(data);
    return this.http.post<object>(this.base_url + 'centers/', body, this.httpOptions);
  }

  getCenters(): Observable<CenterViewInfo[]> {
    return this.http.get<CenterViewInfo[]>(this.base_url + 'centers/');
  }

  addDevice(centerId: number): Observable<object> {
    return this.http.post<object>(
      this.base_url + 'devices/',
      { 
        name: 'New Device',
        center_id: centerId
      },
      this.httpOptions
    );
  }
}
 