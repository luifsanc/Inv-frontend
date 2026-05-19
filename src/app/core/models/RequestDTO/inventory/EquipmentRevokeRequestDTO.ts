import { ConditionResponseDTO } from "../../ResponseDTO/inventory/ConditionResponseDTO";

export interface EquipmentRevokeRequestDTO
{
    revokeDate:string,
    condition: ConditionResponseDTO| null,
    observations?:string,
}
