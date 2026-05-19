import { WarrantTypeDetailResponseDTO } from './../../../../core/models/ResponseDTO/inventory/WarrantTypeDetailResponseDTO ';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class WarrantyService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/warranty-types`;

  constructor(private httpClient: HttpClient) {}

  public findById(warrntyId: number): Observable<ResponseDTO<WarrantTypeDetailResponseDTO>> {
    return this.httpClient.get<ResponseDTO<WarrantTypeDetailResponseDTO>>(
      `${this.apiUrl}/getDetailsWarranty/${warrntyId}`
    );
  }

}
