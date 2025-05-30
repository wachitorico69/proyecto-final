import { Component } from '@angular/core';
import { ClasesService } from '../servicios/clases.service';
import { NgClass} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clases',
  imports: [NgClass, FormsModule, RouterModule],
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.css'
})

export class ClasesComponent {
  filtroTexto: string = '';
  claseList: any[] = [];
  cargado: boolean = false;

  constructor(private clasesService: ClasesService) {}

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
  
}
