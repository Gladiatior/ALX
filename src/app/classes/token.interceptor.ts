import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LocalStorageService} from "../services/local-storage.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, private localdb: LocalStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.localdb.getToken()) {
      req = req.clone({
        setHeaders: {
          Authorization: this.localdb.getToken()
        }
      });
    }
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => this.handleAuthError(error)
      )
    );
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      this.localdb.goLogin();
      this.router.navigate(['/login'], {
        queryParams: {
          sessionFailed: true
        }
      });
    }
    return throwError(error);
  }
}
