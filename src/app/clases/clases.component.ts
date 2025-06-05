import { Component, signal } from '@angular/core';
import { ClasesService } from '../servicios/clases.service';
import { NgClass} from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PaymentService } from '../servicios/payment.service';

@Component({
  selector: 'app-clases',
  imports: [NgClass, FormsModule, RouterModule, MatProgressSpinner, FormsModule, ReactiveFormsModule],
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.scss'
})

export class ClasesComponent {
  filtroTexto: string = '';
  claseList: any[] = [];
  cargado: boolean = false;
  runOut: boolean = false;
  pagoCargo: boolean = false;
  pagoForm: FormGroup;
  isSubmitting = signal(false);

  constructor(private clasesService: ClasesService, private paymentService: PaymentService, private fb: FormBuilder) {
    this.pagoForm = this.fb.group({
      correo: ["", [Validators.required, this.emailValidator]]
    })
  }

  public emailValidator(control: FormControl): { [key: string]: boolean } | null {
    const emailRegexp: RegExp = /[@]/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.clasesService.getClases().subscribe({
      next: (result: any) => {
        console.log('Respuesta de la API:', result);
        this.claseList = result.clases || result;
        this.cargado = true;
      },
      error: (err) => {
        console.error('Error cargando clases', err);
        this.cargado = true;
        this.runOut = true;
      }
    });
  }

  clasesFiltradas(): any[] {
    if (!this.filtroTexto) {
      return this.claseList;
    }
  
    const texto = this.filtroTexto.toLowerCase();
  
    return this.claseList.filter(clase =>
      clase.nombre.toLowerCase().includes(texto) ||
      clase.descripcion.toLowerCase().includes(texto)
    );
  }

  submit() {
    if (this.pagoForm.valid) {

      this.pagoCargo = true;

      this.isSubmitting.set(true);

      const correo = this.pagoForm.get('correo')?.value;

      this.paymentService.createOrder({correo}).subscribe({
        next: (response) => {
        // Redirige al usuario a la URL de PayPal
        window.location.href = response.url;
        },
        error: (err) => {
          console.error('Error creando la orden', err);
        }
      });

    } else {
        this.pagoForm.markAllAsTouched();
        return;
    }
    this.isSubmitting.set(false);
  }
}