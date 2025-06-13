import { TestBed } from '@angular/core/testing';

import { LocalSService } from './local-s.service';

describe('LocalSService', () => {
  let service: LocalSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
