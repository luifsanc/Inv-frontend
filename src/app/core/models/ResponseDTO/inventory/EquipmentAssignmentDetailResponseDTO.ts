import { EmployeeCatalogResponseDTO } from "../administration/EmployeeCatalogResponseDTO";
import { CompanyResponseDTO } from "./CompanyResponseDTO";
import { ConditionResponseDTO } from "./ConditionResponseDTO";
import { EquipmentResponseDTO } from "./EquipmentResponseDTO";

export interface EquipmentAssignmentDetailResponseDTO
{
    id:number,
    employee: EmployeeCatalogResponseDTO,
    equipment: EquipmentResponseDTO,
    company: CompanyResponseDTO,
    assignmentDate: string,
    returnDate: string,
    observations?: string,
    status:boolean,
    statusId: number,
    condition?: ConditionResponseDTO,
}
