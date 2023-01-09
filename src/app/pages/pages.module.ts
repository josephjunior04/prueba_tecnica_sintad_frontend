import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { EntidadComponent } from './entidad/entidad.component';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
import { TipoContribuyenteComponent } from './tipo-contribuyente/tipo-contribuyente.component';
import { TipoDocumentoDialogComponent } from './tipo-documento/tipo-documento-dialog/tipo-documento-dialog.component';
import { TipoContribuyenteDialogComponent } from './tipo-contribuyente/tipo-contribuyente-dialog/tipo-contribuyente-dialog.component';
import { EntidadDialogComponent } from './entidad/entidad-dialog/entidad-dialog.component';



@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    EntidadComponent,
    TipoDocumentoComponent,
    TipoContribuyenteComponent,
    TipoDocumentoDialogComponent,
    TipoContribuyenteDialogComponent,
    EntidadDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
