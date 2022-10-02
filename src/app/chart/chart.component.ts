import {Component, Input, OnInit, ViewChild, SimpleChanges} from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import {ChartAdopter} from "../chartAdopters/BaseAdopter";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"]
})
export class MyChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ChartOptions;
  @Input() chartAdopter: ChartAdopter;

  constructor() {}


  ngOnInit(): void {
    this.chartOptions = this.chartAdopter.getChartOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['chartAdopter']) {
      this.chartOptions = this.chartAdopter.getChartOptions();
    }
  }
}
