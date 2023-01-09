import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../service/login.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formularioLogin:FormGroup

  constructor(
    private formBuilder:FormBuilder,
    private snackBar: MatSnackBar,
    private loginService:LoginService,
    private router: Router
  ) {
   }

  ngOnInit(): void {
    this.crearFormulariLogin();
  }

  crearFormulariLogin(){
    this.formularioLogin = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  validarPorCampo(campo:string){
    return this.formularioLogin.controls[campo].errors 
        && this.formularioLogin.controls[campo].touched;
  }

  login(){
    //Formulario invalido
    if(this.formularioLogin.invalid){
      this.formularioLogin.markAllAsTouched();
      this.snackBar.open("Completar campos", 'INFO', { duration: 2000 });
      return;
    }
    const usuario = this.formularioLogin.controls['username'].value;
    const contraseña = this.formularioLogin.controls['password'].value;
    this.loginService.login(usuario, contraseña).subscribe(data => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['/pages/dashboard']);
    });
  }


}
