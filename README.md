Note: Currently in testing, not ready for use

# leiningen-semantic-release

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to publish a [leiningen](https://github.com/technomancy/leiningen) project.

[![Greenkeeper badge](https://badges.greenkeeper.io/semantic-release/npm.svg)](https://greenkeeper.io/)

[![npm latest version](https://img.shields.io/npm/v/noxharmonium/leiningen-semantic-release/latest.svg)](https://www.npmjs.com/package/noxharmonium/leiningen-semantic-release)
[![npm next version](https://img.shields.io/npm/v/noxharmonium/leiningen-semantic-release/next.svg)](https://www.npmjs.com/package/noxharmonium/leiningen-semantic-release)

| Step               | Description                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `verifyConditions` | Verify the presence of the `NPM_TOKEN` environment variable, create or update the `.npmrc` file with the token and verify the token is valid. |
| `prepare`          | Update the `project.clj` version and [create](https://docs.npmjs.com/cli/pack) the npm package tarball.                                       |
| `publish`          | [Publish the npm package](https://docs.npmjs.com/cli/publish) to the registry.                                                                |

## Install

```bash
$ npm install leiningen-semantic-release -D
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "leiningen-semantic-release"
  ]
}
```

## Configuration

### Npm registry authentication

The npm authentication configuration is **required** and can be set via [environment variables](#environment-variables).

Both the [token](https://docs.npmjs.com/getting-started/working_with_tokens) and the legacy (`username`, `password` and `email`) authentication are supported. It is recommended to use the [token](https://docs.npmjs.com/getting-started/working_with_tokens) authentication. The legacy authentication is supported as the alternative npm registries [Artifactory](https://www.jfrog.com/open-source/#os-arti) and [npm-registry-couchapp](https://github.com/npm/npm-registry-couchapp) only supports that form of authentication.

**Note**: Only the `auth-only` [level of npm two-factor authentication](https://docs.npmjs.com/getting-started/using-two-factor-authentication#levels-of-authentication) is supported, **semantic-release** will not work with the default `auth-and-writes` level.

### Environment variables

| Variable          | Description                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `LEIN_USERNAME`   | The username for the maven repository you are publishing to (or clojars).                                                      |
| `LEIN_PASSWORD`   | The password for the maven repository you are publishing to (or clojars). Usually mutually exclusive to `LEIN_PASSPHRASE`.     |
| `LEIN_PASSPHRASE` | The GPG passphrase for the maven repository you are publishing to (or clojars). Usually mutually exclusive to `LEIN_PASSWORD`. |

As mentioned in the [leiningen documentation](https://github.com/technomancy/leiningen/blob/stable/doc/DEPLOY.md#credentials-in-the-environment),
your `:deploy-repositories` section of `project.clj` should be set up to use environment variables.

For example:

```
:deploy-repositories [["releases" {:url "https://oss.sonatype.org/service/local/staging/deploy/maven2/"
                                   :username :env
                                   :password :env}
                       "snapshots" {:url "https://oss.sonatype.org/content/repositories/snapshots/"
                                    :username :env
                                    :passphrase :env}]]
```

### Options

| Options      | Description                                                                                                                      | Default |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `skipDeploy` | Whether to publish the package to ta respository with `lein deploy`. If `false` the `project.clj` version will still be updated. | `true`  |
| `pkgRoot`    | Directory path to publish.                                                                                                       | `.`     |
| `uberJar`    | Whether to package the project as an uber jar (include dependencies in the jar)                                                  | `false` |

**Note**: The `pkgRoot` directory must contains a `project.clj`. The version will be updated only in the `project.clj` within the `pkgRoot` directory.

**Note**: If you use a [shareable configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/shareable-configurations.md#shareable-configurations) that defines one of these options you can set it to `false` in your [**semantic-release** configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration) in order to use the default value.

### Npm configuration

The plugin uses the [`npm` CLI](https://github.com/npm/cli) which will read the configuration from [`.npmrc`](https://docs.npmjs.com/files/npmrc). See [`npm config`](https://docs.npmjs.com/misc/config) for the option list.

The [`registry`](https://docs.npmjs.com/misc/registry) and [`dist-tag`](https://docs.npmjs.com/cli/dist-tag) can be configured in the `package.json` and will take precedence over the configuration in `.npmrc`:

```json
{
  "publishConfig": {
    "registry": "https://registry.npmjs.org/",
    "tag": "latest"
  }
}
```

### Examples

The `npmPublish` and `tarballDir` option can be used to skip the publishing to the `npm` registry and instead, release the package tarball with another plugin. For example with the [@semantic-release/github](https://github.com/semantic-release/github) plugin:

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm",
      {
        "npmPublish": false,
        "tarballDir": "dist"
      }
    ],
    [
      "@semantic-release/github",
      {
        "assets": "dist/*.tgz"
      }
    ]
  ]
}
```

When publishing from a sub-directory with the `pkgRoot` option, the `package.json` and `npm-shrinkwrap.json` updated with the new version can be moved to another directory with a `postpublish` [npm script](https://docs.npmjs.com/misc/scripts). For example with the [@semantic-release/git](https://github.com/semantic-release/git) plugin:

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm",
      {
        "pkgRoot": "dist"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "npm-shrinkwrap.json"]
      }
    ]
  ]
}
```

```json
{
  "scripts": {
    "postpublish": "cp -r dist/package.json . && cp -r dist/npm-shrinkwrap.json ."
  }
}
```
