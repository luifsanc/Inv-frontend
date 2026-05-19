import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { environment } from '../../../../../environments/environment';
import { SupplierRequestDTO } from '../../../../core/models/RequestDTO/inventory/SupplierRequestDTO';
import { MessageResponseDTO } from '../../../../core/models/ResponseDTO/MessageResponseDTO';
import { SupplierTypeResponseDTO } from '../../../../core/models/ResponseDTO/inventory/SupplierTypeResponseDTO';



@Injectable({
  providedIn: 'root'
})
export class SupplierTypeService {

  private baseUrl = environment.apiBaseUrl;
  private apiURl = `${this.baseUrl}/supplier-types`;

  constructor(private httpClient: HttpClient) {}

  getAllActive(): Observable<ResponseDTO<SupplierTypeResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<SupplierTypeResponseDTO[]>>(`${this.apiURl}/list`);
  }
}
