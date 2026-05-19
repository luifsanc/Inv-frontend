import { EquipmentCharacteristicRequestDTO } from "./EquipmentCharacteristicRequestDTO";

export interface EquipmentRequestDTO {
  condition: number; // id de la condición del equipo (obligatorio)
  categoryId?: number; // opcional si se crea nueva categoría
  categoryName: string; // nombre de la categoría (obligatorio)
  company: number; // id de la empresa (obligatorio)
  equipmentCharacteristics: EquipmentCharacteristicRequestDTO[]; // lista de características
  brand: string;
  model: string;
  serialNumber: string;
  itemCode: string;
}
