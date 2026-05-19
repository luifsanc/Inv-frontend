/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PrivilegeService } from './privilege.service';

describe('Service: Privilege', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivilegeService]
    });
  });

  it('should ...', inject([PrivilegeService], (service: PrivilegeService) => {
    expect(service).toBeTruthy();
  }));
});
