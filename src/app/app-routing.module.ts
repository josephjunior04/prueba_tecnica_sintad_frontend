import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { GuardService } from './service/guard.service';


const routes : Routes = [
     {
         path: 'login',
         component: LoginComponent
      },
      {
         path: '',
         redirectTo: 'login',
         pathMatch: 'full'
      },
      {
         path: 'pages',
         component: LayoutComponent,
         loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
      }
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule{}