import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Location, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { RoleDetailResponseDTO } from '../../../../core/models/ResponseDTO/RoleDetailsResponseDTO';
import { PrivilegeResponseDTO } from '../../../../core/models/ResponseDTO/PrivilegeResponseDTO';
import { RolesResponseDTO } from '../../../../core/models/ResponseDTO/RolesResponseDTO';
import { MenuResponseDTO } from '../../../../core/models/ResponseDTO/MenuResponseDTO';
import { UserDetailsResponseDTO } from '../../../../core/models/ResponseDTO/UserDetailsResponseDTO';

@Component({
  selector: 'app-userDetails',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './userDetails.component.html',
  styleUrls: ['./userDetails.component.css'],
})
export class UserDetailsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  userDetails?: UserDetailsResponseDTO;
  privilege?: PrivilegeResponseDTO;
  roles?: RolesResponseDTO;
  menu?: MenuResponseDTO;
  roleDetails?: RoleDetailResponseDTO;
  loading: boolean = true;
  allUserPrivileges: PrivilegeResponseDTO[] = [];
  privilegeRoleMap: Map<string, string> = new Map();



  Math = Math;


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private modalDialogService: ModalDialogService,
    private formService: FormService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Obtener ID desde query params en lugar de route params
    this.route.queryParams.subscribe(params => {
      const id = Number(params['id']);
      console.log('ID obtenido de query params:', id);

      if (id && !isNaN(id)) {
        this.userService.getDetailsById(id).subscribe({
          next: (resp) => {
            this.userDetails = resp.data;

            this.extractAllPrivileges();

            console.log('Menús obtenidos:', this.userDetails?.menus);
            console.log('Tamaño:', this.userDetails?.menus instanceof Set ? this.userDetails.menus.size : this.userDetails?.menus?.length);
            console.log('Usuario obtenido:', this.userDetails);
            console.log('Privilegios extraídos:', this.allUserPrivileges);

            this.loading = false;
          },
          error: (err) => {
            console.error('Error al obtener usuario', err);
            this.loading = false;
          },
        });
      } else {
        console.error('ID no válido en query params');
        this.loading = false;
      }
    });
  }

  // Método para extraer todos los privilegios únicos de los roles del usuario
  private extractAllPrivileges(): void {
    if (!this.userDetails?.roles) return;

    const privilegesMap = new Map<string, PrivilegeResponseDTO>();
    this.privilegeRoleMap.clear();

    // Recorrer todos los roles del usuario
    this.userDetails.roles.forEach(role => {
      if (role.rolePrivileges) {
        // Convertir Set a Array si es necesario
        const privileges = role.rolePrivileges instanceof Set
          ? Array.from(role.rolePrivileges)
          : role.rolePrivileges;

        privileges.forEach(privilege => {
          // Usar el key como identificador único para evitar duplicados
          if (!privilegesMap.has(privilege.key)) {
            privilegesMap.set(privilege.key, privilege);
            // Mapear el privilegio con el nombre del rol que lo otorga
            this.privilegeRoleMap.set(privilege.key, role.name);
          }
        });
      }
    });

    // Agregar privilegios directos del usuario (si los hay)
    if (this.userDetails.privileges && this.userDetails.privileges.length > 0) {
      this.userDetails.privileges.forEach(privilege => {
        if (!privilegesMap.has(privilege.key)) {
          privilegesMap.set(privilege.key, privilege);
          this.privilegeRoleMap.set(privilege.key, 'Privilegio directo');
        }
      });
    }

    // Convertir el Map a array
    this.allUserPrivileges = Array.from(privilegesMap.values());
  }

  // Método para obtener el nombre legible del privilegio
  getPrivilegeDisplayName(key: string): string {
    const privilegeNames: { [key: string]: string } = {
      'equipment_management': 'Gestión de Equipos',
      'equipment_request': 'Solicitud de Equipos',
      'request_approval': 'Aprobación de Solicitudes',
      'employee_management': 'Gestión de Empleados',
      'time_tracking': 'Control de Tiempo',
      'report_generation': 'Generación de Reportes',
      'user_management': 'Gestión de Usuarios',
      'profile_management': 'Gestión de Perfil',
      'role_management': 'Gestión de Roles',
      'full_access': 'Acceso Completo'
    };

    return privilegeNames[key] || key;
  }

   // Método para obtener el rol que otorga un privilegio específico
  getRoleForPrivilege(privilegeKey: string): string {
    return this.privilegeRoleMap.get(privilegeKey) || 'Desconocido';
  }

  onClose():void{
    this.close.emit();
  }

  goBack(): void {
    this.location.back();
  }
}
