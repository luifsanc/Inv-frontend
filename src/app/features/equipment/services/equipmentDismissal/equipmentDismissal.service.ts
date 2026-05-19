import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseDTO } from "../../../../core/models/ResponseDTO/ResponseDTO";
import { EquipmentDismissalResponseDTO } from "../../../../core/models/ResponseDTO/inventory/EquipmentDismissalResponseDTO";
import { environment } from "../../../../../environments/environment";
import { EquipmentDismissalRequestDTO } from "../../../../core/models/RequestDTO/inventory/EquipmentDismissalRequestDTO";
import { EquipmentDismissalTypeResponseDTO } from "../../../../core/models/ResponseDTO/inventory/EquipmentDismissalTypeResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class EquipmentDismissalService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl =  `${this.baseUrl}/equipment-dismissal`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<EquipmentDismissalResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<EquipmentDismissalResponseDTO[]>>(
      `${this.apiUrl}`
    );
  }

  public getTable(): Observable<ResponseDTO<EquipmentDismissalResponseDTO[]>> {
      return this.httpClient.get<ResponseDTO<EquipmentDismissalResponseDTO[]>>(
        `${this.apiUrl}`
      );
    }

  public getAllTypes(): Observable<ResponseDTO<EquipmentDismissalTypeResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<EquipmentDismissalTypeResponseDTO[]>>(
      `${this.apiUrl}/types`
    );
  }

  public saveDismissal(request: EquipmentDismissalRequestDTO): Observable<ResponseDTO<EquipmentDismissalResponseDTO>> {
    return this.httpClient.post<ResponseDTO<EquipmentDismissalResponseDTO>>(
      `${this.apiUrl}/saveDismissal`,
      request
    );
  }


}
