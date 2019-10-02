import { Context } from "semantic-release";
import { valid } from "semver";
import { getVersion } from "./lein";
import { PluginConfig, PluginStep } from "./types";
import { printVersion } from "./util";

export const verifyReleaseStep: PluginStep = async (
  config: PluginConfig,
  context: Context
) => {
  const { logger } = context;
  printVersion(context);

  const projectVersion = await getVersion(config, context);

  // check integrity of pom version
  if (valid(projectVersion) === null) {
    logger.log(
      "WARNING: project.clj version of %s is an invalid semver version",
      projectVersion
    );
  }
};
