import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalBarChartComponent } from '../verticalBarChart/verticalBarChart.component';
import { PieChartComponent } from '../pieChart/pieChart.component';
import { MatCardModule } from '@angular/material/card';
import { LineChartComponent } from '../lineChart/lineChart.component';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { DashboardEquipmentAssignedByCategoryResponseDTO } from '../../../../core/models/ResponseDTO/inventory/DashboardEquipmentAssignedByCategoryResponseDTO ';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [VerticalBarChartComponent, MatCardModule, CommonModule, PieChartComponent, LineChartComponent],
})
export class HomeComponent implements OnInit {
  cards = [
    { title: 'Equipos', count: 0, color: '#e0f7fa' }, // inicializa con 0
    { title: 'Equipos asignados', count: 0, color: '#eeeeee' },
    { title: 'Clientes', count: 0, color: '#e0f7fa' },
    { title: 'Equipos en reparación', count: 0, color: '#eeeeee' },
    { title: 'Equipos disponibles', count: 0, color: '#e0f7fa' },
    { title: 'Equipos de baja', count: 0, color: '#eeeeee' },
  ];

  barData = signal<DashboardEquipmentAssignedByCategoryResponseDTO[]>([]); // Usar signal para reactividad
  pieData: any[] = [];
  lineData: any[] = [];

  // Ejemplo de parámetros, cámbialos según contexto real
  selectedCategoryId = 1;


  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getAll().subscribe({
      next: (response) => {
        const data = response.data;
        this.cards[0].count = data.totalEquipos;
        this.cards[1].count = data.equiposAsignados;
        this.cards[2].count = data.clientes;
        this.cards[3].count = data.equiposEnReparacion;
        this.cards[4].count = data.equiposDisponibles;
        this.cards[5].count = data.equiposDeBaja;
      },
      error: (error) => {
        console.error('Error fetching dashboard cards:', error);
      },
    });

    this.dashboardService.getBar().subscribe({
      next: (response) => {
        this.barData.set(response.data);
      },
      error: (error) => {
        console.error('Error fetching bar chart data:', error);
      },
    });
  }
}
