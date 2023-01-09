import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataService } from '../data.service';
import { KeyListOfValues } from '../reports-list-component/interfaces';

@Component({
  selector: 'app-success-pie-chart',
  templateUrl: './success-pie-chart.component.html',
  styleUrls: ['./success-pie-chart.component.scss']
})
export class SuccessPieChartComponent implements OnInit, OnChanges {
  constructor(
    private dataService: DataService
  ) { }

  @Input() filters: KeyListOfValues<number> | null = null;

  public series: number[] = [];
  public labels: string[] = [];

  public labelsText: string[] = [
    'وارد نشده',
    'موفق',
    'لغو شده',
    'ناموفق',
  ];

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.dataService.getSuccessRateReport(this.filters).subscribe((data) => {
        this.series = data['count'];
        this.labels = [];
        data['labels'].forEach((label: number) => {
          this.labels.push(this.labelsText[label]);
        });
      });
    }
  }

}
