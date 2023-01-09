import { Component, OnInit, Inject } from '@angular/core';
import { TipoDocumento } from '../../modelos/TipoDocumento';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoDocumentoService } from '../../../service/tipo-documento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-tipo-documento-dialog',
  templateUrl: './tipo-documento-dialog.component.html',
  styleUrls: ['./tipo-documento-dialog.component.css']
})
export class TipoDocumentoDialogComponent implements OnInit {

  tipoDocumento: TipoDocumento;
  formTipoDocumento: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : TipoDocumento,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TipoDocumentoDialogComponent>,
    private tipoDocumentoService : TipoDocumentoService,
    private snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.tipoDocumento = this.data;
    this.elegirFormulario();
  }

  crearFormulario(){
    this.formTipoDocumento = this.formBuilder.group({
      codigo      :['', Validators.required],
      nombre      :['', Validators.required],
      descripcion :['', Validators.required],
      estado      :[true, Validators.required]
    })
  }

  crearFormularioParaEdicion(){
    this.formTipoDocumento = this.formBuilder.group({
      codigo      :[this.tipoDocumento.codigo, Validators.required],
      nombre      :[this.tipoDocumento.nombre, Validators.required],
      descripcion :[this.tipoDocumento.descripcion, Validators.required],
      estado      :[this.tipoDocumento.estado, Validators.required]
    })
  }

  elegirFormulario(){
    if(this.tipoDocumento == undefined){
      this.crearFormulario();
      return;
    }

    this.crearFormularioParaEdicion();
  }

  validarPorCampo(campo:string){
    return this.formTipoDocumento.controls[campo].errors 
        && this.formTipoDocumento.controls[campo].touched;
  }

  cerrarDialogo(){
    this.dialogRef.close();
  }

  guardarTipoDocumento(){
    //Si el formulario es invalido
    if(this.formTipoDocumento.invalid){
      this.snackBar.open("Completar campos", 'INFO', { duration: 2000 });
      this.formTipoDocumento.markAllAsTouched();
      return;
    }

    //Construir el objeto Tipo Documento
    const tipoDocumento: TipoDocumento = {
      id_tipo_documento: this.tipoDocumento == undefined ? null : this.tipoDocumento.id_tipo_documento,
      codigo: this.formTipoDocumento.controls['codigo'].value,
      nombre: this.formTipoDocumento.controls['nombre'].value.toUpperCase(),
      descripcion: this.formTipoDocumento.controls['descripcion'].value.toUpperCase(),
      estado: this.formTipoDocumento.controls['estado'].value
    }

    //Si vamos a agregar
    if(this.tipoDocumento == undefined){
      this.tipoDocumentoService.save(tipoDocumento).pipe(
        switchMap(() => {
          return this.tipoDocumentoService.findAll();
        })
      ).subscribe(data => {
        this.tipoDocumentoService.setTipoDocumentoChange(data);
        this.tipoDocumentoService.setMessageChange("Tipo de Documento agregado correctamente");
        this.cerrarDialogo();
      })
    }//Editar
    else{
      this.tipoDocumentoService.edit(tipoDocumento).pipe(
        switchMap(() => {
          return this.tipoDocumentoService.findAll();
        })
      ).subscribe(data => {
        this.tipoDocumentoService.setTipoDocumentoChange(data);
        this.tipoDocumentoService.setMessageChange("Tipo de Documento editado correctamente");
        this.cerrarDialogo();
      })
    }
  }

  asignarTitulo(){
    if(this.tipoDocumento == undefined){
      return "Agregar Tipo Documento"
    }

    return "Editar Tipo Documento"
  }

}
