export interface InvoiceDetailRequestDTO {
  id?: number; // Opcional para creación, requerido solo para actualización
  description: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}