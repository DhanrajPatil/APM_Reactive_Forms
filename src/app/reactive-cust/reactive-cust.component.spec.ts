import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveCustComponent } from './reactive-cust.component';

describe('ReactiveCustComponent', () => {
  let component: ReactiveCustComponent;
  let fixture: ComponentFixture<ReactiveCustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactiveCustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
