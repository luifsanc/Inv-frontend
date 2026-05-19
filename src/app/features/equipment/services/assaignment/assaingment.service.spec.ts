/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AssaingmentService } from './assaingment.service';

describe('Service: Assaingment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssaingmentService]
    });
  });

  it('should ...', inject([AssaingmentService], (service: AssaingmentService) => {
    expect(service).toBeTruthy();
  }));
});
