import { Component, computed, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { LegendPosition } from '@swimlane/ngx-charts';
import { DashboardEquipmentStatusSummaryResponseDTO } from '../../../../core/models/ResponseDTO/inventory/DashboardEquipmentStatusSummaryResponseDTO ';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { EquipmentCategoriesService } from '../../../equipment/services/equipmentCategories/equipmentCategories.service';
import { EquipmentCategoryResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentCategoryResponseDTO';

@Component({
  selector: 'app-pieChart',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxChartsModule,
    FormsModule,
  ],
  templateUrl: './pieChart.component.html',
  styleUrls: ['./pieChart.component.css'],
})
export class PieChartComponent implements OnInit {
  data = signal<DashboardEquipmentStatusSummaryResponseDTO[]>([]);
  readonly chartData = computed(() =>
    this.data()
      .filter((item) => item.equipmentCount > 0)
      .map((item) => ({
        name: `${item.statusName} (${item.equipmentCount})`,
        value: item.equipmentCount,
      }))
  );

  selectedCategoryId = 1;
  categories = signal<EquipmentCategoryResponseDTO[]>([]);
  selectedCategory: EquipmentCategoryResponseDTO | undefined;
  noData:boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private equipmentCategoriesService: EquipmentCategoriesService
  ) {}

  ngOnInit() {
    this.equipmentCategoriesService.getAll().subscribe({
      next: (response) => {
        console.log(response.data);
        if (response.data.length == 0){
          console.error('No equipment categories found');
          this.noData = true;
          return;
        }
        console.log(response.data);
        this.categories.set(response.data);
        console.log(this.categories())
        this.selectedCategory = this.categories()[0]; // Selecciona la primera categoría por defecto
        this.dashboardService.getPie(this.selectedCategory.id).subscribe({
          next: (response) => {
            this.data.set(response.data);
          },
          error: (error) => {
            console.error('Error fetching pie chart data:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching equipment categories:', error);
      },
    });
  }

  legendPosition: LegendPosition = LegendPosition.Right;

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
  };

  onCategoryChange() {
    if (this.selectedCategory) {
      this.dashboardService.getPie(this.selectedCategory?.id).subscribe({
        next: (response) => {
          this.data.set(response.data);
        },
        error: (error) => {
          console.error('Error fetching pie chart data:', error);
        },
      });
    }
  }
}
