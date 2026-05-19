import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';

import { SupplierResponseDTO } from '../../../../core/models/ResponseDTO/inventory/SupplierResponseDTO';
import { SupplierService } from '../../services/supplier/supplier.service';
import { LoadingService } from '../../../../core/services/modals/loading/loading.service';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { WarningService } from '../../../../core/services/modals/warning/warning.service';
import { SupplierFormComponent } from '../../components/supplierForm/supplierForm.component';


@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    LayoutModule,
    MatCardModule,
  ],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  searchTerm: string = '';
  displayedColumns: string[] = [
    'supplierType',
    'businessName',
    'address',
    'phone',
    'email',
    'ruc',
  ];
  dataSource = new MatTableDataSource<SupplierResponseDTO>();
  totalSupplier = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isSmallScreen: boolean = false;

  constructor(
    private supplierService: SupplierService,
    private breakpointObserver: BreakpointObserver,
    private loading: LoadingService,
    private formService: FormService,
    private modalDialogService: ModalDialogService,
    private warningService: WarningService
  ) { }

  ngOnInit() {
    this.loadSuppliers();
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 920px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  loadSuppliers(): void {
    this.loading.show();
    this.supplierService
      .getAll()
      .pipe(finalize(() => this.loading.hide()))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.totalSupplier = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator;
        },
        error: (err) => {
          console.error('Error loading suppliers', err);
          this.loading.hide();
        },
        complete: () => {
          this.loading.hide();
          this.dataSource.filterPredicate = (data, filter) => {
          const term = filter.trim().toLowerCase();
          return (
            data.businessName?.toLowerCase().includes(term) ||
            (data.email?.toLowerCase() || '').includes(term) ||
            (data.phone?.toLowerCase() || '').includes(term) ||

            (data.ruc?.toLowerCase() || '').includes(term) ||
            (data.address?.toLowerCase() || '').includes(term)
          );
        };
        },
      });
  }

  createSupplier(): void {
    this.formService.open(
      'Nuevo Proveedor',
      'add_business',
      SupplierFormComponent,
      null,
      (result: SupplierResponseDTO) => {
        if (result) {
          this.dataSource.data = [...this.dataSource.data, result];
          this.modalDialogService.open(
            'success',
            'Proveedor creado',
            'El proveedor fue registrado correctamente.'
          );
          this.loadSuppliers();
        }
      },
      (error) => {
        this.modalDialogService.open(
          'error',
          'Error al guardar',
          'Ocurrió un error al guardar el proveedor.'
        );
      }
    );
  }

  editSupplier(supplier: SupplierResponseDTO): void {
    this.formService.open(
      'Editar Proveedor',
      'edit',
      SupplierFormComponent,
      supplier,
      (result: SupplierResponseDTO) => {
        if (result) {
          const index = this.dataSource.data.findIndex((s) => s.id === result.id);
          if (index !== -1) {
            this.dataSource.data[index] = result;
            this.dataSource.data = [...this.dataSource.data];
            this.modalDialogService.open(
              'success',
              'Proveedor actualizado',
              'El proveedor fue actualizado correctamente.'
            );
          }
        }
      },
      (error) => {
        this.modalDialogService.open(
          'error',
          'Error al editar',
          'No se pudo actualizar el proveedor.'
        );
      }
    );
  }

  warningDelete(supplier: SupplierResponseDTO): void {
    this.warningService.open(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este proveedor? Esta acción no se puede deshacer.',
      () => {
        this.deleteSupplier(supplier);
      }
    );
  }

  deleteSupplier(supplier: SupplierResponseDTO): void {
    this.loading.show();
    this.supplierService.delete(supplier.id).subscribe({
      next: () => {
        const index = this.dataSource.data.findIndex((s) => s.id === supplier.id);
        if (index !== -1) {
          this.dataSource.data.splice(index, 1);
          this.dataSource.data = [...this.dataSource.data];
        }
        this.loading.hide();
        this.modalDialogService.open(
          'success',
          'Proveedor eliminado',
          'El proveedor fue eliminado correctamente.'
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

  searchSuppliers(): void {
    // Lógica opcional si usas búsqueda por backend
    console.log('Buscando:', this.searchTerm);
  }

  onPageChange(event: PageEvent): void {
    console.log('Página cambiada:', event);
    // Lógica si necesitas paginar desde backend
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
