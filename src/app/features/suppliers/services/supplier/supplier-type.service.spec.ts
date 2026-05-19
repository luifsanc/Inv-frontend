import { TestBed } from '@angular/core/testing';

import { SupplierTypeService } from './supplier-type.service';

describe('SupplierTypeService', () => {
  let service: SupplierTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
