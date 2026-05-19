import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { UserResponseDTO } from '../../../../core/models/ResponseDTO/UserResponseDTO';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { LoadingService } from '../../../../core/services/modals/loading/loading.service';
import { finalize } from 'rxjs';
import { getSpanishPaginatorIntl } from '../../../../core/functions/mat-paginator-intl-es';
import { UserFormComponent } from '../../components/userForm/userForm.component';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { WarningService } from '../../../../core/services/modals/warning/warning.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
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
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  searchTerm: string = '';
  displayedColumns: string[] = [
    'firstNames',
    'email',
    'active',
    'suspended',
    'roles',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserResponseDTO>();
  totalUsers = 0;
  private router = inject(Router);


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isSmallScreen: boolean = false;

  constructor(
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private loading: LoadingService,
    private formService: FormService,
    private modalDialogService: ModalDialogService,
    private warningService: WarningService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 920px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  loadUsers(): void {
    this.loading.show(); // Show loading spinner
    this.userService
      .getAll()
      .pipe(
        finalize(() => this.loading.hide()) // Siempre se ejecuta al final
      )
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.totalUsers = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator;
        },
        error: (err) => {
          console.error('Error loading users', err);
          this.loading.hide(); // Hide loading spinner on error
        },
        complete: () => {
          this.loading.hide();
          this.dataSource.filterPredicate = (data, filter) => {
          const term = filter.trim().toLowerCase();
          return (
            data.username?.toLowerCase().includes(term) ||
            data.email?.toLowerCase().includes(term)
          );
        };
        },
      });
  }

  getRoleNames(user: any): string {
    return user.roles?.map((role: any) => role.name).join(', ') || '';
  }

  searchUsers(): void {
    // Implementa lógica real para buscar desde backend si es necesario
    console.log('Buscando:', this.searchTerm);
  }

  createUser(): void {
    this.formService.open(
      'Nuevo Usuario',
      'person_add',
      UserFormComponent,
      null,
      (result: UserResponseDTO) => {
        if (result) {
          console.log(result);
          this.dataSource.data = [...this.dataSource.data, result];
          this.modalDialogService.open(
            'success',
            'Usuario creado',
            'El usuario fue registrado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Ocurrió un error al guardar', error);
        this.modalDialogService.open(
          'error',
          'Error al guardar',
          'Ocurrió un error al guardar el usuario.'
        );
      }
    );
  }

  viewUser(user: UserResponseDTO): void {
    console.log('Ver usuario:', user);
    this.router.navigate(['dashboard/setting/users/detail'], { queryParams: { id: user.id } });
  }

  editUser(user: UserResponseDTO): void {
    this.formService.open(
      'Editar Usuario',
      'edit',
      UserFormComponent,
      user,
      (result: UserResponseDTO) => {
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
            'Usuario actualizado',
            'El usuario fue actualizado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Error al editar el usuario', error);
        this.modalDialogService.open(
          'error',
          'Error al editar',
          'No se pudo actualizar el usuario.'
        );
      }
    );
  }

  warningDelete(user: UserResponseDTO) {
    this.warningService.open(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.',
      () => {
        this.deleteUser(user);
      }
    );
  }

  deleteUser(user: UserResponseDTO): void {
    this.loading.show();
    this.userService.delete(user.id).subscribe({
      next: (resp) => {
        const index = this.dataSource.data.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.dataSource.data[index].active = false;
          this.dataSource.data = [...this.dataSource.data];
        }
        this.loading.hide();
        this.modalDialogService.open(
          'success',
          'Usuario Desactivado',
          'El usuario fue desactivado correctamente.'
        );
      },
      error: (error) => {
        this.loading.hide();
        this.modalDialogService.open(
          'error',
          'Error',
          error.error.message
        );

      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event: PageEvent): void {
    console.log('Página cambiada:', event);
    // Implementar lógica si los datos vienen paginados desde el servidor
  }
}
