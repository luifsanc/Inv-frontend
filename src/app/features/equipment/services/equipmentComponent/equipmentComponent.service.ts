import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { ComponentTypeResponseDTO } from '../../../../core/models/ResponseDTO/inventory/ComponentTypeResponseDTO';
import { ComponentTypeRequestDTO } from '../../../../core/models/RequestDTO/inventory/ComponentTypeRequestDTO';
import { MessageResponseDTO } from '../../../../core/models/ResponseDTO/MessageResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class EquipmentComponentService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/component-types`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<ComponentTypeResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<ComponentTypeResponseDTO[]>>(
      `${this.apiUrl}/list`
    );
  }

  public save(
        entity: ComponentTypeRequestDTO
      ): Observable<ResponseDTO<ComponentTypeResponseDTO>> {
        return this.httpClient.post<
          ResponseDTO<ComponentTypeResponseDTO>
        >(`${this.apiUrl}/save`, entity);
  }

  public update(
    entity: ComponentTypeRequestDTO,
    id: number
    ): Observable<ResponseDTO<ComponentTypeResponseDTO[]>> {
        return this.httpClient.put<ResponseDTO<ComponentTypeResponseDTO[]>>(
          `${this.apiUrl}/update/${id}`,
          entity);
  }

  public delete(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
      return this.httpClient.delete<ResponseDTO<MessageResponseDTO[]>>(
        `${this.apiUrl}/inactive/${id}`
      );
    }

}
