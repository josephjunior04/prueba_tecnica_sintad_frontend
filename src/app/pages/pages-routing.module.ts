import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EntidadComponent } from './entidad/entidad.component';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
import { TipoContribuyenteComponent } from './tipo-contribuyente/tipo-contribuyente.component';
import { GuardService } from '../service/guard.service';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate:[GuardService]
    },
    {
        path: 'entidad',
        component: EntidadComponent,
        canActivate:[GuardService]
    },
    {
        path: 'tipo-documento',
        component: TipoDocumentoComponent,
        canActivate:[GuardService]
    },
    {
        path: 'tipo-contribuyente',
        component: TipoContribuyenteComponent,
        canActivate:[GuardService]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule{

}