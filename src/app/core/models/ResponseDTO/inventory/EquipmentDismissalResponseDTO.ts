export interface EquipmentDismissalResponseDTO
{
  id: number;

  equipmentId: number;

  equipmentBrand: string;
  equipmentModel: string;
  equipmentSerialNumber: string;
  equipmentItemCode: string;

  conditionName:string;
  statusName:string;
  categoryName:string;
  companyName:string;

  dismissalTypeId: number;
  dismissalTypeName: string;
  reason:string;

  status: boolean;
  creationDate: string;
  modificationDate: string;
}


