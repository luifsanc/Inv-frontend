
export interface MenuResponseDTO { 
    id?: number;
    label?: string;
    description?: string;
    route?: string;
    parentId?: number;
    active?: boolean;
    icon?: string;
    order?: number;
    creationDate?: string;
    lastModificationDate?: string;
    internalRoute?: boolean;
    applicationId?: number;
    children?: Array<MenuResponseDTO>;
}
