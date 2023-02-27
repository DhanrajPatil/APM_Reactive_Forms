import { TestBed } from '@angular/core/testing';

import { CustomerFormCheckGuard } from './customer-form-check.guard';

describe('CustomerFormCheckGuard', () => {
  let guard: CustomerFormCheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomerFormCheckGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
