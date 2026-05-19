import { NationalityResponseDTO } from '../administration/NationalityResponseDTO'
import{SupplierTypeResponseDTO}from'../inventory/SupplierTypeResponseDTO'

export interface SupplierResponseDTO {
  id: number,
	businessName: string,
	address: string,
	phone: string,
	email: string,
  ruc: string,
  supplierType:SupplierTypeResponseDTO,
  nationality:NationalityResponseDTO
}
