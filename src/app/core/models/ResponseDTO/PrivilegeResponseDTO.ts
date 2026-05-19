export interface PrivilegeResponseDTO {
  id: number;
  key: string;
  active: boolean;
  applicationId:number;
  creationDate: string;
  lastModificationDate?: string;
}
