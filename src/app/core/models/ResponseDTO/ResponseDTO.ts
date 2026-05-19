import { MetadataResponseDTO } from "./MetadataResponseDTO";

export interface ResponseDTO<T> { 
    meta: MetadataResponseDTO;
    data: T;
}

