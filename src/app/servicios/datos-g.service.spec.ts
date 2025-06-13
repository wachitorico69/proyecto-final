import { TestBed } from '@angular/core/testing';

import { DatosGService } from './datos-g.service';

describe('DatosGService', () => {
  let service: DatosGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
