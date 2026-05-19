/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModalDialogService } from './modalDialog.service';

describe('Service: ModalDialog', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalDialogService]
    });
  });

  it('should ...', inject([ModalDialogService], (service: ModalDialogService) => {
    expect(service).toBeTruthy();
  }));
});
