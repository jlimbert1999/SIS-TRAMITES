import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminitracionTramitesComponent } from './adminitracion-tramites/adminitracion-tramites.component';
import { DialogRegistroTramiteComponent } from './adminitracion-tramites/dialog-registro-tramite/dialog-registro-tramite.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DialogRemisionComponent } from './adminitracion-tramites/dialog-remision/dialog-remision.component';
import { BandejaEntradaComponent } from './bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from './bandeja-salida/bandeja-salida.component';
import { RouterModule } from '@angular/router';
import { FichaTramiteComponent } from './ficha-tramite/ficha-tramite.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdministracionTramitesInternosComponent } from './administracion-tramites-internos/administracion-tramites-internos.component';
import { DialogRegistroInternoComponent } from './administracion-tramites-internos/dialog-registro-interno/dialog-registro-interno.component';
import { ReportesModule } from '../reportes/reportes.module';

@NgModule({
  declarations: [
    AdminitracionTramitesComponent,
    DialogRegistroTramiteComponent,
    DialogRemisionComponent,
    BandejaEntradaComponent,
    BandejaSalidaComponent,
    FichaTramiteComponent,
    AdministracionTramitesInternosComponent,
    DialogRegistroInternoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxGraphModule,
    NgxChartsModule,
    ReportesModule
  ]
})
export class TramitesModule { }
