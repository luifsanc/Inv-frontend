import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { SupplierRequestDTO } from '../../../../core/models/RequestDTO/inventory/SupplierRequestDTO';
import { SupplierService } from '../../services/supplier/supplier.service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { SupplierTypeResponseDTO } from '../../../../core/models/ResponseDTO/inventory/SupplierTypeResponseDTO';
import { SupplierTypeService } from '../../services/supplier/supplier-type.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { NationalityService } from '../../../../core/services/nationality/nationality.service';
import { NationalityResponseDTO } from '../../../../core/models/ResponseDTO/administration/NationalityResponseDTO';
import { rucValidator } from '../../../../shared/components/ruc.validator';

@Component({
  selector: 'app-supllierForm',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    MatSelectModule,
    MatOptionModule
],
  templateUrl: './supplierForm.component.html',
  styleUrls: ['./supplierForm.component.css']
})
export class SupplierFormComponent implements OnInit {
  supplierForm!: FormGroup;
  loading: boolean = true;
  isSubmitting: boolean = false;
  supplierId: number = 0;
  supplierTypes: SupplierTypeResponseDTO[] = [];
  nationality: NationalityResponseDTO[]=[];

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private supplierService: SupplierService,
    private supplierTypeService: SupplierTypeService,
    private nationalityService:NationalityService,
  ) { }

  ngOnInit()
  {
    this.initForm();
    this.loadSupplierTypes();
    this.loadNationality();
    this.loadData();
  }

  initForm(): void
  {
    this.supplierForm = this.fb.group(
      {
      businessName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(150),
      Validators.pattern(/^[\p{L}\p{N}\s\.,\-#áéíóúÁÉÍÓÚñÑ]*$/u)]],
      country:['', Validators.required],
      address: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200),
      Validators.pattern(/^[\p{L}\p{N}\s\.,:\-#áéíóúÁÉÍÓÚñÑ]*$/u)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      ruc: ['', [Validators.required, rucValidator(() =>
        {
    const countryId = this.supplierForm?.get('country')?.value;
    const countryObj = this.nationality.find(n => n.id === countryId);
    return countryObj?.description || '';
        })
        ]],
      email: ['', [Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[A-Za-z0-9+_.-]+@(.+)\.(com|ec|net|org|edu|gob|mil|co|info|xyz)$/)]],
      supplierType: ['', Validators.required]
    });

    // Escuchar cambios de país para actualizar validación del RUC
  this.supplierForm.get('country')?.valueChanges.subscribe(() => {
    this.supplierForm.get('ruc')?.updateValueAndValidity();
  });
 }

  loadData(): void
  {
    const supplierToEdit = this.formService.modalDataValue;
    if (supplierToEdit)
      {
      this.supplierForm.patchValue({...supplierToEdit,supplierType: supplierToEdit.supplierType?.id,
        country: supplierToEdit.nationality?.id
      });
            this.supplierId = supplierToEdit.id;

    }
    this.loading = false;
  }

  loadSupplierTypes(): void
  {
    this.supplierTypeService.getAllActive().subscribe({
      next: (resp) => {
        this.supplierTypes = resp.data;
      },
      error: (err) => {
        console.error('Error cargando tipos de proveedor:', err);
      }
    });
  }

  loadNationality():void
  {
    this.nationalityService.getAll().subscribe(
      {
        next:(resp)=>
          {
            this.nationality=resp.data;
          },
          error:(err)=>
          {
            console.error('Error cargando paises:', err);
          }
    })
  }

  onSubmit(): void {
  if (this.supplierForm.invalid) {
    this.supplierForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  const formValue = this.supplierForm.value;

  // Buscar el tipo de proveedor y pais completo en el array
  const selectedSupplierType = this.supplierTypes.find(type => type.id === formValue.supplierType);
  const selectedNationality = this.nationality.find(type => type.id == formValue.country);

  if (!selectedSupplierType)
    {
    console.error('Tipo de proveedor no encontrado');
    this.isSubmitting = false;
    this.formService.error('Seleccione un tipo de proveedor válido');
    return;
  }

  if (!selectedNationality)
    {
      console.error('Pais no encontrado');
      this.isSubmitting = false;
      this.formService.error('Seleccione un pais válido');
      return;
    }

  // Crear el DTO de solicitud con el objeto completo
  const supplierRequest: SupplierRequestDTO =
  {
    businessName: formValue.businessName,
    address: formValue.address,
    phone: formValue.phone,
    email: formValue.email,
    ruc:formValue.ruc,
    supplierType: selectedSupplierType,
    nationality: selectedNationality,
  };

  console.log('Enviando al backend:', supplierRequest); // Para depuración

  const serviceCall = this.supplierId !== 0
    ? this.supplierService.update(supplierRequest, this.supplierId)
    : this.supplierService.create(supplierRequest);

  serviceCall.subscribe({
    next: (resp) => {
      this.isSubmitting = false;
      this.formService.close(resp.data);
    },
    error: (err) => {
      console.error('Error detallado:', {
        status: err.status,
        message: err.message,
        error: err.error,
        url: err.url
      });
      this.isSubmitting = false;
      this.formService.error(err.error?.message || 'Error al guardar el proveedor');
    }
  });
}

allowOnlyNumbers(event: KeyboardEvent): void {
  const country = this.supplierForm?.get('country')?.value;

  // Si es Ecuador: solo números
  if (country === 'Ecuador') {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
  // Otros países: permitir letras y números
  else {
    if (!/^[a-zA-Z0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}


allowOnlyNumbersPhone(event: KeyboardEvent): void {
  const allowedChars = /[0-9+\-() ]/;
  // Permitir teclas de control (backspace, tab, etc.)
  if (event.key === 'Backspace' || event.key === 'Tab' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    return;
  }
  if (!allowedChars.test(event.key)) {
    event.preventDefault();
  }
}

  onCancel(): void {
    this.formService.close();
  }

}
