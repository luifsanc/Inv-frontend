import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  FormsModule, 
  FormControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { PrivilegeService } from '../../services/privilege.service';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PrivilegeRequestDTO } from '../../../../core/models/RequestDTO/authentication/PrivilegeRequestDTO';
@Component({
  selector: 'app-privilegeForm',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    NgxMatSelectSearchModule
  ],
  templateUrl: './privilegeForm.component.html',
  styleUrls: ['./privilegeForm.component.css']
})
export class PrivilegeFormComponent implements OnInit, OnDestroy  {
  
  applications: any[] = [];

  isSubmitting = false;
  loading: boolean = true;

  privilegeForm!: FormGroup;
  entityId: number = 0;
    
  private _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private privilegeService: PrivilegeService,    
    private formService: FormService
  ) { }
  
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.initForm();
    this.loading = false;
    this.loadData();
  }

  loadData() {
    const privilegeToEdit = this.formService.modalDataValue;
    if (privilegeToEdit) {
      this.privilegeForm.patchValue({
        key: privilegeToEdit.key,
        description: privilegeToEdit.description,
        applicationId: privilegeToEdit.applicationId,
      });
      this.entityId = privilegeToEdit.id;
      this.privilegeForm.get('key')?.disable(); // si quieres evitar modificar la clave
      this.privilegeForm.get('description')?.disable();
      this.privilegeForm.get('applicationId')?.disable();
    }
  }

  initForm() {
    this.privilegeForm = this.fb.group({
      key: ['', Validators.required],
      description: [''],
      applicationId: [1, Validators.required],
    });
  }

  onSubmit() {
    if (this.privilegeForm.invalid) {
      this.privilegeForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const request: PrivilegeRequestDTO = {
      key: this.privilegeForm.getRawValue().key,
      description: this.privilegeForm.value.description,
      applicationId: this.privilegeForm.getRawValue().applicationId,
    }; if(this.entityId === 0){
      this.privilegeService.save(request).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          this.formService.close(resp.data);
        },
        error: (error) => {
          console.error(error);
          this.isSubmitting = false;
          this.formService.error(error.error);
        },
      });      
  }else{
    this.privilegeService.update(request,this.entityId).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          this.formService.close(resp.data);
        },
        error: (error) => {
          console.error(error);
          this.isSubmitting = false;
          this.formService.error(error.error);
        },
      });
  }}

  onCancel() {
    this.formService.close();
  }

}
