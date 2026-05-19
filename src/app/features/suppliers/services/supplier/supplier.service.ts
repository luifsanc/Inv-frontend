import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { environment } from '../../../../../environments/environment';
import { SupplierResponseDTO } from '../../../../core/models/ResponseDTO/inventory/SupplierResponseDTO';
import { SupplierRequestDTO } from '../../../../core/models/RequestDTO/inventory/SupplierRequestDTO';
import { MessageResponseDTO } from '../../../../core/models/ResponseDTO/MessageResponseDTO';



@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private baseUrl = environment.apiBaseUrl;
  private apiURl = `${this.baseUrl}/supplier`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<SupplierResponseDTO[]>> {
      return this.httpClient.get<ResponseDTO<SupplierResponseDTO[]>>(
        `${this.apiURl}/list`
      );
    }

    public getSuppliersIdType(
      id:number
    ): Observable<ResponseDTO<SupplierResponseDTO[]>>
    {
      return this.httpClient.get<ResponseDTO<SupplierResponseDTO[]>>(
        `${this.apiURl}/supplierType/${id}`
      )
    }

  public create(
      entity: SupplierRequestDTO
    ): Observable<ResponseDTO<SupplierResponseDTO>> {
      return this.httpClient.post<ResponseDTO<SupplierResponseDTO>>(
        `${this.apiURl}/save`,
        entity
      );
    }

    public update(
     entity: SupplierRequestDTO,
      id: number
    ): Observable<ResponseDTO<SupplierResponseDTO>> {
      return this.httpClient.put<ResponseDTO<SupplierResponseDTO>>(
        `${this.apiURl}/update/${id}`,
        entity
      );
    }

    public delete(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
        return this.httpClient.delete<ResponseDTO<MessageResponseDTO[]>>(
          `${this.apiURl}/inactive/${id}`
        );
      }

    public active(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
        return this.httpClient.put<ResponseDTO<MessageResponseDTO[]>>(
          `${this.apiURl}/activate/${id}`,
          null
        );
    }

}
