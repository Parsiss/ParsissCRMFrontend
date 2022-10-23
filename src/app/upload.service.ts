import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http:HttpClient,
  private dataService: DataService,
  private _snackBar: MatSnackBar
) { }

  upload(file: File) {

    this.dataService.uploadFile(file).subscribe(
      (data: any) => {
        this._snackBar.open("Upload Database Successfully", "Close", {
          duration: 2000,
        });
      }
    );
  }
}
