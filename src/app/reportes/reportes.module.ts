import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteTipoComponent } from './reporte-tipo/reporte-tipo.component';
import { ReporteFichaComponent } from './reporte-ficha/reporte-ficha.component';
import { ReporteEstadoComponent } from './reporte-estado/reporte-estado.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReporteSolicitanteComponent } from './reporte-solicitante/reporte-solicitante.component';


@NgModule({
  declarations: [
    ReporteTipoComponent,
    ReporteFichaComponent,
    ReporteEstadoComponent,
    ReporteSolicitanteComponent

  ],
  imports: [
    CommonModule,
    PdfViewerModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReportesModule { }
