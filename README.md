# Testbed

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.1.

You will likely need to use NVM in order to build these packages locally.

Known Working Versions:

Node: 10.16.3
NPM: 6.9.0

You should also ensure you have removed any globally installed versions of the [Angular CLI](https://github.com/angular/angular-cli)

If you have already ran `npm install` prior to correctly setting up your environment, you should clear the `node_modules` folder and re-run `npm install`.

You do not need to run `npm install` inside any of the packages folders.

## Testing

You can build the respective package with `npm run build  "@audacia/{package-name}" --configuration=production`

This will publish the files to the `/dist` folder.

You can then copy these files to the `node_modules/@audacia/{package-name}` folder of a project that is already set up and configured to use the package you are trying to test.

If your project is using Ivy, you may experience errors when calling `ng serve` or `npm run start` etc., this can be resolved by following the below steps in the exact order:

1. Remove the package folder from `node_modules/@audacia`
2. Run `npm i` (this may not be necessary)
3. Copy the new build to the `node_modules/@audacia/{package-name}`
4. Add `postinstall: "ngcc` to the `package.json`
5. Run `npm run postinstall`

If you continue to have issues, clear your `node_modules` folder, and try the above steps again.

`postinstall` will be run after every call to `npm i`, you should ensure this is not added to the `package.json` until after you called `npm i`.

You should also remove this script once you are done testing.

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

# Contributing

We welcome contributions! Please feel free to check our [Contribution Guidlines](https://github.com/audaciaconsulting/.github/blob/main/CONTRIBUTING.md) for feature requests, issue reporting and guidelines.
