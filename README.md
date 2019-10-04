# leiningen-semantic-release

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to publish a [leiningen](https://github.com/technomancy/leiningen) project.

[![CircleCI](https://circleci.com/gh/NoxHarmonium/leiningen-semantic-release.svg?style=svg)](https://circleci.com/gh/NoxHarmonium/leiningen-semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/NoxHarmonium/leiningen-semantic-release.svg)](https://greenkeeper.io/)
[![codecov](https://codecov.io/gh/NoxHarmonium/leiningen-semantic-release/branch/master/graph/badge.svg)](https://codecov.io/gh/NoxHarmonium/leiningen-semantic-release)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2FNoxHarmonium%2Fleiningen-semantic-release%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
![npm](https://img.shields.io/npm/v/leiningen-semantic-release)

| Step               | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| `verifyConditions` | Checks the `project.clj` is syntactically valid.                                   |
| `prepare`          | Update the `project.clj` version and package the output jar file.                  |
| `publish`          | Publish the jar (and generated Maven metadata) to a maven repository (or clojars). |

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
    "leiningen-semantic-release",
    "@semantic-release/git",
    {
      "assets": ["project.clj"]
    }
  ]
}
```

## Configuration

### Registry authentication

Authenticating with the registry is configured using the `:deploy-repositories` map in `project.clj`.

The recommended way to pass these variables in is by using environment variables.

#### Environment variables

| Variable          | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `LEIN_USERNAME`   | The username for the maven repository you are publishing to (or clojars).                         |
| `LEIN_PASSWORD`   | The password for the maven repository you are publishing to (or clojars).                         |
| `LEIN_PASSPHRASE` | A gpg passphrase to retreive the username and password with. (if retreiving credentials from gpg) |

As mentioned in the [leiningen documentation](https://github.com/technomancy/leiningen/blob/stable/doc/DEPLOY.md#credentials-in-the-environment),
your `:deploy-repositories` section of `project.clj` should be set up to use environment variables.

For example to use `LEIN_USERNAME` and `LEIN_PASSWORD` your config might look like this.

```
:deploy-repositories [["releases" {:url "https://oss.sonatype.org/service/local/staging/deploy/maven2/"
                                   :username :env
                                   :password :env}
                       "snapshots" {:url "https://oss.sonatype.org/content/repositories/snapshots/"
                                    :username :env
                                    :password :env}]]
```

If you want retrieve the username and password from gpg, you can set the `LEIN_PASSPHRASE` environment variable
and use config like the following.

```
:deploy-repositories [["releases" {:url "https://oss.sonatype.org/service/local/staging/deploy/maven2/"
                                   :creds :gpg
                                   :passphrase :env}
                       "snapshots" {:url "https://oss.sonatype.org/content/repositories/snapshots/"
                                    :creds :gpg
                                    :passphrase :env}]]
```

The [example project](https://github.com/NoxHarmonium/leiningen-semantic-release-test-clojars) shows an example of
how to get signing working properly using environment variables on CircleCI.

It techniques used there should apply to most build environments running on Linux.

### Options

| Options      | Description                                                                                                                      | Default |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `skipDeploy` | Whether to publish the package to a respository with `lein deploy`. If `true` the `project.clj` version will still be updated.   | `true`  |
| `pkgRoot`    | Directory path to publish.                                                                                                       | `.`     |
| `uberJar`    | Whether to package the project as an uber jar (include dependencies in the jar)                                                  | `false` |

**Note**: The `pkgRoot` directory must contains a `project.clj`. The version will be updated only in the `project.clj` within the `pkgRoot` directory.

**Note**: If you use a [shareable configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/shareable-configurations.md#shareable-configurations) that defines one of these options you can set it to `false` in your [**semantic-release** configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration) in order to use the default value.

### Example

There is an example project at: https://github.com/NoxHarmonium/leiningen-semantic-release-test-clojars
