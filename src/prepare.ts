import { Context } from "semantic-release";
import { leinPackage, updateVersionInLeinProject } from "./lein";
import { PluginConfig, PluginStep } from "./types";
import { printVersion } from "./util";

export const prepareStep: PluginStep = async (
  config: PluginConfig,
  context: Context
) => {
  printVersion(context);

  // set and commit version number in pom.xml
  await updateVersionInLeinProject(config, context);
  await leinPackage(config, context);
};
