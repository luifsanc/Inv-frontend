import { EquipmentCharacteristicResponseDTO } from './EquipmentCharacteristicResponseDTO';
import { InvoiceDetailResponseDTO } from './InvoiceDetailResponseDTO';

export interface EquipmentDetailResponseDTO {
  id: number;
  invoice: number | null;
  warranty: number | null;
  
  equipmentStatusId: number;
  equipmentStatusName: string;

  equipmentConditionId: number;
  equipmentConditionName: string;

  categoryId: number;
  categoryName: string;
  categoryStock: number;

  companyId: number;
  companyName: string;

  characteristics: EquipmentCharacteristicResponseDTO[];

  brand: string;
  model: string;
  serialNumber: string;
  itemCode: string;

  status: boolean;
  creationDate: string; // ISO format from backend
  modificationDate: string;

  imageUrl:string | null;
}
