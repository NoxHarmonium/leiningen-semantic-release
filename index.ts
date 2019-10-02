import SemanticReleaseError from "@semantic-release/error";
import { fold } from "fp-ts/lib/Either";
import { Errors } from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { Context } from "semantic-release";
import { prepareStep } from "./src/prepare";
import { publishStep } from "./src/publish";
import { PluginConfig, pluginConfigCodec, PluginStep } from "./src/types";
import { verifyConditionsStep } from "./src/verify-conditions";
import { verifyReleaseStep } from "./src/verify-release";

const wrapStep = (step: PluginStep) => async (
  rawConfig: unknown,
  context: Context
) => {
  const result = pluginConfigCodec.decode(rawConfig);
  return fold(
    (_: Errors) => {
      throw new SemanticReleaseError(
        "Invalid plugin config",
        "EINVALIDCONFIG",
        PathReporter.report(result).join(", ")
      );
    },
    (config: PluginConfig) => step(config, context)
  )(result);
};

const wrappedSteps = {
  prepare: wrapStep(prepareStep),
  publish: wrapStep(publishStep),
  verifyConditions: wrapStep(verifyConditionsStep),
  verifyRelease: wrapStep(verifyReleaseStep)
};

export const {
  prepare,
  publish,
  verifyConditions,
  verifyRelease
} = wrappedSteps;
