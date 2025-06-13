import { TestBed } from '@angular/core/testing';

import { OcultarformsService } from './ocultarforms.service';

describe('OcultarformsService', () => {
  let service: OcultarformsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OcultarformsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
