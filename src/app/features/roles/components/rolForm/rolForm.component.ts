import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MenuService } from '../../../menu/services/menu.service';
import { PrivilegeService } from '../../../privilege/services/privilege.service';
import { RoleService } from '../../services/role.service';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { forkJoin, Subject, takeUntil} from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FlattenedMenu } from '../../../../core/models/ResponseDTO/authentication/FlattenedMenu';
import { MenuResponseDTO } from '../../../../core/models/ResponseDTO/MenuResponseDTO';
import { PrivilegeResponseDTO } from '../../../../core/models/ResponseDTO/PrivilegeResponseDTO';
import { RoleRequestDTO } from '../../../../core/models/RequestDTO/authentication/RoleRequestDTO';

@Component({
  selector: 'app-rolForm',
  standalone: true,
  imports:[
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
    NgxMatSelectSearchModule]
  ,
  templateUrl: './rolForm.component.html',
  styleUrls: ['./rolForm.component.css'],
})
export class RolFormComponent implements OnInit, OnDestroy {
  applications: any[] = [];

  privileges: PrivilegeResponseDTO[] = [];
  privilegeFilterCtrl = new FormControl();
  filteredPrivileges: PrivilegeResponseDTO[] = [];
  defaultPrivileges: number[] = [];  // Array para almacenar los IDs de los privilegios predeterminados
  
  isPrivilegeDefault(privilegeId: number): boolean {
    return this.defaultPrivileges.includes(privilegeId);
  }


  menus: MenuResponseDTO[] = [];
  menuFilterCtrl = new FormControl();
  filteredFlattenedMenus: FlattenedMenu[] = [];


  flattenedMenus: FlattenedMenu[] = [];

  loading: boolean = true;
  isSubmitting = false;

  roleForm!: FormGroup;
  entityId: number = 0;

  private _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private privilegeService: PrivilegeService,
    private roleService: RoleService,
    private formService: FormService
  ) {}

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();  }

  ngOnInit() {
    this.initForm();
    forkJoin({
      menus: this.menuService.getAll(),
      privileges: this.privilegeService.getAll(),
    }).subscribe({
      next: (resp) => {
        this.menus = resp.menus.data;
        this.menuFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => this.filterMenus());

        this.flattenedMenus = this.flattenMenus(this.menus);
        this.filteredFlattenedMenus = this.flattenedMenus.slice();

        this.privileges = resp.privileges.data;
        this.filteredPrivileges = this.privileges.slice();
        this.privilegeFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => this.filterPrivileges());

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

  filterPrivileges() {
    const search = this.privilegeFilterCtrl.value?.toLowerCase() || '';
    this.filteredPrivileges = this.privileges.filter(p =>
      p.key?.toLowerCase().includes(search)
    );
  }

  filterMenus() {
    const search = this.menuFilterCtrl.value?.toLowerCase() || '';
    this.filteredFlattenedMenus = this.flattenedMenus.filter(m =>
      m.label.toLowerCase().includes(search)
    );
  }


  loadData() {
    const entityToEdit = this.formService.modalDataValue;
    if (entityToEdit) {
      const defaultPrivilegeIds = entityToEdit.rolePrivileges?.map((p: PrivilegeResponseDTO) => p.id) || [];
      this.defaultPrivileges = [...defaultPrivilegeIds];
      
      this.roleForm.patchValue({
        name: entityToEdit.name,
        description: entityToEdit.description,
        applicationId: entityToEdit.applicationId,
        privilegesId: defaultPrivilegeIds,
        menusId: entityToEdit.menus?.map((m: MenuResponseDTO) => m.id) || [],
      });
      this.entityId = entityToEdit.id;
      this.roleForm.get('name')?.disable();
      this.roleForm.get('description')?.disable();
      this.roleForm.get('applicationId')?.disable();
    }
  }

  initForm() {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      applicationId: [1, Validators.required],
      privilegesId: [[]],
      menusId: [[]],
    });
  }

  onSubmit() {
    if (this.roleForm.invalid) {
      this.roleForm.markAsTouched();
      return;
    }
    this.isSubmitting = true;
    const roleRequet: RoleRequestDTO = {
      name: this.roleForm.value.name,
      description: this.roleForm.value.description,
      applicationId: this.roleForm.value.applicationId,
      privilegesId: this.roleForm.value.privilegesId || [],
      menusId: this.roleForm.value.menusId || [],
    };
    if (this.entityId == 0) {
      this.roleService.save(roleRequet).subscribe({
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
    }else{
      this.roleService.update(roleRequet,this.entityId).subscribe({
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
    }
  }

  onCancel() {
    this.formService.close();
  }

  flattenMenus(menus: MenuResponseDTO[], level = 0): FlattenedMenu[] {
    let result: FlattenedMenu[] = [];

    for (const menu of menus) {
      result.push({ id: menu.id!, label: menu.label!, level });

      if (menu.children?.length) {
        result = result.concat(this.flattenMenus(menu.children, level + 1));
      }
    }

    return result;
  }
}
