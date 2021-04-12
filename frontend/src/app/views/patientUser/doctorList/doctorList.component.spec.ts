import { ComponentFixture, TestBed } from '@angular/core/testing';

import { patientUserDoctorComponent } from './doctorList.component';

describe('patientUserDoctorComponent', () => {
  let component: patientUserDoctorComponent;
  let fixture: ComponentFixture<patientUserDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ patientUserDoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(patientUserDoctorComponent);
    component = fixture.componentInstance;patientUserDoctorComponent
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
