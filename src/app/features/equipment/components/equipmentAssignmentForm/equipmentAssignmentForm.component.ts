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

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FormService } from '../../../../core/services/modals/form/form.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { forkJoin } from 'rxjs';
import { EmployeeCatalogResponseDTO } from '../../../../core/models/ResponseDTO/administration/EmployeeCatalogResponseDTO';
import { EquipmentResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentResponseDTO';
import { EmployeeService } from '../../../employees/services/employee.service';
import { EquipmentService } from '../../services/equipment/equipment.service';
import { EquipmentAssignmentRequestDTO } from '../../../../core/models/RequestDTO/inventory/EquipmentAssignmentRequestDTO';
import { AssaingmentService } from '../../services/assaignment/assaingment.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import { EquipmentAssignmentComponent } from '../../pages/equipmentAssignment/equipmentAssignment.component';

@Component({
  selector: 'app-equipmentAssignmentForm',
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
  templateUrl: './equipmentAssignmentForm.component.html',
  styleUrls: ['./equipmentAssignmentForm.component.css'],
})
export class EquipmentAssignmentFormComponent implements OnInit, OnDestroy {
  employees: EmployeeCatalogResponseDTO[] = [];
  filteredEmployees: EmployeeCatalogResponseDTO[] = []; // 🔍 lista filtrada
  employeeFilter: string = ''; // 🔍 texto del filtro
  employeeFilterCtrl: FormControl = new FormControl(); // 🔍

  equipments: EquipmentResponseDTO[] = [];
  availableEquipmentId:number[]=[];
  equipmentFilterCtrl: FormControl = new FormControl(); // 🔍 Filtro de equipo
  filteredEquipments: EquipmentResponseDTO[] = [];

  loading: boolean = true;
  isSubmitting = false;

  assignmentForm!: FormGroup;
  entityId: number = 0;


  private _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private equipmentService: EquipmentService,
    private equipmentAssignmentService: AssaingmentService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.initForm();
    forkJoin({
      employees: this.employeeService.getAll(),
      equipments: this.equipmentService.getAll(),
      availableIds: this.equipmentAssignmentService.getAvailableEquipmentIds()
    }).subscribe({
      next: (resp) => {
        this.employees = resp.employees.data;
        this.filteredEmployees = [...this.employees];
        // Escuchar cambios en el filtro
        this.employeeFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => this.filterEmployees());

        this.equipments = resp.equipments.data;
        this.availableEquipmentId = resp.availableIds.data;
        this.filteredEquipments = this.getAvailableEquipments();
        // Escuchar filtro de equipos
        this.equipmentFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => this.filterEquipments());

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

  // Método para filtrar solo equipos disponibles
  getAvailableEquipments(): EquipmentResponseDTO[] {
    return this.equipments.filter(equipment =>
      this.availableEquipmentId.includes(equipment.id)
    );
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  filterEmployees() {
    const search = this.employeeFilterCtrl.value?.toLowerCase() || '';
    this.filteredEmployees = this.employees.filter((emp) =>
      emp.fullName.toLowerCase().includes(search)
    );
  }

  filterEquipments() {
  const search = this.equipmentFilterCtrl.value?.toLowerCase() || '';

  this.filteredEquipments = this.equipments.filter(eq => {
    // Verificamos que esté en availableEquipmentIds Y coincida con la búsqueda
    const isAvailable = this.availableEquipmentId.includes(eq.id);
    if (!isAvailable) return false;

    const equipmentText = `${eq.category} ${eq.brand} ${eq.model} ${eq.serialNumber}`.toLowerCase();
    return equipmentText.includes(search);
  });
}

  loadData() {
    const entityToEdit = this.formService.modalDataValue;
    if (entityToEdit) {
      this.assignmentForm.patchValue({
        employee: entityToEdit.employee?.id || null,
        equipment: entityToEdit.equipment?.id || null,
        assignmentDate: entityToEdit.assignmentDate?.split('T')[0],
      });
      this.entityId = entityToEdit.id;
    }
  }

  initForm() {
    this.assignmentForm = this.fb.group({
      employee: [null, Validators.required],
      equipment: [null, Validators.required],
      assignmentDate: [new Date(), Validators.required],
    });
  }

  onSubmit() {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAsTouched();
      return;
    }
    this.isSubmitting = true;
    const assignmentRequest: EquipmentAssignmentRequestDTO = {
      employee: this.assignmentForm.value.employee,
      equipment: this.assignmentForm.value.equipment,
      assigmentDate:
        moment(this.assignmentForm.value.assignmentDate).format('YYYY-MM-DD'),
    };
    this.equipmentAssignmentService.save(assignmentRequest).subscribe({
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
  }

  onCancel() {
    this.formService.close();
  }
}
