import { NationalityResponseDTO } from "../../ResponseDTO/administration/NationalityResponseDTO";
import { SupplierTypeResponseDTO } from "../../ResponseDTO/inventory/SupplierTypeResponseDTO";

export interface SupplierRequestDTO
{
  id?: number,
	businessName: string,
	address: string,
	phone: string,
  ruc: string,
	email: string,
  supplierType:SupplierTypeResponseDTO,
  nationality: NationalityResponseDTO,
}
