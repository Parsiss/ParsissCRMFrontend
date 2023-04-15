import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPreiodicReportComponent } from './patient-preiodic-report.component';

describe('PatientPreiodicReportComponent', () => {
  let component: PatientPreiodicReportComponent;
  let fixture: ComponentFixture<PatientPreiodicReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientPreiodicReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPreiodicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
