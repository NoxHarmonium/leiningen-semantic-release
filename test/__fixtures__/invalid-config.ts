const invalidConfigs: ReadonlyArray<readonly [unknown]> = [
  [undefined],
  [null],
  [{ skipDeploy: null }],
  [{ skipDeploy: "false" }],
  [{ skipDeploy: 5656 }],
  [{ pkgRoot: null }],
  [{ pkgRoot: false }],
  [{ pkgRoot: 444 }],
  [{ pkgRoot: "/tmp/ishouldntexist" }],
  [{ pkgRoot: "./README.md" }],
  [{ uberJar: null }],
  [{ uberJar: "true" }],
  [{ uberJar: 5656 }]
];

export default invalidConfigs;
