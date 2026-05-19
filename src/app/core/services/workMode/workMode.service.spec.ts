/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WorkModeService } from './workMode.service';

describe('Service: WorkMode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkModeService]
    });
  });

  it('should ...', inject([WorkModeService], (service: WorkModeService) => {
    expect(service).toBeTruthy();
  }));
});
