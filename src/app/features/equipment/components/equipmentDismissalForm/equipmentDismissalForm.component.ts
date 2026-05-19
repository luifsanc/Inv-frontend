import { Component, OnDestroy, OnInit, Inject, Optional } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormControl as NgFormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EquipmentDismissalService } from '../../services/equipmentDismissal/equipmentDismissal.service';
import { EquipmentDismissalRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentDismissalRequestDTO';
import { EquipmentDismissalTypeResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentDismissalTypeResponseDTO';
import { FormService } from '../../../../core/services/modals/form/form.service';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { Location as AngularLocation } from '@angular/common';

@Component({
  selector: 'app-equipmentDismissalForm',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
  ],
  templateUrl: './equipmentDismissalForm.component.html',
  styleUrls: ['./equipmentDismissalForm.component.css']
})
export class EquipmentDismissalFormComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  loading = true;

  dismissalTypes: EquipmentDismissalTypeResponseDTO[] = [];
  dismissalTypeFilterCtrl = new NgFormControl();
  filteredDismissalType: EquipmentDismissalTypeResponseDTO[] = [];

  equipmentDismissalTypeForm!: FormGroup;

  entityId: number = 0;

  private _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    public modalDialog: ModalDialogService,
    private location: AngularLocation,
    private equipmentDismissalService: EquipmentDismissalService,
    @Optional() private dialogRef?: MatDialogRef<EquipmentDismissalFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: { equipmentId: number }
  ) {}

  ngOnInit() {
    // Si el componente fue abierto mediante MatDialog, dialogData tendrá equipmentId.
    // Si fue abierto mediante tu FormService, toma el value desde allí.
    this.entityId = this.dialogData?.equipmentId ?? this.formService.modalDataValue ?? 0;

    this.initForm();
    this.loadDismissalTypes();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  initForm() {
    this.equipmentDismissalTypeForm = this.fb.group({
      dismissalType: [null, Validators.required],
      dismissalReason: [null, [ Validators.maxLength(100), (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value && value.trim() !== value) {
          return { whitespace: true };
        }
        return null;
      }]]
    });
  }

  loadDismissalTypes() {
    this.loading = true;
    this.equipmentDismissalService.getAllTypes().subscribe({
      next: (types) => {
        this.dismissalTypes = types.data;
        this.filteredDismissalType = [...this.dismissalTypes];

        // arrancar filtro
        this.dismissalTypeFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => this.filterDismissal());
      },
      error: (err) => {
        console.error('Error al cargar tipos de baja', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  limitCharacters(controlName: string, maxLength: number) {
  const control = this.equipmentDismissalTypeForm.get(controlName);
  if (control && control.value) {
    const currentValue = control.value;
    if (currentValue.length > maxLength) {
      control.setValue(currentValue.substring(0, maxLength), { emitEvent: false });
    }
  }
}

  filterDismissal() {
    const search = this.dismissalTypeFilterCtrl.value?.toLowerCase() || '';
    this.filteredDismissalType = this.dismissalTypes.filter(c =>
      c.name.toLowerCase().includes(search)
    );
  }

  onSubmit() {
    if (this.equipmentDismissalTypeForm.invalid) {
      this.equipmentDismissalTypeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const request: EquipmentDismissalRequestDTO = {
      equipmentId: this.entityId,
      dismissalTypeId: this.equipmentDismissalTypeForm.value.dismissalType,
      reason: this.equipmentDismissalTypeForm.value.dismissalReason
    };

    this.equipmentDismissalService.saveDismissal(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        // Si fue abierto por MatDialog -> cierra dialog con resultado 'submitted'
        if (this.dialogRef) {
          this.dialogRef.close('submitted');
        } else {
          // Si usas FormService -> envia los datos con la API que ya tenías
          this.formService.close(response.data);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        // maneja error como lo tenías
        if (this.dialogRef) {
          // opcional mostrar modal de error
          this.modalDialog.open('error', 'Error', error?.error?.message ?? 'Error al guardar');
        } else {
          this.formService.error(error?.error);
        }
      }
    });
  }

  onCancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.formService.close();
    }
  }

  goBack() {
    this.location.back();
  }
}
