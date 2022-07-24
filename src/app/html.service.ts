import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlService {
  private _isPageReady: boolean = false;
  public get isPageReady(): boolean {
    return this._isPageReady;
  }

  public set isPageReady(value: boolean) {
    this._isPageReady = value;
  }

  constructor() { }
}
