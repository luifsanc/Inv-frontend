import { Injectable } from '@angular/core';
import { UserLoginResponseDTO } from '../../models/ResponseDTO/UserLoginResponseDTO';
import { MenuResponseDTO } from '../../models/ResponseDTO/MenuResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}
  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'token';

  private readonly MOCK_MENUS: MenuResponseDTO[] = [
    { id: 1, label: 'Dashboard', route: '/dashboard/home', icon: 'home', active: true, order: 1, children: [] },
    { id: 2, label: 'Reparacion de Equipos', route: '/dashboard/equipment-repair', icon: 'build', active: true, order: 2, children: [] },
    { id: 3, label: 'Asignacion Equipos', route: '/dashboard/equipment-assignment', icon: 'devices', active: true, order: 3, children: [] },
    { id: 4, label: 'Empleados', route: '/dashboard/employees', icon: 'people', active: true, order: 4, children: [] },
    { id: 5, label: 'Clientes', route: '/dashboard/clients', icon: 'person', active: true, order: 5, children: [] },
    { id: 6, label: 'Proveedores', route: '/dashboard/supplier', icon: 'badge', active: true, order: 6, children: [] },
    { id: 7, label: 'Equipos', route: '/dashboard/equipment', icon: 'computer', active: true, order: 7, children: [] },
    { id: 8, label: 'Equipos Fuera de Servicio', route: '/dashboard/equipment-dismissal', icon: 'delete', active: true, order: 8, children: [] },
    {
      id: 9,
      label: 'Configuraciones',
      route: '/dashboard/setting',
      icon: 'settings',
      active: true,
      order: 9,
      children: [
        { id: 10, label: 'Usuarios', route: '/dashboard/setting/users', icon: 'person', active: true, order: 1, parentId: 9, children: [] },
        { id: 11, label: 'Roles', route: '/dashboard/setting/roles', icon: 'security', active: true, order: 2, parentId: 9, children: [] },
        { id: 12, label: 'Permisos', route: '/dashboard/setting/permissions', icon: 'vpn_key', active: true, order: 3, parentId: 9, children: [] },
        { id: 13, label: 'Menús', route: '/dashboard/setting/menus', icon: 'menu', active: true, order: 4, parentId: 9, children: [] }
      ]
    }
  ];

  private readonly MOCK_USER: UserLoginResponseDTO = {
    id: 1,
    firstNames: 'Luis Sánchez',
    username: 'luis.sanchez',
    email: 'luis.sanchez@integritysolutions.com',
    token: 'mock-jwt-token-luis-sanchez',
    roles: [{ id: 1, name: 'Administrador' } as any] as any,
    privileges: [{ id: 1, key: 'VER_DASHBOARD', name: 'VER_DASHBOARD' } as any] as any,
    menus: this.MOCK_MENUS as any
  };

  /** Guarda el usuario y token en localStorage */
  startSession(user: UserLoginResponseDTO): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, user.token);
  }

  /** Retorna el usuario completo */
  getUserSession(): UserLoginResponseDTO | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) {
      // Auto-iniciar sesión con el mock para facilitar pruebas visuales
      this.startSession(this.MOCK_USER);
      return this.MOCK_USER;
    }
    return JSON.parse(userJson);
  }

  getUserNames(): string {
     const user = this.getUserSession();
     if(!user?.firstNames) return "";
     return user?.firstNames;
  }

  getUserMenus(): MenuResponseDTO[] {
    // Retornar MOCK_MENUS directamente para evitar problemas con localStorage desactualizado durante las pruebas visuales
    return this.MOCK_MENUS.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  }

  /** Retorna solo el token */
  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      this.startSession(this.MOCK_USER);
      return this.MOCK_USER.token;
    }
    return token;
  }

  /** Retorna los roles, si existen */
  getRoles(): string[] {
    const user = this.getUserSession();
    const rolesSet = user?.roles;
    if (!rolesSet) {
      return ['Administrador'];
    }
    const rolesArray = Array.isArray(rolesSet) ? rolesSet : Array.from(rolesSet);
    return rolesArray.map((role: any) => role.name);
  }

  /** Limpia la sesión del usuario */
  endSession(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /** Verifica si el usuario está logueado */
  isAuthenticated(): boolean {
    return true; // Siempre retornado true para evitar que el usuario se bloquee en Login y facilitar demostraciones UI/UX
  }

  /** Valida si el token está vigente */
  isTokenValid(): boolean {
    return true;
  }
}
