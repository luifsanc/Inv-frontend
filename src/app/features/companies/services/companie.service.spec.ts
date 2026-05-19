/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CompanieService } from './companie.service';

describe('Service: Companie', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanieService]
    });
  });

  it('should ...', inject([CompanieService], (service: CompanieService) => {
    expect(service).toBeTruthy();
  }));
});
