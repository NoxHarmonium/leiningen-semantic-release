import { either } from "fp-ts/lib/Either";
import { lstatSync } from "fs";
import * as t from "io-ts";
import { Context } from "semantic-release";

const directoryPathCodec = new t.Type<string, string, unknown>(
  "DirectoryPath",
  t.string.is,
  (u, c) =>
    either.chain(t.string.validate(u, c), s => {
      try {
        return lstatSync(s).isDirectory()
          ? t.success(s)
          : t.failure(u, c, "not a path to a valid directory");
      } catch (error) {
        // Errors that inherit from the base JS error object are easy to use
        if (error instanceof Error) {
          return t.failure(u, c, error.message);
        }
        const stringableError = error as { readonly toString?: () => string };
        // Some errors like Node system errors don't provide a message property
        // In this case we need to use toString()
        if (typeof stringableError.toString === "function") {
          return t.failure(u, c, stringableError.toString());
        }
        // If we can't extract the error message with the above methods
        // give up and throw it again. Something exceptional is occurring.
        throw error;
      }
    }),
  String
);

export type DirectoryPath = t.TypeOf<typeof directoryPathCodec>;

export const optionalPluginConfigCodec = t.partial({
  skipDeploy: t.boolean,
  pkgRoot: directoryPathCodec,
  uberJar: t.boolean
});

export type OptionalPluginConfig = t.TypeOf<typeof optionalPluginConfigCodec>;
export type PluginConfig = Required<OptionalPluginConfig>;

export type PluginStep = (
  config: PluginConfig,
  context: Context
) => Promise<void>;
