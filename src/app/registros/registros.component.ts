import { Component, OnInit } from '@angular/core';
import { LocalSService } from '../shared/local-s.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registros',
  imports: [CommonModule, FormsModule],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.css'
})
export class RegistrosComponent implements OnInit {
  clases: any[] = [];
  perfiles: any[] = [];
  editIndexC: number | null = null;
  editIndexP: number | null = null;

  constructor(private localSService: LocalSService) {}

  ngOnInit(): void {
    this.clases = this.localSService.getClases();
    this.perfiles = this.localSService.getPerfiles();
  }

  deleteClass(index: number): void {
    this.clases.splice(index, 1);
    localStorage.setItem('clases', JSON.stringify(this.clases));
  }

  deleteProfile(index: number): void {
    this.perfiles.splice(index, 1);
    localStorage.setItem('perfiles', JSON.stringify(this.perfiles));
  }

  startEditingClass(index: number): void {
    this.editIndexC = index;
  }

  saveClass(): void {
    localStorage.setItem('clases', JSON.stringify(this.clases));
    this.editIndexC = null;
  }

  startEditingProfile(index: number): void {
    this.editIndexP = index;
  }

  saveProfile(): void {
    localStorage.setItem('perfiles', JSON.stringify(this.perfiles));
    this.editIndexP = null;
  }
}