import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TipoContribuyente } from '../pages/modelos/TipoContribuyente';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoContribuyenteService extends GenericService<TipoContribuyente> {

  private tipoContribuyenteChange = new Subject<TipoContribuyente[]>();
  private messageChange = new Subject<string>();

  constructor(protected override http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/api/v1/tipo_contribuyente`
    )
  }

  setMessageChange(message:string){
    this.messageChange.next(message);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setTipoContribuyenteChange(tipoContribuyente:TipoContribuyente[]){
    this.tipoContribuyenteChange.next(tipoContribuyente);
  }

  getTipoContribuyenteChange(){
    return this.tipoContribuyenteChange.asObservable();
  }
}
