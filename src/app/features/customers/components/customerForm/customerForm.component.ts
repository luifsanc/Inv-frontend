import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { CustomerRequestDTO } from '../../../../core/models/RequestDTO/administration/CustomerRequestDTO';
import { CustomerService } from '../../services/customer/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner
  ],
  templateUrl: './customerForm.component.html',
  styleUrls: ['./customerForm.component.css'],
})
export class CustomerFormComponent implements OnInit {
  loading = false;
  isSubmitting = false;
  entityForm!: FormGroup;
  entityId: number = 0;

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.entityForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-]{7,20}$/)]],
      ruc: ['', [Validators.required, Validators.maxLength(13)]],
    });
  }

  loadData(): void {
    const customerToEdit = this.formService.modalDataValue;
    if (customerToEdit) {
      this.entityForm.patchValue({
        name: customerToEdit.name,
        address: customerToEdit.address,
        email: customerToEdit.email,
        phone: customerToEdit.phone,
        ruc: customerToEdit.ruc,
      });
      this.entityId = customerToEdit.id;
    }
  }

  onSubmit(): void {
    if (this.entityForm.invalid) {
      this.entityForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const form = this.entityForm.value as CustomerRequestDTO;

    if (this.entityId === 0) {
      this.customerService.save(form).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          this.formService.close(resp.data);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.formService.error(err.error);
        },
      });
    } else {
      this.customerService.update(form, this.entityId).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          this.formService.close(resp.data);

        },
        error: (err) => {
          this.isSubmitting = false;
          this.formService.error(err.error);
        },
      });
    }
  }

  onCancel(): void {
    this.formService.close();
  }
}
