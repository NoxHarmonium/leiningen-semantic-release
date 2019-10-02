import { Context } from "semantic-release";
import { deploy } from "./lein";
import { PluginConfig, PluginStep } from "./types";
import { printVersion } from "./util";

export const publishStep: PluginStep = async (
  config: PluginConfig,
  context: Context
) => {
  printVersion(context);

  if (!config.skipDeploy) {
    // deploy the project to maven-central
    await deploy(config, context);
  }
};
