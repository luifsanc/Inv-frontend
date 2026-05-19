import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EquipmentAssignmentDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentAssignmentDetailResponseDTO';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { LoadingService } from '../../../../core/services/modals/loading/loading.service';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { WarningService } from '../../../../core/services/modals/warning/warning.service';
import { EquipmentRepairDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentRepairDetailResponseDTO';
import { RepairService } from '../../services/repair/repair.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EquipmentDismissalFormComponent } from '../../components/equipmentDismissalForm/equipmentDismissalForm.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { EquipmentService } from '../../services/equipment/equipment.service';
import { EquipmentRepairStatusChangeRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentRepairStatusChangeRequestDTO';
import { EquipmentRepairFormComponent } from '../../components/equipmentRepairForm/equipmentRepairForm.component';

@Component({
  selector: 'app-equipmentRepair',
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
    MatDialogModule,
    LayoutModule,
    MatCardModule,
    MatSortModule,
    MatDividerModule
  ],
  templateUrl: './equipmentRepair.component.html',
  styleUrls: ['./equipmentRepair.component.css'],
})
export class EquipmentRepairComponent implements OnInit {
  searchTerm: string = '';
  displayedColumns: string[] = [
    'serialNumber',
    'repairDate',
    'creationDate',
    'repairStatus',
    'description',
    'cost',
    'serviceProvider',
    'actions',
  ];
  dataSource = new MatTableDataSource<EquipmentRepairDetailResponseDTO>();
  total = 0;
  disabledAvailableButtons = new Set<number>();

  equipmentStatuses = [
    { id: 1, name: 'Disponible' },

    { id: 3, name: 'En reparación' },
    { id: 6, name: 'Reparado' },
    { id: 7, name: 'Fuera de Servicio' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isSmallScreen: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loading: LoadingService,
    private formService: FormService,
    private dialog: MatDialog,
    private modalDialogService: ModalDialogService,
    private warningService: WarningService,
    private equipmentRepairService: RepairService,
    private equipmentService: EquipmentService,
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
      const statusPriority: { [key: string]: number } = {
        'En revision': 0,
        'En reparación': 1,
        'reparado': 2,
        'fuera de servicio': 3,
        'disponible': 5,
      };
      this.sort.active = 'repairStatus';
      this.sort.direction = 'asc';
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'serialNumber':
            return item.serialNumber || '';
          case 'repairDate':
            return item.repairDate || '';
          case 'repairStatus':
            const name = item.repairStatus?.name?.toLowerCase() || '';
            return statusPriority[name] ?? 99; // Valor alto para estados no definidos
          case 'description':
            return item.description || '';
          case 'cost':
            return item.cost || 0;
          case 'serviceProvider':
            return item.serviceProviderName || '';
          case 'status':
            return item.status ? 'Activo' : 'Inactivo';
          case 'creationDate':
            return item.creationDate || '';
          case 'modificationDate':
            return item.modificationDate || '';
          default:
            return (item as any)[property];
        }
      };
    });
  }

  openDismissalForm(equipmentId: number): void {
  const dialogRef = this.dialog.open(EquipmentDismissalFormComponent, {
    width: '1200px',
    data: { equipmentId }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'submitted') {
      this.loadTable();
    }
  });
}

openDismissalFormAndThenSetStatus(equipmentId: number, status: number, idRepair: number): void {
  const dialogRef = this.dialog.open(EquipmentDismissalFormComponent, {
    width: '800px',
    height: '350px',  // Altura más generosa
    maxWidth: '90vw',
    maxHeight: '90vh',
    panelClass: 'custom-dialog-container', // MUY IMPORTANTE: esto conecta con el CSS global
    hasBackdrop: true,
    disableClose: false,
    data: { equipmentId }
  });



  dialogRef.afterClosed().subscribe(result => {
    // esperamos que el formulario cierre con 'submitted' al guardar correctamente
    if (result === 'submitted') {
      this.setRepairStatus(equipmentId, status, idRepair);
    }
  });
}


  loadTable(): void {
    this.loading.show(); // Show loading spinner
    this.equipmentRepairService.getAll().subscribe({
      next: (response) => {
        console.log('Datos de reparaciones:', response.data);
        // Log específico para el primer item
        this.dataSource.data = response.data;
        this.total = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.sort.sortChange.emit({
          active: this.sort.active,
          direction: this.sort.direction,
        });
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
            data.serialNumber?.toLowerCase().includes(term) ||
            data.brand?.toLocaleLowerCase().includes(term)||
            data.categoryName?.toLocaleLowerCase().includes(term)||
            data.model?.toLocaleLowerCase().includes(term)||
            data.description?.toLowerCase().includes(term) ||
            data.repairDate?.toLowerCase().includes(term) ||
            data.cost?.toString().includes(term) ||
            data.serviceProviderName?.toLowerCase().includes(term)
          );
        };
      },
    });
  }

  editRepair(repair?: EquipmentRepairDetailResponseDTO): void {
  this.formService.open(repair ?
    'Editar Reparación' :
    'Nueva Reparación',
    'build_circle', // Icono diferente para reparaciones
    EquipmentRepairFormComponent,
    repair,
    (result: EquipmentRepairDetailResponseDTO) => {
      if (result) {
        const index = this.dataSource.data.findIndex(r => r.id === result.id);
        if (index !== -1) {
          // Actualiza solo los campos editables
          this.dataSource.data[index] = {
            ...this.dataSource.data[index],
            description: result.description,
            serviceProviderId: result.serviceProviderId,
            serviceProviderName: result.serviceProviderName,
            cost: result.cost,
          };
          this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
        } else {
        // Inserta nueva reparación
        this.dataSource.data = [result, ...this.dataSource.data];
      }
        this.modalDialogService.open(
          'success',
          'Reparación actualizada',
          'La reparación fue actualizada correctamente.'
        );
      }
    },
    (error) => {
      console.error('Error al editar la reparación', error);
      this.modalDialogService.open(
        'error',
        'Error al editar',
        'No se pudo actualizar la reparación.'
      );
    }
  );
}

  setRepairStatus(equipmentId: number, status: number, idRepair:number) {
    const equipmentRepairStatusChange: EquipmentRepairStatusChangeRequestDTO = {
    statusChange: status,
    idRepair: idRepair
  };

    this.equipmentService.changeStatus(equipmentRepairStatusChange, equipmentId).subscribe({
    next: (response) => {
      console.log('Respuesta del cambio de estado:', response);
      const updatedRepair = this.dataSource.data.find(item => item.id === idRepair);
      if (updatedRepair) {
        // Encontramos el nuevo estado en nuestra lista de estados
        const newStatus = this.equipmentStatuses.find(s => s.id === status);
        if (newStatus) {
          switch (status) {
            case 3: // En reparación
              updatedRepair.repairStatus = {
                id: 3,
                name: 'En reparación'
              };
              break;
            case 6: // Reparado
              updatedRepair.repairStatus = {
                id: 6,
                name: 'Reparado'
              };
              updatedRepair.repairDate = new Date().toISOString();
              break;
            case 1: // Disponible
              updatedRepair.equipmentStatus = {
                id: 1,
                name: 'Disponible'
              };
              // Mantenemos el repairStatus como está
              break;
            case 7: // Fuera de servicio
              updatedRepair.repairStatus = {
                id: 7,
                name: 'Fuera de Servicio'
              };
              break;
          }
        }
      }


        // Forzar actualización del datasource
        this.dataSource.data = [...this.dataSource.data];

        this.modalDialogService.open(
          'success',
          'Estado actualizado',
          'El estado del equipo ha sido actualizado correctamente.'
        );
      },
      error: (error) => {
        this.modalDialogService.open('error', 'Error', error.error.message);
      },
    });
  }


  warningDelete(entity: EquipmentRepairDetailResponseDTO) {
    this.warningService.open(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.',
      () => {
        this.delete(entity);
      }
    );
  }

  delete(entity: EquipmentRepairDetailResponseDTO): void {
    this.loading.show();
    this.equipmentRepairService.delete(entity.id).subscribe({
      next: (resp) => {
        const index = this.dataSource.data.findIndex((u) => u.id === entity.id);
        if (index !== -1) {
          this.dataSource.data[index].status = false;
          this.dataSource.data = [...this.dataSource.data];
        }
        this.loading.hide();
        this.modalDialogService.open(
          'success',
          'Reparacion eliminada',
          'La reparacion fue desactivada correctamente.'
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

  getStatusClasses(statusName: string | undefined): string {
    if (!statusName) return 'dot-inactive out-of-service';
    switch (statusName) {
      case 'disponible':
        return 'dot-available available';
      case 'asignado':
        return 'dot-assigned assigned';
      case 'En reparación':
        return 'dot-under-repair under-repair';
      case 'En revision':
        return 'dot-under-review under-review';
      case 'falla reportada':
        return 'dot-bug-reported bug-reported';
      case 'reparado':
        return 'dot-repaired repaired';
      case 'fuera de servicio':
        return 'dot-out-of-service out-of-service';
      default:
        return 'dot-inactive out-of-service';
    }
  }
}
