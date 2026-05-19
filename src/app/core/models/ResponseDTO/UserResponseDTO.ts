import { MenuResponseDTO } from "./MenuResponseDTO";
import { PrivilegeResponseDTO } from "./PrivilegeResponseDTO";
import { RolesResponseDTO } from "./RolesResponseDTO";

export interface UserResponseDTO {
    id: number;
    username: string;
    email: string;
    firstNames: string;
    employeeId: number;
    lastModificationDate?: string;
    lastConnection?: string;
    active?: boolean;
    suspended?: boolean;
    roles?: Set<RolesResponseDTO>;
    privileges?: Set<PrivilegeResponseDTO>;
    menus?: Set<MenuResponseDTO>;
    loggedIn?: boolean;
}
