import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { map, Observable, of } from 'rxjs';
import { DatedReportData, Filter, PatientInformation} from '../types/report';
import { DateConversionService } from './date-conversion.service';

import { KeyListOfValues } from './reports-list-component/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // public base_url = 'http://192.168.1.201:8081/api/';
  public base_url = 'http://localhost:8000/api/';

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    public http: HttpClient,
    public dateAdapter: DateAdapter<moment.Moment>
  ) { }

  public getReports(filters: KeyListOfValues<string> | null = null): Observable<PatientInformation[]> {
    if (filters === null || Object.keys(filters).length === 0) {
      return this.http.get<PatientInformation[]>(this.base_url + 'rest/');
    }

    let bodyString = JSON.stringify(filters);
    return this.http.post<PatientInformation[]>(this.base_url + 'report/filtered/', bodyString, this.httpOptions);
  }

  public getOptions(): Observable<Filter[]> {
    return this.http.get<Filter[]>(this.base_url + 'options/');
  }

  public getPatient(id: number): Observable<PatientInformation> {
    return this.http.get<PatientInformation>(this.base_url + `rest/${id}/`);
  }

  public updatePatient(fulldata: PatientInformation): Observable<object> {
    fulldata = DateConversionService.ConvertDatetimesToDate(fulldata);

    let id = fulldata.ID;
    let bodyString = JSON.stringify(fulldata);
    return this.http.post<object>(this.base_url + `rest/${id}/`, bodyString, this.httpOptions);
  }

  public addPatient(fulldata: PatientInformation): Observable<object> {
    fulldata = DateConversionService.ConvertDatetimesToDate(fulldata);
    let bodyString = JSON.stringify(fulldata);
    return this.http.post<object>(this.base_url + 'rest/', bodyString, this.httpOptions);
  }

  public deletePatient(id: number): Observable<object> {
    return this.http.delete<object>(this.base_url + `rest/${id}/`);
  }

  public getCalendarEvent(): Observable<PatientInformation[]> {
    return DateConversionService.ConvertDatesToTimestamp(this.http.get<PatientInformation[]>(this.base_url + 'rest/'));
  }

  public uploadFile(file: File): Observable<object> {
    return this.http.post<any>(this.base_url + 'report/upload/', file);
  }

  public getDatedReports(start: number, end: number): Observable<DatedReportData> {
    return this.http.get<DatedReportData>(this.base_url + `reports/dated/?start_date=${start}&end_date=${end}`);
  }

}
