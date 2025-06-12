import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import {MatBadgeModule} from '@angular/material/badge';
import { OcultarformsService } from '../servicios/ocultarforms.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, RouterModule, MatBadgeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  logged = false;
  private subscription!: Subscription;

  constructor(private router: Router, private ocultarService: OcultarformsService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscription = this.ocultarService.boolean$.subscribe(value => {
      this.logged = value;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  irANosotrosConImagen2() {
    const imagen2 = 'assets/img2.jpg';
    this.router.navigate(['/nosotros', encodeURIComponent(imagen2)]);
  }

}
