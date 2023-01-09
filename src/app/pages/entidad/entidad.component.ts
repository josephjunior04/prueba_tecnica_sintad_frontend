import { Component, OnInit, ViewChild } from '@angular/core';
import { Entidad } from '../modelos/Entidad';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EntidadService } from '../../service/entidad.service';
import { switchMap } from 'rxjs';
import { EntidadDialogComponent } from './entidad-dialog/entidad-dialog.component';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.css']
})
export class EntidadComponent implements OnInit {

  displayedColumns: string[] = ['id_entidad', 'nro_documento', 'razon_social', 'nombre_comercial', 'estado', 'acciones'];
  entidades: Entidad[];
  dataSource: MatTableDataSource<Entidad>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private entidadService: EntidadService
  ) { }

  ngOnInit(): void {
    this.entidadService.getEntidadChange().subscribe((data) => {
      this.createTable(data);
    });

    this.entidadService.findAll().subscribe((data) => {
      this.entidades = data;
      this.createTable(data);
    });

    this.entidadService.getMessageChange().subscribe((data) => {
      this.snackBar.open(data, 'INFO', { duration: 3000 });
    });
  }

  createTable(data: Entidad[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event:any){
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  deleteById(idEntidad:number){
    this.entidadService.delete(idEntidad)
                .pipe(
                  switchMap( () => {
                    return this.entidadService.findAll();
                  })
                ).subscribe(data => {
                  this.entidadService.setEntidadChange(data);
                  this.entidadService.setMessageChange("Entidad Eliminada");
                })
  }

  openDialog( entidad ?: Entidad){
     this.dialog.open(EntidadDialogComponent, {
       width:'35%',
       data: entidad
     })
  }

  validarEstado(estado:boolean){
    if(estado){
      return "Habilitado"
    }
    return "Deshabilitado"
  }

}
