/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EquipmentComponentService } from './equipmentComponent.service';

describe('Service: EquipmentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquipmentComponentService]
    });
  });

  it('should ...', inject([EquipmentComponentService], (service: EquipmentComponentService) => {
    expect(service).toBeTruthy();
  }));
});
