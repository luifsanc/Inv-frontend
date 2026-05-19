/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EquipmentCategoriesService } from './equipmentCategories.service';

describe('Service: EquipmentCategories', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquipmentCategoriesService]
    });
  });

  it('should ...', inject([EquipmentCategoriesService], (service: EquipmentCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
