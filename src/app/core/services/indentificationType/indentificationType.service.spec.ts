/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IndentificationTypeService } from './indentificationType.service';

describe('Service: IndentificationType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndentificationTypeService]
    });
  });

  it('should ...', inject([IndentificationTypeService], (service: IndentificationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
