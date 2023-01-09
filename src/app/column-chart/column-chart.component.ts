import { Component, Input, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";

export type ColumnChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: "app-column-chart",
  templateUrl: "./column-chart.component.html",
  styleUrls: ["./column-chart.component.scss"]
})
export class ColumnChartComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ColumnChartOptions;

  @Input() series: Map<string, number[]>;
  @Input() labels: string[];
  @Input() title: string;

  constructor() {
  }


  ngOnChanges(changes: SimpleChanges) {
    if(changes['series'] || changes['labels']) {
      this.series = changes['series'].currentValue;
      this.labels = changes['labels'].currentValue;
      this.updateChart();
    }
  }

  updateChart() {
    let series: any[] = [];
    this.series.forEach((value, key) => {
      series.push({
        name: key,
        data: value
      })
    });
    
    this.chartOptions = {
      series: series,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.labels
      },
      yaxis: {
        title: {
          text: ""
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: (val) => "" + val
        }
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        floating: false,
      }
    };
  }
}
