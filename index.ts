import SemanticReleaseError from "@semantic-release/error";
import { fold } from "fp-ts/lib/Either";
import { Errors } from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { Context } from "semantic-release";
import { prepareStep } from "./src/prepare";
import { publishStep } from "./src/publish";
import {
  OptionalPluginConfig,
  optionalPluginConfigCodec,
  PluginConfig,
  PluginStep
} from "./src/types";
import { verifyConditionsStep } from "./src/verify-conditions";
import { verifyReleaseStep } from "./src/verify-release";

const resolveOptionals = ({
  skipDeploy,
  pkgRoot,
  uberJar
}: OptionalPluginConfig): PluginConfig => ({
  skipDeploy: skipDeploy === undefined ? true : skipDeploy,
  pkgRoot: pkgRoot === undefined ? "." : pkgRoot,
  uberJar: uberJar === undefined ? false : uberJar
});

const wrapStep = (step: PluginStep) => async (
  rawConfig: unknown,
  context: Context
) => {
  const result = optionalPluginConfigCodec.decode(rawConfig);
  return fold(
    (_: Errors) => {
      throw new SemanticReleaseError(
        "Invalid plugin config",
        "EINVALIDCONFIG",
        PathReporter.report(result).join(", ")
      );
    },
    (config: OptionalPluginConfig) => step(resolveOptionals(config), context)
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
