import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { WorkModeResponseDTO } from '../../models/ResponseDTO/administration/WorkModeResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class WorkModeService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/work-mode`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<WorkModeResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<WorkModeResponseDTO[]>>(
      `${this.apiUrl}/getSimpleList`
    );
  }
}
