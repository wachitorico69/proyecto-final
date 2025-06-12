import { Component } from '@angular/core';
import { AuthFireService } from '../servicios/auth-fire.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recpass',
  imports: [CommonModule, FormsModule],
  templateUrl: './recpass.component.html',
  styleUrl: './recpass.component.css'
})
export class RecpassComponent {
 username = '';
  tipo = 'usuarios';
  nuevaPassword = '';
  usuarioEncontrado = false;
  idUsuario = '';
  mensaje = '';

  constructor(private authFireService: AuthFireService) {}

  async verificarUsuario() {
    this.mensaje = '';
    this.usuarioEncontrado = false;

    try {
      const datos = await this.authFireService.obtenerDatosUsuario(this.tipo, this.username);

      if (datos) {
        this.usuarioEncontrado = true;
        this.idUsuario = datos.id;
      } else {
        this.mensaje = 'Usuario no encontrado';
      }
    } catch (error) {
      this.mensaje = 'Error al verificar el usuario';
    }
  }

  async cambiarPassword() {
    this.mensaje = '';

    if (!this.nuevaPassword || this.nuevaPassword.length < 6) {
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    try {
      await this.authFireService.actualizarPassword(this.tipo, this.idUsuario, this.nuevaPassword);
      this.mensaje = 'Contraseña actualizada con éxito';
      this.usuarioEncontrado = false;
      this.username = '';
      this.nuevaPassword = '';
    } catch (error) {
      this.mensaje = 'Error al cambiar la contraseña';
    }
  }
}
