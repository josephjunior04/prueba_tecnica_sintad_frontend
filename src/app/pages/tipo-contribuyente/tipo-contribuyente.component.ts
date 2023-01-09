import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoContribuyente } from '../modelos/TipoContribuyente';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TipoContribuyenteService } from '../../service/tipo-contribuyente.service';
import { switchMap } from 'rxjs';
import { TipoContribuyenteDialogComponent } from './tipo-contribuyente-dialog/tipo-contribuyente-dialog.component';

@Component({
  selector: 'app-tipo-contribuyente',
  templateUrl: './tipo-contribuyente.component.html',
  styleUrls: ['./tipo-contribuyente.component.css']
})
export class TipoContribuyenteComponent implements OnInit {

  displayedColumns: string[] = ['id_tipo_contribuyente','nombre', 'estado', 'actions'];
  tipoContribuyentes: TipoContribuyente[];
  dataSource: MatTableDataSource<TipoContribuyente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private tipoContribuyenteService: TipoContribuyenteService
  ) { }

  ngOnInit(): void {
    this.tipoContribuyenteService.getTipoContribuyenteChange().subscribe((data) => {
      this.createTable(data);
    });

    this.tipoContribuyenteService.findAll().subscribe((data) => {
      this.tipoContribuyentes = data;
      this.createTable(data);
    });

    this.tipoContribuyenteService.getMessageChange().subscribe((data) => {
      this.snackBar.open(data, 'INFO', { duration: 3000 });
    });
  }

  createTable(data: TipoContribuyente[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event:any){
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  deleteById(idTipoDocumento:number){
    this.tipoContribuyenteService.delete(idTipoDocumento)
                .pipe(
                  switchMap( () => {
                    return this.tipoContribuyenteService.findAll();
                  })
                ).subscribe(data => {
                  this.tipoContribuyenteService.setTipoContribuyenteChange(data);
                  this.tipoContribuyenteService.setMessageChange("Tipo de Contribuyente Eliminado");
                })
  }

  openDialog( tipoContribuyente ?: TipoContribuyente){
     this.dialog.open(TipoContribuyenteDialogComponent, {
       width:'35%',
       data: tipoContribuyente
     })
  }

  validarEstado(estado:boolean){
    if(estado){
      return "Habilitado"
    }
    return "Deshabilitado"
  }

}
