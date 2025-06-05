import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-unete',
  imports: [],
  templateUrl: './unete.component.html',
  styleUrl: './unete.component.css'
})
export class UneteComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      correo: ['', [Validators.required]]
    })
  }
}
