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

  @Input() title: string;
  @Input() series: Map<string, number[]>;
  @Input() labels: string[];

  constructor() {
    this.chartOptions = {
      series: [],
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
        enabled: true
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {},
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

  ngOnChanges(changes: SimpleChanges) {
    if(changes['series'] || changes['labels']) {
      let series_data = changes['series'].currentValue;
      let labels_data = changes['labels'].currentValue;
      this.updateChart(series_data, labels_data)
    }
  }

  updateChart(series_data:  Map<string, number[]>, labels_data: string[]) {
    let series: any[] = [];
    series_data.forEach((value, key) => {
      series.push({
        name: key,
        data: value
      })
    });

    this.chartOptions.series = series;
    this.chartOptions.xaxis = {
      categories: labels_data
    }
  }
}
