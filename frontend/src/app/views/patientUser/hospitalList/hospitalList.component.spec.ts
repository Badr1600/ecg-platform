import { ComponentFixture, TestBed } from '@angular/core/testing';

import { patientUserHospitalComponent } from './hospitalList.component';

describe('patientUserHospitalComponent', () => {
  let component: patientUserHospitalComponent;
  let fixture: ComponentFixture<patientUserHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ patientUserHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(patientUserHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
