import { Context } from "semantic-release";
import { PluginConfig } from "./types";
import { exec } from "./util";

/**
 * Gets the path to the "lein" executable.
 * Could be extended in the future to try different locations.
 */
const findCommand = async () => "lein"

export const updateVersionInLeinProject = async (
  { pkgRoot }: PluginConfig,
  { logger, nextRelease }: Context
) => {
  if (nextRelease === undefined) {
    throw new Error("context.nextRelease is undefined");
  }
  const version = nextRelease.version;
  logger.log(`Updating project.clj to version ${version}`);
  const command = await findCommand();
  return exec(command, ["change", "version", "set", `"${version}"`], pkgRoot);
};

export const deploy = async (
  { pkgRoot }: PluginConfig,

  { logger, nextRelease }: Context
) => {
  if (nextRelease === undefined) {
    throw new Error("context.nextRelease is undefined");
  }
  const version = nextRelease.version;
  logger.log("Deploying version %s with leiningen", version);
  const command = await findCommand();
  return exec(command, ["deploy"], pkgRoot);
};

export const getVersion = async (
  { pkgRoot }: PluginConfig,
  { logger }: Context
) => {
  logger.log("Sanity checking project version with leiningen");
  const command = await findCommand();
  return exec(
    command,
    // Uses the lein-project-version plugin to print the version number
    // Only updates the project in memory, the project file on disk will remain unaffected
    [
      "update-in",
      ":plugins",
      "conj",
      '[lein-project-version "0.1.0"]',
      "--",
      "project-version"
    ],
    pkgRoot
  );
};

export const leinPackage = async (
  { uberJar, pkgRoot }: PluginConfig,
  { logger }: Context
) => {
  logger.log("Packaging with leiningen");
  const command = await findCommand();
  return exec(command, [uberJar ? "uberjar" : "jar"], pkgRoot);
};
