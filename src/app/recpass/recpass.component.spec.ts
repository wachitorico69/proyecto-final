import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecpassComponent } from './recpass.component';

describe('RecpassComponent', () => {
  let component: RecpassComponent;
  let fixture: ComponentFixture<RecpassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecpassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
