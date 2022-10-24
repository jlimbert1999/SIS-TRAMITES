import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargosComponent } from '../configuraciones/cargos/cargos.component';
import { CuentasComponent } from '../configuraciones/cuentas/cuentas.component';
import { DependenciasComponent } from '../configuraciones/dependencias/dependencias.component';
import { DocumentosComponent } from '../configuraciones/documentos/documentos.component';
import { InstitucionesComponent } from '../configuraciones/instituciones/instituciones.component';
import { PerfilComponent } from '../configuraciones/perfil/perfil.component';
import { TiposTramitesComponent } from '../configuraciones/tipos-tramites/tipos-tramites.component';
import { UsuariosComponent } from '../configuraciones/usuarios/usuarios.component';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { UserGuard } from '../guards/user.guard';
import { ReporteEstadoComponent } from '../reportes/reporte-estado/reporte-estado.component';
import { ReporteFichaComponent } from '../reportes/reporte-ficha/reporte-ficha.component';
import { ReporteTipoComponent } from '../reportes/reporte-tipo/reporte-tipo.component';
import { AdministracionTramitesInternosComponent } from '../tramites/administracion-tramites-internos/administracion-tramites-internos.component';
import { AdminitracionTramitesComponent } from '../tramites/adminitracion-tramites/adminitracion-tramites.component';
import { BandejaEntradaComponent } from '../tramites/bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from '../tramites/bandeja-salida/bandeja-salida.component';
import { FichaTramiteComponent } from '../tramites/ficha-tramite/ficha-tramite.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: 'usuarios', component: UsuariosComponent, canActivate: [UserGuard], data: { expectedRole: 'admin_role' } },
            { path: 'cuentas', component: CuentasComponent, canActivate: [UserGuard], data: { expectedRole: 'admin_role' } },
            { path: 'cargos', component: CargosComponent, canActivate: [UserGuard], data: { expectedRole: 'admin_role' } },
            { path: 'dependencias', component: DependenciasComponent, canActivate: [UserGuard], data: { expectedRole: 'admin_role' } },
            { path: 'instituciones', component: InstitucionesComponent, canActivate: [UserGuard], data: { expectedRole: 'admin_role' } },
            { path: 'documentos', component: DocumentosComponent, canActivate: [UserGuard], data: { expectedRole: 'admin_role' } },
            { path: 'tipos', component: TiposTramitesComponent, canActivate: [UserGuard], data: { expectedRole: 'admin_role' } },


            { path: 'tramites', component: AdminitracionTramitesComponent, canActivate: [UserGuard], data: { expectedRole: 'receptionist_role' } },
            { path: 'tramites/ficha/:id', component: FichaTramiteComponent, canActivate: [UserGuard], data: { expectedRole: 'receptionist_role' } },

            { path: 'tramites-internos', component: AdministracionTramitesInternosComponent },
            { path: 'tramites-internos/ficha/:id', component: FichaTramiteComponent },

            { path: 'bandeja-entrada', component: BandejaEntradaComponent },
            { path: 'bandeja-entrada/ficha/:id', component: FichaTramiteComponent },

            { path: 'bandeja-salida', component: BandejaSalidaComponent },
            { path: 'bandeja-salida/ficha/:id', component: FichaTramiteComponent },



            { path: 'reporte-ficha', component: ReporteFichaComponent },
            { path: 'reporte-tipo', component: ReporteTipoComponent },
            { path: 'reporte-estado', component: ReporteEstadoComponent },

            { path: 'perfil', component: PerfilComponent },

        ]
    }
]





@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }