import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userData = JSON.parse(sessionStorage.getItem("storedUserData") || '{}');
  
  if (userData.token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${userData.token}` }
    });
  }
  
  return next(req);
};