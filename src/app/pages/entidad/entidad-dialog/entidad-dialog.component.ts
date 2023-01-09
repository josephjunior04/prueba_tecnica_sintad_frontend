import { Component, OnInit, Inject } from '@angular/core';
import { Entidad } from '../../modelos/Entidad';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntidadService } from '../../../service/entidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, switchMap } from 'rxjs';
import { TipoDocumento } from '../../modelos/TipoDocumento';
import { TipoContribuyente } from '../../modelos/TipoContribuyente';
import { TipoDocumentoService } from '../../../service/tipo-documento.service';
import { TipoContribuyenteService } from '../../../service/tipo-contribuyente.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-entidad-dialog',
  templateUrl: './entidad-dialog.component.html',
  styleUrls: ['./entidad-dialog.component.css']
})
export class EntidadDialogComponent implements OnInit {

  entidad: Entidad;
  formEntidad: FormGroup;

  tipoDocuments$ : Observable<TipoDocumento[]>;
  tipoContribuyente$ : Observable<TipoContribuyente[]>;

  existeNroDocumento: boolean = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) private data : Entidad,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EntidadDialogComponent>,
    private entidadService : EntidadService,
    private snackBar: MatSnackBar,
    private tipoDocumentoService: TipoDocumentoService,
    private tipoContribuyenteService: TipoContribuyenteService
  ) { }

  ngOnInit(): void {
    this.entidad = this.data;
    this.elegirFormulario();
    this.obtenerTipoContribuyentes();
    this.obtenerTipoDocumentos();
  }

  obtenerTipoDocumentos(){
    this.tipoDocuments$ = this.tipoDocumentoService.findAll();
  }

  obtenerTipoContribuyentes(){
    this.tipoContribuyente$ = this.tipoContribuyenteService.findAll();
  }

  crearFormulario(){
    this.formEntidad = this.formBuilder.group({
      tipoDocumento     :['', Validators.required],
      nro_documento     :['', Validators.required],
      razon_social      :['', Validators.required],
      nombre_comercial  :['', []],
      tipoContribuyente :['', Validators.required],
      direccion         :['', Validators.required],
      telefono          :['', []],
      estado            :[true, Validators.required]
    })
  }

  crearFormularioParaEdicion(){
    this.formEntidad = this.formBuilder.group({
      tipoDocumento     :[this.entidad.tipoDocumento.id_tipo_documento, Validators.required],
      nro_documento     :[this.entidad.nro_documento, Validators.required],
      razon_social      :[this.entidad.razon_social, Validators.required],
      nombre_comercial  :[this.entidad.nombre_comercial, []],
      tipoContribuyente :[this.entidad.tipoContribuyente.id_tipo_contribuyente, Validators.required],
      direccion         :[this.entidad.direccion, Validators.required],
      telefono          :[this.entidad.telefono, []],
      estado            :[this.entidad.estado, Validators.required]
    })
  }

  elegirFormulario(){
    if(this.entidad == undefined){
      this.crearFormulario();
      return;
    }

    this.crearFormularioParaEdicion();
  }

  validarPorCampo(campo:string){
    return this.formEntidad.controls[campo].errors 
        && this.formEntidad.controls[campo].touched;
  }

  cerrarDialogo(){
    this.dialogRef.close();
  }

  guardarEntidad(){
    //Si el formulario esta invalido
    if(this.formEntidad.invalid){
      this.snackBar.open("Completar campos", 'INFO', { duration: 2000 });
      this.formEntidad.markAllAsTouched();
      return;
    }

    //Verificar si el Numero de documento ya existe
    this.validarNumeroDocumento()
    if(this.existeNroDocumento){
      this.snackBar.open("El numero de documento ya existe", 'INFO', { duration: 2000 });
      return;
    }

    //Primero creamos el objeto tipo Documento
    let tipoDocumento: TipoDocumento = new TipoDocumento();
    tipoDocumento.id_tipo_documento = this.formEntidad.controls['tipoDocumento'].value

    //Creamos el objeto de tipo Contribuyente
    let tipoContribuyente: TipoContribuyente = new TipoContribuyente();
    tipoContribuyente.id_tipo_contribuyente = this.formEntidad.controls['tipoContribuyente'].value

    //Creamos el objeto entidad
    let entidadObjeto : Entidad = new Entidad();
    entidadObjeto.id_entidad        = this.entidad == undefined ? null : this.entidad.id_entidad
    entidadObjeto.tipoDocumento     = tipoDocumento;
    entidadObjeto.nro_documento     = this.formEntidad.controls['nro_documento'].value;
    entidadObjeto.razon_social      = this.formEntidad.controls['razon_social'].value.toUpperCase();
    entidadObjeto.nombre_comercial  = this.formEntidad.controls['nombre_comercial'].value.toUpperCase();
    entidadObjeto.tipoContribuyente = tipoContribuyente;
    entidadObjeto.direccion         = this.formEntidad.controls['direccion'].value.toUpperCase();
    entidadObjeto.telefono          = this.formEntidad.controls['telefono'].value;
    entidadObjeto.estado            = this.formEntidad.controls['estado'].value;

    //Si vamos a agregar
    if(this.entidad == undefined){
      this.entidadService.save(entidadObjeto).pipe(
        switchMap(() => {
          return this.entidadService.findAll();
        })
      ).subscribe(data => {
        this.entidadService.setEntidadChange(data);
        this.entidadService.setMessageChange("Entidad agregada correctamente");
        this.cerrarDialogo();
      })
    }//Editar
    else{
      this.entidadService.edit(entidadObjeto).pipe(
        switchMap(() => {
          return this.entidadService.findAll();
        })
      ).subscribe(data => {
        this.entidadService.setEntidadChange(data);
        this.entidadService.setMessageChange("Entidad editada correctamente");
        this.cerrarDialogo();
      })
    }
  }

  asignarTitulo(){
    if(this.entidad == undefined){
      return "Agregar Entidad"
    }

    return "Editar Entidad"
  }


  validarNumeroDocumento(){

    let nro_documento = this.formEntidad.controls['nro_documento'].value


    this.entidadService.findAll().subscribe(data => {
      let arregloDocumentos = data.map(element => element.nro_documento);
      if(arregloDocumentos.includes(nro_documento)){
        this.existeNroDocumento = true;
      }else{
        this.existeNroDocumento = false;
      }
      
    })

  }

}
