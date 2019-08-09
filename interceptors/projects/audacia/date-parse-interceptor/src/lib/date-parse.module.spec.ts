import { AudaciaDateParseModule } from './date-parse.module';

describe("AudaciaBaseUrlModule", () => {
  let baseUrlModule: AudaciaDateParseModule;

  beforeEach(() => {
    baseUrlModule = new AudaciaDateParseModule();
  });

  it("should create an instance", () => {
    expect(baseUrlModule).toBeTruthy();
  });
});
