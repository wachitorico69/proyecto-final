import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminlogService } from '../shared/adminlog.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loginForm: FormGroup;
  loginError: boolean = false;
  userlog: string | null = null;

  constructor(private fb: FormBuilder, private adminService: AdminlogService, private router: Router) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  login(): void {
    const { username, password } = this.loginForm.value;
    const user = this.adminService.obtenerU(username, password);
    if(user){
      this.userlog = user.nombre;
      Swal.fire({
          title: 'Bienvenido!',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'black',
          color: 'black'
            })
      this.loginError=false;
    }else{
        Swal.fire({
            title: 'Datos incorrectos',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'black',
            color: 'black'
            })
    }
  }
  logout(){
    this.userlog=null;
    this.loginForm.reset();
    this.loginError = false;

    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      timer: 1500,
      showConfirmButton:false,
      color: 'black'
    });
    this.router.navigate(['/home'])
  }

  mostrarLog(){
    if(this.userlog){
      this.logout();
    }else{
      this.loginError = !this.loginError;
    }
  }
}
