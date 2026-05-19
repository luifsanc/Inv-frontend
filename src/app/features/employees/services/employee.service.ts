import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { EmployeeCatalogResponseDTO } from '../../../core/models/ResponseDTO/administration/EmployeeCatalogResponseDTO';
import { EmployeeTableResponseDTO } from '../../../core/models/ResponseDTO/administration/EmployeeTableResponseDTO';
import { EmployeeRequestDTO } from '../../../core/models/RequestDTO/administration/EmployeeRequestDTO';
import { MessageResponseDTO } from '../../../core/models/ResponseDTO/MessageResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/employee`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<EmployeeCatalogResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<EmployeeCatalogResponseDTO[]>>(
      `${this.apiUrl}/getSimpleList`
    );
  }

  public getTable(): Observable<ResponseDTO<EmployeeTableResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<EmployeeTableResponseDTO[]>>(
      `${this.apiUrl}/getTable`
    );
  }

  public save(
    entity: EmployeeRequestDTO
  ): Observable<ResponseDTO<EmployeeTableResponseDTO>> {
    return this.httpClient.post<ResponseDTO<EmployeeTableResponseDTO>>(
      `${this.apiUrl}/save`,
      entity
    );
  }

  public update(
    entity: EmployeeRequestDTO,
    id: number
  ): Observable<ResponseDTO<EmployeeTableResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<EmployeeTableResponseDTO[]>>(
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
