export interface EmployeeRequestDTO {
  idIdentificationType: number;  // requerido
  idGender: number;              // requerido
  idPosition: number;            // requerido
  idWorkMode: number;            // requerido
  idNationality: number;         // requerido

  firstName: string;             // requerido, max 80
  lastName: string;              // requerido, max 80
  identification: string;        // requerido, max 13

  phone?: string;                // opcional, patrón: dígitos/espacios/guiones (7 a 10 caracteres)
  email?: string;                // opcional, válido como email, max 100
  address?: string;              // opcional, max 255

  contractDate: string;          // requerido (formato ISO string: 'YYYY-MM-DD')
  contractEndDate?: string;      // opcional (ISO string)
}
