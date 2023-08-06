import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {
  public url_base: string;
  public use_main_db_anyway = false;

  // public base_url = '';
  // public static base_url = 'http://192.168.1.201:8000/api/';
  // public static base_url = 'http://localhost:8000/api/';

  // public base_url = 'http://192.168.1.201:9000/api/';
  

  constructor() {
    if(!isDevMode() || this.use_main_db_anyway) {
      this.url_base = 'http://192.168.1.201:8000/api/';
    } else {
      this.url_base = 'http://localhost:8000/api/';
    }
  }

}
