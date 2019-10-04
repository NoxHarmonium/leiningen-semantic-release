const validConfigs: ReadonlyArray<readonly [unknown]> = [
  [{}],
  [{ skipDeploy: true }],
  [{ skipDeploy: false }],
  [{ pkgRoot: "." }],
  [{ pkgRoot: "./src" }],
  [{ uberJar: true }],
  [{ uberJar: false }],
  [{ skipDeploy: true, uberJar: false, pkgRoot: "./src" }]
];

export default validConfigs;
