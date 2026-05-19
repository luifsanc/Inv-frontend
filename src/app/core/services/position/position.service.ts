import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { PositionResponseDTO } from '../../models/ResponseDTO/administration/PositionResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/position`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<PositionResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<PositionResponseDTO[]>>(
      `${this.apiUrl}/getSimpleList`
    );
  }
}
