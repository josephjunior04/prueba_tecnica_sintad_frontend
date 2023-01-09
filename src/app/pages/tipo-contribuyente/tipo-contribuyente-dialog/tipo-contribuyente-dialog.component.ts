import { Component, OnInit, Inject } from '@angular/core';
import { TipoContribuyente } from '../../modelos/TipoContribuyente';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoContribuyenteService } from '../../../service/tipo-contribuyente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-tipo-contribuyente-dialog',
  templateUrl: './tipo-contribuyente-dialog.component.html',
  styleUrls: ['./tipo-contribuyente-dialog.component.css']
})
export class TipoContribuyenteDialogComponent implements OnInit {

  tipoContribuyente: TipoContribuyente;
  formTipoContribuyente: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : TipoContribuyente,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TipoContribuyenteDialogComponent>,
    private tipoContribuyenteService : TipoContribuyenteService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.tipoContribuyente = this.data;
    this.elegirFormulario();
  }

  crearFormulario(){
    this.formTipoContribuyente = this.formBuilder.group({
      nombre      :['', Validators.required],
      estado      :[true, Validators.required]
    })
  }

  crearFormularioParaEdicion(){
    this.formTipoContribuyente = this.formBuilder.group({
      nombre      :[this.tipoContribuyente.nombre, Validators.required],
      estado      :[this.tipoContribuyente.estado, Validators.required]
    })
  }

  elegirFormulario(){
    if(this.tipoContribuyente == undefined){
      this.crearFormulario();
      return;
    }

    this.crearFormularioParaEdicion();
  }

  validarPorCampo(campo:string){
    return this.formTipoContribuyente.controls[campo].errors 
        && this.formTipoContribuyente.controls[campo].touched;
  }

  cerrarDialogo(){
    this.dialogRef.close();
  }

  asignarTitulo(){
    if(this.tipoContribuyente == undefined){
      return "Agregar Tipo Contribuyente"
    }

    return "Editar Tipo Contribuyente"
  }

  guardarTipoContribuyente(){
    //Si el formulario es invalido
    if(this.formTipoContribuyente.invalid){
      this.snackBar.open("Completar campos", 'INFO', { duration: 2000 });
      this.formTipoContribuyente.markAllAsTouched();
      return;
    }

    //Construir el objeto Tipo Contribuyente
    const tipoContribuyente: TipoContribuyente = {
      id_tipo_contribuyente: this.tipoContribuyente == undefined ? null : this.tipoContribuyente.id_tipo_contribuyente,
      nombre: this.formTipoContribuyente.controls['nombre'].value.toUpperCase(),
      estado: this.formTipoContribuyente.controls['estado'].value
    }

    //Si vamos a agregar
    if(this.tipoContribuyente == undefined){
      this.tipoContribuyenteService.save(tipoContribuyente).pipe(
        switchMap(() => {
          return this.tipoContribuyenteService.findAll();
        })
      ).subscribe(data => {
        this.tipoContribuyenteService.setTipoContribuyenteChange(data);
        this.tipoContribuyenteService.setMessageChange("Tipo de Contribuyente agregado correctamente");
        this.cerrarDialogo();
      })
    }//Editar
    else{
      this.tipoContribuyenteService.edit(tipoContribuyente).pipe(
        switchMap(() => {
          return this.tipoContribuyenteService.findAll();
        })
      ).subscribe(data => {
        this.tipoContribuyenteService.setTipoContribuyenteChange(data);
        this.tipoContribuyenteService.setMessageChange("Tipo de Contribuyente editado correctamente");
        this.cerrarDialogo();
      })
    }
  }

}
