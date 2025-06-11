import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminlogService } from '../shared/adminlog.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { filter } from 'rxjs';
import { BarraService } from '../servicios/barra.service';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeComponent } from 'angularx-qrcode';
import { QrService, UsuarioData } from '../servicios/Qr.service';
import { OcultarformsService } from '../servicios/ocultarforms.service';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule, RouterModule, HttpClientModule, QRCodeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loginForm: FormGroup;
  loginError: boolean = false;
  userlog: string | null = null;
  administrador: boolean = false;
  usuario: boolean = false;
  qrData = '';
  cargando = true;
  modalVisible = false;
  logged = false;
  abrirModalQR() {
    this.cargando = true;
    this.modalVisible = true;
    this.generarQR(); // Aquí llamamos a la función que carga los datos y genera el QR
  }

  cerrarModalQR(event: Event) {
    event.stopPropagation();
    this.modalVisible = false;
  }

  constructor(private fb: FormBuilder, private adminService: AdminlogService, private router: Router, private barraService: BarraService, 
    private firestore: Firestore, private qrService: QrService, private ocultarService: OcultarformsService) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  async validarUsuario(username: string, password: string): Promise<boolean> {
    const usersRef = collection(this.firestore, 'usuarios');
    const q = query(usersRef, where('nombre', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Obtén el primer documento (suponiendo que hay solo uno)
      const usuarioEncontrado = querySnapshot.docs[0];
      const usuarioData = usuarioEncontrado.data();

      // Guarda el ID del documento en localStorage
      localStorage.setItem('uid', usuarioEncontrado.id);

      // Opcional: también puedes guardar otros datos si quieres
      // localStorage.setItem('nombre', usuarioData.nombre);

      return true;  // usuario encontrado y contraseña correcta
    } else {
      return false; // no encontrado
    }
  }
  async validarAdmin(username: string, password: string): Promise<boolean> {
    const adminsRef = collection(this.firestore, 'admins');
    const q = query(adminsRef, where('nombre', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Obtén el primer documento (suponiendo que hay solo uno)
      const adminEncontrado = querySnapshot.docs[0];
      const adminData = adminEncontrado.data();

      // Guarda el ID del documento en localStorage
      localStorage.setItem('uid', adminEncontrado.id);

      return true;
    } else {
      return false;
    }
  }

  generarQR() {
    const id = localStorage.getItem('uid');
    if (id) {
      this.qrService.getUsuarioPorId(id).subscribe(data => {
        this.qrData = JSON.stringify(data);
        this.cargando = false;
      });
    }
  }

  //mostrar el boton de accesibilidad
  enNosotros = false;

  ngOnInit() {
    this.checkRoute(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute((event as NavigationEnd).urlAfterRedirects);
      });
  }

  private checkRoute(url: string) {
    this.enNosotros = url === '/nosotros/assets%252Fimg2.jpg';
  }

  //mostrar la barra
  mostrarBarra() {
    this.barraService.activarBarra();
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
    this.logged = false;
    this.ocultarService.setBoolean(this.logged);

    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      timer: 1500,
      showConfirmButton:false,
      color: 'black'
    });
    this.router.navigate(['/home'])
  }

  mostrarLog() {
  if (this.userlog) {
    this.logout();
    this.administrador = false;
    this.usuario = false;
  } else {
    Swal.fire({
      title: 'Iniciar como:',
      html: `
        <button id="admin-btn" class="swal2-confirm swal2-styled" style="background-color: black; margin: 10px;">Administrador</button>
        <button id="user-btn" class="swal2-cancel swal2-styled" style="background-color: gray; margin: 10px;">Usuario</button>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      color: 'black',
      didOpen: () => {
        const adminBtn = document.getElementById('admin-btn');
        const userBtn = document.getElementById('user-btn');

        adminBtn?.addEventListener('click', () => {
          Swal.fire({
            title: 'Login Administrador',
            html: `
              <input type="text" id="username" class="swal2-input" placeholder="Usuario">
              <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
            `,
            showCancelButton: true,
            cancelButtonText: 'Regresar',
            confirmButtonText: 'Ingresar',
            confirmButtonColor: 'black',
            cancelButtonColor: 'gray',
            focusConfirm: false,
            color: 'black',
            preConfirm: () => {
              const username = (document.getElementById('username') as HTMLInputElement).value;
              const password = (document.getElementById('password') as HTMLInputElement).value;

              if (!username || !password) {
                Swal.showValidationMessage('Por favor completa ambos campos');
              }

              return { username, password };
            }
          }).then(async (result) => {
            if (result.isConfirmed) {
              const { username, password } = result.value!;

              const valid = await this.validarAdmin(username, password);
    
              if (valid) {
                this.userlog = username;
                this.administrador = true;

                Swal.fire({
                  title: '¡Bienvenido!',
                  text: `Hola ${username}`,
                  icon: 'success',
                  confirmButtonColor: 'black',
                  color: 'black'
                });
            } else {
              Swal.fire({
              title: 'Datos incorrectos',
              icon: 'error',
              confirmButtonColor: 'black',
              color: 'black'
              });
            }
          }
        });
      });

       userBtn?.addEventListener('click', () => {
        Swal.fire({
        title: 'Login Usuario',
        html: `
          <input type="text" id="username" class="swal2-input" placeholder="Usuario">
          <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
        `,
        showCancelButton: true,
        cancelButtonText: 'Regresar',
        confirmButtonText: 'Ingresar',
        confirmButtonColor: 'black',
        cancelButtonColor: 'gray',
        focusConfirm: false,
        color: 'black',
        preConfirm: async () => {
          const username = (document.getElementById('username') as HTMLInputElement).value;
          const password = (document.getElementById('password') as HTMLInputElement).value;
          if (!username || !password) {
            Swal.showValidationMessage('Por favor completa ambos campos');
            return;
          }
          const valid = await this.validarUsuario(username, password);
          if (!valid) {
            Swal.showValidationMessage('Usuario o contraseña incorrectos');
          }
          return { username, password };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuario = true;
          Swal.fire({
            title: '¡Bienvenido!',
            text: `Hola ${result.value?.username}`,
            icon: 'success',
            confirmButtonColor: 'black',
            color: 'black'
          });
          this.userlog = result.value?.username ?? null;
          this.logged = true;
          this.ocultarService.setBoolean(this.logged);
        }
      });
      });
      }
    });
  }
  }
}
