# Testbed

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.11.

You will likely need to use NVM in order to build these packages locally.

Known Working Versions:

Node: 18.14.2
NPM: 9.6.0

You should also ensure you have removed any globally installed versions of the [Angular CLI](https://github.com/angular/angular-cli)

If you have already ran `npm install` prior to correctly setting up your environment, you should clear the `node_modules` folder and re-run `npm install`.

You do not need to run `npm install` inside any of the packages folders.

## Testing

You can build the respective package with `npm run build  "@audacia/{package-name}" --configuration=production`

This will publish the files to the `/dist` folder.

You can then copy these files to the `node_modules/@audacia/{package-name}` folder of a project that is already set up and configured to use the package you are trying to test.

You should ensure your changes have been correctly loaded by opening `dev tools` and browsing to `sources/webpack://@audacia/{package-name}`

If your changes are not being loaded, deleting the contents of the `.angular` folder and rerunning your application should resolve this.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# Change History

The `Audacia.Angular` repository change history can be found in this [changelog](./CHANGELOG.md)

# Contributing

We welcome contributions! Please feel free to check our [Contribution Guidlines](https://github.com/audaciaconsulting/.github/blob/main/CONTRIBUTING.md) for feature requests, issue reporting and guidelines.
