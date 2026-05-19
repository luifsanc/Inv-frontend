import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  FormBuilder,
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { LoadingService } from '../../../../core/services/modals/loading/loading.service';
import { WarrantTypeRequestDTO } from'../../../../core/models/RequestDTO/inventory/WarrantTypeRequestDTO';
import { FormService } from '../../../../core/services/modals/form/form.service';



import { MatFormFieldModule } from '@angular/material/form-field';
import { EquipmentService } from '../../services/equipment/equipment.service'; // ajusta ruta si es distinta
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import{WarrantTypeDetailResponseDTO} from '../../../../core/models/ResponseDTO/inventory/WarrantTypeDetailResponseDTO '


@Component({
  selector: 'app-warranty-type-form',
  standalone: true,
  templateUrl: './warranty-type-form.component.html',
  styleUrls: ['./warranty-type-form.component.css'],
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
      NgxMatSelectSearchModule,
      MatProgressSpinnerModule,
      MatDatepickerModule,
      MatInputModule,
      MatNativeDateModule,
    ],
})
export class WarrantyTypeFormComponent implements OnInit {
  isSubmitting = false;

  warrantyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    private loading: LoadingService,
    private formService: FormService,
  ) {}

  formTitle: string = '';

  ngOnInit(): void
  {
    this.formTitle = this.formService.modalTitle();
      const data = this.formService.modalDataValue as WarrantTypeDetailResponseDTO;

      console.log('Datos recibidos en modal:', this.formService.modalDataValue);

    this.warrantyForm = this.fb.group({
      conditions: [data?.conditions||'', [Validators.required, Validators.maxLength(255)]],
      warrantyStartDate: [data?.warrantyStartDate?new Date(data.warrantyStartDate):new Date(), Validators.required],
      warrantyEndDate: [data?.warrantyEndDate?new Date(data.warrantyEndDate):null, Validators.required],
      supportContact: [data?.supportContact||'', [Validators.required, Validators.maxLength(100)]],
      warrantyStatus: [true, Validators.required],
    });

    if (data?.id) {
    this.warrantyForm.patchValue({
      conditions:data.conditions || '',
      warrantyStartDate:data.warrantyStartDate ? new Date(data.warrantyStartDate) : new Date(),
      warrantyEndDate:data.warrantyEndDate ? new Date(data.warrantyEndDate) : null,
      supportcontact:data.supportContact || '',
      warrantyStatus:data.warrantyStatus ?? true
    });
  }
  }

  endDateValidator(control: any) {
  const endDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignora la hora

  if (control.value && endDate < today) {
    return { endDateInvalid: true };
  }
  return null;
}

  onSubmit(): void {
    if (this.warrantyForm.invalid) return;

    const start = this.warrantyForm.value.warrantyStartDate;
    const end = this.warrantyForm.value.warrantyEndDate;
    const data = this.formService.modalDataValue as WarrantTypeDetailResponseDTO;

    const payload: WarrantTypeRequestDTO = {
      ...this.warrantyForm.value,
      id: data?.id ?? 0,
      id_equipment:data.idEquipment,
      warrantyStartDate: start ? new Date(start).toISOString() : '',
      warrantyEndDate: end ? new Date(end).toISOString() : '',
    };

    this.isSubmitting = true;
    this.loading.show();

    this.equipmentService.setWarranty(payload, data.idEquipment).subscribe({
      next: (resp) => {
        this.loading.hide();
        console.log('Garantía guardada con éxito:', resp);
        this.formService.close(resp.data);
      },
      error: (error) => {
        this.loading.hide();
        console.error('Error al guardar garantía:', error);
        this.formService.error(error);
      },
    });
  }

  onCancel(): void {
    this.formService.close();
  }
}
