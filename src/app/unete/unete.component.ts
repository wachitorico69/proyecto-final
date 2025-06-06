import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-unete',
  imports: [ReactiveFormsModule],
  templateUrl: './unete.component.html',
  styleUrl: './unete.component.css'
})
export class UneteComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(5)]],
      correo: ["", [Validators.required, this.emailValidator]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordValidator2]],
      passwordRepeted: ["", [Validators.required]]
    }, { validators: this.passwordValidator() });
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

  submit(){}
}
