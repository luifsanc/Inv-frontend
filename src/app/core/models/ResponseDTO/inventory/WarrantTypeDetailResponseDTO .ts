export interface WarrantTypeDetailResponseDTO {
  id: number;
  idEquipment: number;
  serialNumber: string;
  conditions: string;
  warrantyStartDate: Date | string; // Puede ser Date o string dependiendo de cómo manejes las fechas
  warrantyEndDate: Date | string;
  supportContact: string;
  warrantyStatus: boolean;
}
