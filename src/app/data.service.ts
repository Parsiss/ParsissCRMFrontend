import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Observable, of } from 'rxjs';
import { Filter, PatientInformation} from '../types/report';

import { filterGroup, KeyListOfValues } from './reports-list-component/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // public base_url = 'http://192.168.1.201:8081/api/';
  public base_url = 'http://localhost:8080/api/';
  constructor(
    public http: HttpClient,
    public dateAdapter: DateAdapter<moment.Moment>
  ) { }

  public getReports(filters: KeyListOfValues<string> | null = null): Observable<PatientInformation[]> {
    if (filters === null || Object.keys(filters).length === 0) {
      return this.http.get<PatientInformation[]>(this.base_url + 'report');
    }

    let bodyString = JSON.stringify(filters);
    return this.http.post<PatientInformation[]>(this.base_url + 'report/filtered', bodyString);
  }

  public getOptions(): Observable<Filter[]> {
    return this.http.get<Filter[]>(this.base_url + 'options');
  }

  public getPatient(id: number): Observable<PatientInformation> {
    return this.http.get<PatientInformation>(this.base_url + 'report/detail/' + id);
  }

  public updatePatient(fulldata: PatientInformation): Observable<object> {
    let bodyString = JSON.stringify(fulldata);
    return this.http.post<object>(this.base_url + 'report/detail/update', bodyString);
  }

  public addPatient(fulldata: PatientInformation): Observable<object> {
    let bodyString = JSON.stringify(fulldata);
    return this.http.post<object>(this.base_url + 'report/add', bodyString);
  }

  public deletePatient(id: number): Observable<object> {
    return this.http.delete<object>(this.base_url + 'report/delete/' + id);
  }

  public getCalendarEvent(): Observable<PatientInformation[]> {
    return this.http.get<PatientInformation[]>(this.base_url + 'home/calendar_event');
  }

  public uploadFile(file: File): Observable<object> {
    return this.http.post<any>(this.base_url + 'report/upload', file);
  }
}
