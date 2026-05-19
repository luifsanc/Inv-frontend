import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

    // Lista de rutas que no deben tener el token
  const excludedUrls = ['/login', '/forgot-password'];

  // Verificar si la URL coincide con alguna de las rutas excluidas
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

 if (shouldExclude) {
    return next(req);
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
