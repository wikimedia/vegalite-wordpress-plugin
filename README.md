# Datavis Block

This plugin provides a flexible data visualization block using the [Vega-Lite](https://vega.github.io/) declarative JSON visualization grammar.

- [Getting Started with Vega-Lite](https://vega.github.io/vega-lite/tutorials/getting_started.html)
- [Documentation for Vega-Lite](https://vega.github.io/vega-lite/docs/)

## Development

This project expects Node 16 and Composer 2. We recommend managing the installed version of Node using [nvm](https://github.com/nvm-sh/nvm), in which case you can select the version of node specified in this project's [`.nvmrc` file](https://github.com/nvm-sh/nvm#nvmrc) by running `nvm use` in your terminal.

```sh
npm install
npm run build
```

To start a live-reloading dev server, run

```sh
npm start
```

Other useful commands

- `npm run test`: Use Jest to run JS unit tests.
- `npm run lint`: Use ESLint to check src code for errors.

----


## Release Process

### Versioning

This plugin follows [Semantic Versioning](https://semver.org/).

In a nutshell, this means that **patch releases**, for example, 1.2.3, only contain **backwards compatible bug fixes**.
**Minor releases**, for example, 1.2.0, may contain **enhancements, new features, tests**, and pretty much everything that **does not break backwards compatibility**.
Every **breaking change** to public APIs—be it renaming or even deleting structures intended for reuse, or making backwards-incompatible changes to certain functionality—warrants a **major release**, for example, 2.0.0.

If you are using Composer to pull this plugin into your website build, choose your version constraint accordingly.

Even when bumping a major version, if the blocks provided by this plugin change in a backwards-incompatible way, a [block deprecation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-deprecation/) should be added to let users migrate their visualizations to the new version of the block.

### Publishing a Release

Release management is done using GitHub's built-in Releases functionality. Each release is tagged using the according version number, for example, the version 1.2.3 of this plugin would have the tag name `v1.2.3`.

To generate a release, ensure the `main` branch is clean and up to date, and then tag it in the format `v#.#.#`.
Once that tag is pushed, the GitHub actions release workflow creates a new built release based on the contents of the tag you just created.
It will copy the tag's current state to a new tag of `original/v.*.*.*` and then build the project and push the built version to the original tag name `v*.*.*`.
This allows composer to pull in a built version of the project without the need to run webpack to use it.

Once a release has been created, update the release's description using GitHub's interface to add patch notes. Release notes should be high-level but complete, detailing all _New Features_, _Enhancements_, _Bug Fixes_ and potential other changes included in the according version.
