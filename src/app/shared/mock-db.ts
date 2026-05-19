export class MockDb {
  private static readonly DB_KEYS = {
    EQUIPMENTS: 'mock_db_equipments',
    EMPLOYEES: 'mock_db_employees',
    CUSTOMERS: 'mock_db_customers',
    SUPPLIERS: 'mock_db_suppliers',
    COMPANIES: 'mock_db_companies',
    USERS: 'mock_db_users',
    ROLES: 'mock_db_roles',
    PRIVILEGES: 'mock_db_privileges',
    MENUS: 'mock_db_menus',
    ASSIGNMENTS: 'mock_db_assignments',
    REPAIRS: 'mock_db_repairs',
    DISMISSALS: 'mock_db_dismissals'
  };

  private static getFromStorage<T>(key: string, defaultData: T[]): T[] {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(data);
  }

  private static saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- COMPANIES ---
  static getCompanies(): any[] {
    return this.getFromStorage(this.DB_KEYS.COMPANIES, [
      { id: 1, businessName: 'Integrity Solutions S.A.', ruc: '1792345678001', address: 'Av. Amazonas N32-120, Quito', phone: '02-3948500', status: 'Activo' },
      { id: 2, businessName: 'TMR Consultores', ruc: '1790987654001', address: 'Av. República de El Salvador, Quito', phone: '02-2849500', status: 'Activo' },
      { id: 3, businessName: 'Ecuagiros Courier', ruc: '0991234567001', address: 'Av. 9 de Octubre y Boyacá, Guayaquil', phone: '04-2567800', status: 'Activo' },
      { id: 4, businessName: 'Kruger Corporation', ruc: '1791243567001', address: 'Cumbayá, Edificio Kruger', phone: '02-3987100', status: 'Inactivo' }
    ]);
  }
  static saveCompanies(data: any[]): void { this.saveToStorage(this.DB_KEYS.COMPANIES, data); }

  // --- SUPPLIERS ---
  static getSuppliers(): any[] {
    return this.getFromStorage(this.DB_KEYS.SUPPLIERS, [
      { id: 1, businessName: 'Computron S.A.', ruc: '0990432123001', email: 'ventas@computron.com.ec', phone: '1800-266788', address: 'Av. Juan Tanca Marengo, Guayaquil', supplierType: { id: 1, name: 'Tecnología' }, status: 'Activo' },
      { id: 2, businessName: 'Sonda Ecuador S.A.', ruc: '1791321456001', email: 'contacto@sonda.com.ec', phone: '02-2983100', address: 'Av. 12 de Octubre, Quito', supplierType: { id: 1, name: 'Tecnología' }, status: 'Activo' },
      { id: 3, businessName: 'Muebles El Bosque', ruc: '1790432312001', email: 'info@elbosque.com.ec', phone: '02-2444555', address: 'Av. Galo Plaza Lasso, Quito', supplierType: { id: 2, name: 'Mobiliario' }, status: 'Activo' },
      { id: 4, businessName: 'Axxis Cloud Provider', ruc: '1798765432001', email: 'support@axxis.net', phone: '0998765432', address: 'Av. Shyris, Quito', supplierType: { id: 3, name: 'Servicios Cloud' }, status: 'Activo' }
    ]);
  }
  static saveSuppliers(data: any[]): void { this.saveToStorage(this.DB_KEYS.SUPPLIERS, data); }

  // --- CUSTOMERS ---
  static getCustomers(): any[] {
    return this.getFromStorage(this.DB_KEYS.CUSTOMERS, [
      { id: 1, businessName: 'Banco Pichincha C.A.', ruc: '1790005701001', email: 'contacto@pichincha.com', phone: '02-2999999', address: 'Av. 10 de Agosto, Quito', status: 'Activo' },
      { id: 2, businessName: 'Corporación Favorita', ruc: '1790016919001', email: 'proveedores@favorita.com', phone: '02-2997300', address: 'Av. General Enríquez, Sangolquí', status: 'Activo' },
      { id: 3, businessName: 'Produbanco Grupo Promerica', ruc: '1790074120001', email: 'info@produbanco.com.ec', phone: '02-2996000', address: 'Av. Amazonas y Nuñez de Vela, Quito', status: 'Activo' },
      { id: 4, businessName: 'Telefónica Movistar Ecuador', ruc: '1791256139001', email: 'atencion@movistar.com.ec', phone: '02-2227700', address: 'Av. República, Quito', status: 'Inactivo' }
    ]);
  }
  static saveCustomers(data: any[]): void { this.saveToStorage(this.DB_KEYS.CUSTOMERS, data); }

  // --- EMPLOYEES ---
  static getEmployees(): any[] {
    return this.getFromStorage(this.DB_KEYS.EMPLOYEES, [
      { id: 1, firstNames: 'Carlos Andres', lastNames: 'Vaca Perez', identification: '1723456789', email: 'carlos.vaca@integrity.com', phone: '0987654321', position: { id: 1, name: 'Desarrollador Senior' }, workMode: { id: 1, name: 'Híbrido' }, gender: { id: 1, name: 'Masculino' }, nationality: { id: 1, name: 'Ecuatoriana' }, status: 'Activo' },
      { id: 2, firstNames: 'Ana Maria', lastNames: 'Gomez Alvarez', identification: '1719876543', email: 'ana.gomez@integrity.com', phone: '0991234567', position: { id: 2, name: 'Product Owner' }, workMode: { id: 2, name: 'Remoto' }, gender: { id: 2, name: 'Femenino' }, nationality: { id: 1, name: 'Ecuatoriana' }, status: 'Activo' },
      { id: 3, firstNames: 'Juan Francisco', lastNames: 'Lopez Mera', identification: '0928374652', email: 'juan.lopez@integrity.com', phone: '0983456789', position: { id: 3, name: 'Diseñador UI/UX' }, workMode: { id: 3, name: 'Presencial' }, gender: { id: 1, name: 'Masculino' }, nationality: { id: 1, name: 'Ecuatoriana' }, status: 'Activo' },
      { id: 4, firstNames: 'Elena Patricia', lastNames: 'Ruiz Delgado', identification: '1712435678', email: 'elena.ruiz@integrity.com', phone: '0956789012', position: { id: 4, name: 'Scrum Master' }, workMode: { id: 1, name: 'Híbrido' }, gender: { id: 2, name: 'Femenino' }, nationality: { id: 2, name: 'Colombiana' }, status: 'Inactivo' }
    ]);
  }
  static saveEmployees(data: any[]): void { this.saveToStorage(this.DB_KEYS.EMPLOYEES, data); }

  // --- EQUIPMENTS ---
  static getEquipments(): any[] {
    return this.getFromStorage(this.DB_KEYS.EQUIPMENTS, [
      { id: 1, code: 'LAP-001', name: 'MacBook Pro M3 Max', model: 'A2991', serialNumber: 'C02FX40QMD6M', brand: 'Apple', category: { id: 1, name: 'Laptops' }, status: { id: 1, name: 'Asignado' }, condition: { id: 1, name: 'Excelente' }, purchaseDate: '2025-01-10', price: 3499.00, company: { id: 1, businessName: 'Integrity Solutions S.A.' }, supplier: { id: 1, businessName: 'Computron S.A.' }, employee: { id: 1, fullName: 'Carlos Andres Vaca Perez' }, invoiceNumber: 'FAC-2025-001', warrantyExpiration: '2027-01-10' },
      { id: 2, code: 'LAP-002', name: 'Dell XPS 15', model: '9530', serialNumber: '8X9D3M2', brand: 'Dell', category: { id: 1, name: 'Laptops' }, status: { id: 2, name: 'Disponible' }, condition: { id: 2, name: 'Excelente' }, purchaseDate: '2024-06-15', price: 1899.00, company: { id: 1, businessName: 'Integrity Solutions S.A.' }, supplier: { id: 2, businessName: 'Sonda Ecuador S.A.' }, employee: null, invoiceNumber: 'FAC-2024-118', warrantyExpiration: '2026-06-15' },
      { id: 3, code: 'MON-023', name: 'Monitor LG UltraWide 34"', model: '34WN80C-B', serialNumber: 'LG34WN80C123', brand: 'LG', category: { id: 2, name: 'Monitores' }, status: { id: 1, name: 'Asignado' }, condition: { id: 3, name: 'Bueno' }, purchaseDate: '2024-02-20', price: 499.00, company: { id: 2, businessName: 'TMR Consultores' }, supplier: { id: 1, businessName: 'Computron S.A.' }, employee: { id: 2, fullName: 'Ana Maria Gomez Alvarez' }, invoiceNumber: 'FAC-2024-045', warrantyExpiration: '2026-02-20' },
      { id: 4, code: 'MON-024', name: 'Monitor ASUS ProArt 27"', model: 'PA278QV', serialNumber: 'ASUSPA278Q99', brand: 'ASUS', category: { id: 2, name: 'Monitores' }, status: { id: 3, name: 'En Reparación' }, condition: { id: 4, name: 'Reparado' }, purchaseDate: '2024-03-05', price: 349.00, company: { id: 1, businessName: 'Integrity Solutions S.A.' }, supplier: { id: 2, businessName: 'Sonda Ecuador S.A.' }, employee: null, invoiceNumber: 'FAC-2024-052', warrantyExpiration: '2025-03-05' },
      { id: 5, code: 'CEL-008', name: 'iPhone 15 Pro 256GB', model: 'A3102', serialNumber: 'DX7G9H2K0L1M', brand: 'Apple', category: { id: 3, name: 'Móviles' }, status: { id: 5, name: 'Fuera de Servicio' }, condition: { id: 5, name: 'Dañado' }, purchaseDate: '2024-11-12', price: 1199.00, company: { id: 3, businessName: 'Ecuagiros Courier' }, supplier: { id: 1, businessName: 'Computron S.A.' }, employee: null, invoiceNumber: 'FAC-24-908', warrantyExpiration: '2025-11-12' }
    ]);
  }
  static saveEquipments(data: any[]): void { this.saveToStorage(this.DB_KEYS.EQUIPMENTS, data); }

  // --- USERS ---
  static getUsers(): any[] {
    return this.getFromStorage(this.DB_KEYS.USERS, [
      { id: 1, firstNames: 'Luis', lastNames: 'Sánchez', username: 'luis.sanchez', email: 'luis.sanchez@integritysolutions.com', active: true, roles: [{ id: 1, name: 'Administrador' }] },
      { id: 2, firstNames: 'Andres', lastNames: 'Salgado', username: 'andres.salgado', email: 'andres.salgado@integritysolutions.com', active: true, roles: [{ id: 2, name: 'Soporte TI' }] },
      { id: 3, firstNames: 'Gabriela', lastNames: 'Proaño', username: 'gabriela.proano', email: 'gabriela.proano@integritysolutions.com', active: true, roles: [{ id: 3, name: 'Consulta' }] }
    ]);
  }
  static saveUsers(data: any[]): void { this.saveToStorage(this.DB_KEYS.USERS, data); }

  // --- ROLES ---
  static getRoles(): any[] {
    return this.getFromStorage(this.DB_KEYS.ROLES, [
      { id: 1, name: 'Administrador', description: 'Acceso total a todos los módulos y configuraciones del sistema.', active: true },
      { id: 2, name: 'Soporte TI', description: 'Gestión completa de inventario, asignaciones y mantenimientos.', active: true },
      { id: 3, name: 'Consulta', description: 'Acceso exclusivo de lectura y generación de reportes.', active: true }
    ]);
  }
  static saveRoles(data: any[]): void { this.saveToStorage(this.DB_KEYS.ROLES, data); }

  // --- PRIVILEGES ---
  static getPrivileges(): any[] {
    return this.getFromStorage(this.DB_KEYS.PRIVILEGES, [
      { id: 1, name: 'VER_DASHBOARD', description: 'Visualizar resumen ejecutivo y gráficos.', active: true },
      { id: 2, name: 'CREAR_EQUIPO', description: 'Registrar nuevos equipos en el inventario.', active: true },
      { id: 3, name: 'ASIGNAR_EQUIPO', description: 'Asignar o desasignar equipos a colaboradores.', active: true },
      { id: 4, name: 'CONFIGURAR_SISTEMA', description: 'Acceder a gestión de usuarios, roles y permisos.', active: true }
    ]);
  }
  static savePrivileges(data: any[]): void { this.saveToStorage(this.DB_KEYS.PRIVILEGES, data); }

  // --- MENUS ---
  static getMenus(): any[] {
    return this.getFromStorage(this.DB_KEYS.MENUS, [
      { id: 1, label: 'Inicio', route: '/dashboard/home', icon: 'home', active: true, order: 1 },
      { id: 2, label: 'Inventario', route: '/dashboard/equipment', icon: 'inventory', active: true, order: 2 },
      { id: 3, label: 'Asignaciones', route: '/dashboard/equipment-assignment', icon: 'assignment', active: true, order: 3 },
      { id: 4, label: 'Mantenimiento', route: '/dashboard/equipment-repair', icon: 'build', active: true, order: 4 },
      { id: 5, label: 'Bajas', route: '/dashboard/equipment-dismissal', icon: 'delete', active: true, order: 5 }
    ]);
  }
  static saveMenus(data: any[]): void { this.saveToStorage(this.DB_KEYS.MENUS, data); }

  // --- REPAIRS ---
  static getRepairs(): any[] {
    return this.getFromStorage(this.DB_KEYS.REPAIRS, [
      { id: 1, equipment: { id: 4, code: 'MON-024', name: 'Monitor ASUS ProArt 27"' }, details: 'Parpadeo en pantalla y puerto HDMI dañado.', cost: 85.00, entryDate: '2026-05-10', repairDate: '2026-05-15', status: 'Reparado' },
      { id: 2, equipment: { id: 2, code: 'LAP-002', name: 'Dell XPS 15' }, details: 'Limpieza de ventiladores y cambio de pasta térmica.', cost: 45.00, entryDate: '2026-05-18', repairDate: null, status: 'En Reparación' }
    ]);
  }
  static saveRepairs(data: any[]): void { this.saveToStorage(this.DB_KEYS.REPAIRS, data); }

  // --- DISMISSALS ---
  static getDismissals(): any[] {
    return this.getFromStorage(this.DB_KEYS.DISMISSALS, [
      { id: 1, equipment: { id: 5, code: 'CEL-008', name: 'iPhone 15 Pro 256GB' }, reason: 'Pantalla rota y placa madre inservible por humedad.', date: '2026-05-12', approvedBy: 'Luis Sánchez' }
    ]);
  }
  static saveDismissals(data: any[]): void { this.saveToStorage(this.DB_KEYS.DISMISSALS, data); }

  // --- ASSIGNMENTS ---
  static getAssignments(): any[] {
    return this.getFromStorage(this.DB_KEYS.ASSIGNMENTS, [
      { id: 1, equipment: { id: 1, code: 'LAP-001', name: 'MacBook Pro M3 Max' }, employee: { id: 1, firstNames: 'Carlos Andres', lastNames: 'Vaca Perez' }, assignmentDate: '2025-01-15', observations: 'Entregado con cargador y estuche original.', status: 'Activo' },
      { id: 2, equipment: { id: 3, code: 'MON-023', name: 'Monitor LG UltraWide 34"' }, employee: { id: 2, firstNames: 'Ana Maria', lastNames: 'Gomez Alvarez' }, assignmentDate: '2024-02-22', observations: 'Entregado con cable HDMI y soporte.', status: 'Activo' }
    ]);
  }
  static saveAssignments(data: any[]): void { this.saveToStorage(this.DB_KEYS.ASSIGNMENTS, data); }
}
