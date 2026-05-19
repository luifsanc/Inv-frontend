import { MenuResponseDTO } from "./MenuResponseDTO";
import { PrivilegeResponseDTO } from "./PrivilegeResponseDTO";
import { RolesResponseDTO } from "./RolesResponseDTO";

export interface UserLoginResponseDTO {
  id: number;
  username: string;
  email: string;
  firstNames: string;
  token: string;
  roles: Set<RolesResponseDTO>;
  privileges: Set<PrivilegeResponseDTO>;
  menus: Set<MenuResponseDTO>;
}
    