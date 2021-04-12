import { ComponentFixture, TestBed } from '@angular/core/testing';

import { hospitalUserPatientComponent } from './patientList.component';

describe('hospitalUserPatientComponent', () => {
  let component: hospitalUserPatientComponent;
  let fixture: ComponentFixture<hospitalUserPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ hospitalUserPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(hospitalUserPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
