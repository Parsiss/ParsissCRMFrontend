import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportData } from '../types/report';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public base_url = 'http://localhost:8080/api/';

  constructor(
    public http: HttpClient
  ) { }
  
  public getReports(): Observable<ReportData> {
    console.log('getReports');
    return this.http.get<ReportData>(this.base_url + 'report');
  }

}
