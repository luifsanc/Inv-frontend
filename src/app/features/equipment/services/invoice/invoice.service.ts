
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { InvoiceDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/InvoiceDetailResponseDTO';
import { InvoiceRequestDTO } from '../../../../core/models/RequestDTO/inventory/InvoiceRequestDTO';
import { MessageResponseDTO } from '../../../../core/models/ResponseDTO/MessageResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/invoices`;

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<ResponseDTO<InvoiceDetailResponseDTO[]>> {
      return this.httpClient.get<ResponseDTO<InvoiceDetailResponseDTO[]>>(
        `${this.apiUrl}/list`
      );
    }

  public getByInvoiceNumber(invoiceNumber: string): Observable<ResponseDTO<InvoiceDetailResponseDTO>> {
      return this.httpClient.get<ResponseDTO<InvoiceDetailResponseDTO>>(
        `${this.apiUrl}/get-number/${invoiceNumber}`
      );
    }

      public getBySerialNumber(serialNumber: string): Observable<ResponseDTO<InvoiceDetailResponseDTO>> {
    return this.httpClient.get<ResponseDTO<InvoiceDetailResponseDTO>>(
      `${this.apiUrl}/get-by-serial/${serialNumber}`
    );
  }

  public save(
      entity: InvoiceRequestDTO
    ): Observable<ResponseDTO<InvoiceDetailResponseDTO>> {
      return this.httpClient.post<
        ResponseDTO<InvoiceDetailResponseDTO>
      >(`${this.apiUrl}/save`, entity);
    }
  
  public edit(
      entity: InvoiceRequestDTO,
      id: number
    ): Observable<ResponseDTO<InvoiceDetailResponseDTO[]>> {
      return this.httpClient.put<ResponseDTO<InvoiceDetailResponseDTO[]>>(
        `${this.apiUrl}/update/${id}`,
        entity
      );
    }
  
  public delete(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
      return this.httpClient.delete<ResponseDTO<MessageResponseDTO[]>>(
        `${this.apiUrl}/inactive/${id}`
      );
    }

}
