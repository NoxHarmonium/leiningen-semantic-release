// tslint:disable-next-line: ordered-imports
import { isLeft, isRight } from "fp-ts/lib/Either";
import { Errors, ValidationError } from "io-ts";
import { optionalPluginConfigCodec } from "../src/types";
import invalidConfigs from "./__fixtures__/invalid-config";
import validConfigs from "./__fixtures__/valid-config";

/**
 * Tries to convert Windows paths to Unix paths
 * so that snapshots don't have OS specific paths in them.
 */
const sanitizeMessages = (errors: Errors) =>
  errors.map(
    (error: ValidationError): ValidationError => ({
      ...error,
      message:
        error.message === undefined
          ? undefined
          : error.message.replace(/[a-zA-Z]:/g, "").replace(/\\/g, "/")
    })
  );

describe("when parsing config", () => {
  describe("when the config is valid", () => {
    test.each(validConfigs)("parse %o", (input: unknown) => {
      expect.assertions(2);
      const parsed = optionalPluginConfigCodec.decode(input);
      expect(isRight(parsed)).toBeTruthy();
      if (isRight(parsed)) {
        const value = parsed.right;
        expect(value).toMatchSnapshot();
      }
    });
  });
  describe("when the config is invalid", () => {
    test.each(invalidConfigs)("parse %o", (input: unknown) => {
      expect.assertions(2);
      const parsed = optionalPluginConfigCodec.decode(input);
      expect(isLeft(parsed)).toBeTruthy();
      if (isLeft(parsed)) {
        const errors = sanitizeMessages(parsed.left);
        expect(errors).toMatchSnapshot();
      }
    });
  });
});
