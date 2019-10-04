import mockContext from "./__fixtures__/mock-context";

const mockLeinModule = {
  updateVersionInLeinProject: jest.fn(),
  leinPackage: jest.fn()
};
jest.mock("../src/lein", () => mockLeinModule);
const mockUtilModule = {
  printVersion: jest.fn()
};
jest.mock("../src/util", () => mockUtilModule);

import { prepareStep } from "../src/prepare";

describe("when preparing", () => {
  beforeEach(() => {
    mockLeinModule.updateVersionInLeinProject.mockReset();
    mockLeinModule.leinPackage.mockReset();
    mockUtilModule.printVersion.mockReset();
  });
  it("should update version and package", async () => {
    await prepareStep(
      {
        skipDeploy: true,
        pkgRoot: ".",
        uberJar: false
      },
      mockContext
    );
    expect(mockUtilModule.printVersion).toBeCalledTimes(1);
    expect(mockLeinModule.updateVersionInLeinProject).toBeCalledTimes(1);
    expect(mockLeinModule.leinPackage).toBeCalledTimes(1);
  });
});
