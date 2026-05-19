import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { MatMenuModule } from '@angular/material/menu';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { LoadingService } from '../../../../core/services/modals/loading/loading.service';
import { finalize } from 'rxjs';
import { FormService } from '../../../../core/services/modals/form/form.service';

import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { WarningService } from '../../../../core/services/modals/warning/warning.service';
import { EquipmentAssignmentDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentAssignmentDetailResponseDTO';
import { AssaingmentService } from '../../services/assaignment/assaingment.service';
import { EquipmentAssignmentFormComponent } from '../../components/equipmentAssignmentForm/equipmentAssignmentForm.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { EquipmentReturnFormComponent } from '../../components/equipmentReturnForm/equipmentReturnForm.component';
import { EquipmentDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentDetailResponseDTO';
import { EquipmentRepairDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentRepairDetailResponseDTO';
import { EquipmentRepairFormComponent } from '../../components/equipmentRepairForm/equipmentRepairForm.component';

@Component({
  selector: 'app-equipmentAssignment',
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
  templateUrl: './equipmentAssignment.component.html',
  styleUrls: ['./equipmentAssignment.component.css'],
})
export class EquipmentAssignmentComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  displayedColumns: string[] = [
    'employee',
    'equipment',
    'company',
    'assignmentDate',
    'returnDate',
    'observations',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<EquipmentAssignmentDetailResponseDTO>();
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
    private equipmentAssingmentService: AssaingmentService
  ) {}

  ngOnInit(): void {
    this.loadTable();
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 920px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sort.active = 'returnDate';
      this.sort.direction = 'asc';
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'employee':
            return item.employee?.fullName || '';
          case 'equipment':
            return item.equipment?.model || '';
          case 'company':
            return item.company?.name || '';
          case 'assignmentDate':
            return item.assignmentDate || '';
          case 'returnDate':
            return item.returnDate || new Date(0).toISOString();
          default:
            return (item as any)[property];
        }
      };
    });
  }

  loadTable(): void {
    this.loading.show(); // Show loading spinner
    this.equipmentAssingmentService.getAll().subscribe({
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
          return (
            data.employee?.fullName?.toLowerCase().includes(term) ||
            data.equipment?.category?.toLowerCase().includes(term) ||
            data.equipment?.model?.toLowerCase().includes(term) ||
            data.equipment?.brand?.toLowerCase().includes(term) ||
            data.company?.name?.toLowerCase().includes(term)
          );
        };
      },
    });
  }

  create(): void {
    this.formService.open(
      'Nueva Asignación',
      'add',
      EquipmentAssignmentFormComponent,
      null,
      (result: EquipmentAssignmentDetailResponseDTO) => {
        if (result) {
          console.log(result);
          this.dataSource.data = [...this.dataSource.data, result];
          this.modalDialogService.open(
            'success',
            'Equipo creado',
            'El equipo fue registrado correctamente.'
          );
        }
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

  return(equipment: EquipmentAssignmentDetailResponseDTO) {
    this.formService.open(
      'Retornar equipo',
      'computer',
      EquipmentReturnFormComponent,
      equipment.id,
      (result: EquipmentAssignmentDetailResponseDTO) => {
        if (result) {
          console.log(result);
          const index = this.dataSource.data.findIndex(
            (u) => u.id === result.id
          );
          if (index !== -1) {
            this.dataSource.data[index] = result;
            this.dataSource.data = [...this.dataSource.data]; // Reasignar para que se actualice la tabla
          }
          this.modalDialogService.open(
            'success',
            'Equipo retornado',
            'El equipo fue retornado correctamente.'
          );
        }
      },
      (error) => {
        console.error('Ocurrió un error al guardar', error);
        this.modalDialogService.open(
          'error',
          'Error al desasignar',
          'Ocurrió un error al desasignar el equipo.'
        );
      }
    );
    /*

    this.loading.show();
    this.equipmentAssingmentService.revoke(equipment.id).subscribe({
      next: (resp) => {
        this.loading.hide();
        const index = this.dataSource.data.findIndex(
          (u) => u.id === resp.data.id
        );
        if (index !== -1) {
          this.dataSource.data[index] = resp.data;
          this.dataSource.data = [...this.dataSource.data]; // Reasignar para que se actualice la tabla
        }
        this.modalDialogService.open(
          'success',
          'Devolución realizada',
          'El equipo fue registrado correctamente.'
        );
      },
      error: (error) => {},
    });*/
  }

  sendToRepair(entity: EquipmentAssignmentDetailResponseDTO): void {
    const item = {
      id: entity.equipment.id,
      serialNumber: entity.equipment.serialNumber,
      equipmentStatusId: 2,
    };
    this.formService.open(
      'Reparar Equipo',
      'engineering',
      EquipmentRepairFormComponent,
      item,
      (result: EquipmentRepairDetailResponseDTO) => {
        if (result) {
          this.dataSource.data = this.dataSource.data.map((item) => {
            if (item.id === result.equipment) {
              return {
                ...item,
                equipmentConditionId: 3,
                equipmentStatusName: 'En reparación',
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

  generatePdf(item: any): void {
    this.loading.show();
    this.equipmentAssingmentService.generatePdf(item.id).pipe(
    finalize(() => this.loading.hide())
  ).subscribe((response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${item.id}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    });
  }

  warningDelete(entity: EquipmentAssignmentDetailResponseDTO) {
    this.warningService.open(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.',
      () => {
        this.delete(entity);
      }
    );
  }

  delete(entity: EquipmentAssignmentDetailResponseDTO): void {
    this.loading.show();
    this.equipmentAssingmentService.delete(entity.id).subscribe({
      next: (resp) => {
        const index = this.dataSource.data.findIndex((u) => u.id === entity.id);
        if (index !== -1) {
          this.dataSource.data[index].status = false;
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
