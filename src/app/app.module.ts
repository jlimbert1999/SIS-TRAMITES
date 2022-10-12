import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { AuthModule } from './auth/auth.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginService } from './auth/services/login.service';
import { ConfiguracionesModule } from './configuraciones/configuraciones.module';
import { PageNoFoundComponent } from './page-no-found/page-no-found.component';
import { SharedModule } from './shared/shared.module';
import { TramitesModule } from './tramites/tramites.module';

import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNoFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ToastrModule.forRoot(), // ToastrModule added

    //modulos creados en subcarpetas
    AuthModule,
    ConfiguracionesModule,
    SharedModule,
    TramitesModule
    

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoginService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
