import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { LoadingService } from '../../../../core/services/modals/loading/loading.service';
import { finalize } from 'rxjs';
import { FormService } from '../../../../core/services/modals/form/form.service';

import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { WarningService } from '../../../../core/services/modals/warning/warning.service';
import { RolesResponseDTO } from '../../../../core/models/ResponseDTO/RolesResponseDTO';
import { PrivilegeService } from '../../services/privilege.service';

import { PrivilegeFormComponent } from '../../components/privilegeForm/privilegeForm.component';
import { PrivilegeResponseDTO } from '../../../../core/models/ResponseDTO/PrivilegeResponseDTO';

@Component({
  selector: 'app-privilege',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    LayoutModule,
    MatCardModule,
  ],
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.css'],
})
export class PrivilegeComponent implements OnInit {
  searchTerm: string = '';
  displayedColumns: string[] = [
    'name',
    'active',
    'creationDate',
    'lastModificationDate',
  ];
  dataSource = new MatTableDataSource<PrivilegeResponseDTO>();
  total = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isSmallScreen: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loading: LoadingService,
    private formService: FormService,
    private modalDialogService: ModalDialogService,
    private warningService: WarningService,
    private privilegeService: PrivilegeService
  ) {}

  ngOnInit() {
    this.loadTable();
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 920px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  loadTable(): void {
    this.loading.show(); // Show loading spinner
    this.privilegeService
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
      'Nuevo permiso',
      'person_add',
      PrivilegeFormComponent,
      null,
      (result: PrivilegeResponseDTO) => {
        if (result) {
          console.log(result);
          this.dataSource.data = [...this.dataSource.data, result];
          this.modalDialogService.open(
            'success',
            'Permiso creado',
            'El permiso fue registrado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Ocurrió un error al guardar', error);
        this.modalDialogService.open(
          'error',
          'Error al guardar',
          'Ocurrió un error al guardar el permiso.'
        );
      }
    );
  }

  edit(user: PrivilegeResponseDTO): void {
    this.formService.open(
      'Editar permiso',
      'edit',
      PrivilegeFormComponent,
      user,
      (result: PrivilegeResponseDTO) => {
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
            'Privilegio actualizado',
            'El privilegio fue actualizado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Error al editar el privilegio', error);
        this.modalDialogService.open(
          'error',
          'Error al editar',
          'No se pudo actualizar el privilegio.'
        );
      }
    );
  }

  warningDelete(entity: PrivilegeResponseDTO) {
    this.warningService.open(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.',
      () => {
        this.delete(entity);
      }
    );
  }

  delete(entity: PrivilegeResponseDTO): void {
    this.loading.show();
    this.privilegeService.delete(entity.id).subscribe({
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

  onPageChange(event: PageEvent): void {
    console.log('Página cambiada:', event);
    // Implementar lógica si los datos vienen paginados desde el servidor
  }
}
