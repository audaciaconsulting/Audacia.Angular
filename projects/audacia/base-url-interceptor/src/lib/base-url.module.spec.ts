import { AudaciaBaseUrlModule } from './base-url.module';

describe("AudaciaBaseUrlModule", () => {
  let baseUrlModule: AudaciaBaseUrlModule;

  beforeEach(() => {
    baseUrlModule = new AudaciaBaseUrlModule();
  });

  it("should create an instance", () => {
    expect(baseUrlModule).toBeTruthy();
  });
});
