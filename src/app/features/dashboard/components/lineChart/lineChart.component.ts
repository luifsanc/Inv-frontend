import {
  AfterViewInit,
  Component,
  computed,
  effect,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartModule } from '@swimlane/ngx-charts';
import {
  curveBasis,
  curveLinear,
  curveStep,
  curveCardinal,
  curveMonotoneX,
} from 'd3-shape';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DashboardEquipmentAssignedByCategoryResponseDTO } from '../../../../core/models/ResponseDTO/inventory/DashboardEquipmentAssignedByCategoryResponseDTO ';
import { EquipmentCategoriesService } from '../../../equipment/services/equipmentCategories/equipmentCategories.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { DashboardAcquisitionResponseDTO } from '../../../../core/models/ResponseDTO/inventory/DashboardAcquisitionResponseDTO';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-lineChart',
  standalone: true,
  templateUrl: './lineChart.component.html',
  styleUrls: ['./lineChart.component.css'],
  imports: [
    LineChartModule,
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
  ],
})
export class LineChartComponent implements OnInit, AfterViewInit {
  data = signal<DashboardAcquisitionResponseDTO[]>([]); // Input signal for data
  readonly barChartData = computed(() =>
    this.data().map((item) => ({
      name: item.nombreMes,
      value: item.valorTotalAdquisiciones,
    }))
  );

  resizeWidth = signal<number>(0);
  readonly view = computed(() => [this.resizeWidth(), 400] as [number, number]);

  years: number[] = [];
  selectedYear = new Date().getFullYear();

  lineData = signal<any[]>([]); // Usar signal para reactividad

  colorScheme = {
    domain: ['#5AA454'],
  };
  curve: any = curveMonotoneX;

  constructor(
    private dashboardService: DashboardService,
    private equipmentCategoriesService: EquipmentCategoriesService
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 8 }, (_, i) => currentYear - 4 + i);

    this.selectedYear = currentYear;
    this.dashboardService.getLine(this.selectedYear).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.loadData(this.selectedYear);
      },
      error: (error) => {
        console.error('Error fetching line chart data:', error);
      },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const width =
        (document.querySelector('.chart-container') as HTMLElement)
          ?.clientWidth || 400;
      this.resizeWidth.set(width);
    });

    fromEvent(window, 'resize').subscribe(() => {
      const width =
        (document.querySelector('.chart-container') as HTMLElement)
          ?.clientWidth || 400;
      this.resizeWidth.set(width);
    });
  }

  onYearChange(event: any): void {
    this.selectedYear = +event.value;
    this.dashboardService.getLine(this.selectedYear).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.loadData(this.selectedYear);
      },
      error: (error) => {
        console.error('Error fetching line chart data:', error);
      },
    });
  }

  loadData(year: number): void {
    this.lineData.set([
      {
        name: `Año ${year}`,
        series: this.barChartData(),
      },
    ]);
  }
}
