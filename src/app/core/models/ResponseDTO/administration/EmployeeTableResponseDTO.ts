export interface EmployeeTableResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  address:string,
  email: string;
  phone: string;
  status: boolean;
  identificationType: string;
  identification: string;
  contractDate: string;       // ISO string: '2025-06-23T00:00:00'
  contractEndDate: string;    // ISO string: '2025-12-31T00:00:00'
}
