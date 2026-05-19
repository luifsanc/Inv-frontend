import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentTypeResponseDTO } from '../../../../core/models/ResponseDTO/inventory/ComponentTypeResponseDTO';
import { EquipmentComponentService } from '../../services/equipmentComponent/equipmentComponent.service';
import { ComponentTypeRequestDTO } from '../../../../core/models/RequestDTO/inventory/ComponentTypeRequestDTO';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-equipmentComponents',
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
    LayoutModule,
    MatCardModule,
    MatSortModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSlideToggleModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule
],
  templateUrl: './equipmentComponents.component.html',
  styleUrls: ['./equipmentComponents.component.css']
})
export class EquipmentComponentsComponent implements OnInit {
  @Input() componentControl!: FormControl;
  components: ComponentTypeResponseDTO[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private equipmentComponentService: EquipmentComponentService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadComponents();
  }

  loadComponents(): void {
    this.equipmentComponentService.getAll().subscribe({
      next: (response) => this.components = response.data,
      error: () => this.snackBar.open('Error al cargar los componentes.', 'Cerrar', { duration: 3000 })
    });
  }

  createComponent(): void {
    if (this.form.invalid) return;

    const newComponent: ComponentTypeRequestDTO = {
      description: this.form.value.description.trim().toUpperCase()
    };

    this.equipmentComponentService.save(newComponent).subscribe({
      next: (response) => {
        this.snackBar.open('Componente creado correctamente.', 'Cerrar', { duration: 3000 });
        this.form.reset();
        this.loadComponents();
      },
      error: () => this.snackBar.open('Error al crear el componente.', 'Cerrar', { duration: 3000 })
    });
  }

  deleteComponent(id: number): void {
    if (!confirm('¿Está seguro de eliminar este componente?')) return;

    this.equipmentComponentService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Componente eliminado correctamente.', 'Cerrar', { duration: 3000 });
        this.loadComponents();
      },
      error: () => this.snackBar.open('Error al eliminar el componente.', 'Cerrar', { duration: 3000 })
    });
  }
}
