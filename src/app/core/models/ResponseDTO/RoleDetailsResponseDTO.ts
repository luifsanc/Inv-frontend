import { MenuResponseDTO } from './MenuResponseDTO';
import { PrivilegeResponseDTO } from './PrivilegeResponseDTO';

export interface RoleDetailResponseDTO {
  id: number;
  name: string;
  description: string;
  active: boolean;
  rolePrivileges?:  Set<PrivilegeResponseDTO>;
  menus?: Set<MenuResponseDTO>;
  applicationId:number;
  creationDate: string;
}
