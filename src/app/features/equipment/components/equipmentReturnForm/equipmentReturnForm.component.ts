import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FormService } from '../../../../core/services/modals/form/form.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { forkJoin } from 'rxjs';
import { FlattenedMenu } from '../../../../core/models/ResponseDTO/authentication/FlattenedMenu';
import { EmployeeCatalogResponseDTO } from '../../../../core/models/ResponseDTO/administration/EmployeeCatalogResponseDTO';
import { EquipmentResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentResponseDTO';
import { EmployeeService } from '../../../employees/services/employee.service';
import { EquipmentService } from '../../services/equipment/equipment.service';
import { EquipmentAssignmentRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentAssignmentRequestDTO';
import { AssaingmentService } from '../../services/assaignment/assaingment.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EquipmentRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentRequestDTO';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { EquipmentAssignmentDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentAssignmentDetailResponseDTO';
import { EquipmentRevokeRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentRevokeRequestDTO';
import { ConditionResponseDTO } from '../../../../core/models/ResponseDTO/inventory/ConditionResponseDTO';
import { ConditionsService } from '../../../../core/services/conditions/conditions.service';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';


@Component({
  selector: 'app-equipmentReturnForm',
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
  templateUrl: './equipmentReturnForm.component.html',
  styleUrls: ['./equipmentReturnForm.component.css'],
})
export class EquipmentReturnFormComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  loading = true;

  conditions: ConditionResponseDTO[] = [];
  conditionFilterCtrl = new FormControl();
  filteredConditions: ConditionResponseDTO[] = [];

  equipmentReturnForm!: FormGroup;
  entityId: number = 0;

  private _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private assignamentService: AssaingmentService,
    public modalDialog: ModalDialogService,
    private location: Location,
    private conditionService: ConditionsService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  initForm() {
    this.equipmentReturnForm = this.fb.group({
      dateReturn: [null],
      condition: [null],
      observations: [''],
    });
  }

loadData() {
  this.entityId = this.formService.modalDataValue;

  this.assignamentService.getAll().subscribe({
    next: (resp: ResponseDTO<EquipmentAssignmentDetailResponseDTO[]>) => {
      const assignments = resp.data; // <-- aquí accedemos al arreglo real
      const assignment = assignments.find(a => a.id === this.entityId);
      if (assignment) {
        this.equipmentReturnForm.patchValue({
          dateReturn: assignment.returnDate ? new Date(assignment.returnDate) : null,
          condition: assignment.condition || null,
          observations: assignment.observations || '',
        });
      }
    },
    error: (err) => console.error('Error al cargar asignación:', err),
    complete: () => {
      this.loading = false;
    },
  });



  this.conditionService.getAll().subscribe({
    next: (resp) => { this.conditions = resp.data;
      this.filteredConditions = [...this.conditions];
      this.conditionFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => this.filterConditions());
    },
    error: (err) => {
      console.error('Error al cargar condiciones:', err);
    },
    complete: () => {
      this.loading = false;
    },
  });
}

  onSubmit() {
    this.isSubmitting = true;

    // Convertimos el objeto Date a string yyyy-MM-dd
    const dateReturn = this.equipmentReturnForm.value.dateReturn;

    const revokeDate: string = dateReturn
      ? dateReturn.format('YYYY-MM-DD')
      : '';

    const revokeRequest: EquipmentRevokeRequestDTO =
    {
  revokeDate: revokeDate,
  condition: this.equipmentReturnForm.value.condition,
  observations: this.equipmentReturnForm.value.observations,
};

    this.assignamentService.revoke(this.entityId, revokeRequest).subscribe({
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

  filterConditions() {
  const search = this.conditionFilterCtrl.value?.toLowerCase() || '';
  this.filteredConditions = this.conditions.filter(c =>
    c.name.toLowerCase().includes(search)
  );
}


  onCancel() {
    this.formService.close();
  }

  goBack() {
    this.location.back();
  }
}
