import { ComponentFixture, TestBed } from '@angular/core/testing';

import { hospitalUserDoctorComponent } from './doctorList.component';

describe('hospitalUserDoctorComponent', () => {
  let component: hospitalUserDoctorComponent;
  let fixture: ComponentFixture<hospitalUserDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ hospitalUserDoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(hospitalUserDoctorComponent);
    component = fixture.componentInstance;hospitalUserDoctorComponent
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
