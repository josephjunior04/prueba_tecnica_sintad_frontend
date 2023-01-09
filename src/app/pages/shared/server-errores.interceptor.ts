import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap, catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';



@Injectable({
    providedIn: 'root'
})
export class ServerErroresInterceptor implements HttpInterceptor {

    constructor(private snackBar: MatSnackBar, private router : Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(environment.REINTENTOS))
            .pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        throw new Error(event.body.errorMessage);
                    }
                }
                //variable err tiene el response json del backend
            })).pipe(catchError((err) => {     
                console.log(err);  
                if (err.status === 400) {
                    console.log(err);
                    this.snackBar.open("Credenciales incorrectas", 'ERROR 400', { duration: 5000 });
                }
                else if (err.status === 404){
                    this.snackBar.open('No existe el recurso', 'ERROR 404', { duration: 5000 });
                }
                else if (err.status === 403 || err.status === 401) {
                    console.log(err);
                    this.snackBar.open(err.error.error_description, 'ERROR 403', { duration: 5000 });

                }
                else if (err.status === 500) {                    
                    this.snackBar.open(err.error.mensaje, 'ERROR 500', { duration: 5000 });
                } else {
                    this.snackBar.open(err.error.mensaje, 'ERROR', { duration: 5000 });
                }
                return EMPTY;
            }));
    }
}