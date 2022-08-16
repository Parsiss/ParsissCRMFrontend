import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AllPatientFullInformation,
  Filter,
  Patient,
  PatientFullInformation,
  SurgeriesInformation
} from '../types/report';

import { filterGroup, KeyListOfValues } from './reports-list-component/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public base_url = 'http://localhost:8080/api/';

  constructor(
    public http: HttpClient
  ) { }

  public getReports(filters: KeyListOfValues<string> | null): Observable<AllPatientFullInformation> {
    if (filters === null || Object.keys(filters).length === 0) {
      return this.http.get<AllPatientFullInformation>(this.base_url + 'report');
    }

    let bodyString = JSON.stringify(filters);
    return this.http.post<AllPatientFullInformation>(this.base_url + 'report/filtered', bodyString);
  }

  public getOptions(): Observable<Filter[]> {
    return this.http.get<Filter[]>(this.base_url + 'options');
  }

  public getPatient(id: number): Observable<PatientFullInformation> {
    return this.http.get<PatientFullInformation>(this.base_url + 'report/detail/' + id);
  }

  public updatePatient(fulldata: PatientFullInformation): Observable<object> {
    let bodyString = JSON.stringify(fulldata);
    return this.http.post<object>(this.base_url + 'report/detail/update', bodyString);
  }

  public addPatient(fulldata: PatientFullInformation): Observable<object> {
    let bodyString = JSON.stringify(fulldata);
    return this.http.post<object>(this.base_url + 'report/add', bodyString);
  }

  public deletePatient(id: number): Observable<object> {
    return this.http.delete<object>(this.base_url + 'report/delete/' + id);
  }

  public getCalendarEvent(): Observable<SurgeriesInformation[]> {
      return this.http.get<SurgeriesInformation[]>(this.base_url + 'home/calendar_event');
  }
}
