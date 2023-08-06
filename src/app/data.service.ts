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
  // public base_url = '';
  public static base_url = 'http://192.168.1.201:8000/api/';
  // public base_url = 'http://192.168.1.201:9000/api/';
  // public static base_url = 'http://localhost:8000/api/';

  public static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    public http: HttpClient,
    public dateAdapter: DateAdapter<moment.Moment>
  ) {
    this.http.get('assets/config.json').subscribe(data => {
      // @ts-ignore
      // DataService.base_url = data['url'];
      // console.log(DataService.base_url)
    });
  }


  public getReports(filters: ActiveFilters | null = null, page_index: number, page_size: number): Observable<PatientListData> {
    if (filters === null) { // || Object.keys(filters).length === 0) {
      // return this.http.get<PatientInformation[]>(DataService.base_url + 'rest/');
      filters = {};
    }

    let bodyString = {
      'filters': JSON.stringify(filters),
      'page_index': page_index,
      'page_size': page_size
    };

    return this.http.post<PatientListData>(DataService.base_url + 'report/filtered/', bodyString, DataService.httpOptions);
  }

  public getReportsForSearch(filters: ActiveFilters | null = null): Observable<PatientListData> {
    if (filters === null) {
      filters = {};
    }
    let bodyString = {
      'filters': JSON.stringify(filters),
    };

    return this.http.post<PatientListData>(DataService.base_url + 'report/search/', bodyString, DataService.httpOptions);
  }

  public getOptions(): Observable<ComboOptions<number>> {
    return this.http.get<ComboOptions<number>>(DataService.base_url + 'options/', DataService.httpOptions);
  }

  public getFilters(): Observable<ComboOptions<number>> {
    return this.http.get<ComboOptions<number>>(DataService.base_url + 'filters/', DataService.httpOptions);
  }

  public getAdaptiveFilterOptions(activeFilters: ActiveFilters) : Observable<ComboOptions<string>> {
    let body = JSON.stringify(activeFilters);
    return this.http.post<ComboOptions<string>>(DataService.base_url + 'adaptive_filters/', body, DataService.httpOptions);
  }

  public getPatient(id: number): Observable<PatientInformation> {
    return this.http.get<PatientInformation>(DataService.base_url + `rest/${id}/`);
  }

  public updatePatient(fulldata: PatientInformation): Observable<object> {
    fulldata = DateConversionService.ConvertDatetimesToDate(fulldata);

    let id = fulldata.ID;
    let bodyString = JSON.stringify(fulldata);
    return this.http.post<object>(DataService.base_url + `rest/${id}/`, bodyString, DataService.httpOptions);
  }

  public addPatient(fulldata: PatientInformation): Observable<object> {
    fulldata = DateConversionService.ConvertDatetimesToDate(fulldata);
    let bodyString = JSON.stringify(fulldata);
    return this.http.post<object>(DataService.base_url + 'rest/', bodyString, DataService.httpOptions);
  }

  public deletePatient(id: number): Observable<object> {
    return this.http.delete<object>(DataService.base_url + `rest/${id}/`);
  }

  public getCalendarEvent(): Observable<PatientInformation[]> {
    return DateConversionService.ConvertDatesToTimestamp(this.http.get<PatientInformation[]>(DataService.base_url + 'calendar/'));
  }

  public uploadFile(file: File): Observable<object> {
    return this.http.post<any>(DataService.base_url + 'report/upload/', file);
  }

  public getDatedReports(start: number, end: number): Observable<DatedReportData> {
    return this.http.get<DatedReportData>(DataService.base_url + `reports/dated/?start_date=${start}&end_date=${end}`);
  }

  public getSuccessRateReport(filters: KeyListOfValues<number> | null = null): Observable<KeyListOfValues<number>> {
    return this.http.post<KeyListOfValues<number>>(DataService.base_url + 'reports/success/', JSON.stringify(filters), DataService.httpOptions);
  }

  public getHospitalsPeriodicReport(filters: KeyListOfValues<number> | null, p1start: number, p1end: number, p2start: number, p2end: number): Observable<HospitalsPeriodicReportData> {
    return this.http.post<HospitalsPeriodicReportData>(
      DataService.base_url + `reports/hospitals/?p1start=${p1start}&p1end=${p1end}&p2start=${p2start}&p2end=${p2end}`,
      JSON.stringify(filters),
      DataService.httpOptions
    );
  }

  public getPatientPeriodicReport(filters: KeyListOfValues<number> | null, p1start: number, p1end: number, p2start: number, p2end: number): Observable<HospitalsPeriodicReportData> {
    return this.http.post<HospitalsPeriodicReportData>(
      DataService.base_url + `reports/patients/?p1start=${p1start}&p1end=${p1end}&p2start=${p2start}&p2end=${p2end}`,
      JSON.stringify(filters),
      DataService.httpOptions
    );
  }

  public getAutofillData(fields: string[]): Observable<AutolFillOptions> {
    return this.http.post<AutolFillOptions>(DataService.base_url + 'autofill/', JSON.stringify(fields), DataService.httpOptions);
  }

  public getFilteredReportExcel(filters: KeyListOfValues<number> | null = null): Observable<PatientListData> {
    if (filters === null) { // || Object.keys(filters).length === 0) {
      // return this.http.get<PatientInformation[]>(DataService.base_url + 'rest/');
      filters = {};
    }

    let bodyString = {
      'filters': JSON.stringify(filters),
    };

    return this.http.post<PatientListData>(DataService.base_url + 'report/excel/', bodyString, DataService.httpOptions);
  }
}
