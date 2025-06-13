import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobretiComponent } from './sobreti.component';

describe('SobretiComponent', () => {
  let component: SobretiComponent;
  let fixture: ComponentFixture<SobretiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobretiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobretiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
