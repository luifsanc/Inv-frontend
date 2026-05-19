import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { DashboardResponseDTO } from '../../../../core/models/ResponseDTO/inventory/DashboardResponseDTO';
import { DashboardAcquisitionResponseDTO } from '../../../../core/models/ResponseDTO/inventory/DashboardAcquisitionResponseDTO';
import { DashboardEquipmentAssignedByCategoryResponseDTO } from '../../../../core/models/ResponseDTO/inventory/DashboardEquipmentAssignedByCategoryResponseDTO ';
import { DashboardEquipmentStatusSummaryResponseDTO } from '../../../../core/models/ResponseDTO/inventory/DashboardEquipmentStatusSummaryResponseDTO ';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/dashboard`;

  constructor(private httpClient: HttpClient) {}

  // Obtener cards sin parámetros
  public getAll(): Observable<ResponseDTO<DashboardResponseDTO>> {
    const mockData: DashboardResponseDTO = {
      totalEquipos: 120,
      equiposAsignados: 85,
      clientes: 45,
      equiposEnReparacion: 12,
      equiposDisponibles: 20,
      equiposDeBaja: 3
    };
    return of({ success: true, message: 'OK', data: mockData } as unknown as ResponseDTO<DashboardResponseDTO>).pipe(delay(500));
  }

  // Obtener bar chart sin parámetros
  public getBar(): Observable<ResponseDTO<DashboardEquipmentAssignedByCategoryResponseDTO[]>> {
    const mockData: DashboardEquipmentAssignedByCategoryResponseDTO[] = [
      { categoria: 'Laptops', total: 45 } as any,
      { categoria: 'Monitores', total: 30 } as any,
      { categoria: 'Teclados', total: 60 } as any,
      { categoria: 'Mouse', total: 55 } as any
    ];
    return of({ success: true, message: 'OK', data: mockData } as unknown as ResponseDTO<DashboardEquipmentAssignedByCategoryResponseDTO[]>).pipe(delay(500));
  }

  // Obtener pie chart con parámetro category (categoryId)
  public getPie(categoryId: number): Observable<ResponseDTO<DashboardEquipmentStatusSummaryResponseDTO[]>> {
    const mockData: DashboardEquipmentStatusSummaryResponseDTO[] = [
      { statusName: 'Operativo', equipmentCount: 70 } as any,
      { statusName: 'En Reparación', equipmentCount: 15 } as any,
      { statusName: 'Dañado', equipmentCount: 10 } as any,
      { statusName: 'Baja', equipmentCount: 5 } as any
    ];
    return of({ success: true, message: 'OK', data: mockData } as unknown as ResponseDTO<DashboardEquipmentStatusSummaryResponseDTO[]>).pipe(delay(500));
  }

  // Obtener line chart con parámetro year
  public getLine(year: number): Observable<ResponseDTO<DashboardAcquisitionResponseDTO[]>> {
    const mockData: DashboardAcquisitionResponseDTO[] = [
      { nombreMes: 'Ene', valorTotalAdquisiciones: 10 } as any,
      { nombreMes: 'Feb', valorTotalAdquisiciones: 15 } as any,
      { nombreMes: 'Mar', valorTotalAdquisiciones: 20 } as any,
      { nombreMes: 'Abr', valorTotalAdquisiciones: 12 } as any,
      { nombreMes: 'May', valorTotalAdquisiciones: 25 } as any,
      { nombreMes: 'Jun', valorTotalAdquisiciones: 30 } as any
    ];
    return of({ success: true, message: 'OK', data: mockData } as unknown as ResponseDTO<DashboardAcquisitionResponseDTO[]>).pipe(delay(500));
  }
}
