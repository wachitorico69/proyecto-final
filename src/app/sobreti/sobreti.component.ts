  import { Component } from '@angular/core';
  import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
  import Swal from 'sweetalert2'

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
      const perfilesGuardados = JSON.parse(localStorage.getItem('perfiles') || '[]');
      perfilesGuardados.push(this.perfil);

      localStorage.setItem('perfiles', JSON.stringify(perfilesGuardados));

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

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
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

      const clasesGuardadas = JSON.parse(localStorage.getItem('clases') || '[]');
      clasesGuardadas.push(this.claseForm.value);

      localStorage.setItem('clases', JSON.stringify(clasesGuardadas));

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
  }



