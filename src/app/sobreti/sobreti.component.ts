import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { FirestoreService } from '../servicios/firestore.service';
import { OcultarformsService } from '../servicios/ocultarforms.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

  interface perfilForm {
    nombre: string;
    email: string;
    edad: string;
    sexo: string;
    peso: string;
    altura: string;
  }

  function validarFecha(): ValidatorFn {
    return (control: AbstractControl) => {
      const fechaSelect = new Date(control.value);

      if (!control.value) return null;

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const errores: any = {};

      if (fechaSelect < hoy) {
        errores.fechaInvalida = true;
      }

      if (fechaSelect.getFullYear() > 2025) {
        errores.añoInvalido = true;
      }

      return Object.keys(errores).length > 0 ? errores : null;
    };
  }

  @Component({
    selector: 'app-sobreti',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './sobreti.component.html',
    styleUrl: './sobreti.component.css'
  })
  export class SobretiComponent {
    logged = false;
    private subscription!: Subscription;
    //TEMPLATE
    perfil: perfilForm = {
      nombre: "",
      email: "",
      edad: "",
      sexo: "",
      peso: "",
      altura: ""
    };

    submit(form: NgForm) {
      this.firestoreService.guardarPerfil({
        nombre: this.perfil.nombre,
        email: this.perfil.email,
        edad: this.perfil.edad,
        sexo: this.perfil.sexo,
        peso: this.perfil.peso,
        altura: this.perfil.altura
      }).then(() => {
        console.log('Usuario guardado con éxito');
        }).catch((err) => {
        console.error('Error al guardar', err);
      });

      Swal.fire({
        title: 'Buen trabajo!',
        text: 'Recibirás tu perfil personalizado pronto en tu correo electrónico',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'black',
        color: 'black',
        iconColor: 'black'
      })
      
      form.resetForm(); //para limpiar el form
    }

    //REACTIVO
    claseForm!: FormGroup;
    submitted = false;
    clases: { id: string, nombre: string }[] = [
      { id: 'zumba', nombre: 'Zumba' },
      { id: 'spinning', nombre: 'Spinning' },
      { id: 'pilates', nombre: 'Pilates' },
      { id: 'yoga', nombre: 'Yoga' },
      { id: 'bodypump', nombre: 'Body Pump' },
      { id: 'crossfit', nombre: 'CrossFit' },
      { id: 'boxeo', nombre: 'Boxeo' },
      { id: 'kickboxing', nombre: 'Kickboxing' },
      { id: 'hiit', nombre: 'HIIT' }
    ];

    constructor(private formBuilder: FormBuilder, private firestoreService: FirestoreService, 
      private ocultarService: OcultarformsService, private router: Router) {}

    ngOnInit() {
      this.subscription = this.ocultarService.boolean$.subscribe(value => {
        this.logged = value;
      });
      
      if(!this.logged) {
        Swal.fire({
        title: 'Inicia sesión para acceder a este contenido',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'black',
        color: 'black',
        iconColor: 'black'
      }).then(() => {
        this.router.navigate(['/home']);
      })
      }
      this.claseForm = this.formBuilder.group({
        nombre: ["", [Validators.required, Validators.minLength(5)]],
        telefono: ["", [Validators.required, Validators.minLength(10)]],
        clase: ["", [Validators.required]],
        horario: [{ value: "", disabled: true }, [Validators.required]],
        fecha: ["", [Validators.required, validarFecha()]]
      })

      this.claseForm.get('clase')?.valueChanges.subscribe(value => {
        const horarioControl = this.claseForm.get('horario');
        if (value) {
          horarioControl?.enable();
        } else {
          horarioControl?.disable();
          horarioControl?.reset();
        }
      });
    }

    get form() {
      return this.claseForm.controls;
    }

    onSubmit() {
      this.submitted = true;

      //se detiene aqui si el form es invalido
      if (this.claseForm.invalid) {
        return;
      }

      this.firestoreService.guardarClase({
        nombre: this.claseForm.get('nombre')?.value,
        telefono: this.claseForm.get('telefono')?.value,
        clase: this.claseForm.get('clase')?.value,
        horario: this.claseForm.get('horario')?.value,
        fecha: this.claseForm.get('fecha')?.value
      }).then(() => {
        console.log('Usuario guardado con éxito');
        }).catch((err) => {
        console.error('Error al guardar', err);
      });

      Swal.fire({
        title: 'Clase programada!',
        text: 'Espera a recibir una confirmación de alguno de nuestros coachs por WhatsApp ',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'black',
        color: 'black',
        iconColor: 'black'
      })

      this.claseForm.reset({
        nombre: '',
        telefono: '',
        clase: '',
        horario: '',  // Este será deshabilitado, pero lo reseteamos visualmente
        fecha: ''
      });
      this.claseForm.get('horario')?.disable();
    }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}



