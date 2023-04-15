import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { filter, map, Observable, of } from 'rxjs';
import { DatedReportData, HospitalsPeriodicReportData, PatientInformation, PatientListData} from '../types/report';
import { ActiveFilters, ComboOptions } from 'src/types/filters';
import { DateConversionService } from './date-conversion.service';

import { KeyListOfValues, KeyOfValues, AutolFillOptions } from './reports-list-component/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public base_url = 'http://192.168.1.201:8000/api/';
  //public base_url = 'http://localhost:8000/api/';

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    public http: HttpClient,
    public dateAdapter: DateAdapter<moment.Moment>
  ) { }

  public getReports(filters: ActiveFilters | null = null, page_index: number, page_size: number): Observable<PatientListData> {
    if (filters === null) { // || Object.keys(filters).length === 0) {
      // return this.http.get<PatientInformation[]>(this.base_url + 'rest/');
      filters = {};
    }

    let bodyString = {
      'filters': JSON.stringify(filters),
      'page_index': page_index,
      'page_size': page_size
    };
    
    return this.http.post<PatientListData>(this.base_url + 'report/filtered/', bodyString, this.httpOptions);
  }

  public getOptions(): Observable<ComboOptions<number>> {
    return this.http.get<ComboOptions<number>>(this.base_url + 'options/', this.httpOptions);
  }

  public getFilters(): Observable<ComboOptions<number>> {
    return this.http.get<ComboOptions<number>>(this.base_url + 'filters/', this.httpOptions);
  }

  public getAdaptiveFilterOptions(activeFilters: ActiveFilters) : Observable<ComboOptions<string>> {
    let body = JSON.stringify(activeFilters);
    return this.http.post<ComboOptions<string>>(this.base_url + 'adaptive_filters/', body, this.httpOptions);
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
    return DateConversionService.ConvertDatesToTimestamp(this.http.get<PatientInformation[]>(this.base_url + 'calendar/'));
  }

  public uploadFile(file: File): Observable<object> {
    return this.http.post<any>(this.base_url + 'report/upload/', file);
  }

  public getDatedReports(start: number, end: number): Observable<DatedReportData> {
    return this.http.get<DatedReportData>(this.base_url + `reports/dated/?start_date=${start}&end_date=${end}`);
  }

  public getSuccessRateReport(filters: KeyListOfValues<number> | null = null): Observable<KeyListOfValues<number>> {
    return this.http.post<KeyListOfValues<number>>(this.base_url + 'reports/success/', JSON.stringify(filters), this.httpOptions);
  }

  public getHospitalsPeriodicReport(filters: KeyListOfValues<number> | null, p1start: number, p1end: number, p2start: number, p2end: number): Observable<HospitalsPeriodicReportData> {
    return this.http.post<HospitalsPeriodicReportData>(
      this.base_url + `reports/hospitals/?p1start=${p1start}&p1end=${p1end}&p2start=${p2start}&p2end=${p2end}`,
      JSON.stringify(filters),
      this.httpOptions
    );
  }

  public getPatientPeriodicReport(filters: KeyListOfValues<number> | null, p1start: number, p1end: number, p2start: number, p2end: number): Observable<HospitalsPeriodicReportData> {    
    return this.http.post<HospitalsPeriodicReportData>(
      this.base_url + `reports/patients/?p1start=${p1start}&p1end=${p1end}&p2start=${p2start}&p2end=${p2end}`,
      JSON.stringify(filters), 
      this.httpOptions
    );
  }

  public getAutofillData(fields: string[]): Observable<AutolFillOptions> {
    return this.http.post<AutolFillOptions>(this.base_url + 'autofill/', JSON.stringify(fields), this.httpOptions);
  }

  public getFilteredReportExcel(filters: KeyListOfValues<number> | null = null): Observable<Blob> {
    if (filters === null || Object.keys(filters).length === 0) {
      return this.http.get(this.base_url + 'report/excel/', { responseType: 'blob' });
    }

    let bodyString = JSON.stringify(filters);
    return this.http.post(this.base_url + 'report/excel/', bodyString, { responseType: 'blob' });
  }
}
