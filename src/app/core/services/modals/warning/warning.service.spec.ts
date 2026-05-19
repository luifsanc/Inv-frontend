/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WarningService } from './warning.service';

describe('Service: Warning', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WarningService]
    });
  });

  it('should ...', inject([WarningService], (service: WarningService) => {
    expect(service).toBeTruthy();
  }));
});
