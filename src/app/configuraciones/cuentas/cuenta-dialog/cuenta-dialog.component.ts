import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { CuentaModel, CuentaModel_View, UsuarioModel, UsuarioModel_View } from '../../models/usuario.model';
import { ConfiguracionesService } from '../../services/configuraciones.service';
import { DependenciaService } from '../../services/dependencia.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cuenta-dialog',
  templateUrl: './cuenta-dialog.component.html',
  styleUrls: ['./cuenta-dialog.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class CuentaDialogComponent implements OnInit {
  // element_table: CuentaModel_View = {

  // }

  instituciones: { id_institucion: number, nombre: string, sigla: string }[] = []
  dependencias: { id_dependencia: number, nombre: string }[] = []
  cargos: { id_cargo: number, nombre: string }[]

  hide = true;

  expedido = this.configuracionesService.expedido //se obtiene por codido
  permisos = [
    { id_permiso: 2, descripcion: 'encargado de la recepcion de tramites' },
    { id_permiso: 3, descripcion: 'encargado de la evaluacion de tramite' },
  ]

  titulo: string = ""
  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
    apellido_p: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
    apellido_m: [''],
    dni: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    telefono: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
    direccion: ['', Validators.required],
    expedido: ['', Validators.required]
  });
  Form_Cueta: FormGroup = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    permisos: ['', Validators.required],
    id_dependencia: ['', Validators.required],
    id_cargo: ['', Validators.required]
  })
  actualizar_password: boolean = false

  Funcionarios: UsuarioModel[]
  dataSource = new MatTableDataSource()
  displayedColumns = ['dni', 'funcionario', 'opciones']
  paginator: number = 0
  items_page: number = 5
  Total: number = 0
  termino_busqueda: string = ""


  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: CuentaModel_View,
    private configuracionesService: ConfiguracionesService,
    private dependenciaService: DependenciaService,
    public dialogRef: MatDialogRef<CuentaDialogComponent>,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.titulo = 'Edicion'
      if (this.data.id_funcionario) {
        this.cambiar_formulario(this.actualizar_password)
      }
      else {
        this.obtener_funcionarios_asignacion()
      }

    }
    else {
      this.titulo = 'Registro'
      //iniciarlizar data para tabla
      this.data = {
        login: "",
        id_cuenta: 0,
        id_funcionario: 0,
        activo: true,
        permisos: 0,
        dni: 0,
        funcionario: "",
        cargo: "",
        rol: "",
        dependencia: "",
        sigla_institucion: ""
      }

      forkJoin([this.dependenciaService.getInstituciones_Habilitadas(), this.configuracionesService.getCargos_Habilitados()]).subscribe((alldata) => {
        this.instituciones = alldata[0]
        this.cargos = alldata[1]
      })
    }
  }

  obtener_dependencias(id_institucion: number) {
    this.configuracionesService.getIDepedencias_habilitadas_deInstitucion(id_institucion).subscribe(dep => this.dependencias = dep)
  }

  guardar() {
    if (this.titulo === 'Edicion') {
      this.configuracionesService.putCuenta(this.data.id_cuenta, this.Form_Cueta.value).subscribe(cambios => {
        this.dialogRef.close(cambios)
      })
    }
    else {
      this.configuracionesService.addFuncionario_Cuenta(this.Form_Funcionario.value, this.Form_Cueta.value).subscribe(data => {
        this.data = this.updateObject(this.data, data.cuenta)
        this.data.funcionario = data.funcionario.nombre_completo
        this.data.dni = data.funcionario.dni
        this.dialogRef.close(this.data)
      })
    }
  }

  cambiar_formulario(update: boolean) {
    this.actualizar_password = update
    if (this.actualizar_password) {
      this.Form_Cueta = this.fb.group({
        login: ['', Validators.required],
        password: ['', Validators.required],
        permisos: ['', Validators.required],
      })
    }
    else {
      this.Form_Cueta = this.fb.group({
        login: ['', Validators.required],
        permisos: ['', Validators.required]
      })
    }
    this.Form_Cueta.patchValue(this.data)

  }
  onNoClick() {
    this.dialogRef.close()
  }


  cambiarPagincion(evento: any) {
    if (evento.pageSize > this.Total) {
      return
    }
    this.items_page = evento.pageSize
    if (evento.pageIndex > evento.previousPageIndex) {
      this.paginator = this.paginator + this.items_page
    }
    else if (evento.pageIndex < evento.previousPageIndex) {
      this.paginator = this.paginator - this.items_page
      if (this.paginator < 0) {
        this.paginator = 0
      }
    }
    this.obtener_funcionarios_asignacion()
  }
  obtener_funcionarios_asignacion() {
    this.configuracionesService.getFuncionarios_Asignacion(this.paginator, this.items_page).subscribe(data => {
      this.Funcionarios = data.funcionarios
      this.Total = data.total
      this.dataSource.data = this.Funcionarios
    })
  }
  asignar_cuenta(funcionario: UsuarioModel) {

    Swal.fire({
      title: 'Asignar la cuenta?',
      text: `Se asignara la cuenta ${this.data.cargo} al funcionario ${funcionario.nombre_completo} - DNI:${funcionario.dni}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, asignar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.configuracionesService.asignar_cuenta(this.data.id_cuenta, funcionario.id_funcionario!).subscribe(cuenta => {
          this.data = this.updateObject(this.data, cuenta)
          this.data.funcionario = funcionario.nombre_completo
          this.data.dni = funcionario.dni
          this.cambiar_formulario(true)
        })
        Swal.fire(
          'Cuenta asginada',
          'La cuenta fue asignada correctamente',
          'success'
        )
        this.Funcionarios = this.Funcionarios.filter(funcio => funcio.id_funcionario != funcionario.id_funcionario)
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== '') {
      this.configuracionesService.searchFuncionarios_NoAsignados(filterValue).subscribe(funcionarios => {
        this.Funcionarios = funcionarios
        this.dataSource.data = this.Funcionarios
      })
    }
    else {
      this.obtener_funcionarios_asignacion()
    }
  }
  limpiar_busqueda() {
    this.paginator = 0
    this.termino_busqueda = ""
    this.obtener_funcionarios_asignacion()
  }

  updateObject(target: any, source: any) {
    const res: any = {};
    Object.keys(target)
      .forEach(k => res[k] = (source[k] ?? target[k]));
    return res;
  }

  generar_datos_cuenta() {
    this.Form_Cueta.controls['login'].setValue((`${this.Form_Funcionario.controls['nombre'].value} ${this.Form_Funcionario.controls['apellido_p'].value.charAt(0)} ${this.Form_Funcionario.controls['apellido_m'].value.charAt(0)}`).replace(/\s/g, '').toUpperCase())
    this.Form_Cueta.controls['password'].setValue(this.Form_Funcionario.controls['dni'].value)
  }


  //Manejo de errores validacion
  get NombreErrorMessage(): string {
    const form = (this.Form_Funcionario.get('nombre') as FormControl);
    return form.hasError('required') ?
      'Ingrese la nombre' :
      form.hasError('pattern') ?
        'Solo letras' : ''
  }
  get ApellidoErrorMessage(): string {
    const form = (this.Form_Funcionario.get('apellido_p') as FormControl);
    return form.hasError('required') ?
      'Ingrese la apellido' :
      form.hasError('pattern') ?
        'Solo letras' : ''
  }
  get DniErrorMessage(): string {
    const form = (this.Form_Funcionario.get('dni') as FormControl);
    return form.hasError('required') ?
      'Ingrese la dni' :
      form.hasError('pattern') ?
        'Solo numeros' : ''
  }
  get TelefonoErrorMessage(): string {
    const form = (this.Form_Funcionario.get('telefono') as FormControl);
    return form.hasError('required') ?
      'Ingrese la telefono' :
      form.hasError('pattern') ?
        'Solo numeros' :
        form.hasError('minlength') ?
          'Ingrese un numero valido' :
          form.hasError('maxlength') ?
            'Ingrese un numero valido' : ''
  }


}
