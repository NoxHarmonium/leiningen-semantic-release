import { Context, NextRelease } from "semantic-release";
import { PluginConfig } from "../src/types";
import mockContext from "./__fixtures__/mock-context";

// tslint:disable: no-duplicate-string

const mockUtilModule = {
  exec: jest.fn(),
  printVersion: jest.fn()
};
jest.mock("../src/util", () => mockUtilModule);

import {
  deploy,
  getVersion,
  leinPackage,
  updateVersionInLeinProject
} from "../src/lein";

type LeinWrapperFunction = (
  config: PluginConfig,
  context: Context
) => Promise<string>;

const performTestPass = async (
  fn: LeinWrapperFunction,
  uberJar: boolean,
  nextRelease: NextRelease
) => {
  await fn(
    {
      pkgRoot: "pkgroot",
      skipDeploy: false,
      uberJar
    },
    {
      ...mockContext,
      nextRelease
    }
  );
  expect(mockUtilModule.exec).toBeCalledTimes(1);
  expect(mockUtilModule.exec.mock.calls[0]).toMatchSnapshot();
};

const performTestFail = async (fn: LeinWrapperFunction) => {
  expect.assertions(1);
  try {
    await fn(
      {
        pkgRoot: "pkgroot",
        skipDeploy: false,
        uberJar: true
      },
      mockContext
    );
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
};

describe("when calling leiningen", () => {
  beforeEach(() => {
    mockUtilModule.exec.mockReset();
    mockUtilModule.printVersion.mockReset();
  });
  describe("when calling lein wrapper methods", () => {
    describe("when nextRelease is defined", () => {
      test.each([
        ["updateVersionInLeinProject", updateVersionInLeinProject, false],
        ["updateVersionInLeinProject", updateVersionInLeinProject, true],
        ["deploy", deploy, false],
        ["deploy", deploy, true],
        ["getVersion", getVersion, false],
        ["getVersion", getVersion, true],
        ["leinPackage", leinPackage, false],
        ["leinPackage", leinPackage, true]
      ])(
        "'%s' should call lein with the correct arguments",
        // @ts-ignore
        async (_: string, fn: LeinWrapperFunction, uberJar: boolean) => {
          await performTestPass(fn, uberJar, {
            version: "1.2.3",
            gitTag: "v1.2.3-git",
            gitHead: "abcd1234",
            notes: "some notes"
          });
        }
      );
    });
    describe("when nextRelease is undefined", () => {
      test.each([
        ["updateVersionInLeinProject", updateVersionInLeinProject],
        ["deploy", deploy]
      ])(
        "'%s' should throw",
        // @ts-ignore
        async (_: string, fn: LeinWrapperFunction) => {
          await performTestFail(fn);
        }
      );
    });
  });
});
