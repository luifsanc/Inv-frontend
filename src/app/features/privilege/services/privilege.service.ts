import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';

import { MessageResponseDTO } from '../../../core/models/ResponseDTO/MessageResponseDTO';
import { PrivilegeResponseDTO } from '../../../core/models/ResponseDTO/PrivilegeResponseDTO';
import { PrivilegeRequestDTO } from '../../../core/models/RequestDTO/authentication/PrivilegeRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {
 private baseUrl = environment.authBaseUrl;
  private apiURl = `${this.baseUrl}/privilege`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<PrivilegeResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<PrivilegeResponseDTO[]>>(
      `${this.apiURl}`
    );
  }

    public save(
      entity: PrivilegeRequestDTO
    ): Observable<ResponseDTO<PrivilegeResponseDTO>> {
      return this.httpClient.post<ResponseDTO<PrivilegeResponseDTO>>(
        `${this.apiURl}/save`,
        entity
      );
    }
  
    public update(
      entity: PrivilegeRequestDTO,
      id: number
    ): Observable<ResponseDTO<PrivilegeResponseDTO>> {
      return this.httpClient.put<ResponseDTO<PrivilegeResponseDTO>>(
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
