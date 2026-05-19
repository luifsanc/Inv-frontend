import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { UserLoginResponseDTO } from '../../../core/models/ResponseDTO/UserLoginResponseDTO';
import { ResponseDTO } from '../../../core/models/ResponseDTO/ResponseDTO';
import { LoginRequestDTO } from '../../../core/models/RequestDTO/LoginRequestDTO';
import { PasswordChangeRequestDTO } from '../../../core/models/RequestDTO/PasswordChangeRequestDTO';
import { UserRequestoDTO } from '../../../core/models/RequestDTO/UserRequestDTO';
import { MessageResponseDTO } from '../../../core/models/ResponseDTO/MessageResponseDTO';
import { TokenResponseDTO } from '../../../core/models/ResponseDTO/TokenResponseDTO';
import { UserResponseDTO } from '../../../core/models/ResponseDTO/UserResponseDTO';
import { MenuResponseDTO } from '../../../core/models/ResponseDTO/MenuResponseDTO';
import { SessionService } from '../../../core/services/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private sessionService: SessionService) {}

  public login(
    loginRequest: LoginRequestDTO
  ): Observable<ResponseDTO<UserLoginResponseDTO>> {
    const mockUser: UserLoginResponseDTO = {
      id: 1,
      firstNames: 'Luis Sánchez',
      username: loginRequest.email ? loginRequest.email.split('@')[0] : 'luis.sanchez',
      email: loginRequest.email || 'luis.sanchez@integritysolutions.com',
      token: 'mock-jwt-token-' + Date.now(),
      roles: new Set([{ id: 1, name: 'Administrador' } as any]),
      privileges: new Set([{ id: 1, key: 'VER_DASHBOARD', name: 'VER_DASHBOARD' } as any]),
      menus: new Set<MenuResponseDTO>()
    };

    this.sessionService.startSession(mockUser);
    
    return of({
      meta: { message: 'Inicio de sesión exitoso (Mocked)' },
      data: mockUser
    }).pipe(delay(500));
  }

  public register(
    userRequest: UserRequestoDTO
  ): Observable<ResponseDTO<UserResponseDTO>> {
    const mockUserResponse: UserResponseDTO = {
      id: 99,
      firstNames: userRequest.firstNames,
      username: userRequest.username,
      email: userRequest.email,
      employeeId: userRequest.employeeId,
      active: true,
      roles: new Set(),
      privileges: new Set(),
      menus: new Set()
    };

    return of({
      meta: { message: 'Registro exitoso (Mocked)' },
      data: mockUserResponse
    }).pipe(delay(500));
  }

  public generateTokenForgotPassword(
    email: string
  ): Observable<ResponseDTO<TokenResponseDTO>> {
    return of({
      meta: { message: 'Token de recuperación enviado a ' + email },
      data: { token: 'mock-forgot-password-token' } as TokenResponseDTO
    }).pipe(delay(500));
  }

  public validateTokenForgotPassword(
    token: string
  ): Observable<ResponseDTO<MessageResponseDTO>> {
    return of({
      meta: { message: 'Token válido' },
      data: { message: 'Token verificado correctamente' } as MessageResponseDTO
    }).pipe(delay(300));
  }

  public restorePassword(
    token: string,
    passwordRequest: PasswordChangeRequestDTO
  ): Observable<ResponseDTO<boolean>> {
    return of({
      meta: { message: 'Contraseña restaurada exitosamente' },
      data: true
    }).pipe(delay(500));
  }

  public logout(): Observable<ResponseDTO<string>> {
    this.sessionService.endSession();
    return of({
      meta: { message: 'Sesión cerrada exitosamente' },
      data: 'OK'
    }).pipe(delay(300));
  }
}
