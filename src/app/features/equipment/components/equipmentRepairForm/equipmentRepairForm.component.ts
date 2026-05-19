import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { FormService } from '../../../../core/services/modals/form/form.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EquipmentRepairRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentRepairRequestDTO';
import { RepairService } from '../../services/repair/repair.service';
import { WarningService } from '../../../../core/services/modals/warning/warning.service';
import { SupplierRequestDTO } from '../../../../core/models/RequestDTO/inventory/SupplierRequestDTO';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { SupplierService } from '../../../suppliers/services/supplier/supplier.service';
import { SupplierResponseDTO } from '../../../../core/models/ResponseDTO/inventory/SupplierResponseDTO';

@Component({
  selector: 'app-equipmentRepairForm',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
  ],
  templateUrl: './equipmentRepairForm.component.html',
  styleUrls: ['./equipmentRepairForm.component.css'],
})
export class EquipmentRepairFormComponent implements OnInit {
  equipment = {
    id: 0,
    serialNumber: '',
    equipmentStatusId: 0,
  };


  isSubmitting = false;
  loading = true;
  repairForm!: FormGroup;
  entityId: number = 0;
  isEditMode: boolean = false;

  suppliers: SupplierRequestDTO[] = [];
  suppliersFilterCtrl = new FormControl();
  filteredSuppliers: any[] = [];

  private _onDestroy = new Subject<void>();

  revoke: boolean = false;

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private suppliersService: SupplierService,
    private warningService: WarningService,
    private repairSearvice: RepairService
  ) {}


  ngOnInit() {
    console.log('Iniciando ngOnInit');
    this.initForm();
    console.log('Formulario inicializado');
    console.log('Obteniendo proveedores de servicio...');
    forkJoin({
          suppliers: this.suppliersService.getSuppliersIdType(2), // proveedores de servicio profesionales
        }).subscribe({
          next: (resp) => {
            console.log('Suppliers response:', resp.suppliers);
            this.suppliers = resp.suppliers.data;
            console.log('Service suppliers:', this.suppliers);
            this.filteredSuppliers = this.suppliers.slice();
            this.suppliersFilterCtrl.valueChanges
              .pipe(takeUntil(this._onDestroy))
              .subscribe(() => {
                this.filterSuppliers();
              });
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

  filterSuppliers() {
    console.log('Filtrando proveedores...');
    const search = this.suppliersFilterCtrl.value?.toLowerCase() || '';
    console.log('Texto de búsqueda:', search);
    this.filteredSuppliers = this.suppliers.filter((sup) =>
      `${sup.businessName} ${sup.id}`.toLowerCase().includes(search)
    );
    console.log('Proveedores filtrados:', this.filteredSuppliers);
  }

  initForm() {
    this.repairForm = this.fb.group({
      description: [null, Validators.required],
      supplierId: [null, [Validators.required, Validators.min(1)]],
      cost: [null, [Validators.required]],
    });

  
    this.repairForm.get('supplierId')?.valueChanges.subscribe(value => {
      console.log('Valor de supplierId cambiado a:', value);
    });
  }

  loadData() {
    const entityToEdit = this.formService.modalDataValue;
    console.log('Datos recibidos en el formulario:', entityToEdit);

    if (entityToEdit) {
      this.isEditMode = true;
      console.log('Valores antes de asignar:', {
        equipmentId: entityToEdit.equipmentId,
        id: entityToEdit.id,
        equipment: entityToEdit.equipment
      });

      // El ID del equipo puede venir en diferentes proiedades dependiendo del origen
      this.equipment = {
        id: entityToEdit.equipment || entityToEdit.equipmentId || entityToEdit.id,
        serialNumber: entityToEdit.serialNumber || '',
        equipmentStatusId: entityToEdit.equipmentStatusId || 0,
      };

      console.log('Equipo asignado:', this.equipment);

      // Si estamos editando, guardamos el ID de la reparación
      if (entityToEdit.id) {
        this.entityId = entityToEdit.id;
      }
      const providerId = entityToEdit.serviceProviderId;
      console.log('Service Provider ID recibido:', providerId);
      console.log('Service Provider Name recibido:', entityToEdit.serviceProviderName);

      this.repairForm.patchValue({
        description: entityToEdit.description,
        supplierId: providerId,
        cost: entityToEdit.cost,
      });

      // Verificar que el valor se estableció correctamente
      console.log('Valor actual del formulario después de patch:', this.repairForm.value);
      console.log('Estado del control supplierId:', {
        value: this.repairForm.get('supplierId')?.value,
        valid: this.repairForm.get('supplierId')?.valid,
        errors: this.repairForm.get('supplierId')?.errors
      });
    }
  }

  onSubmit() {
    if (this.repairForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.repairForm.value;

    console.log('Datos del equipo antes de enviar:', this.equipment);

    console.log('Valores del formulario:', formValue);

    // Validar y convertir el ID del proveedor
    if (!formValue.supplierId) {
      console.error('El ID del proveedor es requerido');
      this.isSubmitting = false;
      return;
    }

    const providerId = Number(formValue.supplierId);
    if (isNaN(providerId) || providerId <= 0) {
      console.error('ID de proveedor inválido:', formValue.supplierId);
      this.isSubmitting = false;
      return;
    }

    const request: EquipmentRepairRequestDTO = {
      equipment: this.equipment.id,
      description: formValue.description,
      serviceProviderId: providerId,
      cost: formValue.cost,
      revoke: this.revoke,
    };

    // Log detallado del request
    console.log('Valores del formulario antes de enviar:', {
      rawSupplierId: formValue.supplierId,
      convertedSupplierId: providerId,
      fullFormValue: formValue
    });
    console.log('Request final a enviar:', request);

    console.log('Request completo a enviar:', request);

    console.log('Request a enviar:', request);
    if (this.entityId == 0)
      {
      this.repairSearvice.save(request).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.formService.close(response.data);
        },
        error: (error) =>
          {
          this.isSubmitting = false;
          this.formService.error(error.error);
        },
      });
    } else
      {
        this.repairSearvice.update(this.entityId, request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.formService.close(response.data);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formService.error(error.error);
      },
    });
      }
    }

  getSupplierNameById(id: number): string {
    return this.suppliers.find(s => s.id === id)?.businessName || '';
  }

  submitAndRepair() {
    if (this.equipment.equipmentStatusId == 2) {
      this.warningService.open(
        'Confirmar devolución',
        'Este equipo está asignado a un usuario. ¿Desea realizar la devolución automática?',
        () => {
          this.revoke = true;
          this.onSubmit();
        },
        () => {
          this.revoke = false;
          this.onSubmit();
        },
        'Sí, continuar',
        'Continuar sin devolución'
      );
    } else {
      this.onSubmit();
    }
  }

  onCancel() {
    this.formService.close();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  preventInvalidInput(event: KeyboardEvent) {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }
}
