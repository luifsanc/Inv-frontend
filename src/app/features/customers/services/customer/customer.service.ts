import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { CustomerResponseDTO } from '../../../../core/models/ResponseDTO/administration/CustomerResponseDTO';
import { CustomerDetailResponseDTO } from '../../../../core/models/ResponseDTO/administration/CustomerDetailResponseDTO';
import { CustomerRequestDTO } from '../../../../core/models/RequestDTO/administration/CustomerRequestDTO';
import { MessageResponseDTO } from '../../../../core/models/ResponseDTO/MessageResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/customers`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<CustomerDetailResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<CustomerDetailResponseDTO[]>>(
      `${this.apiUrl}`
    );
  }

  public getList(): Observable<ResponseDTO<CustomerResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<CustomerResponseDTO[]>>(
      `${this.apiUrl}/getTable`
    );
  }

  public save(
    entity: CustomerRequestDTO
  ): Observable<ResponseDTO<CustomerDetailResponseDTO>> {
    return this.httpClient.post<ResponseDTO<CustomerDetailResponseDTO>>(
      `${this.apiUrl}/save`,
      entity
    );
  }

  public update(
    entity: CustomerRequestDTO,
    id: number
  ): Observable<ResponseDTO<CustomerDetailResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<CustomerDetailResponseDTO[]>>(
      `${this.apiUrl}/update/${id}`,
      entity
    );
  }

  public delete(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
    return this.httpClient.delete<ResponseDTO<MessageResponseDTO[]>>(
      `${this.apiUrl}/inactive/${id}`
    );
  }

  public active(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<MessageResponseDTO[]>>(
      `${this.apiUrl}/activate/${id}`,
      null
    );
  }
}
