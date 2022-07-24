import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter, Patient, PatientFullInformation } from '../types/report';

import { filterGroup, KeyListOfValues } from './reports-list-component/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public base_url = 'http://localhost:8080/api/';

  constructor(
    public http: HttpClient
  ) { }

  public getReports(filters: KeyListOfValues<string> | null): Observable<Patient[]> {
    if (filters === null || Object.keys(filters).length === 0) {
      return this.http.get<Patient[]>(this.base_url + 'report');
    }

    let bodyString = JSON.stringify(filters);
    return this.http.post<Patient[]>(this.base_url + 'report/filtered', bodyString);
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

}
