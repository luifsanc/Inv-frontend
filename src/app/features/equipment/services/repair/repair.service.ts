import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { EquipmentRepairDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentRepairDetailResponseDTO';
import { EquipmentRepairRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentRepairRequestDTO';
import { MessageResponseDTO } from '../../../../core/models/ResponseDTO/MessageResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class RepairService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/equipment-repairs`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<EquipmentRepairDetailResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<EquipmentRepairDetailResponseDTO[]>>(
      `${this.apiUrl}/allDetailList`
    );
  }

  public save(
    entity: EquipmentRepairRequestDTO
  ): Observable<ResponseDTO<EquipmentRepairDetailResponseDTO>> {
    return this.httpClient.post<ResponseDTO<EquipmentRepairDetailResponseDTO>>(
      `${this.apiUrl}/createEquipmentRepair`,
      entity
    );
  }

  public update(id: number,
    entity: EquipmentRepairRequestDTO
  ): Observable<ResponseDTO<EquipmentRepairDetailResponseDTO>> {
    return this.httpClient.put<ResponseDTO<EquipmentRepairDetailResponseDTO>>(
      `${this.apiUrl}/updateEquipmentRepair/${id}`,
      entity
    );
  }

  public delete(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
  return this.httpClient.patch<ResponseDTO<MessageResponseDTO[]>>(
    `${this.apiUrl}/inactive/${id}`,
    null
  );
}
}
