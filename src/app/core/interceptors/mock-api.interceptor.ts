import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { MockDb } from '../../shared/mock-db';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  const method = req.method;

  // --- CATALOGS ---
  if (url.includes('/nationality/getSimpleList')) {
    const list = [
      { id: 1, name: 'Ecuatoriana' },
      { id: 2, name: 'Colombiana' },
      { id: 3, name: 'Venezolana' },
      { id: 4, name: 'Española' }
    ];
    return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
  }

  if (url.includes('/position/getSimpleList')) {
    const list = [
      { id: 1, name: 'Desarrollador Senior' },
      { id: 2, name: 'Product Owner' },
      { id: 3, name: 'Diseñador UI/UX' },
      { id: 4, name: 'Scrum Master' },
      { id: 5, name: 'QA Engineer' }
    ];
    return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
  }

  if (url.includes('/gender/getSimpleList')) {
    const list = [
      { id: 1, name: 'Masculino' },
      { id: 2, name: 'Femenino' },
      { id: 3, name: 'Otro' }
    ];
    return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
  }

  if (url.includes('/identification-type/getSimpleList')) {
    const list = [
      { id: 1, name: 'Cédula' },
      { id: 2, name: 'Pasaporte' },
      { id: 3, name: 'RUC' }
    ];
    return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
  }

  if (url.includes('/workMode/getSimpleList')) {
    const list = [
      { id: 1, name: 'Híbrido' },
      { id: 2, name: 'Remoto' },
      { id: 3, name: 'Presencial' }
    ];
    return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
  }

  if (url.includes('/conditions/getSimpleList') || url.includes('/conditions')) {
    const list = [
      { id: 1, name: 'Excelente' },
      { id: 2, name: 'Bueno' },
      { id: 3, name: 'Regular' },
      { id: 4, name: 'Dañado' },
      { id: 5, name: 'Reparado' }
    ];
    return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
  }

  // --- COMPANIES ---
  if (url.includes('/companies/simple') || url.includes('/companies')) {
    const list = MockDb.getCompanies();
    if (method === 'GET') {
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
    }
  }

  // --- SUPPLIERS ---
  if (url.includes('/suppliers')) {
    let list = MockDb.getSuppliers();
    if (method === 'GET') {
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
    }
    if (method === 'POST') {
      const entity = req.body as any;
      entity.id = list.length + 1;
      entity.status = 'Activo';
      list.push(entity);
      MockDb.saveSuppliers(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Creado' }, data: entity } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/update/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      const entity = req.body as any;
      list = list.map(item => item.id === id ? { ...item, ...entity } : item);
      MockDb.saveSuppliers(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Actualizado' }, data: list } })).pipe(delay(200));
    }
    if (method === 'DELETE' && url.includes('/inactive/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      list = list.map(item => item.id === id ? { ...item, status: 'Inactivo' } : item);
      MockDb.saveSuppliers(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Inactivado' }, data: null } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/activate/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      list = list.map(item => item.id === id ? { ...item, status: 'Activo' } : item);
      MockDb.saveSuppliers(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Activado' }, data: null } })).pipe(delay(200));
    }
  }

  // --- CUSTOMERS ---
  if (url.includes('/customers')) {
    let list = MockDb.getCustomers();
    if (method === 'GET') {
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
    }
    if (method === 'POST' && url.includes('/save')) {
      const entity = req.body as any;
      entity.id = list.length + 1;
      entity.status = 'Activo';
      list.push(entity);
      MockDb.saveCustomers(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Creado' }, data: entity } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/update/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      const entity = req.body as any;
      list = list.map(item => item.id === id ? { ...item, ...entity } : item);
      MockDb.saveCustomers(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Actualizado' }, data: list } })).pipe(delay(200));
    }
    if (method === 'DELETE' && url.includes('/inactive/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      list = list.map(item => item.id === id ? { ...item, status: 'Inactivo' } : item);
      MockDb.saveCustomers(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Inactivado' }, data: null } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/activate/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      list = list.map(item => item.id === id ? { ...item, status: 'Activo' } : item);
      MockDb.saveCustomers(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Activado' }, data: null } })).pipe(delay(200));
    }
  }

  // --- EMPLOYEES ---
  if (url.includes('/employee')) {
    let list = MockDb.getEmployees();
    if (method === 'GET' && (url.includes('/getSimpleList') || url.includes('/getTable'))) {
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
    }
    if (method === 'POST' && url.includes('/save')) {
      const entity = req.body as any;
      entity.id = list.length + 1;
      entity.status = 'Activo';
      // Mapear catálogos
      entity.position = entity.positionId ? { id: entity.positionId, name: 'Puesto ' + entity.positionId } : entity.position;
      entity.workMode = entity.workModeId ? { id: entity.workModeId, name: 'Modalidad ' + entity.workModeId } : entity.workMode;
      list.push(entity);
      MockDb.saveEmployees(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Creado' }, data: entity } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/update/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      const entity = req.body as any;
      list = list.map(item => item.id === id ? { ...item, ...entity } : item);
      MockDb.saveEmployees(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Actualizado' }, data: list } })).pipe(delay(200));
    }
    if (method === 'DELETE' && url.includes('/inactive/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      list = list.map(item => item.id === id ? { ...item, status: 'Inactivo' } : item);
      MockDb.saveEmployees(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Inactivado' }, data: null } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/activate/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      list = list.map(item => item.id === id ? { ...item, status: 'Activo' } : item);
      MockDb.saveEmployees(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Activado' }, data: null } })).pipe(delay(200));
    }
  }

  // --- EQUIPMENTS ---
  if (url.includes('/equipment')) {
    let list = MockDb.getEquipments();
    if (method === 'GET' && (url.includes('/simple') || url === req.url.split('?')[0] && url.endsWith('/equipment'))) {
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
    }
    if (method === 'GET' && url.includes('/detail/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      const equipment = list.find(item => item.id === id) || list[0];
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: equipment } })).pipe(delay(200));
    }
    if (method === 'POST' && url.includes('/save')) {
      const entity = req.body as any;
      entity.id = list.length + 1;
      entity.code = 'EQP-' + String(entity.id).padStart(3, '0');
      entity.status = { id: 2, name: 'Disponible' };
      list.push(entity);
      MockDb.saveEquipments(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Creado' }, data: entity } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/update/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      const entity = req.body as any;
      list = list.map(item => item.id === id ? { ...item, ...entity } : item);
      MockDb.saveEquipments(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Actualizado' }, data: list } })).pipe(delay(200));
    }
    if (method === 'PATCH' && url.includes('/inactive/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      list = list.map(item => item.id === id ? { ...item, status: { id: 5, name: 'Fuera de Servicio' } } : item);
      MockDb.saveEquipments(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Desactivado' }, data: null } })).pipe(delay(200));
    }
    if (method === 'PATCH' && url.includes('/activate/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      list = list.map(item => item.id === id ? { ...item, status: { id: 2, name: 'Disponible' } } : item);
      MockDb.saveEquipments(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Activado' }, data: null } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/setWarranty/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      const warranty = req.body as any;
      list = list.map(item => item.id === id ? { ...item, warrantyExpiration: warranty.warrantyExpirationDate } : item);
      MockDb.saveEquipments(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Garantía guardada' }, data: warranty } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/setInvoice/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      const invoice = req.body as any;
      list = list.map(item => item.id === id ? { ...item, invoiceNumber: invoice.invoiceNumber } : item);
      MockDb.saveEquipments(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Factura guardada' }, data: invoice } })).pipe(delay(200));
    }
    if (method === 'PUT' && url.includes('/changeStatus/')) {
      const segments = url.split('/');
      const id = parseInt(segments[segments.length - 1]);
      const statusData = req.body as any;
      list = list.map(item => item.id === id ? { ...item, status: { id: statusData.statusId, name: 'Estado ' + statusData.statusId } } : item);
      MockDb.saveEquipments(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Estado modificado' }, data: null } })).pipe(delay(200));
    }
  }

  // --- SETTINGS (USERS, ROLES, PERMISSIONS, MENUS) ---
  if (url.includes('/users') || url.includes('/user')) {
    let list = MockDb.getUsers();
    if (method === 'GET') {
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
    }
    if (method === 'POST') {
      const entity = req.body as any;
      entity.id = list.length + 1;
      entity.active = true;
      list.push(entity);
      MockDb.saveUsers(list);
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Creado' }, data: entity } })).pipe(delay(200));
    }
  }

  if (url.includes('/roles') || url.includes('/role')) {
    let list = MockDb.getRoles();
    if (method === 'GET') {
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
    }
  }

  if (url.includes('/privilege')) {
    let list = MockDb.getPrivileges();
    if (method === 'GET') {
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
    }
  }

  if (url.includes('/menu')) {
    let list = MockDb.getMenus();
    if (method === 'GET') {
      return of(new HttpResponse({ status: 200, body: { meta: { message: 'Ok' }, data: list } })).pipe(delay(200));
    }
  }

  // Default passthrough
  return next(req);
};
