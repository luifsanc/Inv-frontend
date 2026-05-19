import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { CompanyResponseDTO } from '../../../core/models/ResponseDTO/inventory/CompanyResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class CompanieService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/companies`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<CompanyResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<CompanyResponseDTO[]>>(
      `${this.apiUrl}/simple`
    );
  }
}
