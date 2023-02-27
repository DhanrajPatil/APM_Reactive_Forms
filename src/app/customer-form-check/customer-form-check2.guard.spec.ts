import { TestBed } from '@angular/core/testing';

import { CustomerFormCheck2Guard } from './customer-form-check2.guard';

describe('CustomerFormCheck2Guard', () => {
  let guard: CustomerFormCheck2Guard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomerFormCheck2Guard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
