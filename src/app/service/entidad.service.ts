import { Injectable } from '@angular/core';
import { Entidad } from '../pages/modelos/Entidad';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntidadService extends GenericService<Entidad> {

  private entidadChange = new Subject<Entidad[]>();
  private messageChange = new Subject<string>();

  constructor(protected override http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/api/v1/entidad`
    )
  }

  setMessageChange(message:string){
    this.messageChange.next(message);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setEntidadChange(entidad:Entidad[]){
    this.entidadChange.next(entidad);
  }

  getEntidadChange(){
    return this.entidadChange.asObservable();
  }
}
