import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormService } from '../../../../core/services/modals/form/form.service';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { EquipmentService } from '../../services/equipment/equipment.service';
import { InvoiceDetailRequestDTO } from '../../../../core/models/RequestDTO/inventory/InvoiceDetailRequestDTO';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SupplierRequestDTO } from '../../../../core/models/RequestDTO/inventory/SupplierRequestDTO';
import { SupplierService } from '../../../suppliers/services/supplier/supplier.service';
import { SupplierResponseDTO } from '../../../../core/models/ResponseDTO/inventory/SupplierResponseDTO';
import { InvoiceRequestDTO } from '../../../../core/models/RequestDTO/inventory/InvoiceRequestDTO';

@Component({
  selector: 'app-InvoiceForm',
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
    MatProgressSpinner,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
  ],
  templateUrl: './equipmentInvoiceForm.component.html',
  styleUrls: ['./equipmentInvoiceForm.component.css'],
})
export class EquipmentInvoiceFormComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  loading = true;

  equipmentInvoiceForm!: FormGroup;
  entityId: number = 0;
  equipmentId: number = 0;

  private _onDestroy = new Subject<void>();

  suppliers: SupplierRequestDTO[] = [];
  suppliersFilterCtrl = new FormControl();
  filteredSuppliers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private equipmentService: EquipmentService,
    private suppliersService: SupplierService,
    public modalDialog: ModalDialogService,
    private location: Location
  ) {}

  ngOnInit() {
    this.initForm();
    forkJoin({
      suppliers: this.suppliersService.getAll(),
    }).subscribe({
      next: (resp) => {
        this.suppliers = resp.suppliers.data.filter((supplier: SupplierResponseDTO) => 
      supplier.supplierType?.id === 1);
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
    const search = this.suppliersFilterCtrl.value?.toLowerCase() || '';
    this.filteredSuppliers = this.suppliers.filter((sup) =>
      `${sup.businessName} ${sup.id}`.toLowerCase().includes(search)
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  initForm() {
    this.equipmentInvoiceForm = this.fb.group({
      description: ['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      tax: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0)]],
      subtotal: [0, [Validators.min(0)]],
      total: [0, [Validators.min(0)]],
      supplier: ['', Validators.required],
      invoiceDate: [new Date(), Validators.required],
      invoiceNumber: ['', Validators.required],
    });
  }

  loadData() {
    const data = this.formService.modalDataValue;
    this.equipmentId = data.equipmentId;
    if (data.invoiceDetail) {
      this.entityId = data.invoiceDetail.id;
      this.equipmentInvoiceForm.patchValue({
        description: data.invoiceDetail.description,
        unitPrice: data.invoiceDetail.unitPrice,
        quantity: data.invoiceDetail.quantity,
        tax: data.invoiceDetail.tax,
        discount: data.invoiceDetail.discount,
        subtotal: data.invoiceDetail.subtotal,
        total: data.invoiceDetail.total,
        supplier: data.invoiceDetail.supplierId,
        invoiceDate: data.invoiceDetail.invoiceDate,
        invoiceNumber: data.invoiceDetail.invoiceNumber,
      });
    }
    this.loading = false;
  }

  onSubmit() {
    if (this.equipmentInvoiceForm.invalid) return;
    this.isSubmitting = true;
    const formValue = this.equipmentInvoiceForm.getRawValue();
    const requestDetail: InvoiceDetailRequestDTO = {
      id:0,
      description: formValue.description,
      unitPrice: formValue.unitPrice,
      quantity: formValue.quantity,
      subtotal: formValue.subtotal,
      tax: formValue.tax,
      discount: formValue.discount,
      total: formValue.total,
    };

    const request: InvoiceRequestDTO = {
      id:0,
      invoiceDetail: requestDetail,
      supplier: formValue.supplier,
      invoiceDate: this.formatDate(
        formValue.invoiceDate ? new Date(formValue.invoiceDate) : new Date()
      ),
      invoiceNumber: formValue.invoiceNumber,
    };
    this.equipmentService.invoice(request, this.equipmentId).subscribe({
      next: (resp) => {
        this.isSubmitting = false;
        this.formService.close(resp.data);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formService.error(error.error);
      },
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  onCancel() {
    this.formService.close();
  }

  onSave() {
    throw new Error('Method not implemented.');
  }
}
