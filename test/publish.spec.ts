import mockContext from "./__fixtures__/mock-context";

const mockLeinModule = {
  deploy: jest.fn()
};
jest.mock("../src/lein", () => mockLeinModule);
const mockUtilModule = {
  printVersion: jest.fn()
};
jest.mock("../src/util", () => mockUtilModule);

import { publishStep } from "../src/publish";

describe("when publishing", () => {
  beforeEach(() => {
    mockLeinModule.deploy.mockReset();
    mockUtilModule.printVersion.mockReset();
  });
  describe("when skipDeploy is true", () => {
    it("should not deploy", async () => {
      await publishStep(
        {
          skipDeploy: true,
          pkgRoot: ".",
          uberJar: false
        },
        mockContext
      );
      expect(mockUtilModule.printVersion).toBeCalledTimes(1);
      expect(mockLeinModule.deploy).not.toBeCalled();
    });
  });
  describe("when skipDeploy is false", () => {
    it("should deploy", async () => {
      await publishStep(
        {
          skipDeploy: false,
          pkgRoot: ".",
          uberJar: false
        },
        mockContext
      );
      expect(mockUtilModule.printVersion).toBeCalledTimes(1);
      expect(mockLeinModule.deploy).toBeCalledTimes(1);
    });
  });
});
