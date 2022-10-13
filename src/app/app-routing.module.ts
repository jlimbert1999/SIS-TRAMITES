import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { HomeRoutingModule } from './home/home-routing.module';
import { PageNoFoundComponent } from './page-no-found/page-no-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home/tramites-internos', pathMatch: 'full' },
  { path: '**', redirectTo: '/home/tramites-internos' }
];




@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    HomeRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
