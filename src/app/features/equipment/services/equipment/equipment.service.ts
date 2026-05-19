import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { EquipmentResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentResponseDTO';
import { EquipmentDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentDetailResponseDTO';
import { EquipmentRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentRequestDTO';
import { MessageResponseDTO } from '../../../../core/models/ResponseDTO/MessageResponseDTO';
import { WarrantTypeRequestDTO } from '../../../../core/models/RequestDTO/inventory/WarrantTypeRequestDTO';
import { InvoiceDetailRequestDTO } from '../../../../core/models/RequestDTO/inventory/InvoiceDetailRequestDTO';
import { InvoiceDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/InvoiceDetailResponseDTO';
import {WarrantTypeDetailResponseDTO} from '../../../../core/models/ResponseDTO/inventory/WarrantTypeDetailResponseDTO '
import { InvoiceRequestDTO } from '../../../../core/models/RequestDTO/inventory/InvoiceRequestDTO';
import { EquipmentRepairStatusChangeRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentRepairStatusChangeRequestDTO';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/equipment`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<EquipmentResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<EquipmentResponseDTO[]>>(
      `${this.apiUrl}/simple`
    );
  }

  public getTable(): Observable<ResponseDTO<EquipmentDetailResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<EquipmentDetailResponseDTO[]>>(
      `${this.apiUrl}`
    );
  }

  public getDetailById(id:number): Observable<ResponseDTO<EquipmentDetailResponseDTO>> {
    return this.httpClient.get<ResponseDTO<EquipmentDetailResponseDTO>>(
      `${this.apiUrl}/detail/${id}`
    );
  }

  public save(
    entity: EquipmentRequestDTO
  ): Observable<ResponseDTO<EquipmentDetailResponseDTO>> {
    return this.httpClient.post<ResponseDTO<EquipmentDetailResponseDTO>>(
      `${this.apiUrl}/save`,
      entity
    );
  }

  public update(
    entity: EquipmentRequestDTO,
    id: number
  ): Observable<ResponseDTO<EquipmentDetailResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<EquipmentDetailResponseDTO[]>>(
      `${this.apiUrl}/update/${id}`,
      entity
    );
  }

  public setWarranty(
    entity: WarrantTypeRequestDTO,
    id: number
  ): Observable<ResponseDTO<WarrantTypeDetailResponseDTO>>{
    return this.httpClient.put<ResponseDTO<WarrantTypeDetailResponseDTO>>(
      `${this.apiUrl}/setWarranty/${id}`,
      entity
    )

  }

  public invoice(
    entity: InvoiceRequestDTO,
    id: number
  ): Observable<ResponseDTO<InvoiceDetailResponseDTO>> {
    return this.httpClient.put<ResponseDTO<InvoiceDetailResponseDTO>>(
      `${this.apiUrl}/setInvoice/${id}`,
      entity
    );
  }

    public changeStatus(entity: EquipmentRepairStatusChangeRequestDTO, id: number  ): Observable<ResponseDTO<MessageResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<MessageResponseDTO[]>>(
      `${this.apiUrl}/changeStatus/${id}`,
      entity
    );
  }



  public delete(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
    return this.httpClient.patch<ResponseDTO<MessageResponseDTO[]>>(
      `${this.apiUrl}/inactive/${id}`, null
    );
  }

  public active(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
    return this.httpClient.patch<ResponseDTO<MessageResponseDTO[]>>(
      `${this.apiUrl}/activate/${id}`,
      null
    );
  }
}
