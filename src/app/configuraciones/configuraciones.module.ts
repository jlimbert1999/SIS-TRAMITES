import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargosComponent } from './cargos/cargos.component';
import { DependenciasComponent } from './dependencias/dependencias.component';
import { InstitucionesComponent } from './instituciones/instituciones.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';
import { UsuarioDialogComponent } from './usuarios/usuario-dialog/usuario-dialog.component';
import { CargosDialogComponent } from './cargos/cargos-dialog/cargos-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InstitucionDialogComponent } from './instituciones/institucion-dialog/institucion-dialog.component';
import { DependeniaDialogComponent } from './dependencias/dependenia-dialog/dependenia-dialog.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { CuentaDialogComponent } from './cuentas/cuenta-dialog/cuenta-dialog.component';
import { MovilidadDialogComponent } from './usuarios/movilidad-dialog/movilidad-dialog.component';
import { TiposTramitesComponent } from './tipos-tramites/tipos-tramites.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { DocumentoDialogComponent } from './documentos/documento-dialog/documento-dialog.component';
import { DialogTiposTramitesComponent } from './tipos-tramites/dialog-tipos-tramites/dialog-tipos-tramites.component';
import { DialogTramiteRequisitosComponent } from './tipos-tramites/dialog-tramite-requisitos/dialog-tramite-requisitos.component';


@NgModule({
  declarations: [
    UsuariosComponent,
    CargosComponent,
    DependenciasComponent,
    InstitucionesComponent,
    PerfilComponent,
    UsuarioDialogComponent,
    CargosDialogComponent,
    InstitucionDialogComponent,
    DependeniaDialogComponent,
    CuentasComponent,
    CuentaDialogComponent,
    MovilidadDialogComponent,
    TiposTramitesComponent,
    DocumentosComponent,
    DocumentoDialogComponent,
    DialogTiposTramitesComponent,
    DialogTramiteRequisitosComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConfiguracionesModule { }
