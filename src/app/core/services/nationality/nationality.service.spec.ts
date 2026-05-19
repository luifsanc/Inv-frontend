/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NationalityService } from './nationality.service';

describe('Service: Nationality', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NationalityService]
    });
  });

  it('should ...', inject([NationalityService], (service: NationalityService) => {
    expect(service).toBeTruthy();
  }));
});
