import { Injectable } from '@angular/core';
import { EquipmentCharacteristicResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentCharacteristicResponseDTO';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { EquipmentCategoryResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentCategoryResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class EquipmentCategoriesService {
 private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/equipment-categories`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<EquipmentCategoryResponseDTO[]>> {
    const mockData: EquipmentCategoryResponseDTO[] = [
      { id: 1, name: 'MacBook Pro M3 Max' } as any,
      { id: 2, name: 'Laptops' } as any,
      { id: 3, name: 'Monitores' } as any,
      { id: 4, name: 'Periféricos' } as any
    ];
    return of({ success: true, message: 'OK', data: mockData } as unknown as ResponseDTO<EquipmentCategoryResponseDTO[]>).pipe(delay(500));
  }

}
