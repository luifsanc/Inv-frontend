  import { MenuResponseDTO } from "./MenuResponseDTO";
  import { PrivilegeResponseDTO } from "./PrivilegeResponseDTO";
  import { RoleDetailResponseDTO } from "./RoleDetailsResponseDTO";

export interface UserDetailsResponseDTO {
      id: number;
      username: string,
      email: string,
      firstNames: string,
      employeeId: number,
      lastModificationDate: Date,
      lastConnection: Date,
      isLoggedIn: boolean,
      active: boolean,
      suspended: boolean,
      roles: RoleDetailResponseDTO[],
      privileges: PrivilegeResponseDTO[],
      menus: MenuResponseDTO[]
      employee?: {
        identificationType?: {
          name: string,} 
      }

}
