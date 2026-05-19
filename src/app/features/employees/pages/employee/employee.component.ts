import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
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
import { EmployeeTableResponseDTO } from '../../../../core/models/ResponseDTO/administration/EmployeeTableResponseDTO';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeFormComponent } from '../../components/employeeForm/employeeForm.component';
import { MatSort, MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-employee',
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
    MatSortModule
  ],
  providers: [],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  displayedColumns: string[] = [
    'employee',
    'identification',
    'email',
    'phone',
    'position',
    'contractDate',
  ];
  dataSource = new MatTableDataSource<EmployeeTableResponseDTO>();
  total = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isSmallScreen: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loading: LoadingService,
    private formService: FormService,
    private modalDialogService: ModalDialogService,
    private warningService: WarningService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadTable();
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 920px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'employee':
          return `${item.firstName} ${item.lastName}`.toLowerCase();
        case 'contractDate':
        case 'contractEndDate':
          return item[property] || '';
        default:
          return (item as any)[property] ?? '';
      }
    };
  }

  loadTable(): void {
    this.loading.show(); // Show loading spinner
    this.employeeService.getTable().subscribe({
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
        this.dataSource.filterPredicate = (data, filter) => {
          const term = filter.trim().toLowerCase();

          const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
          const phone = data.phone?.toLowerCase() || '';
          const email = data.email?.toLowerCase() || '';
          const identification = data.identification?.toLowerCase() || '';
          const identificationType =
            data.identificationType?.toLowerCase() || '';
          const position = data.position?.toLowerCase() || '';
          const contractDate = data.contractDate
            ? new Date(data.contractDate).toLocaleDateString('es-ES')
            : '';
          const contractEndDate = data.contractEndDate
            ? new Date(data.contractEndDate).toLocaleDateString('es-ES')
            : '';

          return (
            fullName.includes(term) ||
            phone.includes(term) ||
            email.includes(term) ||
            identification.includes(term) ||
            identificationType.includes(term) ||
            position.includes(term) ||
            contractDate.includes(term) ||
            contractEndDate.includes(term)
          );
        };
      },
    });
  }

  create(): void {
    this.formService.open(
      'Nuevo Empleado',
      'person_add',
      EmployeeFormComponent,
      null,
      (result: EmployeeTableResponseDTO) => {
        if (result) {
          console.log(result);
          this.dataSource.data = [...this.dataSource.data, result];
          this.modalDialogService.open(
            'success',
            'Empleado creado',
            'El Empleado fue registrado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Ocurrió un error al guardar', error);
        this.modalDialogService.open(
          'error',
          'Error al guardar',
          'Ocurrió un error al guardar el empleado.'
        );
      }
    );
  }

  edit(user: EmployeeTableResponseDTO): void {
    this.formService.open(
      'Editar Empleado',
      'edit',
      EmployeeFormComponent,
      user,
      (result: EmployeeTableResponseDTO) => {
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
            'Empleado actualizado',
            'El empleado fue actualizado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Error al editar el rol', error);
        this.modalDialogService.open(
          'error',
          'Error al editar',
          'No se pudo actualizar el empleado.'
        );
      }
    );
  }

  warningDelete(entity: EmployeeTableResponseDTO) {
    this.warningService.open(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.',
      () => {
        this.delete(entity);
      }
    );
  }

  delete(entity: EmployeeTableResponseDTO): void {
    this.loading.show();
    this.employeeService.delete(entity.id).subscribe({
      next: (resp) => {
        const index = this.dataSource.data.findIndex((u) => u.id === entity.id);
        if (index !== -1) {
          this.dataSource.data[index].status = false;
          this.dataSource.data = [...this.dataSource.data];
        }
        this.loading.hide();
        this.modalDialogService.open(
          'success',
          'Empleado Desactivado',
          'El empleado fue desactivado correctamente.'
        );
      },
      error: (error) => {
        this.loading.hide();
        this.modalDialogService.open('error', 'Error', error.error.message);
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

  search(): void {
    // Implementa lógica real para buscar desde backend si es necesario
    console.log('Buscando:', this.searchTerm);
  }
}
