/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RepairService } from './repair.service';

describe('Service: Repair', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairService]
    });
  });

  it('should ...', inject([RepairService], (service: RepairService) => {
    expect(service).toBeTruthy();
  }));
});
