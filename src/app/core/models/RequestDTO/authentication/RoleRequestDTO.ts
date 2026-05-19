export interface RoleRequestDTO {
  name: string;
  description?: string;
  applicationId: number;
  privilegesId?: Set<number>;
  menusId?: Set<number>;
}
