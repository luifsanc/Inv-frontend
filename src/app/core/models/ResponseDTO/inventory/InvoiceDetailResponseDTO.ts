export interface InvoiceDetailResponseDTO {
  id: number;
  description: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  supplierId: number;
  supplier: string;
  invoiceDate: string;
  invoiceNumber: string;
  status: boolean;
  creationDate: string;
  modificationDate: string;
}
