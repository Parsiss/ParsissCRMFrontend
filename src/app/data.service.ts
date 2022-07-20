import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportData } from '../types/report';

import { filterGroup, KeyListOfValues } from './reports-list-component/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public base_url = 'http://localhost:8080/api/';

  constructor(
    public http: HttpClient
  ) { }
  
  public getReports(filters: KeyListOfValues<string> | null): Observable<ReportData> {
    if(filters === null) {
      return this.http.get<ReportData>(this.base_url + 'report');
    }

    let bodyString = JSON.stringify(filters);
    return this.http.post<ReportData>(this.base_url + 'report/filtered', bodyString);
  }

}
