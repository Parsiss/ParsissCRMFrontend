import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { filter, map, Observable, of } from 'rxjs';


import { DataService as BaseDataService } from '../data.service';

import { ApiBaseService } from '../api-base.service';
import { LoginResult, User } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public localStorageKey = 'access';
  public authData?: LoginResult;
  public base_url = this.apiBase.token_url;
  public httpOptions = BaseDataService.httpOptions;

  constructor(
    private apiBase: ApiBaseService,
    public http: HttpClient,
    public dateAdapter: DateAdapter<moment.Moment>
  ) {
  }

  public login(user: User): Observable<void> {
    let observable = new EventEmitter<void>();
    this.http.post<LoginResult>(this.base_url, JSON.stringify(user), this.httpOptions).subscribe(data => {
      this.authData = data;
      localStorage.setItem(this.localStorageKey, this.authData.access);
      observable.emit()
    })
    return observable;
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(this.localStorageKey);
    console.log(token)
    return token != null && token.length > 0;
  }


  public getToken(): string | null {
    return localStorage.getItem(this.localStorageKey);
  }
}
