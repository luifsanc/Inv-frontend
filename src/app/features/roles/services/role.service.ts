import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { RolesResponseDTO } from '../../../core/models/ResponseDTO/RolesResponseDTO';
import { RoleRequestDTO } from '../../../core/models/RequestDTO/authentication/RoleRequestDTO';
import { MessageResponseDTO } from '../../../core/models/ResponseDTO/MessageResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = environment.authBaseUrl;
  private apiURl = `${this.baseUrl}/role`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<RolesResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<RolesResponseDTO[]>>(
      `${this.apiURl}`
    );
  }

  public save(
    entity: RoleRequestDTO
  ): Observable<ResponseDTO<RolesResponseDTO>> {
    return this.httpClient.post<ResponseDTO<RolesResponseDTO>>(
      `${this.apiURl}/save`,
      entity
    );
  }

  public update(
    entity: RoleRequestDTO,
    id: number
  ): Observable<ResponseDTO<RolesResponseDTO>> {
    return this.httpClient.put<ResponseDTO<RolesResponseDTO>>(
      `${this.apiURl}/update/${id}`,
      entity
    );
  }

  public addMenus(
    entity: RoleRequestDTO,
    id: number
  ): Observable<ResponseDTO<RolesResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<RolesResponseDTO[]>>(
      `${this.apiURl}/addMenus/${id}`,
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
