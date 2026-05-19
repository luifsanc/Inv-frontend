import { InvoiceDetailRequestDTO } from "./InvoiceDetailRequestDTO";

export interface InvoiceRequestDTO{
    id:number;
    invoiceDetail: InvoiceDetailRequestDTO;
    invoiceDate: string;
    invoiceNumber: string;
    supplier: number;
    

} 