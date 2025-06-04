import { Component } from '@angular/core';
import { ClasesService } from '../servicios/clases.service';
import { NgClass} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PaymentService } from '../servicios/payment.service';

@Component({
  selector: 'app-clases',
  imports: [NgClass, FormsModule, RouterModule, MatProgressSpinner],
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.scss'
})

export class ClasesComponent {
  filtroTexto: string = '';
  claseList: any[] = [];
  cargado: boolean = false;
  runOut: boolean = false;

  constructor(private clasesService: ClasesService, private paymentService: PaymentService) {}

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

  pagar() {
    this.paymentService.createOrder().subscribe({
      next: (response) => {
        // Redirige al usuario a la URL de PayPal
        window.location.href = response.url;
      },
      error: (err) => {
        console.error('Error creando la orden', err);
      }
    });
  }
  
}
