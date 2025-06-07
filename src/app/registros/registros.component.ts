import { Component, OnInit } from '@angular/core';
import { LocalSService } from '../shared/local-s.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../servicios/firestore.service';
import { RouterModule } from '@angular/router';
import { PesoPipe } from '../pipes/peso.pipe';
import { AlturaPipe } from '../pipes/altura.pipe';

@Component({
  selector: 'app-registros',
  imports: [CommonModule, FormsModule, PesoPipe, AlturaPipe],
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.css'
})
export class RegistrosComponent implements OnInit {
  clases: any[] = [];
  perfiles: any[] = [];
  editIndexC: number | null = null;
  editIndexP: number | null = null;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.firestoreService.getClases().subscribe(data => this.clases = data);
    this.firestoreService.getPerfiles().subscribe(data => this.perfiles = data);
  }

  deleteClass(index: number): void {
    const id = this.clases[index].id;
    this.firestoreService.deleteClase(id);
  }

  deleteProfile(index: number): void {
    const id = this.perfiles[index].id;
    this.firestoreService.deletePerfil(id);
  }

  startEditingClass(index: number): void {
    this.editIndexC = index;
  }

  saveClass(): void {
    if (this.editIndexC !== null) {
      const item = this.clases[this.editIndexC];
      this.firestoreService.updateClase(item.id, item);
      this.editIndexC = null;
    }
  }

  startEditingProfile(index: number): void {
    this.editIndexP = index;
  }

  saveProfile(): void {
    if (this.editIndexP !== null) {
      const item = this.perfiles[this.editIndexP];
      this.firestoreService.updatePerfil(item.id, item);
      this.editIndexP = null;
    }
  }
}