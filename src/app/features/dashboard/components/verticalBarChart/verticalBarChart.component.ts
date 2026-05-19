import {
  Component,
  computed,
  effect,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { DashboardEquipmentAssignedByCategoryResponseDTO } from '../../../../core/models/ResponseDTO/inventory/DashboardEquipmentAssignedByCategoryResponseDTO ';

@Component({
  selector: 'app-verticalBarChart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './verticalBarChart.component.html',
  styleUrls: ['./verticalBarChart.component.css'],
})
export class VerticalBarChartComponent implements OnInit {
  data = input<DashboardEquipmentAssignedByCategoryResponseDTO[]>([]); // Input signal for data
  readonly barChartData = computed(() => 
    this.data().map((item) => ({
      name: item.categoria,
      value: item.total,
    }))
  );
  barWidth = 400;

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
  };

  noData:boolean = false;

  constructor() {
    effect(() => {
      const newData = this.data();
      console.log("Nueva data recibida:", newData);

      const barCount = newData.length;
      this.noData = barCount === 0;

      const barSpacing = 80;
      this.barWidth = Math.max(barCount * barSpacing, 400);
    });
  }

  ngOnInit() {
  }
}
