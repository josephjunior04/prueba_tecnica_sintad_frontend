import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  usuarioLogeado:string = '';

  constructor(
    private loginService: LoginService,
    public jwtHelper: JwtHelperService
  ) { }

  ngOnInit(): void {
    const decodeToken = this.jwtHelper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME)); // token
    this.usuarioLogeado = decodeToken.user_name;
  }

  logout(){
    this.loginService.logout();
  }

}
