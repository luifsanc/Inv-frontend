import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { UserResponseDTO } from '../../../core/models/ResponseDTO/UserResponseDTO';
import { UserRequestoDTO } from '../../../core/models/RequestDTO/UserRequestDTO';
import { MessageResponseDTO } from '../../../core/models/ResponseDTO/MessageResponseDTO';
import { UserDetailsResponseDTO } from '../../../core/models/ResponseDTO/UserDetailsResponseDTO';
import { PasswordChangeRequestDTO } from '../../../core/models/RequestDTO/PasswordChangeRequestDTO';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.authBaseUrl;
  private userGetUrl = `${this.baseUrl}/usuarios`;

  constructor(private httpClient: HttpClient) {}


  public getDetailsById(id: number): Observable<ResponseDTO<UserDetailsResponseDTO>> {
  return this.httpClient.get<ResponseDTO<UserDetailsResponseDTO>>(
    `${this.userGetUrl}/detail/${id}`
  );
}

  public getAll(): Observable<ResponseDTO<UserResponseDTO[]>> {
    return this.httpClient.get<ResponseDTO<UserResponseDTO[]>>(
      `${this.userGetUrl}`
    );
  }

  public update(
    user: UserRequestoDTO,
    id: number
  ): Observable<ResponseDTO<UserResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<UserResponseDTO[]>>(
      `${this.userGetUrl}/update/${id}`,
      user
    );
  }

  public delete(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
    return this.httpClient.delete<ResponseDTO<MessageResponseDTO[]>>(
      `${this.userGetUrl}/delete/${id}`
    );
  }

  public active(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<MessageResponseDTO[]>>(
      `${this.userGetUrl}/activate/${id}`,null
    );
  }

  public suspend(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<MessageResponseDTO[]>>(
      `${this.userGetUrl}/suspend/${id}`,null
    );
  }

  public unsuspend(id: number): Observable<ResponseDTO<MessageResponseDTO[]>> {
    return this.httpClient.put<ResponseDTO<MessageResponseDTO[]>>(
      `${this.userGetUrl}/unsuspend/${id}`,null
    );
  }

  public changePassword(id: number, request: PasswordChangeRequestDTO): Observable<ResponseDTO<MessageResponseDTO>> {
    return this.httpClient.put<ResponseDTO<MessageResponseDTO>>(
      `${this.userGetUrl}/changePassword/${id}`,
      request
    );
  }
}
