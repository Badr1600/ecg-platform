import { ComponentFixture, TestBed } from '@angular/core/testing';

import { doctorUserHospitalComponent } from './hospitalList.component';

describe('doctorUserHospitalComponent', () => {
  let component: doctorUserHospitalComponent;
  let fixture: ComponentFixture<doctorUserHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ doctorUserHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(doctorUserHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
