import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { NotifyService } from './notify.service';
import { LoggingService } from './logging/loggin.service';

@Injectable()
export class AuthService {
    baseAuthUrl = environment.backend['baseAuthUrl'];
    TOKEN_KEY = 'token';
    DATA_KEY = 'userInfo';
    userData: any;

    constructor(
        private http: HttpClient,
        private notifyService: NotifyService,
        private logger: LoggingService) { }

    get token() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    get isAuthenticated() {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    userInfo(): any {
        if (!this.userData) {
            this.userData = JSON.parse(localStorage.getItem(this.DATA_KEY));
        }
        return Observable.of(this.userData);
    }

    loginUser(userData): Observable<any> {
        this.userData = null;
        const body = userData;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const options = new HttpResponse({ headers: headers });
        return this.http.post<any>(this.baseAuthUrl + 'login', userData).map(res => {
            this.userData = res.userData;
            this.logger.info(JSON.stringify(res.userData.email) + ' has been logged in');
            this.saveUserData(res.userData);
            this.saveToken(res.token);
            this.notifyService.notify('You have been successfully logged in', null, {
                duration: 4000,
                panelClass: ['snack-success']
            });
            return true;
        }, (err) => {
            this.notifyService.notify(err.error.message, null, {
                duration: 4000,
                panelClass: ['snack-denied']
            });
            return false;
        });
    }

    logout(): boolean {
        try {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.DATA_KEY);
            if (this.userData) {
                this.logger.info(JSON.stringify(this.userData.email) + ' has been logged out');
                this.userData = null;
            }
            return true;
        } catch (err) {
            console.error('server error:', err);
            return false;
        }
    }

    registerUser(userData): Observable<any> {
        this.userData = null;
        const body = userData;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const options = new HttpResponse({ headers: headers });
        return this.http.post<any>(this.baseAuthUrl + 'register', body, options).map(res => {
            this.logger.info(JSON.stringify(userData.email) + ' registered');
            this.saveToken(res.token);
            this.saveUserData(res.userData);
            this.notifyService.notify(`Email has been sent to ${userData.email}`, null, {
                duration: 4000,
                panelClass: ['snack-success']
            });
            return true;
        }, (err) => {
            this.notifyService.notify(err.error.message, null, {
                duration: 4000,
                panelClass: ['snack-denied']
            });
            return err;
        });
    }

    private saveToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    private saveUserData(data) {
        localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
    }

    private handleError(error: any) {
        console.error('server error:', error);
        this.logger.error(JSON.stringify(error));
        if (error instanceof HttpResponse) {
            let errMessage = '';
            try {
                errMessage = error.statusText;
            } catch (err) {
                errMessage = error.statusText;
            }
            return Observable.throw(errMessage);
        }
        return Observable.throw(error || 'json server error');
    }

}
