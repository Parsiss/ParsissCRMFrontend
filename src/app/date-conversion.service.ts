import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map, Observable } from 'rxjs';
import { PatientInformation } from 'src/types/report';

@Injectable({
  providedIn: 'root'
})
export class DateConversionService {
  constructor() { }

  public static ConvertDatetimesToDate(fulldata: PatientInformation): PatientInformation {
    for(let key of ['SurgeryDate', 'DateOfHospitalAdmission', 'DateOfFirstContact', 'DateOfPayment']) {
      if ((fulldata as any)[key]) {
        (fulldata as any)[key] = moment((fulldata as any)[key]).format('YYYY-MM-DD');
      }
    }
    return fulldata;
  }

  public static ConvertDatesToTimestamp(obs: Observable<PatientInformation[]>): Observable<PatientInformation[]> {
    return obs.pipe(
      map((data: PatientInformation[]) => {
        data.forEach(patient => {
          for(let key of ['SurgeryDate', 'DateOfBirth', 'DateOfFirstTreatment', 'DateOfLastTreatment']) {
            if ((patient as any)[key]) {
              (patient as any)[key] = moment((patient as any)[key]).unix();
            }
          }
        });

        return data;
      })
    );
  }

}
