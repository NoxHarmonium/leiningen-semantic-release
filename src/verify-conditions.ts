import { Context } from "semantic-release";
import { getVersion } from "./lein";
import { PluginConfig, PluginStep } from "./types";
import { printVersion } from "./util";

/**
 * Verify that the leiningen project is properly setup to allow deployment
 */
export const verifyConditionsStep: PluginStep = async (
  config: PluginConfig,
  context: Context
) => {
  printVersion(context);

  await getVersion(config, context);
};
