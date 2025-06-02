import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { IntegranteComponent } from '../integrante/integrante.component';
import { ActivatedRoute } from '@angular/router';
import { BarraService } from '../servicios/barra.service';
import { Subscription } from 'rxjs';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-nosotros',
  imports: [IntegranteComponent, NgStyle],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {
  image: string = 'assets/screamer.webp';
  imagen: string = 'assets/img3.jpg';
  personaSeleccionada: { nombre: string, descripcion: string, foto: string } | null = null;
  showBar = false;
  private sub!: Subscription;

  //barra
  fontSize: number = 16;
  fontFam: string = "Titillium Web";
  color: string = "#000000";
  bcolor: string = "#ffffff";
  weight: string = "normal";
  contrasteActivo = false;

  constructor(private route: ActivatedRoute, private barraService: BarraService) {}

  onPersonaSeleccionada(persona: { nombre: string, descripcion: string, foto: string }) {
    this.personaSeleccionada = persona;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.imagen = decodeURIComponent(params.get('image') || '');
    });

    this.sub = this.barraService.mostrarBarra$.subscribe(val => {
      if (this.showBar && !val) {
        this.fontSize = 16;
        this.fontFam = "Titillium Web";
        this.color = "#000000";
        this.bcolor = "#ffffff";
        this.weight = "normal";
        this.cancelar();
      }
      this.showBar = val;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //metodos de accesibilidad
  @ViewChildren('readable') readableElements!: QueryList<ElementRef>;
  currentElement: HTMLElement | null = null;

  addMessage() {
    const elements = this.readableElements.toArray();

    const readNext = (index: number) => {
      if (index >= elements.length) return;

      const el = elements[index].nativeElement;
      const text = el.innerText;

      const utterance = new SpeechSynthesisUtterance(text);

      //resaltar
      utterance.onstart = () => {
        if (!this.contrasteActivo) {
          el.style.backgroundColor = 'yellow';  
        }
        this.currentElement = el; //referencia
      };

      //quitar resaltado
      utterance.onend = () => {
        if (!this.contrasteActivo) {
          el.style.backgroundColor = 'transparent';
        }
        this.currentElement = null;
        readNext(index + 1);
      };

      speechSynthesis.speak(utterance);
    };

    readNext(0); // Comenzar desde el primer elemento
  }

  pausaResumir() {
    if (speechSynthesis.paused)
      speechSynthesis.resume();
    else
      speechSynthesis.pause();
  }

  cancelar() {
    speechSynthesis.cancel();

    if (this.currentElement) {
      if (this.contrasteActivo) {
        this.currentElement.style.backgroundColor = '#000000'
        this.currentElement = null;
      } else {
        this.currentElement.style.backgroundColor = 'transparent';
        this.currentElement = null;
      }
    }
  }

  actContraste() {
    const isHighContrast = this.color === '#ffffff' && this.bcolor === '#000000';

    this.color = isHighContrast ? '#000000' : '#ffffff';
    this.bcolor = isHighContrast ? '#ffffff' : '#000000';
    this.weight = this.weight === 'normal' ? 'bolder' : 'normal';

    this.contrasteActivo = !isHighContrast;
  }

  changeSize() {
    const sizes = [16, 18, 20, 22, 24];
    const currentIndex = sizes.indexOf(this.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    this.fontSize = sizes[nextIndex];
  }

  changeFont() {
    const fonts = ["Arial", "Verdana", "Roboto", "Titillium Web"];
    const currentIndex = fonts.indexOf(this.fontFam);
    const nextIndex = (currentIndex + 1) % fonts.length;
    this.fontFam = fonts[nextIndex];
  }
}
