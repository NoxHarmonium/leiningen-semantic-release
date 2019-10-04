// tslint:disable-next-line: ordered-imports
import { isRight, right, isLeft, left } from "fp-ts/lib/Either";
import { optionalPluginConfigCodec } from "../src/types";
import invalidConfigs from "./__fixtures__/invalid-config";
import validConfigs from "./__fixtures__/valid-config";

describe("when parsing config", () => {
  describe("when the config is valid", () => {
    test.each(validConfigs)("parse %o", (input: unknown) => {
      const parsed = optionalPluginConfigCodec.decode(input);
      expect(isRight(parsed)).toBeTruthy();
      expect(right(parsed)).toMatchSnapshot();
    });
  });
  describe("when the config is invalid", () => {
    test.each(invalidConfigs)("parse %o", (input: unknown) => {
      const parsed = optionalPluginConfigCodec.decode(input);
      expect(isLeft(parsed)).toBeTruthy();
      expect(left(parsed)).toMatchSnapshot();
    });
  });
});
