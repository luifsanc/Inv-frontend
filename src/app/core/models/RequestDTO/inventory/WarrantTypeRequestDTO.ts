export interface WarrantTypeRequestDTO {
  id?: number;
  id_equipment: number;
  conditions: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  supportContact: string;
}
