import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl
} from '@angular/forms';
import { EmployeeCatalogResponseDTO } from '../../../../core/models/ResponseDTO/administration/EmployeeCatalogResponseDTO';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { EmployeeService } from '../../../employees/services/employee.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { MenuService } from '../../../menu/services/menu.service';
import { PrivilegeService } from '../../../privilege/services/privilege.service';
import { RoleService } from '../../../roles/services/role.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user.service';
import { MenuResponseDTO } from '../../../../core/models/ResponseDTO/MenuResponseDTO';
import { PrivilegeResponseDTO } from '../../../../core/models/ResponseDTO/PrivilegeResponseDTO';
import { RolesResponseDTO } from '../../../../core/models/ResponseDTO/RolesResponseDTO';
import { UserRequestoDTO } from '../../../../core/models/RequestDTO/UserRequestDTO';
import { UserResponseDTO } from '../../../../core/models/ResponseDTO/UserResponseDTO';
@Component({
  selector: 'app-userForm',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinner,
    NgxMatSelectSearchModule
  ],
  templateUrl: './userForm.component.html',
  styleUrls: ['./userForm.component.css'],
})
export class UserFormComponent implements OnInit, OnDestroy {
  selectedEmployee: EmployeeCatalogResponseDTO | null = null;
  employees: EmployeeCatalogResponseDTO[] = [];
    availableEmployees: EmployeeCatalogResponseDTO[] = [];
  employeeFilterCtrl = new FormControl();
  filteredEmployees: EmployeeCatalogResponseDTO[] = [];

  menus: MenuResponseDTO[] = [];
  menuFilterCtrl = new FormControl();
  filteredMenus: any[] = [];

  privileges: PrivilegeResponseDTO[] = [];
  privilegeFilterCtrl = new FormControl();
  filteredPrivileges: any[] = [];

  roles: RolesResponseDTO[] = [];
  roleFilterCtrl = new FormControl();
  filteredRoles: any[] = [];

  loading: boolean = true;
  isSubmitting = false;

  userForm!: FormGroup;
  userId: number = 0;

  private _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private menuService: MenuService,
    private privilegeService: PrivilegeService,
    private roleService: RoleService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.initForm();
    forkJoin({
      employees: this.employeeService.getAll(),
      users: this.userService.getAll(),
      menus: this.menuService.getAll(),
      privileges: this.privilegeService.getAll(),
      roles: this.roleService.getAll(),
    }).subscribe({
      next: (resp) => {
        this.employees = resp.employees.data;

        const usersWithEmployeeId = resp.users.data.map((user: UserResponseDTO) => user.employeeId);
        this.availableEmployees = this.employees.filter(emp=>
           !usersWithEmployeeId.includes(emp.id)
        );

        this.filteredEmployees = this.availableEmployees.slice();
        this.employeeFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterEmployees();
          });

        this.menus = resp.menus.data;
        this.filteredMenus = this.menus.slice();
        this.menuFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => this.filterMenus());

        this.privileges = resp.privileges.data;
        this.filteredPrivileges = this.privileges.slice();
        this.privilegeFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => this.filterPrivileges());

        this.roles = resp.roles.data;
        this.filteredRoles = this.roles.slice();
        this.roleFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => this.filterRoles());

      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
      },
      complete: () => {
        this.loading = false;
        this.loadData();
      },
    });
  }

  filterEmployees() {
    const search = this.employeeFilterCtrl.value?.toLowerCase() || '';
    this.filteredEmployees = this.availableEmployees.filter(emp =>
      (`${emp.fullName} ${emp.identification}`.toLowerCase().includes(search))
    );
  }

  filterRoles() {
    const search = this.roleFilterCtrl.value?.toLowerCase() || '';
    this.filteredRoles = this.roles.filter(role =>
      role.name.toLowerCase().includes(search)
    );
  }

  filterPrivileges() {
    const search = this.privilegeFilterCtrl.value?.toLowerCase() || '';
    this.filteredPrivileges = this.privileges.filter(p =>
      p.key.toLowerCase().includes(search)
    );
  }

  filterMenus() {
    const search = this.menuFilterCtrl.value?.toLowerCase() || '';
    this.filteredMenus = this.menus.filter(m =>
      m.label?.toLowerCase().includes(search)
    );
  }

  updatePrivilegesFromRoles(selectedRoleIds: number[]) {
    if (!selectedRoleIds || selectedRoleIds.length === 0) {
      this.userForm.patchValue({
        privilegeIds: [],
        menuIds: []
      });
      return;
    }

    // Obtener todos los privilegios y menús únicos de los roles seleccionados
    const selectedRoles = this.roles.filter(role => selectedRoleIds.includes(role.id));
    const defaultPrivilegeIds = new Set<number>();
    const defaultMenuIds = new Set<number>();

    selectedRoles.forEach(role => {
      // Agregar privilegios del rol
      role.rolePrivileges?.forEach(privilege => {
        if (privilege.id) {
          defaultPrivilegeIds.add(privilege.id);
        }
      });

      // Agregar menús del rol
      role.menus?.forEach(menu => {
        if (menu.id) {
          defaultMenuIds.add(menu.id);
        }
      });
    });

    // Actualizar el control de privilegios con los privilegios predeterminados
    const currentPrivilegeIds = this.userForm.get('privilegeIds')?.value || [];
    const updatedPrivilegeIds = Array.from(new Set([...currentPrivilegeIds, ...defaultPrivilegeIds]));

    // Actualizar el control de menús con los menús predeterminados
    const currentMenuIds = this.userForm.get('menuIds')?.value || [];
    const updatedMenuIds = Array.from(new Set([...currentMenuIds, ...defaultMenuIds]));

    // Actualizar ambos controles
    this.userForm.patchValue({
      privilegeIds: updatedPrivilegeIds,
      menuIds: updatedMenuIds
    });
  }  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      employeeId: [null, Validators.required],
      roleIds: [[], Validators.required],
      privilegeIds: [[]], // Opcional y múltiple
      menuIds: [[]], // Opcional y múltiple
    });

    // Observar cambios en roleIds
    this.userForm.get('roleIds')?.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((selectedRoleIds: number[]) => {
        this.updatePrivilegesFromRoles(selectedRoleIds);
      });
  }

  loadData() {
    const userToEdit = this.formService.modalDataValue;
    if (userToEdit) {
      this.userForm.patchValue({
        name: userToEdit.username,
        email: userToEdit.email,
        employeeId: userToEdit.employeeId,
        roleIds: userToEdit.roles.map((r: RolesResponseDTO) => r.id),
        privilegeIds:
          userToEdit.privileges?.map((p: PrivilegeResponseDTO) => p.id) || [],
        menuIds: userToEdit.menus?.map((m: MenuResponseDTO) => m.id) || [],
      },{ emitEvent: false });

     this.selectedEmployee = this.employees.find((emp) => emp.id === userToEdit.employeeId) || null;

     if (this.selectedEmployee && !this.availableEmployees.find(emp => emp.id === this.selectedEmployee!.id)) {
        this.availableEmployees.unshift(this.selectedEmployee);
        this.filteredEmployees = this.availableEmployees.slice();
      }

      this.userId = userToEdit.id;
    }
  }

  onEmployeeSelected(employeeId: number): void {
    const selected =
      this.employees.find((emp) => emp.id === employeeId) || null;
    this.selectedEmployee = selected;

    if (selected?.email) {
      this.userForm.patchValue({ email: selected.email });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const userRequest: UserRequestoDTO = {
      username: this.userForm.value.name,
      email: this.userForm.value.email,
      firstNames: this.selectedEmployee?.fullName || '',
      employeeId: this.userForm.value.employeeId,
      rolesId: this.userForm.value.roleIds || [],
      privilegesId: this.userForm.value.privilegeIds || [],
      menusId: this.userForm.value.menuIds || [],
    };
    if (this.userId != 0) {
      this.userService.update(userRequest, this.userId).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          this.formService.close(resp.data);
        },
        error: (error) => {
          console.error(error);
          this.isSubmitting = false;
          this.formService.error(error.error);
        },
      });
    } else {
      this.authService.register(userRequest).subscribe({
        next: (resp) => {
          console.log(resp);
          this.isSubmitting = false;
          this.formService.close(resp.data);
        },
        error: (error) => {
          console.error(error);
          this.isSubmitting = false;
          this.formService.error(error.error);
        },
      });
    }
  }

  onSave() {
    throw new Error('Method not implemented.');
  }

  onCancel() {
    this.formService.close();
  }
}
