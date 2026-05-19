import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { NationalityResponseDTO } from '../../models/ResponseDTO/administration/NationalityResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class NationalityService {

  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/nationality`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<NationalityResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<NationalityResponseDTO[]>>(
      `${this.apiUrl}/getSimpleList`
    );
  }

}
