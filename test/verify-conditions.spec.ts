import mockContext from "./__fixtures__/mock-context";

const mockLeinModule = {
  getVersion: jest.fn()
};
jest.mock("../src/lein", () => mockLeinModule);
const mockUtilModule = {
  printVersion: jest.fn()
};
jest.mock("../src/util", () => mockUtilModule);

import { verifyConditionsStep } from "../src/verify-conditions";

describe("when verifying conditions", () => {
  beforeEach(() => {
    mockLeinModule.getVersion.mockReset();
    mockUtilModule.printVersion.mockReset();
  });
  it("should get the project version", async () => {
    await verifyConditionsStep(
      {
        skipDeploy: true,
        pkgRoot: ".",
        uberJar: false
      },
      mockContext
    );
    expect(mockUtilModule.printVersion).toBeCalledTimes(1);
    expect(mockLeinModule.getVersion).toBeCalledTimes(1);
  });
});
