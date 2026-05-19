import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { MenuResponseDTO } from '../../../core/models/ResponseDTO/MenuResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = environment.authBaseUrl;
  private getUrl = `${this.baseUrl}/menu`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<ResponseDTO<MenuResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<MenuResponseDTO[]>>(
      `${this.getUrl}`
    );
  }

}
