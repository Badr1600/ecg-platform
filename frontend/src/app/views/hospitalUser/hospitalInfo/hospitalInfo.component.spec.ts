import { ComponentFixture, TestBed } from '@angular/core/testing';

import { hospitalUserInfoComponent } from './hospitalInfo.component';

describe('hospitalUserInfoComponent', () => {
  let component: hospitalUserInfoComponent;
  let fixture: ComponentFixture<hospitalUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ hospitalUserInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(hospitalUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
