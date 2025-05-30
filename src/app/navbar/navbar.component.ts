import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, RouterModule, MatBadgeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  constructor(private router: Router) {}

  irANosotrosConImagen2() {
    const imagen2 = 'assets/img2.jpg';
    this.router.navigate(['/nosotros', encodeURIComponent(imagen2)]);
  }
}
