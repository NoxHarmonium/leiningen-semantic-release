import { writeFileSync } from "fs";
import { basename, dirname } from "path";
import * as tempy from "tempy";
import { inspect } from "util";

jest.mock("../package.json", () => ({
  name: "test name",
  version: "test version"
}));

import { exec, printVersion } from "../src/util";

// tslint:disable: no-identical-functions

describe("when executing an external process", () => {
  describe("when running a successful command", () => {
    it("should return stdout as a trimmed string", async () => {
      const result = await exec(
        "node",
        ["-e", "console.log('hello from unit testing!')"],
        "."
      );
      expect(result).toMatchSnapshot();
    });
  });
  describe("when an error occurs", () => {
    it("should catch the error", async () => {
      expect.assertions(1);
      try {
        await exec(
          "node",
          ["-e", "throw new Error('synthetic unit test error')"],
          "."
        );
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });
  describe("when using a different working directory", () => {
    it("should should execute command relative to that directory", async () => {
      const currentDirTest = await exec(
        "node",
        [
          "-e",
          `console.dir(require('fs').lstatSync(${inspect(
            __filename
          )}).isFile().toString())`
        ],
        __dirname
      );
      const relativePathTest = await exec(
        "node",
        ["-e", "console.dir(require('fs').lstatSync('config.yml').isFile())"],
        "src/../test/../.circleci"
      );
      const tempPath = tempy.file();

      writeFileSync(tempPath, "test");
      const tempFile = basename(tempPath);
      const tempDir = dirname(tempPath);
      const randomTest = await exec(
        "node",
        [
          "-e",
          `console.dir(require('fs').lstatSync(${inspect(tempFile)}).isFile())`
        ],
        tempDir
      );

      expect(currentDirTest).toMatchSnapshot();
      expect(relativePathTest).toMatchSnapshot();
      expect(randomTest).toMatchSnapshot();
    });
  });
  describe("when printing version", () => {
    it("should print the version and name stored in package.json (mocked)", async () => {
      expect.assertions(1);
      printVersion({
        logger: {
          log: (message: string, _: readonly unknown[]) => {
            expect(message).toMatchSnapshot();
          },
          error: (_: string, __: readonly unknown[]) => {
            throw new Error("Should not be called");
          }
        }
      });
    });
  });
});
