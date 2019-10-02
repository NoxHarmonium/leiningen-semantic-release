import { either } from "fp-ts/lib/Either";
import { lstatSync } from "fs";
import * as t from "io-ts";
import { Context } from "semantic-release";

const directoryPathCodec = new t.Type<string, string, unknown>(
  "DirectoryPath",
  t.string.is,
  (u, c) =>
    either.chain(t.string.validate(u, c), s => {
      return lstatSync(s).isDirectory()
        ? t.failure(u, c, "not a path to a valid directory")
        : t.success(s);
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
