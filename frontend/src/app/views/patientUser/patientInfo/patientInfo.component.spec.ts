import { ComponentFixture, TestBed } from '@angular/core/testing';

import { patientUserInfoComponent } from './patientInfo.component';

describe('patientUserInfoComponent', () => {
  let component: patientUserInfoComponent;
  let fixture: ComponentFixture<patientUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ patientUserInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(patientUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
