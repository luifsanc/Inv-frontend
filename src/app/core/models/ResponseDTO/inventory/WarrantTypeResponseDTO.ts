export interface WarrantTypeResponseDTO {
  id: number;
  id_equipment: number;
  conditions: string;
  warrantyStartDate: string; // ISO format string (LocalDateTime)
  warrantyEndDate: string;   // ISO format string (LocalDateTime)
  SupportContact: string;
}
