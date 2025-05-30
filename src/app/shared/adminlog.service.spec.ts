import { TestBed } from '@angular/core/testing';

import { AdminlogService } from './adminlog.service';

describe('AdminlogService', () => {
  let service: AdminlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
