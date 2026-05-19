import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { LoadingService } from '../../../../core/services/modals/loading/loading.service';
import { finalize } from 'rxjs';
import { FormService } from '../../../../core/services/modals/form/form.service';

import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { WarningService } from '../../../../core/services/modals/warning/warning.service';
import { RolesResponseDTO } from '../../../../core/models/ResponseDTO/RolesResponseDTO';
import { RoleService } from '../../services/role.service';
import { RolFormComponent } from '../../components/rolForm/rolForm.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    CommonModule,
    LayoutModule,
    MatCardModule,
  ],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit {
  searchTerm: string = '';
  displayedColumns: string[] = [
    'name',
    'active',
    'rolePrivileges',
    'creationDate',
    'actions',
  ];
  dataSource = new MatTableDataSource<RolesResponseDTO>();
  total = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isSmallScreen: boolean = false;

  constructor(
    private roleService: RoleService,
    private breakpointObserver: BreakpointObserver,
    private loading: LoadingService,
    private formService: FormService,
    private modalDialogService: ModalDialogService,
    private warningService: WarningService
  ) {}

  ngOnInit(): void {
    this.loadTable();
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 920px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  loadTable(): void {
    this.loading.show(); // Show loading spinner
    this.roleService
      .getAll()
      .pipe(
        finalize(() => this.loading.hide()) // Siempre se ejecuta al final
      )
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.total = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator;
        },
        error: (err) => {
          console.error('Error loading table', err);
          this.loading.hide(); // Hide loading spinner on error
        },
        complete: () => {
          this.loading.hide(); // Hide loading spinner on complete
        },
      });
  }

  create(): void {
    this.formService.open(
      'Nuevo Rol',
      'person_add',
      RolFormComponent,
      null,
      (result: RolesResponseDTO) => {
        if (result) {
          console.log(result);
          this.dataSource.data = [...this.dataSource.data, result];
          this.modalDialogService.open(
            'success',
            'Rol creado',
            'El rol fue registrado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Ocurrió un error al guardar', error);
        this.modalDialogService.open(
          'error',
          'Error al guardar',
          'Ocurrió un error al guardar el rol.'
        );
      }
    );
  }

  edit(user: RolesResponseDTO): void {
    this.formService.open(
      'Editar Rol',
      'edit',
      RolFormComponent,
      user,
      (result: RolesResponseDTO) => {
        if (result) {
          const index = this.dataSource.data.findIndex(
            (u) => u.id === result.id
          );
          if (index !== -1) {
            this.dataSource.data[index] = result;
            this.dataSource.data = [...this.dataSource.data]; // Reasignar para que se actualice la tabla
          }
          this.modalDialogService.open(
            'success',
            'Rol actualizado',
            'El rol fue actualizado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Error al editar el rol', error);
        this.modalDialogService.open(
          'error',
          'Error al editar',
          'No se pudo actualizar el rol.'
        );
      }
    );
  }

  warningDelete(entity: RolesResponseDTO) {
      this.warningService.open(
        'Confirmar eliminación',
        '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.',
        () => {
          this.delete(entity);
        }
      );
    }

    delete(entity: RolesResponseDTO): void {
      this.loading.show();
      this.roleService.delete(entity.id).subscribe({
        next: (resp) => {
          const index = this.dataSource.data.findIndex((u) => u.id === entity.id);
          if (index !== -1) {
            this.dataSource.data[index].active = false;
            this.dataSource.data = [...this.dataSource.data];
          }
          this.loading.hide();
          this.modalDialogService.open(
            'success',
            'Rol Desactivado',
            'El rol fue desactivado correctamente.'
          );
        },
        error: (error) => {
          this.loading.hide();
          this.modalDialogService.open('error', 'Error', error.error.message);
        },
      });
    }

  getPermisionNames(rol: RolesResponseDTO): string {
    return (
      rol.rolePrivileges?.map((privilege: any) => privilege.key).join(', ') ||
      ''
    );
  }

  onPageChange(event: PageEvent): void {
    console.log('Página cambiada:', event);
    // Implementar lógica si los datos vienen paginados desde el servidor
  }

  search(): void {
    // Implementa lógica real para buscar desde backend si es necesario
    console.log('Buscando:', this.searchTerm);
  }
}
