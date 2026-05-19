export interface UserRequestoDTO { 
    username: string;
    email: string;
    firstNames: string;
    employeeId: number;
    rolesId: [];
    privilegesId?:  [];
    menusId?:  [];
}
