import {ChartAdopter} from './BaseAdopter';
import {ChartOptions} from "../chart/chart.component";
import {PatientInformation} from "../../types/report";

export class SimplePieAdopter implements ChartAdopter
{
  chartType : 'pie' = 'pie';
  columns: string[];
  patientData: PatientInformation[];

  constructor(patientData: PatientInformation[], columns: string[]) {
    this.patientData = patientData;
    this.columns = columns;
  }

  getChartOptions(): ChartOptions {
    let series: number[] = [];
    let labels: string[] = [];
    this.patientData.forEach((patient) => {
      let label = (patient as any)[this.columns[0]];
      if(["SurgeryResult"].includes(this.columns[0])) {
        label = label == 1 ? "Success" : "Failure";
      }
      if (!labels.includes(label)) {
        labels.push(label);
        series.push(1);
      } else {
        series[labels.indexOf(label)]++;
      }
    });

    return {
      series: series,
      chart: {
        width: 380,
        type: this.chartType,
      },
      labels: labels,
      responsive: []
    };
  }

  setDataSource(dataSource: any): void {
    this.patientData = dataSource;
  }

  setFeaturesName(columns: string[]): void {
    this.columns = columns;
  }
}
