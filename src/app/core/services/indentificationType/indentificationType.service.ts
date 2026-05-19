import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { IdentificationTypeResponseDTO } from '../../models/ResponseDTO/administration/IdentificationTypeResponseDTO';
@Injectable({
  providedIn: 'root',
})
export class IndentificationTypeService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/identification-type`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<IdentificationTypeResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<IdentificationTypeResponseDTO[]>>(
      `${this.apiUrl}/getSimpleList`
    );
  }
}
