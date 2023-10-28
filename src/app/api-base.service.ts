import { Injectable, isDevMode } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {
  public token_url: string;
  public url_base: string;
  public use_main_db_anyway = false;

  // public base_url = '';
  // public static base_url = 'http://192.168.1.201:8000/api/';
  // public static base_url = 'http://localhost:8000/api/';

  // public base_url = 'http://192.168.1.201:9000/api/';


  constructor(private location: Location, private locationStrategy: LocationStrategy) {
    if(!isDevMode() || this.use_main_db_anyway) {
      // this.token_url = 'http://192.168.1.201:8000/token/'
      // this.url_base = 'http://192.168.1.201:8000/api/'
      const currentOrigin = window.location.origin
      const originWithoutPort = currentOrigin.replace(`:${window.location.port}`, '');
      this.token_url = originWithoutPort + ':8000/token/'
      this.url_base = originWithoutPort + ':8000/api/'
    } else {
      this.token_url = 'http://localhost:8000/token/'
      this.url_base = 'http://localhost:8000/api/'
    }
  }

}
