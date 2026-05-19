
export interface EquipmentRepairRequestDTO {
    equipment: number;
    description: string;
    cost: number;
    revoke: boolean;
    serviceProviderId: number | null;

}
