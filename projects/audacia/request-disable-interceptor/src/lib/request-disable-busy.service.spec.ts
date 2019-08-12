import { TestBed } from '@angular/core/testing';

import { RequestDisableBusyService } from './request-disable-busy.service';

describe('RequestDisableBusyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestDisableBusyService = TestBed.get(RequestDisableBusyService);
    expect(service).toBeTruthy();
  });
});
