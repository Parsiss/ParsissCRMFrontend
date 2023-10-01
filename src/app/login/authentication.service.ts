import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';


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
    this.http.post<LoginResult>(this.base_url, JSON.stringify(user), this.httpOptions).subscribe({ next:
          data => { this.authData = data;
                    localStorage.setItem(this.localStorageKey, this.authData!.access);
                    observable.emit()},
      error: err => {console.log("Login error"), observable.error(err)}
    })
    return observable;
  }

  public isLoggedIn(): boolean {
    let current_token = localStorage.getItem(this.localStorageKey);
    if (current_token === null){
      return false
    }
    return true
  }


  public getToken(): string | null {
    return localStorage.getItem(this.localStorageKey);
  }
}
