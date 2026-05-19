export interface DashboardAcquisitionResponseDTO {
  numeroMes: number;
  nombreMes: string;
  conteoAdquisiciones: number;
  valorTotalAdquisiciones: number; // BigDecimal en Java lo puedes mapear a number en TS (ojo con precisión)
}
