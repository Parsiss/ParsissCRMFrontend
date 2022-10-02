import {ChartOptions} from "../chart/chart.component";


export interface ChartAdopter {
  chartType: string;

  getChartOptions(): ChartOptions;
  setDataSource(dataSource: any): void;
  setFeaturesName(columns: any[]): void;
};
