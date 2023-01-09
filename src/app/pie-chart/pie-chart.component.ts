import {Component, ViewChild, Input, OnChanges, OnInit} from "@angular/core";
import { ApexLegend, ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  legend: ApexLegend;
};


@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"]
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input() series: number[];
  @Input() labels: string[];
  
  @ViewChild("chart") chart: ChartComponent;

  public chartOptions: PieChartOptions;

  constructor() {

  }

  ngOnInit(): void {
  }

  getChartOptions(): PieChartOptions {
    return {
      series: this.series,
      chart: {
        width: 380,
        type: "pie"
      },
      
      labels: this.labels,
      responsive: [],
      legend: {
        position: "bottom"
      }
    };
  }

  ngOnChanges(): void {
    this.chartOptions = this.getChartOptions();
  }
}
