import { Injectable } from '@angular/core';
import { TipoDocumento } from '../pages/modelos/TipoDocumento';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService extends GenericService<TipoDocumento> {

  private tipoDocumentoChange = new Subject<TipoDocumento[]>();
  private messageChange = new Subject<string>();

  constructor(protected override http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/api/v1/tipo_documento`
    )
  }

  setMessageChange(message:string){
    this.messageChange.next(message);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setTipoDocumentoChange(tipoDocumento:TipoDocumento[]){
    this.tipoDocumentoChange.next(tipoDocumento);
  }

  getTipoDocumentoChange(){
    return this.tipoDocumentoChange.asObservable();
  }
}
