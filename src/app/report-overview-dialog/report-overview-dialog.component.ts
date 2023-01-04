import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as saveAs from 'file-saver';
import { NgxCaptureService } from 'ngx-capture';
import { DatedReportDialogData } from 'src/types/report';

@Component({
  selector: 'app-report-overview-dialog',
  templateUrl: './report-overview-dialog.component.html',
  styleUrls: ['./report-overview-dialog.component.scss']
})
export class ReportOverviewDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReportOverviewDialogComponent>,
    private captureService: NgxCaptureService,
    @Inject(MAT_DIALOG_DATA) public data: DatedReportDialogData) { }

  @ViewChild('dialogContent', { static: true }) screen: ElementRef;

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close('Canceled');
  }

  saveImage(): void {
    this.captureService.getImage(this.screen.nativeElement, true).subscribe((base64img) => {
      this.downloadBase64Data(base64img, "Weekly Report");
    })
  }

  convertBase64ToFile(base64String: string, fileName: string): File {
    let arr = base64String.split(',');
    // @ts-ignore
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
      uint8Array[n] = bstr.charCodeAt(n);
    }
    return new File([uint8Array], fileName, {type: mime});
  }

  downloadBase64Data(base64String: string, fileName: string): void {
    let file = this.convertBase64ToFile(base64String, fileName);
    saveAs(file, fileName);
  }
}
