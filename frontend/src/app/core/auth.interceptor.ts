import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '@services/auth.service';
import { environment } from '@env/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authService = this.injector.get(AuthService);
        if (req.url.indexOf('github') > -1) {
            req = req.clone({
                setHeaders: {
                  Authorization: `Basic ${btoa(environment.github.userName + ':' + environment.github.token)}`
                }
              });
            return next.handle(req);
        }
        const authRequest = req.clone({
            // tslint:disable-next-line:max-line-length
            headers: req.headers.set('Authorization', 'token ' + authService.token)
        });

        return next.handle(authRequest);
    }
}
