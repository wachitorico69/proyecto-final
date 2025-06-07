import { Component, OnInit } from '@angular/core';
import { DatosGService } from '../servicios/datos-g.service';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule,   ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle } from 'ng-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { FirestoreService } from '../servicios/firestore.service';

@Component({
  selector: 'app-grafica',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css'
})
export class GraficaComponent  implements OnInit {
  chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
  } = {
    series: [
      {
        name: 'Inscritos',
        data: [] as number[]
      }
    ],
    chart: {
      type: 'bar',
      height: 350
    },
    xaxis: {
      categories: [] as string[]
    },
    title: {
      text: 'Cantidad de inscritos por clase'
    }
  };

  constructor(private firebaseService: FirestoreService) {}

  ngOnInit(): void {
    this.firebaseService.getConteoPorClase().subscribe(resultados => {
      this.chartOptions.series[0].data = resultados.map(r => r.total);
      this.chartOptions.xaxis.categories = resultados.map(r => r.clase);
    });
  }
}