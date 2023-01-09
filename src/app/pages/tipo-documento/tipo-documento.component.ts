import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TipoDocumento } from '../modelos/TipoDocumento';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TipoDocumentoService } from '../../service/tipo-documento.service';
import { switchMap } from 'rxjs';
import { TipoDocumentoDialogComponent } from './tipo-documento-dialog/tipo-documento-dialog.component';

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.css']
})
export class TipoDocumentoComponent implements OnInit {

  displayedColumns: string[] = ['id_tipo_documento', 'codigo', 'nombre', 'descripcion', 'estado', 'actions'];
  documentos: TipoDocumento[];
  dataSource: MatTableDataSource<TipoDocumento>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private tipoDocumentoService: TipoDocumentoService
  ) { }

  ngOnInit(): void {
    this.tipoDocumentoService.getTipoDocumentoChange().subscribe((data) => {
      this.createTable(data);
    });

    this.tipoDocumentoService.findAll().subscribe((data) => {
      this.documentos = data;
      this.createTable(data);
    });

    this.tipoDocumentoService.getMessageChange().subscribe((data) => {
      this.snackBar.open(data, 'INFO', { duration: 3000 });
    });
  }

  createTable(data: TipoDocumento[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event:any){
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  deleteById(idTipoDocumento:number){
    this.tipoDocumentoService.delete(idTipoDocumento)
                .pipe(
                  switchMap( () => {
                    return this.tipoDocumentoService.findAll();
                  })
                ).subscribe(data => {
                  this.tipoDocumentoService.setTipoDocumentoChange(data);
                  this.tipoDocumentoService.setMessageChange("Tipo de Documento Eliminado");
                })
  }

  openDialog( tipoDocumento ?: TipoDocumento){
     this.dialog.open(TipoDocumentoDialogComponent, {
       width:'35%',
       data: tipoDocumento
     })
  }

  validarEstado(estado:boolean){
    if(estado){
      return "Habilitado"
    }
    return "Deshabilitado"
  }

}
