import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from '../../environments/environment';
import { FirestoreService } from '../servicios/firestore.service';
import Swal from 'sweetalert2';
import { AuthFireService } from '../servicios/auth-fire.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-unete',
  standalone: true,
  imports: [ReactiveFormsModule, RecaptchaFormsModule, RecaptchaModule, FormsModule, AsyncPipe, CommonModule],
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
  user$!: Observable<User | null>;
  
  constructor(private fb: FormBuilder, private firestoreService: FirestoreService, private authService: AuthFireService) {
    this.user$ = this.authService.user$;
    this.registroForm = this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(5)]],
      correo: ["", [Validators.required, this.emailValidator]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordValidator2]],
      passwordRepeted: ["", [Validators.required]]
    }, { validators: this.passwordValidator() });

    this.token = undefined;
  }
  login() {
  this.authService.loginWithGoogle().then(result => {
    const user = result.user;
    const datosUsuario = {
      nombre: user.displayName ?? 'Sin nombre',
      correo: user.email ?? 'Sin correo'
    };

    this.firestoreService.guardarUsuario(datosUsuario)
      .then(() => {
        console.log('Usuario con Google guardado en Firestore');
        Swal.fire({
          title: '¡Bienvenido con Google!',
          text: `Hola ${user.displayName}`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'black',
          color: 'black',
          iconColor: 'black'
        });
      })
      .catch(error => {
        console.error('Error al guardar el usuario en Firestore:', error);
      });
  }).catch(err => {
    console.error('Error en login con Google:', err);
  });
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

      if (!this.token) {
        console.warn('Captcha no completado');
      }

      return;
    }

    const nombre = this.registroForm.get('nombre')?.value;
    const correo = this.registroForm.get('correo')?.value;
    const password = this.registroForm.get('password')?.value;

    this.authService.registrarUsuario(nombre, correo, password)
      .then(() => {
        Swal.fire({
          title: 'Bienvenido a Gorilla Gym!',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'black',
          color: 'black',
          iconColor: 'black'
        });

        this.registroForm.reset();
        this.token = undefined;
      })
      .catch(error => {
        console.error('Error al registrar usuario:', error);
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonColor: 'black'
        });
      });
  }

}