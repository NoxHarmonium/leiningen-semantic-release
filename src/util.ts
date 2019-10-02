import execa from "execa";
import { Context } from "semantic-release";
import * as pkg from "../package.json";

/**
 * Execute while streaming to stdout in realtime
 */
export const exec = async (
  file: string,
  args: readonly string[],
  cwd: string
) => {
  const childProcess = execa(file, args, { cwd });
  if (childProcess.stdout !== null) {
    childProcess.stdout.pipe(process.stdout);
  }
  if (childProcess.stderr !== null) {
    childProcess.stderr.pipe(process.stderr);
  }
  return childProcess.then(({ stdout }) => stdout);
};

export const printVersion = ({ logger }: Context) => {
  logger.log(`Running ${pkg.name} version ${pkg.version}`);
};
