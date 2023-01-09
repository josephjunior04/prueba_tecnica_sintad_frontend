import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(
    private loginService: LoginService,
    private router: Router,
    public jwtHelper: JwtHelperService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //Verificar si el usuario esta logeado
    let logged:boolean = this.loginService.isLogged();
    if(!logged){
      this.loginService.logout()
      return false
    }

    //Verificar si el token no ha expirado
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    if(this.jwtHelper.isTokenExpired(token)){
      this.loginService.logout()
      return false;
    }

    return true;


  }
}
