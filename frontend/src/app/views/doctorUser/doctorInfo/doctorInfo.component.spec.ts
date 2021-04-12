import { ComponentFixture, TestBed } from '@angular/core/testing';

import { doctorUserInfoComponent } from './doctorInfo.component';

describe('doctorUserInfoComponent', () => {
  let component: doctorUserInfoComponent;
  let fixture: ComponentFixture<doctorUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ doctorUserInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(doctorUserInfoComponent);
    component = fixture.componentInstance;doctorUserInfoComponent
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
