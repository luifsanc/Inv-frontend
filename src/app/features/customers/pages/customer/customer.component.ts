import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomerDetailResponseDTO } from '../../../../core/models/ResponseDTO/administration/CustomerDetailResponseDTO';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { LoadingService } from '../../../../core/services/modals/loading/loading.service';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { WarningService } from '../../../../core/services/modals/warning/warning.service';
import { CustomerService } from '../../services/customer/customer.service';
import { CustomerFormComponent } from '../../components/customerForm/customerForm.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-customer',
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
    MatSortModule,
  ],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  searchTerm: string = '';
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'ruc',
    'address',

  ];
  dataSource = new MatTableDataSource<CustomerDetailResponseDTO>();
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
    private customerService: CustomerService
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
        default:
          return (item as any)[property] ?? '';
      }
    };
  }
//
  loadTable(): void {
    this.loading.show();
    this.customerService.getAll().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.total = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error loading table', err);
        this.loading.hide();
      },
      complete: () => {
        this.loading.hide();
        this.dataSource.filterPredicate = (data, filter) => {
          const term = filter.trim().toLowerCase();
          return (
            data.name.toLowerCase().includes(term) ||
            (data.email?.toLowerCase() || '').includes(term) ||
            (data.phone?.toLowerCase() || '').includes(term) ||
            (data.ruc?.toLowerCase() || '').includes(term) ||
            (data.address?.toLowerCase() || '').includes(term)
          );
        };
      },
    });
  }

  create(): void {
    this.formService.open(
      'Nuevo Cliente',
      'person_add',
      CustomerFormComponent,
      null,
      (result: CustomerDetailResponseDTO) => {
        if (result) {
          this.dataSource.data = [...this.dataSource.data, result];
          this.modalDialogService.open(
            'success',
            'Cliente creado',
            'El cliente fue registrado correctamente.'
          );
        }
      },
      (error) => {
        this.modalDialogService.open(
          'error',
          'Error al guardar',
          'Ocurrió un error al guardar el cliente.'
        );
      }
    );
  }

  edit(customer: CustomerDetailResponseDTO): void {
    this.formService.open(
      'Editar Cliente',
      'edit',
      CustomerFormComponent,
      customer,
      (result: CustomerDetailResponseDTO) => {
        if (result) {
          const index = this.dataSource.data.findIndex(
            (c) => c.id === result.id
          );
          if (index !== -1) {
            this.dataSource.data[index] = result;
            this.dataSource.data = [...this.dataSource.data];
          }
          this.modalDialogService.open(
            'success',
            'Cliente actualizado',
            'El cliente fue actualizado correctamente.'
          );
        }
      },
      (error) => {
        this.modalDialogService.open(
          'error',
          'Error al editar',
          'No se pudo actualizar el cliente.'
        );
      }
    );
  }

  warningDelete(entity: CustomerDetailResponseDTO): void {
    this.warningService.open(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este cliente?',
      () => {
        this.delete(entity);
      }
    );
  }

  delete(entity: CustomerDetailResponseDTO): void {
    this.loading.show();
    this.customerService.delete(entity.id).subscribe({
      next: () => {
        const index = this.dataSource.data.findIndex((c) => c.id === entity.id);
        if (index !== -1) {
          this.dataSource.data[index].status = false;
          this.dataSource.data = [...this.dataSource.data];
        }
        this.loading.hide();
        this.modalDialogService.open(
          'success',
          'Cliente eliminado',
          'El cliente fue eliminado correctamente.'
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
  }

  search(): void {
    console.log('Buscando:', this.searchTerm);
  }
}
