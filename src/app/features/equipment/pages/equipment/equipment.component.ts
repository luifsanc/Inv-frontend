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
import { EmployeeTableResponseDTO } from '../../../../core/models/ResponseDTO/administration/EmployeeTableResponseDTO';
import { EquipmentDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentDetailResponseDTO';
import { EquipmentService } from '../../services/equipment/equipment.service';
import { EquipmentFormComponent } from '../../components/equipmentForm/equipmentForm.component';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { WarrantyTypeFormComponent } from '../../components/warranty-type-form/warranty-type-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EquipmentRepairFormComponent } from '../../components/equipmentRepairForm/equipmentRepairForm.component';
import { EquipmentRepairDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentRepairDetailResponseDTO';
import { EquipmentDismissalFormComponent } from '../../components/equipmentDismissalForm/equipmentDismissalForm.component';
import { EquipmentRepairStatusChangeRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentRepairStatusChangeRequestDTO';
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    CommonModule,
    LayoutModule,
    MatCardModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule
],
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
})
export class EquipmentComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'identificacion_equipo',
    'estado',
    'condicion',
    'buyDate',
    'invoice',
    'office',
    'actions',
  ];
  dataSource = new MatTableDataSource<EquipmentDetailResponseDTO>();
  originalData: EquipmentDetailResponseDTO[] = [];
  public searchTerm: string = '';
  total = 0;
  selectedStatus: string[] = [];
  selectedCondition: string[] = [];
  filter: any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isSmallScreen: boolean = false;

  equipmentStatuses = [
    { id: 1, name: 'Disponible' },
    { id: 2, name: 'Asignado' },
    { id: 3, name: 'En reparación' },
    { id: 4, name: 'En revisión' },
    { id: 5, name: 'Falla reportada' },
    { id: 6, name: 'Reparado' },
    { id: 7, name: 'Fuera de Servicio' },
  ];

  constructor
  (
    private breakpointObserver: BreakpointObserver,
    private loading: LoadingService,
    private formService: FormService,
    private modalDialogService: ModalDialogService,
    private warningService: WarningService,
    private equipmentService: EquipmentService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTable();
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 920px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  applyFilters(valor: string, campo: string){
    const fieldMap: any = {
      estado: 'equipmentStatusName',
      condicion: 'equipmentConditionName'
    };

    // Convertimos 'estado' → 'equipmentStatusName', etc.
    const realField = fieldMap[campo] || campo;
    this.filter[realField] = valor === '' ? '' : valor;

    this.search();
  }

  loadTable(): void {
    this.loading.show(); // Show loading spinner
    this.equipmentService
      .getTable()
      .pipe(
        finalize(() => this.loading.hide()) // Siempre se ejecuta al final
      )
      .subscribe({
        next: (response) => {
          this.originalData = response.data;
          this.dataSource.data = [...this.originalData];
          this.total = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator;

          this.selectedStatus = [...new Set(this.dataSource.data.map((item: any) => item.equipmentStatusName))];
          this.selectedCondition = [...new Set(this.dataSource.data.map((item: any) => item.equipmentConditionName))];

          this.dataSource.filterPredicate = (data: any, filter: string) => {
          const term = this.searchTerm.trim().toLowerCase();
          const matchesSearch =
            !term ||
            data.categoryName?.toLowerCase().includes(term) ||
            data.brand?.toLowerCase().includes(term) ||
            data.model?.toLowerCase().includes(term) ||
            data.serialNumber?.toLowerCase().includes(term) ||
            data.itemCode?.toLowerCase().includes(term) ||
            data.companyName?.toLowerCase().includes(term) ||
            data.equipmentStatusName?.toLowerCase().includes(term) ||
            data.equipmentConditionName?.toLowerCase().includes(term);

          const matchesFilters =
            (!this.filter.equipmentStatusName ||
              data.equipmentStatusName === this.filter.equipmentStatusName) &&
            (!this.filter.equipmentConditionName ||
              data.equipmentConditionName === this.filter.equipmentConditionName);

          return matchesSearch && matchesFilters;
        };
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

  downloadExcel(): void{
     const filteredData = this.dataSource.filteredData || this.dataSource.data;
     if (!filteredData.length) {
        this.modalDialogService.open('error', 'Sin datos', 'No hay datos para exportar.');
        return;
      }

      const exportData = filteredData.map((item) => ({
        'Equipo': item.categoryName,
        'Marca': item.brand,
        'Modelo': item.model,
        'Serie': item.serialNumber,
        'Código': item.itemCode,
        'Estado': item.equipmentStatusName,
        'Condición': item.equipmentConditionName,
        'Factura': item.invoice || 'No asignada',
        'Oficina': item.companyName,
        'Creado': new Date(item.creationDate).toLocaleDateString(),
      }));

      // Convierte los datos a hoja de Excel
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipos');

      // Obtener rango de celdas
      const range = XLSX.utils.decode_range(worksheet['!ref']!);

      // Aplicar color
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // Fila 0 = encabezado
        const cell = worksheet[cellAddress];
        if (cell) {
          cell.s = {
            fill: { fgColor: { rgb: '2685BF' } }, // Fondo azul
            font: { color: { rgb: 'FFFFFF' }, bold: true }, // Letras blancas y negritas
            alignment: { horizontal: 'center', vertical: 'center' }, // Centrado
          };
        }
      }

      // Ajustar ancho de columnas
      const columnWidths = Object.keys(exportData[0]).map((key) => ({ wch: key.length + 12 }));
      worksheet['!cols'] = columnWidths;

      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `Equipos_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

  // Método para confirmar y marcar equipo como fuera de servicio
  confirmOutOfService(equipment: EquipmentDetailResponseDTO): void {
    this.warningService.open(
      'Confirmar fuera de servicio',
      '¿Estás seguro que deseas marcar este equipo como fuera de servicio? Esta acción cambiará el estado del equipo.',
      () => {
        this.setEquipmentOutOfService(equipment);
      }
    );
  }


openDismissalFormAndThenSetStatus(entity: EquipmentDetailResponseDTO): void {
  const dialogRef = this.dialog.open(EquipmentDismissalFormComponent, {
    width: '800px',
    height: '350px',  // Altura más generosa
    maxWidth: '90vw',
    maxHeight: '90vh',
    panelClass: 'custom-dialog-container', // MUY IMPORTANTE: esto conecta con el CSS global
    hasBackdrop: true,
    disableClose: false,
    data: { equipmentId:entity.id }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'submitted') {
      this.setEquipmentOutOfService(entity);
    }
  });

}

  setEquipmentOutOfService(entity: EquipmentDetailResponseDTO): void {
    this.loading.show();
    this.equipmentService.delete(entity.id).subscribe({
      next: (resp) => {
        const index = this.dataSource.data.findIndex((u) => u.id === entity.id);
        if (index !== -1) {
          this.dataSource.data[index].status = false;
          this.dataSource.data[index].equipmentStatusName = 'Fuera de servicio';
          this.dataSource.data[index].equipmentStatusId = 7;
          this.dataSource.data = this.dataSource.data.map((item) => {
            if (item.categoryId === entity.categoryId) {
              return {
                ...item,
                categoryStock: entity.categoryStock - 1,
              };
            }
            return item;
          });
          this.dataSource.data = [...this.dataSource.data];
        }
        this.loading.hide();
        this.modalDialogService.open(
          'success',
          'Equipo fuera de servicio',
          'El equipo fue marcado como fuera de servicio correctamente.'
        );
      },
      error: (error) => {
        this.loading.hide();
        this.modalDialogService.open('error', 'Error', error.error.message);
      },
    });
  }

  create(): void {
    this.formService.open(
      'Nuevo Equipo',
      'add',
      EquipmentFormComponent,
      null,
      (result: EquipmentDetailResponseDTO) => {
        if (result) {
          this.dataSource.data = this.dataSource.data.map((item) => {
            if (item.categoryId === result.categoryId) {
              return {
                ...item,
                categoryStock: result.categoryStock,
              };
            }
            return item;
          });
          this.dataSource.data = [...this.dataSource.data, result];
          this.modalDialogService.open(
            'success',
            'Equipo creado',
            'El equipo fue registrado correctamente.'
          );
        }
        this.loadTable();
      },
      (error) => {
        console.error('Ocurrió un error al guardar', error);
        this.modalDialogService.open(
          'error',
          'Error al guardar',
          'Ocurrió un error al guardar el equipo.'
        );
      }
    );
  }

  edit(entity: EquipmentDetailResponseDTO): void {
    this.formService.open(
      'Editar Equipo',
      'edit',
      EquipmentFormComponent,
      entity,
      (result: EquipmentDetailResponseDTO) => {
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
            'Equipo actualizado',
            'El equipo fue actualizado correctamente.'
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

  view(item: any)
  {
    this.router.navigate(['dashboard/equipment/detail'], {
      queryParams: { id: item.id },
      state: { equipment: item }, // <-- Esto pasa el objeto completo
    });
  }

  sendToRepair(entity: EquipmentDetailResponseDTO): void {
    // Pasa SOLO los datos necesarios para creación
  const repairData = {
    equipment: entity.id,
    description: '',                // Initialize empty or with default values
    serviceProvider: '',           // User should fill this in the form
    cost: 0.00,
    revoke: false
  };

  console.log('Datos enviados al formulario:', repairData);

    this.formService.open(
      'Reparar Equipo',
      'engineering',
      EquipmentRepairFormComponent,
      repairData,
      (result: EquipmentRepairDetailResponseDTO) => {
        if (result) {
          this.dataSource.data = this.dataSource.data.map((item) => {
            if (item.id === result.equipment) {
              return {
                ...item,
                 equipmentConditionId: 3,
                equipmentStatusName: 'en reparación',
              };
            }
            return item;
          });

          this.modalDialogService.open(
            'success',
            'Equipo enviado a reparación',
            'El equipo fue registrado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Ocurrió un error al guardar', error);
        this.modalDialogService.open(
          'error',
          'Error al guardar',
          'Ocurrió un error al registrar la reparacion del equipo.'
        );
      }
    );
  }

  warningDelete(entity: EquipmentDetailResponseDTO) {
    this.warningService.open(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.',
      () => {
        this.delete(entity);
      }
    );
  }

  delete(entity: EquipmentDetailResponseDTO): void {
    this.loading.show();
    this.equipmentService.delete(entity.id).subscribe({
      next: (resp) => {
        const index = this.dataSource.data.findIndex((u) => u.id === entity.id);
        if (index !== -1) {
          this.dataSource.data[index].status = false;
          this.dataSource.data[index].equipmentStatusName = 'Fuera de servicio';
          this.dataSource.data = this.dataSource.data.map((item) => {
            if (item.categoryId === entity.categoryId) {
              return {
                ...item,
                categoryStock: entity.categoryStock - 1,
              };
            }
            return item;
          });
          this.dataSource.data = [...this.dataSource.data];
        }
        this.loading.hide();
        this.modalDialogService.open(
          'success',
          'Equipo Desactivado',
          'El Equipo fue desactivado correctamente.'
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



  /**
   * Retorna las clases CSS para el punto y el fondo del estado funcional del equipo de forma simplificada.
   */
  getStatusClasses(statusName: string | undefined): string {
    if (!statusName) return 'dot-inactive out-of-service';
    switch (statusName) {
      case 'Disponible':
        return 'dot-available available';
      case 'Asignado':
        return 'dot-assigned assigned';
      case 'En reparación':
        return 'dot-under-repair under-repair';
      case 'En revisión':
        return 'dot-under-review under-review';
      case 'Falla Reportada':
        return 'dot-bug-reported bug-reported';
      case 'Reparado':
        return 'dot-repaired repaired';
      case 'Fuera de Servicio':
        return 'dot-out-of-service out-of-service';
      default:
        return 'dot-inactive out-of-service';
    }
  }

  getConditions(statusName: string | undefined): string {
    if (!statusName) return 'dot-inactive out-of-service';

    switch (statusName.trim().toLowerCase()) {
      case 'nuevo':
        return 'dot-new new';
      case 'como nuevo':
        return 'dot-like-new like-new';
      case 'usado':
        return 'dot-used used';
      case 'desgastado':
        return 'dot-worn-out worn-out';
      case 'Falla menor':
        return 'dot-minor-issue minor-issue';
      case 'Falla mayor':
        return 'dot-major-issue major-issue';
      case 'irreparable':
        return 'dot-unrepairable unrepairable';
      default:
        return 'dot-inactive out-of-service';
    }
  }

  search(): void {
    this.dataSource.filter = 'trigger';
  }
}
