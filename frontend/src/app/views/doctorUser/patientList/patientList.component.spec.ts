import { ComponentFixture, TestBed } from '@angular/core/testing';

import { doctorUserPatientComponent } from './patientList.component';

describe('doctorUserPatientComponent', () => {
  let component: doctorUserPatientComponent;
  let fixture: ComponentFixture<doctorUserPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ doctorUserPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(doctorUserPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
