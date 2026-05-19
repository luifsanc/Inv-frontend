import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { GenderResponseDTO } from '../../models/ResponseDTO/administration/GenderResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/gender`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<GenderResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<GenderResponseDTO[]>>(
      `${this.apiUrl}/getSimpleList`
    );
  }
}
