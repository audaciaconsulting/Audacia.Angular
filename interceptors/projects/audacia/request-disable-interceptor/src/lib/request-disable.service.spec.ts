import { TestBed } from '@angular/core/testing';

import { RequestDisableService } from './request-disable.service';

describe("RequestDisableService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: RequestDisableService = TestBed.get(RequestDisableService);
    expect(service).toBeTruthy();
  });
});
