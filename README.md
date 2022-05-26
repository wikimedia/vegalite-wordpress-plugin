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
