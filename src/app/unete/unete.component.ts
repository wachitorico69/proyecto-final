import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from '../../environments/environment';
import { FirestoreService } from '../servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unete',
  imports: [ReactiveFormsModule, RecaptchaFormsModule, RecaptchaModule, FormsModule],
  providers: [
  {
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: environment.recaptcha.siteKey,
    } as RecaptchaSettings,
  },
  ] ,
  templateUrl: './unete.component.html',
  styleUrl: './unete.component.css'
})

export class UneteComponent {
  registroForm: FormGroup;
  token: string|undefined;

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService) {
    this.registroForm = this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(5)]],
      correo: ["", [Validators.required, this.emailValidator]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordValidator2]],
      passwordRepeted: ["", [Validators.required]]
    }, { validators: this.passwordValidator() });

    this.token = undefined;
  }

  //Validar correo
  public emailValidator(control: FormControl): { [key: string]: boolean } | null {
    const emailRegexp: RegExp = /[@]/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
    return null;
  }

  //Validar contraseña
  public passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const repeat_password = formGroup.get('passwordRepeted')?.value;

      if (!password || !repeat_password || password !== repeat_password) {
        return { isValid: false };
      }
      return null;
    };
  }


  public passwordValidator2(control: FormControl): { [key: string]: boolean } | null {
    const passRegexp: RegExp = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/;
    const value = control.value;

    //que no tenga caracteres especiales
    if (value && passRegexp.test(value)) {
        return { invalidPass: true };
    }

    //que tenga una mayuscula
    const hasUpperCase: boolean = /[A-Z]/.test(value);
    if (!hasUpperCase) {
      return { noUpperCase: true };
    }

    //que tenga un numero al menos
    const hasNumber: boolean = /[0-9]/.test(value);
    if (!hasNumber) {
     return { noNumber: true };
    
    }
    return null;
  }

  submit() {
    if (this.registroForm.invalid || !this.token) {
      for (const control of Object.keys(this.registroForm.controls)) {
        this.registroForm.controls[control].markAsTouched();
      }

      // Mostrar un mensaje de error para el captcha si es necesario
      if (!this.token) {
        console.warn('Captcha no completado');
      }

      return;
    }

    this.firestoreService.guardarUsuario({
      nombre: this.registroForm.get('nombre')?.value,
      correo: this.registroForm.get('correo')?.value,
      password: this.registroForm.get('password')?.value
    }).then(() => {
      console.log('Usuario guardado con éxito');
    }).catch((err) => {
      console.error('Error al guardar', err);
    });

    Swal.fire({
      title: 'Bienvenido a Gorilla Gym!',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'black',
      color: 'black',
      iconColor: 'black'
    })

    this.registroForm.reset();
    this.token = undefined;

    console.debug(`Token [${this.token}] generated`);
  }
}