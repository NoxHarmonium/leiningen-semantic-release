import { either } from "fp-ts/lib/Either";
import { lstatSync } from "fs";
import * as t from "io-ts";
import { withFallback } from "io-ts-types/lib/withFallback";
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

export const pluginConfigCodec = t.type({
  skipDeploy: withFallback(t.boolean, true),
  pkgRoot: directoryPathCodec,
  uberJar: withFallback(t.boolean, false)
});

export type PluginConfig = t.TypeOf<typeof pluginConfigCodec>;

export type PluginStep = (
  config: PluginConfig,
  context: Context
) => Promise<void>;
