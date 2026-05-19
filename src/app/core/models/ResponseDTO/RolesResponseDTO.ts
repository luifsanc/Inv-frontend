import { MenuResponseDTO } from './MenuResponseDTO';
import { PrivilegeResponseDTO } from './PrivilegeResponseDTO';

export interface RolesResponseDTO {
  id: number;
  name: string;
  description: string;
  active: boolean;
  rolePrivileges?: PrivilegeResponseDTO[];
  menus?: MenuResponseDTO[];
  applicationId: number;
  creationDate?: string;
}
