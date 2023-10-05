import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';
import { AuthService } from '../services/auth.service';
@Injectable()
export class CustomHttpErrorInterceptor implements HttpInterceptor {

  constructor(private nbToastService: NbToastrService,private auth:AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorHttpRequest: HttpErrorResponse) => {
        let errorMsg = '';
        let config = { status: 'danger', duration: 5000 };
      
        errorMsg = JSON.stringify(errorHttpRequest.error);
        if ('code' in errorHttpRequest.error && errorHttpRequest.error['code'] == 'token_not_valid') {
          console.log("Token Refresh required")
          console.log(JSON.stringify(errorHttpRequest.error))
          if(errorHttpRequest.error['detail']=='Token is invalid or expired'){
            this.auth.logout();
          }
          // this.auth.logout();
          return throwError(errorHttpRequest);
        }
        if (errorHttpRequest.error instanceof ErrorEvent) {
          // errorMsg = `Error: ${errorHttpRequest.error.message}`;
          this.nbToastService.show(errorMsg, 'Client Side Error', config);
        }
        else {
          // errorMsg = `Error Code: ${errorHttpRequest.status},  Message: ${errorHttpRequest.message}`;

          this.nbToastService.show(errorMsg, 'Server Side Error', config);
        }

        console.log(errorMsg);
        // return throwError(errorMsg);
        return throwError(errorHttpRequest);
      })
    );
  }
}